"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MatchType, Side } from "@/lib/supabase/types";

export async function createMatch(formData: FormData) {
  const matchType = String(formData.get("match_type") ?? "") as MatchType;
  const playedAt = String(formData.get("played_at") ?? "");
  const winningSide = String(formData.get("winning_side") ?? "") as Side;

  const playerIds = (matchType === "1v1"
    ? ["side_a_1", "side_b_1"]
    : ["side_a_1", "side_a_2", "side_b_1", "side_b_2"]
  ).map((field) => String(formData.get(field) ?? ""));

  if (playerIds.some((id) => !id)) {
    redirect(
      `/matches/new?error=${encodeURIComponent("Selecione todos os jogadores.")}`
    );
  }

  if (new Set(playerIds).size !== playerIds.length) {
    redirect(
      `/matches/new?error=${encodeURIComponent(
        "Cada jogador só pode aparecer uma vez na partida."
      )}`
    );
  }

  const half = playerIds.length / 2;
  const participants = [
    ...playerIds.slice(0, half).map((player_id) => ({
      player_id,
      side: "A" as Side,
      is_winner: winningSide === "A",
    })),
    ...playerIds.slice(half).map((player_id) => ({
      player_id,
      side: "B" as Side,
      is_winner: winningSide === "B",
    })),
  ];

  const supabase = await createClient();
  const { error } = await supabase.rpc("record_match", {
    p_match_type: matchType,
    p_played_at: playedAt,
    p_participants: participants,
  });

  if (error) {
    redirect(`/matches/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
