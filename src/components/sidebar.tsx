"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { pageSections } from "@/lib/sections";
import { ForAgents } from "./agent-view";
import { OnThisPage } from "./on-this-page";
import { useViewMode, ViewSwitch } from "./view-mode";
import { Wordmark } from "./wordmark";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/blog", label: "Blog" },
];

function isActiveHref(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Logo() {
  return <Wordmark />;
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
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const sections = pageSections[pathname] ?? [];
  const mode = useViewMode();

  return (
    <div className="flex flex-col">
      <Logo />

      <ViewSwitch className="mt-6" />

      <div className="mt-10">
        <NavLinks />
      </div>

      {mode === "agent" ? (
        <>
          <div className="mt-8 border-t border-dashed border-border" />
          <ForAgents />
        </>
      ) : (
        sections.length > 0 && (
          <>
            <div className="mt-8 border-t border-dashed border-border" />
            {/* Keyed by route so the scroll-spy resets on navigation */}
            <OnThisPage key={pathname} sections={sections} />
          </>
        )
      )}
    </div>
  );
}
