type RankingRow = {
  player_id: string;
  name: string;
  points: number;
  wins: number;
  matches: number;
};

const PLACES = [
  { order: 2, label: "2º", height: 78, nameSize: "clamp(20px,3vw,28px)" },
  { order: 1, label: "1º", height: 126, nameSize: "clamp(28px,4.6vw,44px)" },
  { order: 3, label: "3º", height: 58, nameSize: "clamp(20px,3vw,28px)" },
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
          <div key={order} style={{ order, position: "relative" }} className="text-center">
            {isFirst && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: -14,
                  transform: "translateX(-50%)",
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 34% 28%, rgba(243,241,232,0.09) 0%, rgba(8,11,9,0) 64%)",
                  pointerEvents: "none",
                }}
              />
            )}

            {!isFirst && (
              <div
                className="font-heading uppercase"
                style={{ fontSize: 12, letterSpacing: "0.22em", color: "var(--muted)" }}
              >
                {label}
              </div>
            )}

            {isFirst && (
              <div
                className="relative mx-auto mb-3 flex items-center justify-center rounded-full"
                style={{
                  width: 44,
                  height: 44,
                  background:
                    "radial-gradient(circle at 32% 28%, #F0DFA8 0%, #C8A45D 55%, #8A6E33 100%)",
                  boxShadow: "0 8px 24px rgba(200,164,93,0.28)",
                }}
              >
                <span className="font-heading" style={{ fontSize: 20, color: "#1A1408" }}>
                  1
                </span>
              </div>
            )}

            <div
              className="relative font-heading uppercase"
              style={{
                fontSize: nameSize,
                letterSpacing: isFirst ? "0.09em" : "0.1em",
                lineHeight: 1,
                marginTop: isFirst ? 0 : 6,
              }}
            >
              {row.name}
            </div>
            <div
              className="relative font-heading"
              style={{
                fontSize: isFirst ? 19 : 15,
                letterSpacing: isFirst ? "0.18em" : "0.16em",
                color: "var(--gold)",
                marginTop: isFirst ? 6 : 2,
              }}
            >
              {row.points} PTS
            </div>
            <div
              style={{
                marginTop: isFirst ? 18 : 14,
                height,
                borderTop: isFirst
                  ? "1px solid rgba(200,164,93,0.45)"
                  : "1px solid rgba(243,241,232,0.16)",
                background: isFirst
                  ? "linear-gradient(180deg, rgba(200,164,93,0.16), rgba(200,164,93,0.02))"
                  : "linear-gradient(180deg, rgba(243,241,232,0.07), rgba(243,241,232,0.01))",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
