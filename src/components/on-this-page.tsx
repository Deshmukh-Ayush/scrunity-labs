"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";

export type Section = { id: string; label: string };

const MINOR_TICKS = 3; // ruler ticks between each section

export function OnThisPage({
  sections,
  onNavigate,
}: {
  sections: Section[];
  onNavigate?: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll-spy: the section crossing ~40% from the top of the viewport is "active"
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = sections.findIndex((s) => s.id === entry.target.id);
            if (i !== -1) setActiveIndex(i);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    // Close any open sheet first so the page can scroll underneath it
    onNavigate?.();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className="mt-7">
      <p className="eyebrow">On this page</p>

      <ul className="mt-5">
        {sections.map((s, i) => {
          const isActive = i === activeIndex;
          const isPassed = i <= activeIndex; // sections above the current one stay accent-colored

          return (
            <li key={s.id}>
              {/* Major tick + label */}
              <button
                onClick={() => scrollTo(s.id)}
                aria-current={isActive ? "location" : undefined}
                className="group flex h-6 items-center gap-3"
              >
                <span
                  className={cn(
                    "h-px transition-all duration-300 ease-out motion-reduce:transition-none",
                    isActive ? "w-5 bg-accent" : isPassed ? "w-3 bg-accent" : "w-3 bg-muted/60",
                    "group-hover:w-5"
                  )}
                />
                <span
                  className={cn(
                    "text-[14px] transition-colors motion-reduce:transition-none",
                    isActive ? "text-foreground" : "text-muted group-hover:text-foreground"
                  )}
                >
                  {s.label}
                </span>
              </button>

              {/* Minor ruler ticks between sections */}
              {i < sections.length - 1 && (
                <div className="flex flex-col gap-[5px] py-[3px]">
                  {Array.from({ length: MINOR_TICKS }).map((_, t) => (
                    <span key={t} className="h-px w-1.5 bg-border" />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
