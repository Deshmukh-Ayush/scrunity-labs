"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";

export type Section = { id: string; label: string };

const MINOR_TICKS = 3; // ruler ticks between each section

export function OnThisPage({ sections }: { sections: Section[] }) {
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mt-7">
      <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-500 uppercase">
        On this page
      </p>

      <ul className="mt-5">
        {sections.map((s, i) => {
          const isActive = i === activeIndex;
          const isPassed = i <= activeIndex; // sections above the current one stay blue

          return (
            <li key={s.id}>
              {/* Major tick + label */}
              <button
                onClick={() => scrollTo(s.id)}
                className="group flex h-6 items-center gap-3"
              >
                <span
                  className={cn(
                    "h-px transition-all duration-300 ease-out",
                    isActive ? "w-5 bg-blue-600" : isPassed ? "w-3 bg-blue-600" : "w-3 bg-neutral-400",
                    "group-hover:w-5"
                  )}
                />
                <span
                  className={cn(
                    "text-[14px] transition-colors",
                    isActive ? "text-neutral-900" : "text-neutral-500 group-hover:text-neutral-900"
                  )}
                >
                  {s.label}
                </span>
              </button>

              {/* Minor ruler ticks between sections */}
              {i < sections.length - 1 && (
                <div className="flex flex-col gap-[5px] py-[3px]">
                  {Array.from({ length: MINOR_TICKS }).map((_, t) => (
                    <span key={t} className="h-px w-1.5 bg-neutral-300" />
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