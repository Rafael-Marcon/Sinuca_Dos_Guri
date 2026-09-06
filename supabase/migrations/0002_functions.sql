-- Trigger: auto-create profile row on signup

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.email),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- RPC: record_match — transactional insert of a match + its participants
-- participants: jsonb array of { player_id: uuid, side: 'A'|'B', is_winner: boolean }

create or replace function record_match(
  p_match_type text,
  p_played_at date,
  p_participants jsonb
)
returns uuid
language plpgsql
security invoker
as $$
declare
  v_match_id uuid;
  v_expected_count int;
  v_actual_count int;
  v_side_a_count int;
  v_side_b_count int;
  v_winning_sides int;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if p_match_type not in ('1v1', '2v2') then
    raise exception 'invalid match_type: %', p_match_type;
  end if;

  v_expected_count := case when p_match_type = '1v1' then 2 else 4 end;
  v_actual_count := jsonb_array_length(p_participants);

  if v_actual_count != v_expected_count then
    raise exception 'expected % participants for %, got %', v_expected_count, p_match_type, v_actual_count;
  end if;

  select count(*) filter (where elem ->> 'side' = 'A'),
         count(*) filter (where elem ->> 'side' = 'B')
    into v_side_a_count, v_side_b_count
  from jsonb_array_elements(p_participants) elem;

  if v_side_a_count != v_side_b_count or v_side_a_count != v_expected_count / 2 then
    raise exception 'sides must be balanced: got A=%, B=%', v_side_a_count, v_side_b_count;
  end if;

  select count(distinct elem ->> 'side')
    into v_winning_sides
  from jsonb_array_elements(p_participants) elem
  where (elem ->> 'is_winner')::boolean;

  if v_winning_sides != 1 then
    raise exception 'exactly one side must be marked as winner';
  end if;

  insert into matches (match_type, played_at, created_by)
  values (p_match_type, p_played_at, auth.uid())
  returning id into v_match_id;

  insert into match_participants (match_id, player_id, side, is_winner, points_awarded)
  select
    v_match_id,
    (elem ->> 'player_id')::uuid,
    elem ->> 'side',
    (elem ->> 'is_winner')::boolean,
    case when (elem ->> 'is_winner')::boolean then 3 else 0 end
  from jsonb_array_elements(p_participants) elem;

  return v_match_id;
end;
$$;

-- View: total points/wins per player
create or replace view player_points as
select
  player_id,
  sum(points_awarded) as total_points,
  count(*) as matches_played,
  count(*) filter (where is_winner) as wins
from match_participants
group by player_id;

-- View: teammate pairs per 2v2 match (normalized, player_a < player_b)
create or replace view duo_matches as
select
  m.id as match_id,
  m.played_at,
  p1.player_id as player_a,
  p2.player_id as player_b,
  p1.is_winner,
  p1.points_awarded + p2.points_awarded as duo_points
from matches m
join match_participants p1 on p1.match_id = m.id
join match_participants p2 on p2.match_id = m.id
  and p2.side = p1.side and p2.player_id > p1.player_id
where m.match_type = '2v2';

-- View: win-rate stats per duo pairing
create or replace view duo_stats as
select
  player_a,
  player_b,
  count(*) as matches_played,
  count(*) filter (where is_winner) as wins,
  round(100.0 * count(*) filter (where is_winner) / count(*), 1) as win_rate,
  sum(duo_points) as total_points
from duo_matches
group by player_a, player_b;

-- Function: ranking (points/wins/matches per player) for a date range, for weekly/monthly podium
create or replace function ranking_for_period(period_start date, period_end date)
returns table(player_id uuid, name text, points bigint, wins bigint, matches bigint)
language sql
stable
as $$
  select
    p.id,
    p.name,
    coalesce(sum(mp.points_awarded), 0) as points,
    count(*) filter (where mp.is_winner) as wins,
    count(mp.*) as matches
  from profiles p
  left join match_participants mp on mp.player_id = p.id
  left join matches m on m.id = mp.match_id and m.played_at between period_start and period_end
  group by p.id, p.name
  order by points desc;
$$;

-- Function: longest win/loss streak per player
create or replace function player_streaks()
returns table(player_id uuid, longest_win_streak int, longest_loss_streak int)
language sql
stable
as $$
  with ordered as (
    select
      mp.player_id,
      m.played_at,
      mp.is_winner,
      row_number() over (partition by mp.player_id order by m.played_at, m.id) as rn
    from match_participants mp
    join matches m on m.id = mp.match_id
  ),
  grp as (
    select
      *,
      rn - row_number() over (partition by player_id, is_winner order by rn) as grp_id
    from ordered
  ),
  streaks as (
    select player_id, is_winner, count(*) as streak_len
    from grp
    group by player_id, is_winner, grp_id
  )
  select
    player_id,
    coalesce(max(streak_len) filter (where is_winner), 0) as longest_win_streak,
    coalesce(max(streak_len) filter (where not is_winner), 0) as longest_loss_streak
  from streaks
  group by player_id;
$$;
