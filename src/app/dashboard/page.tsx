import { createClient } from "@/lib/supabase/server";
import PainelClient from "./PainelClient";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - diff);
  return d;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toISODate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const now = new Date();
  const weekStart = toISODate(startOfWeek(now));
  const monthStart = toISODate(startOfMonth(now));
  const today = toISODate(now);

  const [
    { data: weeklyRanking },
    { data: monthlyRanking },
    { data: overallRanking },
    { count: matchesCount },
    { count: playersCount },
    { count: duplasCount },
  ] = await Promise.all([
    supabase.rpc("ranking_for_period", { period_start: weekStart, period_end: today }),
    supabase.rpc("ranking_for_period", { period_start: monthStart, period_end: today }),
    supabase.rpc("ranking_for_period", { period_start: "1970-01-01", period_end: today }),
    supabase.from("matches").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("duo_stats").select("*", { count: "exact", head: true }),
  ]);

  return (
    <PainelClient
      weeklyRanking={weeklyRanking ?? []}
      monthlyRanking={monthlyRanking ?? []}
      overallRanking={overallRanking ?? []}
      matchesCount={matchesCount ?? 0}
      playersCount={playersCount ?? 0}
      duplasCount={duplasCount ?? 0}
    />
  );
}
