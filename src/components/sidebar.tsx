"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "cn";
import { OnThisPage, type Section } from "./on-this-page";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Book an audit", external: true },
];

function isActiveHref(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Logo() {
  return (
    <Link href="/" className="text-[20px] font-medium tracking-tight text-foreground">
      scrunity labs
    </Link>
  );
}

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-[14px]">
      {links.map((l) => {
        const isActive = isActiveHref(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative w-fit text-[14px] transition-colors motion-reduce:transition-none",
              isActive ? "text-foreground" : "text-muted hover:text-foreground"
            )}
          >
            {/* Small square marker for the active page */}
            {isActive && (
              <span className="absolute top-1/2 -left-3.5 size-[5px] -translate-y-1/2 bg-accent" />
            )}
            {l.label}
            {l.external && <span className="ml-1 text-muted/70">↗</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ sections }: { sections: Section[] }) {
  const [view, setView] = useState<"human" | "agent">("human");

  return (
    <div className="flex flex-col">
      <Logo />

      {/* Segmented toggle */}
      <div className="mt-6 inline-flex w-fit rounded-lg border border-border bg-border/30 p-[3px]">
        {(["human", "agent"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "rounded-md px-3 py-1.5 text-[11px] font-medium capitalize transition-colors motion-reduce:transition-none",
              view === v
                ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                : "text-muted hover:text-foreground"
            )}
          >
            {v === "agent" ? "Operations" : "human"}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <NavLinks />
      </div>

      <div className="mt-8 border-t border-dashed border-border" />

      <OnThisPage sections={sections} />
    </div>
  );
}
