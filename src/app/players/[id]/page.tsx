import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EightBall from "@/components/EightBall";

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: profile }, { data: pointsRow }, { data: streaksRow }, { data: profiles }, { data: duoStats }] =
    await Promise.all([
      supabase.from("profiles").select("id, name").eq("id", id).maybeSingle(),
      supabase.from("player_points").select("*").eq("player_id", id).maybeSingle(),
      supabase.rpc("player_streaks").then((res) => ({
        ...res,
        data: (res.data ?? []).find((s) => s.player_id === id) ?? null,
      })),
      supabase.from("profiles").select("id, name"),
      supabase
        .from("duo_stats")
        .select("*")
        .or(`player_a.eq.${id},player_b.eq.${id}`)
        .order("win_rate", { ascending: false })
        .limit(1),
    ]);

  if (!profile) {
    notFound();
  }

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.name]));

  const matches = pointsRow?.matches_played ?? 0;
  const wins = pointsRow?.wins ?? 0;
  const points = pointsRow?.total_points ?? 0;
  const rate = matches > 0 ? Math.round((wins / matches) * 100) : 0;
  const winStreak = streaksRow?.longest_win_streak ?? 0;

  const bestDuo = duoStats?.[0];
  const bestDuoPartnerId = bestDuo
    ? bestDuo.player_a === id
      ? bestDuo.player_b
      : bestDuo.player_a
    : null;
  const bestDuoPartnerName = bestDuoPartnerId ? nameById.get(bestDuoPartnerId) ?? "?" : null;

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col px-5 pb-12 text-center sm:min-h-[calc(100vh-110px)] sm:pb-20">
      <div className="pt-4 text-left sm:pt-8.5">
        <Link
          href="/players"
          className="font-heading uppercase"
          style={{ fontSize: 12, letterSpacing: "0.24em", color: "var(--muted)" }}
        >
          ← Jogadores
        </Link>
      </div>

      <main className="w-full sm:flex sm:flex-1 sm:flex-col sm:justify-center">
      <div className="relative mt-3 sm:mt-6.5">
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            top: -30,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle at 34% 28%, rgba(243,241,232,0.06) 0%, rgba(8,11,9,0) 66%)",
          }}
        />
        <div className="relative mx-auto flex justify-center">
          <EightBall size={44} />
        </div>
        <h1
          className="m-0 mt-3 font-heading font-normal uppercase sm:mt-4.5"
          style={{ fontSize: "clamp(30px,7vw,58px)", letterSpacing: "0.14em", lineHeight: 1 }}
        >
          {profile.name}
        </h1>
        <div className="mt-1.5 font-heading text-[14px] tracking-[0.24em] sm:mt-2.5 sm:text-[17px] sm:tracking-[0.3em]" style={{ color: "var(--gold)" }}>
          {points} PONTOS
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-3 gap-px sm:mt-11"
        style={{
          background: "rgba(243,241,232,0.08)",
          border: "1px solid rgba(243,241,232,0.08)",
        }}
      >
        <div className="px-2 py-4 sm:px-3.5 sm:py-6.5" style={{ background: "var(--surface-alt)" }}>
          <div className="font-heading text-[24px] sm:text-[38px]">
            {wins}
          </div>
          <div className="font-heading uppercase" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: "var(--muted)" }}>
            Vitórias
          </div>
        </div>
        <div className="px-2 py-4 sm:px-3.5 sm:py-6.5" style={{ background: "var(--surface-alt)" }}>
          <div className="font-heading text-[24px] sm:text-[38px]">
            {matches}
          </div>
          <div className="font-heading uppercase" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: "var(--muted)" }}>
            Partidas
          </div>
        </div>
        <div className="px-2 py-4 sm:px-3.5 sm:py-6.5" style={{ background: "var(--surface-alt)" }}>
          <div className="font-heading text-[24px] sm:text-[38px]" style={{ color: "var(--green-light)" }}>
            {rate}%
          </div>
          <div className="font-heading uppercase" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: "var(--muted)" }}>
            Aproveitamento
          </div>
        </div>
      </div>

      <div
        className="mt-2.5 grid gap-2.5 text-left sm:mt-3.5 sm:gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}
      >
        <div
          className="rounded-[5px] p-4 sm:p-5.5"
          style={{ border: "1px solid rgba(24,166,106,0.24)", background: "var(--surface)" }}
        >
          <div className="font-heading uppercase" style={{ fontSize: 10.5, letterSpacing: "0.28em", color: "var(--green-light)" }}>
            Maior sequência
          </div>
          <div className="mt-1.5 font-heading text-[24px] sm:mt-2.5 sm:text-[30px]">
            {winStreak > 0 ? `${winStreak} vitórias` : "—"}
          </div>
        </div>
        <div
          className="rounded-[5px] p-4 sm:p-5.5"
          style={{ border: "1px solid rgba(200,164,93,0.24)", background: "var(--surface)" }}
        >
          <div className="font-heading uppercase" style={{ fontSize: 10.5, letterSpacing: "0.28em", color: "var(--gold)" }}>
            Melhor dupla
          </div>
          {bestDuo ? (
            <>
              <div className="mt-2.5 font-heading uppercase" style={{ fontSize: 20, letterSpacing: "0.08em" }}>
                {profile.name} + {bestDuoPartnerName}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: "var(--muted)" }}>
                {bestDuo.win_rate}% em {bestDuo.matches_played} partidas
              </div>
            </>
          ) : (
            <div className="mt-2.5 font-heading" style={{ fontSize: 20, color: "var(--muted)" }}>
              —
            </div>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
