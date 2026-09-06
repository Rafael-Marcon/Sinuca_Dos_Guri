-- Schema: profiles, matches, match_participants + RLS

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  match_type text not null check (match_type in ('1v1','2v2')),
  played_at date not null default current_date,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists match_participants (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  player_id uuid not null references profiles(id),
  side text not null check (side in ('A','B')),
  is_winner boolean not null,
  points_awarded int not null default 0,
  unique (match_id, player_id)
);

create index if not exists idx_match_participants_player on match_participants (player_id);
create index if not exists idx_match_participants_match on match_participants (match_id);
create index if not exists idx_matches_played_at on matches (played_at);

-- Row Level Security

alter table profiles enable row level security;
alter table matches enable row level security;
alter table match_participants enable row level security;

create policy "profiles_select_all" on profiles
  for select using (auth.role() = 'authenticated');

create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

create policy "matches_select_all" on matches
  for select using (auth.role() = 'authenticated');

create policy "matches_insert_auth" on matches
  for insert with check (auth.uid() = created_by);

create policy "participants_select_all" on match_participants
  for select using (auth.role() = 'authenticated');

create policy "participants_insert_auth" on match_participants
  for insert with check (auth.role() = 'authenticated');

-- Realtime replication
alter publication supabase_realtime add table match_participants;
alter publication supabase_realtime add table matches;
