type RankingRow = {
  player_id: string;
  name: string;
  points: number;
  wins: number;
  matches: number;
};

const PLACES = [
  { order: 2, label: "2º", height: 78, nameSize: "clamp(18px,2.6vw,24px)" },
  { order: 1, label: "1º", height: 126, nameSize: "clamp(24px,4vw,36px)" },
  { order: 3, label: "3º", height: 58, nameSize: "clamp(18px,2.6vw,24px)" },
] as const;

export default function Podium({ ranking }: { ranking: RankingRow[] }) {
  const top3 = ranking.filter((r) => r.matches > 0).slice(0, 3);

  if (top3.length === 0) {
    return (
      <p className="relative pb-8 text-center text-sm text-[var(--muted)]">
        Nenhuma partida registrada neste período.
      </p>
    );
  }

  return (
    <div
      className="relative mx-auto grid max-w-[820px] items-end gap-2.5 px-4.5 pb-0 pt-4.5"
      style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}
    >
      {PLACES.map(({ order, label, height, nameSize }) => {
        const row = top3[order - 1];
        if (!row) return <div key={order} style={{ order }} />;

        const isFirst = order === 1;

        return (
          <div key={order} style={{ order }} className="text-center">
            {!isFirst && (
              <div
                className="font-heading uppercase"
                style={{ fontSize: 12, letterSpacing: "0.18em", color: "var(--muted)" }}
              >
                {label}
              </div>
            )}

            {isFirst && (
              <div
                className="mx-auto mb-3 flex items-center justify-center rounded-full"
                style={{ width: 40, height: 40, background: "var(--gold)" }}
              >
                <span className="font-heading" style={{ fontSize: 18, color: "#1A1408" }}>
                  1
                </span>
              </div>
            )}

            <div
              className="font-heading"
              style={{
                fontSize: nameSize,
                lineHeight: 1,
                marginTop: isFirst ? 0 : 6,
              }}
            >
              {row.name}
            </div>
            <div
              className="font-heading"
              style={{
                fontSize: isFirst ? 17 : 14,
                color: "var(--gold)",
                marginTop: isFirst ? 6 : 2,
              }}
            >
              {row.points} pts
            </div>
            <div
              style={{
                marginTop: isFirst ? 18 : 14,
                height,
                borderTop: isFirst
                  ? "2px solid var(--gold)"
                  : "1px solid rgba(243,241,232,0.16)",
                background: isFirst ? "rgba(200,164,93,0.08)" : "rgba(243,241,232,0.04)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
