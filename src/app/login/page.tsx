import Link from "next/link";
import { signIn } from "@/app/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
      <h1 className="font-heading text-2xl uppercase tracking-[0.1em]">Entrar</h1>

      {error && (
        <p
          className="rounded p-3 text-sm"
          style={{ background: "rgba(184,74,74,0.16)", color: "#E2A6A6" }}
        >
          {error}
        </p>
      )}

      <form action={signIn} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-[var(--muted)]">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded px-3 py-2 text-[var(--text)]"
            style={{ background: "rgba(7,16,11,0.55)", border: "1px solid rgba(243,241,232,0.18)" }}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--muted)]">
          Senha
          <input
            name="password"
            type="password"
            required
            className="rounded px-3 py-2 text-[var(--text)]"
            style={{ background: "rgba(7,16,11,0.55)", border: "1px solid rgba(243,241,232,0.18)" }}
          />
        </label>
        <button
          type="submit"
          className="rounded-[3px] px-4 py-2.5 font-heading uppercase tracking-[0.2em] text-[var(--gold)]"
          style={{
            border: "1px solid var(--gold)",
            background: "linear-gradient(180deg, rgba(200,164,93,0.16), rgba(200,164,93,0.04))",
          }}
        >
          Entrar
        </button>
      </form>

      <p className="text-sm text-[var(--muted)]">
        Ainda não tem conta? <Link href="/signup">Cadastre-se</Link>
      </p>
    </main>
  );
}
