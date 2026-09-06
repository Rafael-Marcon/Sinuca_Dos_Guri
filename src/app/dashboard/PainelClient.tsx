"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Podium from "./Podium";

type RankingRow = {
  player_id: string;
  name: string;
  points: number;
  wins: number;
  matches: number;
};

type Period = "weekly" | "monthly" | "all";

const PERIOD_LABEL: Record<Period, string> = {
  weekly: "Semana",
  monthly: "Mês",
  all: "Temporada",
};

export default function PainelClient({
  weeklyRanking,
  monthlyRanking,
  overallRanking,
  matchesCount,
  playersCount,
  duplasCount,
}: {
  weeklyRanking: RankingRow[];
  monthlyRanking: RankingRow[];
  overallRanking: RankingRow[];
  matchesCount: number;
  playersCount: number;
  duplasCount: number;
}) {
  const [period, setPeriod] = useState<Period>("all");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("dashboard-matches")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "match_participants" },
        () => router.refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const byPeriod: Record<Period, RankingRow[]> = {
    weekly: weeklyRanking,
    monthly: monthlyRanking,
    all: overallRanking,
  };
  const ranking = byPeriod[period].filter((r) => r.matches > 0);
  const leader = ranking[0];
  const leaderRate = leader ? Math.round((leader.wins / leader.matches) * 1000) / 10 : 0;

  const stats = [
    { label: "Partidas", value: String(matchesCount).padStart(2, "0"), sub: "disputadas na temporada" },
    {
      label: leader ? `Vitórias de ${leader.name}` : "Vitórias do líder",
      value: leader ? String(leader.wins).padStart(2, "0") : "—",
      sub: leader ? `${leaderRate.toLocaleString("pt-BR")}% de aproveitamento` : "sem partidas ainda",
    },
    { label: "Jogadores", value: String(playersCount).padStart(2, "0"), sub: "ativos no ranking" },
    { label: "Duplas", value: String(duplasCount).padStart(2, "0"), sub: "combinações registradas" },
  ];

  return (
    <main className="mx-auto w-full max-w-[1120px] px-5 pb-12 sm:pb-20">
      <div
        className="relative mt-4 flex min-h-[160px] items-end overflow-hidden rounded-md sm:mt-8.5 sm:min-h-[260px]"
        style={{ border: "1px solid rgba(200,164,93,0.16)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/hero/painel.png)",
            backgroundSize: "cover",
            backgroundPosition: "center 62%",
            filter: "saturate(0.82)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,11,9,0.42) 0%, rgba(8,11,9,0.72) 46%, #080B09 100%)",
          }}
        />
        <div className="relative flex w-full flex-wrap items-end justify-between gap-2 px-4 pb-3.5 pt-4 sm:gap-4 sm:px-7.5 sm:pb-7 sm:pt-8.5">
          <h1
            className="m-0 font-heading font-normal uppercase"
            style={{
              fontSize: "clamp(24px,5vw,50px)",
              letterSpacing: "0.06em",
              textShadow: "0 2px 18px rgba(0,0,0,0.8)",
            }}
          >
            Temporada 2026
          </h1>
          <span
            className="font-heading text-[11px] uppercase tracking-[0.18em] sm:text-[13px] sm:tracking-[0.24em]"
            style={{ color: "var(--gold)" }}
          >
            {matchesCount} partidas • atualizado hoje
          </span>
        </div>
      </div>

      <section
        className="felt-texture relative mt-3 overflow-hidden rounded-md sm:mt-8.5"
        style={{
          border: "1px solid rgba(200,164,93,0.16)",
          background: "linear-gradient(180deg,#101613 0%,#0B100D 100%)",
        }}
      >
        <div
          className="relative flex flex-wrap items-center justify-center gap-3 px-3 pb-2 pt-4 sm:gap-4 sm:px-6.5 sm:pt-8.5"
        >
          <span
            className="font-heading uppercase"
            style={{ fontSize: 12, letterSpacing: "0.34em", color: "var(--gold)" }}
          >
            Pódio
          </span>
          <div
            className="flex gap-1 rounded-full p-1"
            style={{ border: "1px solid rgba(243,241,232,0.1)", background: "#101613" }}
          >
            {(["weekly", "monthly", "all"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="rounded-full px-4 py-1.5 font-heading text-[11px] uppercase tracking-[0.2em]"
                style={
                  period === p
                    ? { background: "var(--green)", color: "var(--text)" }
                    : { background: "none", color: "var(--muted)" }
                }
              >
                {PERIOD_LABEL[p]}
              </button>
            ))}
          </div>
        </div>

        <Podium ranking={ranking} />
      </section>

      <section
        className="mt-2.5 grid gap-2.5 sm:mt-3.5 sm:gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))" }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="felt-texture relative overflow-hidden rounded-[5px] px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5.5"
            style={{ border: "1px solid rgba(243,241,232,0.08)", background: "var(--surface)" }}
          >
            <div
              className="relative font-heading uppercase"
              style={{ fontSize: 11, letterSpacing: "0.28em", color: "var(--muted)" }}
            >
              {s.label}
            </div>
            <div
              className="relative mt-2 font-heading text-[32px] font-normal sm:mt-4 sm:text-[46px]"
              style={{ lineHeight: 1.1 }}
            >
              {s.value}
            </div>
            <div className="relative text-[12.5px]" style={{ color: "var(--muted)" }}>
              {s.sub}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
