"use client";

/**
 * Bento grid of soft tiles, each holding a pseudo-UI mockup with its caption (number,
 * title, copy, optional tags) underneath. One card is active at a time: its number
 * turns accent and its mockup plays. The active card advances on its own while the
 * grid is on screen; hovering or focusing a card makes it active and holds it there.
 *
 * Styling hooks: `data-slot="bento" | "bento-card" | "bento-tile" | "bento-caption"`, and
 * `data-state="active" | "inactive"` on each card (children style off `group-data-[state=active]`).
 */

import { useEffect, useRef, useState } from "react";
import type { ComponentProps, ComponentType } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "cn";
import { Para } from "@/components/utils/texts";

const ADVANCE_EVERY = 5200; // ms each card stays active

export type BentoItem = {
  title: string;
  description: string;
  Mock: ComponentType<{ play: boolean }>;
  /** Spans both columns, with the mockup pinned to the top of a taller tile. */
  wide?: boolean;
  tags?: string[];
};

export function Bento({
  items,
  className,
  ...props
}: { items: BentoItem[] } & Omit<ComponentProps<"div">, "children">) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  // bumped on every activation so the same card can replay
  const [run, setRun] = useState(0);

  const activate = (index: number) => {
    setHeld(true);
    if (index === active) return;
    setActive(index);
    setRun((r) => r + 1);
  };

  useEffect(() => {
    if (!inView || held || reduceMotion) return;
    const id = setTimeout(() => {
      setActive((a) => (a + 1) % items.length);
      setRun((r) => r + 1);
    }, ADVANCE_EVERY);
    return () => clearTimeout(id);
  }, [active, inView, held, reduceMotion, items.length]);

  return (
    <div
      ref={gridRef}
      data-slot="bento"
      className={cn("mt-8 grid grid-cols-1 gap-x-3 gap-y-10 sm:grid-cols-2", className)}
      {...props}
      onPointerLeave={() => setHeld(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
      }}
    >
      {items.map(({ title, description, Mock, wide, tags }, index) => {
        const isActive = index === active;
        const play = isActive && inView && !reduceMotion;

        return (
          <article
            key={title}
            tabIndex={0}
            data-slot="bento-card"
            data-state={isActive ? "active" : "inactive"}
            onPointerEnter={() => activate(index)}
            onFocus={() => activate(index)}
            className={cn(
              "group flex flex-col gap-5 outline-none",
              wide && "sm:col-span-2"
            )}
          >
            <div
              aria-hidden
              data-slot="bento-tile"
              className={cn(
                "relative flex h-60 items-center justify-center overflow-hidden bg-black/[0.025] transition-colors duration-500",
                "group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-accent",
                "group-data-[state=active]:bg-black/[0.04]",
                wide && "h-64 items-start pt-10"
              )}
            >
              <Mock key={play ? `play-${run}` : "rest"} play={play} />
            </div>

            <div data-slot="bento-caption" className="flex flex-col gap-1.5 pr-4">
              <span className="font-mono text-[10px] leading-none text-muted transition-colors duration-300 group-data-[state=active]:text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Para tone="foreground" className="text-[15px] leading-[1.4] font-medium">
                {title}
              </Para>
              <Para className="text-[14px] leading-[1.6]">{description}</Para>
              {tags && (
                <ul aria-label="Includes" className="mt-1.5 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="bg-black/[0.035] px-1.5 py-[3px] font-mono text-[9px] leading-none tracking-wider text-foreground/55 uppercase transition-colors duration-300 group-data-[state=active]:bg-accent/[0.08] group-data-[state=active]:text-accent"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
