"use client";

/**
 * Story arc: the whole process as one line, jagged where it starts (friction) and smooth
 * where it ends (flow). It draws itself on mount, then a marker for each chapter drops in
 * along it, captioned with its chapter. Each marker is a link to its chapter: hovering or
 * focusing it traces the line up to that marker in accent and lifts its caption.
 *
 * Styling hooks: `data-slot="story-arc" | "story-arc-marker"`, `data-state="active"` on the
 * hovered or focused marker.
 */

import { useEffect, useRef, useState } from "react";
import type { ComponentProps, MouseEvent, RefObject } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";
import { EASE } from "@/components/bento/primitives";
import { chapters } from "./chapters-data";

const W = 600;
const H = 150;

// jagged until the first chapter settles it, then one long easing climb
const ARC =
  "M8 112L18 102L26 116L36 104L44 114L54 100L64 110L72 104" +
  "C120 104 140 98 172 92S240 76 272 70S340 56 372 50S440 38 472 34S540 26 584 24";

// chapter markers: points that sit on the arc
const MARKERS = [
  { x: 72, y: 104 },
  { x: 172, y: 92 },
  { x: 272, y: 70 },
  { x: 372, y: 50 },
  { x: 472, y: 34 },
  { x: 584, y: 24 },
];

/** How far along the path (0..1) each marker sits, so the accent trace stops exactly on it. */
function useMarkerStops(pathRef: RefObject<SVGPathElement | null>) {
  const [stops, setStops] = useState(() => MARKERS.map((_, i) => (i + 1) / MARKERS.length));

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const found = MARKERS.map(({ x }) => {
      let length = 0;
      while (length < total && path.getPointAtLength(length).x < x) length += 1;
      return Math.min(1, length / total);
    });
    setStops(found);
  }, [pathRef]);

  return stops;
}

export function StoryArc({ className, ...props }: Omit<ComponentProps<"nav">, "children">) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const stops = useMarkerStops(pathRef);
  const trace = active === null ? 0 : stops[active];

  const go = (id: string) => (event: MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="Chapters"
      data-slot="story-arc"
      className={cn("relative bg-black/[0.025] px-4 pt-8 pb-4 sm:px-8 sm:pb-6", className)}
      onPointerLeave={() => setActive(null)}
      {...props}
    >
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden fill="none" className="w-full overflow-visible">
          {[40, 80, 120].map((y) => (
            <path key={y} d={`M0 ${y}H${W}`} stroke="currentColor" strokeOpacity={0.05} />
          ))}
          <motion.path
            ref={pathRef}
            d={ARC}
            className="text-foreground/35"
            stroke="currentColor"
            strokeWidth={1}
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
          />
          {/* accent trace up to the hovered chapter */}
          <motion.path
            d={ARC}
            className="text-accent"
            stroke="currentColor"
            strokeWidth={1.5}
            initial={false}
            animate={{ pathLength: trace, opacity: trace ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
          />
        </svg>

        <ol className="absolute inset-0">
          {chapters.map(({ id, label }, i) => {
            const { x, y } = MARKERS[i];
            const isActive = active === i;
            const passed = active !== null && i <= active;
            return (
              <motion.li
                key={id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.5 + i * 0.18 }}
              >
                <a
                  href={`#${id}`}
                  onClick={go(id)}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  aria-label={`Chapter ${i + 1}: ${label}`}
                  data-slot="story-arc-marker"
                  data-state={isActive ? "active" : undefined}
                  className="group relative grid size-7 place-items-center outline-none"
                >
                  <span
                    className={cn(
                      "size-2.5 ring-4 ring-[#f9f9f9] transition-[background-color,transform] duration-300 ease-out group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-accent",
                      passed ? "bg-accent" : "bg-muted",
                      isActive && "scale-125"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute top-full mt-0.5 flex flex-col items-center gap-1.5 whitespace-nowrap",
                      // the last marker sits at the edge, so its caption hangs leftward
                      i === chapters.length - 1 && "right-1 items-end"
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[9px] leading-none transition-colors duration-300",
                        passed ? "text-accent" : "text-muted"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "hidden text-[11px] leading-none transition-[color,transform] duration-300 ease-out sm:block",
                        isActive ? "translate-y-0.5 text-foreground" : passed ? "text-foreground/60" : "text-muted"
                      )}
                    >
                      {label}
                    </span>
                  </span>
                </a>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <div className="mt-8 flex justify-between sm:mt-12 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
        <span>Friction</span>
        <span className="flex items-center gap-2 text-foreground/70">
          <span aria-hidden className="size-[5px] bg-accent" />
          Flow
        </span>
      </div>
    </nav>
  );
}
