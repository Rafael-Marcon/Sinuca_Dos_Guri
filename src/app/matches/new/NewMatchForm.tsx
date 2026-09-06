"use client";

import { useState } from "react";
import { createMatch } from "@/app/actions/matches";
import PlayerSelect from "@/components/PlayerSelect";

type Player = { id: string; name: string };

function ModeButton({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      type="button"
      className="rounded-full px-4.5 py-2 font-heading sm:px-6.5 sm:py-2.5"
      style={{
        fontSize: 13,
        letterSpacing: "0.22em",
        background: active ? "var(--green)" : "none",
        color: active ? "var(--text)" : "var(--muted)",
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function WinnerButton({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      type="button"
      className="mt-2 w-full rounded py-2 font-heading uppercase sm:mt-3 sm:py-3"
      style={{
        fontSize: 11.5,
        letterSpacing: "0.26em",
        border: active ? "1px solid var(--green-light)" : "1px solid rgba(243,241,232,0.16)",
        background: active ? "rgba(24,166,106,0.22)" : "rgba(7,16,11,0.35)",
        color: active ? "var(--text)" : "var(--muted)",
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export default function NewMatchForm({ players }: { players: Player[] }) {
  const [matchType, setMatchType] = useState<"1v1" | "2v2">("1v1");
  const [winner, setWinner] = useState<"A" | "B" | null>(null);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;

  return (
    <form action={createMatch} className="flex flex-col items-center">
      <input type="hidden" name="played_at" value={today} />

      <div
        className="mt-4 inline-flex gap-1 rounded-full p-1 sm:mt-7.5"
        style={{ border: "1px solid rgba(243,241,232,0.1)", background: "var(--surface)" }}
      >
        <ModeButton active={matchType === "1v1"} onClick={() => setMatchType("1v1")}>
          1V1
        </ModeButton>
        <ModeButton active={matchType === "2v2"} onClick={() => setMatchType("2v2")}>
          2V2
        </ModeButton>
        <input type="hidden" name="match_type" value={matchType} />
      </div>

      <div
        className="mt-4 w-full rounded-xl p-2 sm:mt-8 sm:p-3.5"
        style={{
          background: "linear-gradient(160deg,#4A2C18,#2E1A0E)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="felt-texture relative overflow-hidden rounded-md px-4 py-5 sm:px-6.5 sm:py-8.5"
          style={{
            background: "radial-gradient(120% 90% at 50% 0%, #14724A 0%, #0E5B3A 55%, #0A4229 100%)",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.45)",
          }}
        >
          {[
            { left: 10, top: 10 },
            { right: 10, top: 10 },
            { left: 10, bottom: 10 },
            { right: 10, bottom: 10 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{ width: 20, height: 20, background: "var(--pocket)", ...pos }}
            />
          ))}

          <div
            className="relative grid items-stretch gap-3 sm:gap-5.5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}
          >
            <div className="text-left">
              <div className="flex items-center gap-2.5">
                <span
                  className="block rounded-full"
                  style={{
                    width: 16,
                    height: 16,
                    background: "radial-gradient(circle at 32% 28%,#FFF 0%,#D9D4C2 70%)",
                  }}
                />
                <span
                  className="font-heading uppercase"
                  style={{ fontSize: 11, letterSpacing: "0.28em", color: "rgba(243,241,232,0.72)" }}
                >
                  Lado A
                </span>
              </div>
              <PlayerSelect name="side_a_1" players={players} />
              {matchType === "2v2" && (
                <PlayerSelect name="side_a_2" players={players} variant="secondary" />
              )}
              <WinnerButton active={winner === "A"} onClick={() => setWinner("A")}>
                Vencedor
              </WinnerButton>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2.5">
                <span
                  className="block rounded-full"
                  style={{
                    width: 16,
                    height: 16,
                    background: "radial-gradient(circle at 32% 28%,#E2603F 0%,#9C2B18 70%)",
                  }}
                />
                <span
                  className="font-heading uppercase"
                  style={{ fontSize: 11, letterSpacing: "0.28em", color: "rgba(243,241,232,0.72)" }}
                >
                  Lado B
                </span>
              </div>
              <PlayerSelect name="side_b_1" players={players} />
              {matchType === "2v2" && (
                <PlayerSelect name="side_b_2" players={players} variant="secondary" />
              )}
              <WinnerButton active={winner === "B"} onClick={() => setWinner("B")}>
                Vencedor
              </WinnerButton>
            </div>
          </div>
        </div>
      </div>

      <input type="hidden" name="winning_side" value={winner ?? ""} />

      <button
        type="submit"
        disabled={!winner}
        className="mt-4 rounded-[3px] px-8 py-3.5 font-heading uppercase sm:mt-6.5 sm:px-[46px] sm:py-[17px]"
        style={{
          whiteSpace: "nowrap",
          border: "1px solid var(--gold)",
          background: "linear-gradient(180deg, rgba(200,164,93,0.16), rgba(200,164,93,0.04))",
          color: "var(--gold)",
          fontSize: 15,
          letterSpacing: "0.3em",
          opacity: winner ? 1 : 0.5,
        }}
      >
        Iniciar partida
      </button>
      <div className="mt-2 h-[18px] text-[13px] sm:mt-3.5" style={{ color: "var(--green-light)" }}>
        {!winner && "Selecione o vencedor."}
      </div>
    </form>
  );
}
