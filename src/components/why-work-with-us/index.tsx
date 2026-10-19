"use client";

/**
 * "Why work with us" bento. Each card is a soft tile holding a pseudo-UI mockup, with
 * its caption (number, title, copy) underneath. One card is active at a time: its
 * number turns accent and its mockup plays. The active card advances on its own while
 * the grid is on screen; hovering or focusing a card makes it active and holds it there.
 */

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "cn";
import { Para } from "@/components/utils/texts";
import { DesignMock, ExperienceMock, FrontierMock, ProblemMock, TransformationMock } from "./visuals";

const ADVANCE_EVERY = 5200; // ms each card stays active

const reasons: {
  title: string;
  description: string;
  Mock: ComponentType<{ play: boolean }>;
  wide?: boolean;
}[] = [
  {
    title: "A direct line to the frontier",
    description:
      "Scrunity Labs was purpose-built to put frontier AI to work. We stay close to the people shaping it, so new capabilities reach you early.",
    Mock: FrontierMock,
    wide: true,
  },
  {
    title: "We find what holds you back",
    description:
      "We sit with your team, learn how the whole company runs and pinpoint the bottlenecks. Then we clear them with frontier intelligence.",
    Mock: ProblemMock,
  },
  {
    title: "Crafted, never copied",
    description:
      "Every product gets a visual language of its own. Considered down to the detail, never lifted straight out of a Figma file.",
    Mock: DesignMock,
  },
  {
    title: "Proven in our own arena",
    description:
      "We're already building agentic systems that replace legacy CRMs and go-to-market tools. That depth comes with us into your work.",
    Mock: ExperienceMock,
  },
  {
    title: "With you, end to end",
    description:
      "We don't hand off a repo and disappear. We work alongside your team from roadmap to deployment, building what you need to compete.",
    Mock: TransformationMock,
  },
];

export const WhyWorkWithUs = () => {
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
      setActive((a) => (a + 1) % reasons.length);
      setRun((r) => r + 1);
    }, ADVANCE_EVERY);
    return () => clearTimeout(id);
  }, [active, inView, held, reduceMotion]);

  return (
    <div
      ref={gridRef}
      className="mt-8 grid grid-cols-1 gap-x-3 gap-y-10 sm:grid-cols-2"
      onPointerLeave={() => setHeld(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
      }}
    >
      {reasons.map(({ title, description, Mock, wide }, index) => {
        const isActive = index === active;
        const play = isActive && inView && !reduceMotion;

        return (
          <article
            key={title}
            tabIndex={0}
            onPointerEnter={() => activate(index)}
            onFocus={() => activate(index)}
            className={cn(
              "group flex flex-col gap-5 outline-none",
              wide && "sm:col-span-2"
            )}
          >
            <div
              aria-hidden
              className={cn(
                "relative flex h-60 items-center justify-center overflow-hidden bg-black/[0.025] transition-colors duration-500",
                "group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-accent",
                isActive && "bg-black/[0.04]",
                wide && "h-64 items-start pt-10"
              )}
            >
              <Mock key={play ? `play-${run}` : "rest"} play={play} />
            </div>

            <div className="flex flex-col gap-1.5 pr-4">
              <span
                className={cn(
                  "font-mono text-[10px] leading-none transition-colors duration-300",
                  isActive ? "text-accent" : "text-muted"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <Para tone="foreground" className="text-[15px] leading-[1.4] font-medium">
                {title}
              </Para>
              <Para className="text-[14px] leading-[1.6]">{description}</Para>
            </div>
          </article>
        );
      })}
    </div>
  );
};
