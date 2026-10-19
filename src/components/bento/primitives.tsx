"use client";

/**
 * Shared parts for the bento pseudo-UI mockups ("Why work with us", Services).
 * Every mockup takes `play`: when true it runs its sequence from the start,
 * otherwise it rests on its final state (also what reduced-motion users see).
 */

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "cn";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const TICKS = "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 4px)";

/* ───────────────────────── hooks ───────────────────────── */

/** Step counter: 0 at mount, then `i + 1` once `timings[i]` ms have passed. Rests at the last step. */
export function useSequence(play: boolean, timings: readonly number[]) {
  const [step, setStep] = useState(play ? 0 : timings.length);

  useEffect(() => {
    if (!play) return;
    const ids = timings.map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    return () => ids.forEach(clearTimeout);
  }, [play, timings]);

  return step;
}

/** Types `text` out one character at a time after `delay` ms. */
export function useTypewriter(play: boolean, text: string, delay: number, speed: number) {
  const [count, setCount] = useState(play ? 0 : text.length);

  useEffect(() => {
    if (!play) return;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c + 1 >= text.length) clearInterval(interval);
          return Math.min(c + 1, text.length);
        });
      }, speed);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [play, text, delay, speed]);

  return text.slice(0, count);
}

/* ───────────────────────── shared parts ───────────────────────── */

/** The white "app surface" every mockup is drawn on. */
export function Surface({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "bg-background p-4 shadow-[0_18px_40px_-24px_rgba(11,16,21,0.28)] ring-1 ring-black/[0.05]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Same tag as Annotation.Label: accent bullet + small label, with optional meta on the right. */
export function SurfaceHeader({ label, meta }: { label: string; meta?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 bg-black/[0.025] px-2 py-1 text-[11px] leading-none font-medium text-foreground/80">
        <span aria-hidden className="size-[5px] bg-accent" />
        {label}
      </span>
      {meta && <span className="shrink-0 text-[10px] text-muted">{meta}</span>}
    </div>
  );
}

export function Chip({ tone = "neutral", children }: { tone?: "neutral" | "accent"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 px-1.5 py-[3px] font-mono text-[8.5px] leading-none tracking-wider uppercase transition-colors duration-300",
        tone === "accent" ? "bg-accent/10 text-accent" : "bg-black/[0.04] text-foreground/60"
      )}
    >
      {children}
    </span>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden className={cn("size-2.5", className)}>
      <path d="M2 5.2L4.1 7.2L8 2.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Spinner() {
  return (
    <motion.svg
      viewBox="0 0 12 12"
      aria-hidden
      className="size-3 text-accent"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.3" />
      <path d="M6 1.5A4.5 4.5 0 0 1 10.5 6" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </motion.svg>
  );
}

/** Live dot: a solid square with a ring that keeps expanding off it. */
export function LiveDot() {
  return (
    <span className="relative inline-grid size-1.5 place-items-center">
      <span className="size-1.5 bg-accent" />
      <span className="absolute inset-0 animate-ping bg-accent/60 motion-reduce:hidden" />
    </span>
  );
}
