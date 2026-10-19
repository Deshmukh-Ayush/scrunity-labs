"use client";

/**
 * Engagement timeline: an ordered list of stages joined by a rail that fills with
 * scroll. A stage is "reached" once the rail gets to it; reached stages swap their
 * tile to solid accent and tick off their deliverables. Under reduced motion the
 * rail is drawn full and every stage starts reached.
 *
 * Styling hooks: `data-slot="engagement" | "engagement-stage"` and
 * `data-state="reached" | "upcoming"` on each stage.
 */

import { useRef, useState } from "react";
import type { ComponentProps, ComponentType } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { cn } from "cn";
import { Para } from "@/components/utils/texts";
import { CheckIcon } from "@/components/bento/primitives";

export type Stage = {
  title: string;
  description: string;
  deliverables: string[];
  Illustration: ComponentType;
};

export function Engagement({
  stages,
  className,
  ...props
}: { stages: Stage[] } & Omit<ComponentProps<"ol">, "children">) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 65%"] });
  const last = stages.length - 1;
  const [reached, setReached] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(v <= 0 ? -1 : Math.min(last, Math.floor(v * last + 0.15)));
  });

  return (
    <ol
      ref={listRef}
      data-slot="engagement"
      className={cn("mt-10 flex flex-col gap-12", className)}
      {...props}
    >
      {stages.map((stage, index) => (
        <StageItem
          key={stage.title}
          stage={stage}
          index={index}
          last={last}
          progress={scrollYProgress}
          reached={reduceMotion || index <= reached}
          staticRail={!!reduceMotion}
        />
      ))}
    </ol>
  );
}

function StageItem({
  stage: { title, description, deliverables, Illustration },
  index,
  last,
  progress,
  reached,
  staticRail,
}: {
  stage: Stage;
  index: number;
  last: number;
  progress: MotionValue<number>;
  reached: boolean;
  staticRail: boolean;
}) {
  // this segment's share of the whole rail, clamped to 0..1
  const fill = useTransform(progress, (v) => Math.min(1, Math.max(0, v * last - index)));

  return (
    <li
      data-slot="engagement-stage"
      data-state={reached ? "reached" : "upcoming"}
      className="group relative grid grid-cols-[72px_1fr] gap-6"
    >
      {/* rail to the next stage: spans this item's remaining height plus the list gap */}
      {index < last && (
        <span aria-hidden className="absolute top-21 -bottom-9 left-9 w-px bg-border">
          <motion.span
            className="absolute inset-0 origin-top bg-accent"
            style={{ scaleY: staticRail ? 1 : fill }}
          />
        </span>
      )}

      <div className="relative size-18 bg-accent/[0.07] text-accent transition-colors duration-500 group-data-[state=reached]:bg-accent group-data-[state=reached]:text-white motion-reduce:transition-none">
        <Illustration />
      </div>

      <div className="flex flex-col gap-1.5 pt-0.5">
        <span className="font-mono text-[10px] leading-none text-muted transition-colors duration-300 group-data-[state=reached]:text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Para tone="foreground" className="text-[15px] leading-[1.4] font-medium">
          {title}
        </Para>
        <Para className="max-w-[56ch] text-[14px] leading-[1.6]">{description}</Para>

        <ul aria-label="Deliverables" className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
          {deliverables.map((item, i) => (
            <li key={item} className="flex items-center gap-2 text-[12.5px] leading-none text-foreground/70">
              <span
                aria-hidden
                style={{ transitionDelay: reached ? `${150 + i * 90}ms` : "0ms" }}
                className="grid size-3.5 place-items-center text-white ring-1 ring-black/15 transition-colors duration-300 group-data-[state=reached]:bg-accent group-data-[state=reached]:ring-accent motion-reduce:transition-none"
              >
                <CheckIcon className="size-2 scale-0 transition-transform duration-300 group-data-[state=reached]:scale-100 motion-reduce:transition-none" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
