import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import EightBall from "./EightBall";
import NavLinks from "./NavLinks";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let name: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    name = profile?.name ?? null;
  }

  return (
    <header
      className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3 sm:py-[22px]"
      style={{ borderBottom: "1px solid rgba(200,164,93,0.14)" }}
    >
      <Link href="/dashboard" className="order-1 flex shrink-0 items-center gap-2.5 sm:gap-3.5">
        <EightBall size={32} />
        <div style={{ lineHeight: 1.02 }}>
          <div className="font-heading text-[15px] font-medium uppercase tracking-[0.18em] text-[var(--text)] sm:text-[19px] sm:tracking-[0.22em]">
            Sinuca
          </div>
          <div className="font-heading text-[15px] font-light uppercase tracking-[0.18em] text-[var(--gold)] sm:text-[19px] sm:tracking-[0.22em]">
            dos amigos
          </div>
        </div>
      </Link>

      {user ? (
        <>
          <div className="order-3 basis-full sm:order-2 sm:basis-auto sm:flex-1">
            <NavLinks />
          </div>
          <div
            className="order-2 flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-2 pr-2.5 sm:order-3 sm:gap-2.5 sm:py-[7px] sm:pl-[9px] sm:pr-3.5"
            style={{ border: "1px solid rgba(243,241,232,0.1)", background: "var(--surface)" }}
          >
            <span
              className="block h-4.5 w-4.5 shrink-0 rounded-full sm:h-[22px] sm:w-[22px]"
              style={{ background: "var(--green-light)" }}
            />
            <span className="max-w-[90px] truncate text-[12px] font-semibold sm:max-w-none sm:text-[13px]">
              {name}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-[12px] text-[var(--muted)] hover:text-[var(--text)]"
              >
                Sair
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="order-2 flex shrink-0 items-center gap-4 text-sm">
          <Link href="/login">Entrar</Link>
          <Link href="/signup">Cadastrar</Link>
        </div>
      )}
    </header>
  );
}
