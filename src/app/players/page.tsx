import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PlayersPage() {
  const supabase = await createClient();

  const [{ data: profiles }, { data: points }] = await Promise.all([
    supabase.from("profiles").select("id, name").order("name"),
    supabase.from("player_points").select("*"),
  ]);

  const pointsByPlayer = new Map((points ?? []).map((p) => [p.player_id, p]));

  const rows = (profiles ?? [])
    .map((player) => {
      const stats = pointsByPlayer.get(player.id);
      const matches = stats?.matches_played ?? 0;
      const wins = stats?.wins ?? 0;
      const points = stats?.total_points ?? 0;
      const rate = matches > 0 ? Math.round((wins / matches) * 100) : 0;
      return { ...player, matches, wins, points, rate };
    })
    .sort((a, b) => b.points - a.points);

  return (
    <main className="mx-auto w-full max-w-[1000px] px-5 pb-12 sm:pb-20">
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 pt-5 sm:gap-4 sm:pb-6.5 sm:pt-12.5">
        <h1
          className="m-0 font-heading font-normal"
          style={{ fontSize: "clamp(24px,4.6vw,36px)" }}
        >
          Jogadores
        </h1>
        <span
          className="text-[12px] sm:text-[13px]"
          style={{ color: "var(--muted)" }}
        >
          Clique para ver o perfil
        </span>
      </div>

      <div className="flex flex-col">
        {rows.map((row, i) => {
          const isTop3 = i < 3;
          const barColor = i === 0 ? "var(--gold)" : "var(--green-light)";
          return (
            <Link
              key={row.id}
              href={`/players/${row.id}`}
              className="grid cursor-pointer items-center gap-x-3 gap-y-1.5 px-2 py-3 transition-colors hover:bg-[var(--surface)] grid-cols-[34px_1fr_auto] [grid-template-areas:'rank_name_pts'_'rank_bar_bar'] sm:gap-x-4.5 sm:gap-y-2 sm:px-3 sm:py-5 sm:grid-cols-[44px_minmax(0,1fr)_minmax(90px,180px)_auto] sm:[grid-template-areas:'rank_name_bar_pts']"
              style={{
                borderBottom: "1px solid rgba(243,241,232,0.06)",
                color: "inherit",
              }}
            >
              <div
                className="flex items-center justify-center rounded-full font-heading"
                style={{
                  gridArea: "rank",
                  width: 34,
                  height: 34,
                  fontSize: 15,
                  background: isTop3 ? "var(--gold)" : "rgba(243,241,232,0.06)",
                  color: isTop3 ? "#1A1408" : "var(--muted)",
                }}
              >
                {i + 1}
              </div>
              <div style={{ gridArea: "name", minWidth: 0 }}>
                <div className="font-heading text-[17px] sm:text-[20px]">
                  {row.name}
                </div>
                <div className="mt-0.5 text-[12.5px]" style={{ color: "var(--muted)" }}>
                  {row.matches} partidas • {row.wins} vitórias • {row.rate}%
                </div>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-sm"
                style={{ gridArea: "bar", background: "rgba(243,241,232,0.07)" }}
              >
                <div
                  className="h-full rounded-sm"
                  style={{ width: `${row.rate}%`, background: barColor }}
                />
              </div>
              <div className="text-right" style={{ gridArea: "pts" }}>
                <div className="font-heading" style={{ fontSize: 22, color: "var(--gold)" }}>
                  {row.points}
                </div>
                <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                  pts
                </div>
              </div>
            </Link>
          );
        })}
        {rows.length === 0 && (
          <p className="py-6 text-sm" style={{ color: "var(--muted)" }}>
            Nenhum jogador cadastrado ainda.
          </p>
        )}
      </div>
    </main>
  );
}
