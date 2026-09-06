import { createClient } from "@/lib/supabase/server";

type Streak = {
  player_id: string;
  longest_win_streak: number;
  longest_loss_streak: number;
};

type DuoStat = {
  player_a: string;
  player_b: string;
  matches_played: number;
  wins: number;
  win_rate: number;
  total_points: number;
};

export default async function DestaquesPage() {
  const supabase = await createClient();

  const [{ data: streaks }, { data: duoStats }, { data: profiles }] = await Promise.all([
    supabase.rpc("player_streaks"),
    supabase
      .from("duo_stats")
      .select("*")
      .order("win_rate", { ascending: false })
      .limit(6),
    supabase.from("profiles").select("id, name"),
  ]);

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.name]));

  const streakRows: Streak[] = streaks ?? [];
  const hotStreak = [...streakRows].sort(
    (a, b) => b.longest_win_streak - a.longest_win_streak
  )[0];
  const blackStreak = [...streakRows].sort(
    (a, b) => b.longest_loss_streak - a.longest_loss_streak
  )[0];

  const duplas: DuoStat[] = duoStats ?? [];

  return (
    <main className="mx-auto w-full max-w-[1120px] px-5 pb-12 sm:pb-20">
      <div
        className="relative mt-4 flex min-h-[130px] items-end overflow-hidden rounded-md sm:mt-8.5 sm:min-h-[200px]"
        style={{ border: "1px solid rgba(200,164,93,0.16)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/hero/destaques.png)",
            backgroundSize: "cover",
            backgroundPosition: "center 58%",
            filter: "saturate(0.8)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,11,9,0.5) 0%, rgba(8,11,9,0.78) 50%, #080B09 100%)",
          }}
        />
        <div className="relative w-full p-4 sm:p-7.5">
          <h1
            className="m-0 font-heading font-normal uppercase"
            style={{ fontSize: "clamp(24px,4.6vw,44px)", letterSpacing: "0.1em", textShadow: "0 2px 18px rgba(0,0,0,0.8)" }}
          >
            Destaques
          </h1>
          <p
            className="mt-1.5 font-heading text-[11px] uppercase tracking-[0.18em] sm:mt-2 sm:text-[12.5px] sm:tracking-[0.24em]"
            style={{ color: "var(--gold)" }}
          >
            Sequências e duplas da temporada
          </p>
        </div>
      </div>

      <section
        className="mt-2.5 grid gap-2.5 sm:mt-3.5 sm:gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))" }}
      >
        <div
          className="rounded-[5px] px-4 py-4 sm:px-5.5 sm:py-6"
          style={{
            border: "1px solid rgba(24,166,106,0.28)",
            background: "linear-gradient(150deg, rgba(14,91,58,0.28), #101613 62%)",
          }}
        >
          <div className="font-heading uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--green-light)" }}>
            Hot streak
          </div>
          {hotStreak && hotStreak.longest_win_streak > 0 ? (
            <>
              <div className="mt-2 font-heading uppercase sm:mt-3.5" style={{ fontSize: 26, letterSpacing: "0.12em" }}>
                {nameById.get(hotStreak.player_id) ?? "?"}
              </div>
              <div className="mt-1 flex items-end gap-3 sm:mt-1.5">
                <span className="font-heading text-[44px] sm:text-[64px]" style={{ lineHeight: 0.9, color: "var(--green-light)" }}>
                  {hotStreak.longest_win_streak}
                </span>
                <span className="pb-2 text-[13px] sm:pb-2.5" style={{ color: "var(--muted)" }}>
                  vitórias consecutivas
                </span>
              </div>
            </>
          ) : (
            <div className="mt-2 text-sm sm:mt-3.5" style={{ color: "var(--muted)" }}>
              Sem dados ainda
            </div>
          )}
        </div>

        <div
          className="rounded-[5px] px-4 py-4 sm:px-5.5 sm:py-6"
          style={{
            border: "1px solid rgba(184,74,74,0.26)",
            background: "linear-gradient(150deg, rgba(184,74,74,0.16), #101613 62%)",
          }}
        >
          <div className="font-heading uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--danger)" }}>
            Black streak
          </div>
          {blackStreak && blackStreak.longest_loss_streak > 0 ? (
            <>
              <div className="mt-2 font-heading uppercase sm:mt-3.5" style={{ fontSize: 26, letterSpacing: "0.12em" }}>
                {nameById.get(blackStreak.player_id) ?? "?"}
              </div>
              <div className="mt-1 flex items-end gap-3 sm:mt-1.5">
                <span className="font-heading text-[44px] sm:text-[64px]" style={{ lineHeight: 0.9, color: "var(--danger)" }}>
                  {blackStreak.longest_loss_streak}
                </span>
                <span className="pb-2 text-[13px] sm:pb-2.5" style={{ color: "var(--muted)" }}>
                  derrotas consecutivas
                </span>
              </div>
            </>
          ) : (
            <div className="mt-2 text-sm sm:mt-3.5" style={{ color: "var(--muted)" }}>
              Sem dados ainda
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 sm:mt-11">
        <div className="flex items-baseline gap-3.5">
          <h2 className="m-0 font-heading font-normal uppercase" style={{ fontSize: 22, letterSpacing: "0.2em" }}>
            Duplas mais perigosas
          </h2>
          <span className="h-px flex-1" style={{ background: "rgba(200,164,93,0.16)" }} />
        </div>

        <div className="mt-3.5 flex flex-col gap-0.5 sm:mt-5.5">
          {duplas.length === 0 && (
            <p className="py-4 text-sm" style={{ color: "var(--muted)" }}>
              Nenhuma partida em dupla registrada ainda.
            </p>
          )}
          {duplas.map((d) => {
            const nameA = nameById.get(d.player_a) ?? "?";
            const nameB = nameById.get(d.player_b) ?? "?";
            const barColor =
              d.win_rate >= 60 ? "#0E5B3A,#18A66A" : "#8A6E33,#C8A45D";
            return (
              <div
                key={`${d.player_a}-${d.player_b}`}
                className="grid items-center gap-x-3 gap-y-2 px-1 py-3 grid-cols-[1fr_auto] [grid-template-areas:'name_pts'_'bar_bar'] sm:gap-x-5 sm:gap-y-0 sm:py-4.5 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] sm:[grid-template-areas:'name_bar_pts']"
                style={{
                  borderBottom: "1px solid rgba(243,241,232,0.06)",
                }}
              >
                <div style={{ gridArea: "name", minWidth: 0 }}>
                  <div className="font-heading uppercase" style={{ fontSize: 18, letterSpacing: "0.1em" }}>
                    {nameA} + {nameB}
                  </div>
                  <div className="mt-0.5 text-[12.5px]" style={{ color: "var(--muted)" }}>
                    {d.matches_played} partidas • {d.wins} vitórias
                  </div>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-sm"
                  style={{ gridArea: "bar", background: "rgba(243,241,232,0.07)" }}
                >
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${d.win_rate}%`,
                      background: `linear-gradient(90deg,${barColor})`,
                    }}
                  />
                </div>
                <div
                  className="min-w-[62px] text-right font-heading"
                  style={{ gridArea: "pts", fontSize: 22, letterSpacing: "0.06em", color: "var(--gold)" }}
                >
                  {d.win_rate}%
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
