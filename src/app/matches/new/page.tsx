import { createClient } from "@/lib/supabase/server";
import NewMatchForm from "./NewMatchForm";

export default async function NewMatchPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: players } = await supabase
    .from("profiles")
    .select("id, name")
    .order("name");

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col px-5 pb-12 sm:min-h-[calc(100vh-110px)] sm:justify-center sm:pb-20">
      <main className="w-full text-center">
        <h1
          className="m-0 pt-6 pb-2 font-heading font-normal sm:pt-0"
          style={{ fontSize: "clamp(26px,4.6vw,36px)" }}
        >
          Nova partida
        </h1>
        <p className="m-0 text-[13.5px]" style={{ color: "var(--muted)" }}>
          Escolha os jogadores e registre o vencedor.
        </p>

        {error && (
          <p
            className="mt-4 rounded p-3 text-sm"
            style={{ background: "rgba(184,74,74,0.16)", color: "#E2A6A6" }}
          >
            {error}
          </p>
        )}

        <NewMatchForm players={players ?? []} />
      </main>
    </div>
  );
}
