type Player = { id: string; name: string };

export default function PlayerSelect({
  name,
  players,
  variant = "primary",
}: {
  name: string;
  players: Player[];
  variant?: "primary" | "secondary";
}) {
  const primary = variant === "primary";

  return (
    <select
      name={name}
      required
      defaultValue=""
      className={
        primary
          ? "mt-2 w-full rounded px-2.5 py-2.5 font-heading text-[17px] uppercase sm:mt-3 sm:px-3 sm:py-3.5 sm:text-[20px]"
          : "mt-1.5 w-full rounded px-2.5 py-2 font-heading text-[14px] uppercase sm:mt-2 sm:py-3 sm:text-[16px]"
      }
      style={{
        background: "rgba(7,16,11,0.55)",
        color: "var(--text)",
        border: primary
          ? "1px solid rgba(243,241,232,0.18)"
          : "1px solid rgba(243,241,232,0.14)",
        letterSpacing: "0.1em",
      }}
    >
      <option value="" disabled>
        Selecione
      </option>
      {players.map((player) => (
        <option key={player.id} value={player.id}>
          {player.name}
        </option>
      ))}
    </select>
  );
}
