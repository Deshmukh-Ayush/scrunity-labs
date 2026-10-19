"use client";

/**
 * TickBarChart: a ranked horizontal bar chart where each bar is a row of thin ticks.
 * Bars sweep in from the left one row after another when the chart mounts, so inside
 * an Annotation.Card the animation replays every time the card opens.
 *
 *   <TickBarChart
 *     data={[{ label: "DeepSeek", value: 27.6 }, { label: "Z.ai", value: 11.5 }]}
 *     unit="%"
 *   />
 *
 * Each row is a list item whose visible text is "label value", so screen readers get
 * the data as a plain list. The bar itself is decorative.
 */

import type { ComponentProps } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";

const TICKS = "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 4px)";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type TickBarDatum = { label: string; value: number };

export type TickBarChartProps = Omit<ComponentProps<"ul">, "children"> & {
  data: TickBarDatum[];
  /** Value that maps to a full-width bar. Defaults to the largest value in `data`. */
  max?: number;
  /** Appended to every value label, e.g. "%". Kept a string so Server Components can pass it. */
  unit?: string;
};

export function TickBarChart({
  data,
  max = Math.max(...data.map((d) => d.value)),
  unit = "",
  className,
  ...props
}: TickBarChartProps) {
  const reduceMotion = useReducedMotion();
  // show every value with as many decimals as the most precise one, so "8" lines up as "8.0"
  const decimals = Math.max(...data.map((d) => String(d.value).split(".")[1]?.length ?? 0));

  return (
    <ul
      data-slot="tick-bar-chart"
      className={cn("group/chart flex flex-col gap-2 text-[11px] leading-none", className)}
      {...props}
    >
      {data.map((datum, index) => (
        <li
          key={datum.label}
          className={cn(
            "grid grid-cols-[80px_1fr_44px] items-center gap-4 transition-opacity duration-150",
            // hovering a row fades the others so it can be compared at a glance
            "group-hover/chart:opacity-40 hover:opacity-100!"
          )}
        >
          <span className="truncate text-foreground/80">{datum.label}</span>

          <span aria-hidden className="h-3 text-accent">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${(datum.value / max) * 100}%` }}
              transition={
                reduceMotion ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: 0.15 + index * 0.06 }
              }
              style={{ backgroundImage: TICKS }}
              className="block h-full"
            />
          </span>

          <span className="text-right tabular-nums text-muted">
            {datum.value.toFixed(decimals)}
            {unit}
          </span>
        </li>
      ))}
    </ul>
  );
}
