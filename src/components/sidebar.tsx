"use client";

import Link from "next/link";
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

export function Sidebar({ sections }: { sections: Section[] }) {
  const [view, setView] = useState<"founder" | "ops">("founder");
  const active = "/"; // swap for usePathname() once you have more routes

  return (
    <div className="flex flex-col">
      {/* Logo */}
      <Link href="/" className="text-[20px] font-medium tracking-tight text-neutral-900">
        scrunity labs
      </Link>

      {/* Segmented toggle */}
      <div className="mt-6 inline-flex w-fit rounded-lg border border-neutral-200 bg-neutral-50 p-[3px]">
        {(["founder", "ops"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "rounded-md px-3 py-1.5 text-[11px] font-medium capitalize transition-colors",
              view === v
                ? "bg-white text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            {v === "ops" ? "Operations" : "Founder"}
          </button>
        ))}
      </div>

      {/* Primary nav */}
      <nav className="mt-10 flex flex-col gap-[14px]">
        {links.map((l) => {
          const isActive = active === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative w-fit text-[14px] transition-colors",
                isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              {/* Small square marker for the active page */}
              {isActive && (
                <span className="absolute top-1/2 -left-3.5 size-[5px] -translate-y-1/2 bg-blue-600" />
              )}
              {l.label}
              {l.external && <span className="ml-1 text-neutral-400">↗</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-dashed border-neutral-300" />

      <OnThisPage sections={sections} />
    </div>
  );
}