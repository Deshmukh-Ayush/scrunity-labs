"use client";

/**
 * "On this page": a ruler of the current page's sections with a scroll-spy.
 *
 * The current section is the last one whose top has passed the reading line (a third of
 * the way down the viewport), or the last section once the page is scrolled to the end,
 * so a short closing section still gets its turn. Clicking an entry pins it as current
 * until scrolling has been quiet for a moment, so the ruler doesn't flicker through every
 * section in between, and writes the section to the URL hash.
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

export type Section = { id: string; label: string };

const MINOR_TICKS = 3; // ruler ticks between each section
const READING_LINE = 1 / 3; // fraction of the viewport height
const SETTLE = 150; // ms of no scrolling before a clicked entry stops pinning the ruler

function currentIndex(sections: Section[]) {
  const scroller = document.documentElement;
  if (window.scrollY + window.innerHeight >= scroller.scrollHeight - 2) return sections.length - 1;
  const line = window.innerHeight * READING_LINE;
  let index = 0;
  sections.forEach(({ id }, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) index = i;
  });
  return index;
}

export function OnThisPage({
  sections,
  onNavigate,
}: {
  sections: Section[];
  onNavigate?: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  // set while a click-initiated scroll is in flight
  const pinned = useRef<number | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const missing = sections.filter(({ id }) => !document.getElementById(id)).map(({ id }) => id);
      if (missing.length) console.warn(`OnThisPage: no element for section id(s) ${missing.join(", ")}`);
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      if (pinned.current === null) setActiveIndex(currentIndex(sections));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onScroll = () => {
      // while pinned, every scroll event pushes the release back
      if (pinned.current !== null) {
        clearTimeout(settleTimer.current);
        settleTimer.current = setTimeout(() => {
          pinned.current = null;
          schedule();
        }, SETTLE);
      }
      schedule();
    };

    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
    };
  }, [sections]);

  const scrollTo = (index: number) => {
    const { id } = sections[index];
    // Close any open sheet first so the page can scroll underneath it
    onNavigate?.();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    pinned.current = index;
    setActiveIndex(index);
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
    // released by the first quiet moment, even if the page was already there and never scrolls
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      pinned.current = null;
    }, SETTLE * 3);
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
                onClick={() => scrollTo(i)}
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
