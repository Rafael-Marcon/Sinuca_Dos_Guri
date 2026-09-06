"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", label: "Painel" },
  { href: "/destaques", label: "Destaques" },
  { href: "/matches/new", label: "Nova partida" },
  { href: "/players", label: "Jogadores" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="-mx-5 mt-2 flex items-center gap-1 overflow-x-auto px-5 sm:mx-0 sm:mt-0 sm:justify-center sm:gap-1.5 sm:overflow-visible sm:px-0">
      {ITEMS.map((item) => {
        const active =
          pathname === item.href ||
          (item.href === "/players" && pathname.startsWith("/players"));
        return (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 whitespace-nowrap rounded-[3px] px-3 py-2 text-[13.5px] font-medium transition-colors sm:px-4 sm:py-2.5"
            style={
              active
                ? { background: "rgba(200,164,93,0.12)", color: "var(--gold)" }
                : { color: "var(--muted)" }
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
