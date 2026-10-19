"use client";

/**
 * Pseudo-UI mockups for the "Why work with us" bento. Each one takes `play`:
 * when true it runs its short sequence from the start, otherwise it rests on its
 * final state (also what reduced-motion users see). The parent remounts a mockup
 * (via `key`) whenever it should replay, so the sequences only ever count forward.
 */

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "cn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TICKS = "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 4px)";

/* ───────────────────────── hooks ───────────────────────── */

/** Step counter: 0 at mount, then `i + 1` once `timings[i]` ms have passed. Rests at the last step. */
function useSequence(play: boolean, timings: readonly number[]) {
  const [step, setStep] = useState(play ? 0 : timings.length);

  useEffect(() => {
    if (!play) return;
    const ids = timings.map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    return () => ids.forEach(clearTimeout);
  }, [play, timings]);

  return step;
}

/** Types `text` out one character at a time after `delay` ms. */
function useTypewriter(play: boolean, text: string, delay: number, speed: number) {
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
function Surface({ className, children }: { className?: string; children: ReactNode }) {
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
function SurfaceHeader({ label, meta }: { label: string; meta?: ReactNode }) {
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

function Chip({ tone = "neutral", children }: { tone?: "neutral" | "accent"; children: ReactNode }) {
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden className={cn("size-2.5", className)}>
      <path d="M2 5.2L4.1 7.2L8 2.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function Spinner() {
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
function LiveDot() {
  return (
    <span className="relative inline-grid size-1.5 place-items-center">
      <span className="size-1.5 bg-accent" />
      <span className="absolute inset-0 animate-ping bg-accent/60 motion-reduce:hidden" />
    </span>
  );
}

/* ───────────────────────── 01 · Frontier ───────────────────────── */

const FRONTIER_TIMINGS = [700, 1900] as const;

const RELEASES = [
  { name: "Long-horizon agents", meta: "Computer use · tools" },
  { name: "Multimodal reasoning", meta: "Vision · audio · text" },
];

/** A release feed: a new frontier capability lands, and an evaluated one goes live. */
export function FrontierMock({ play }: { play: boolean }) {
  const step = useSequence(play, FRONTIER_TIMINGS);

  return (
    <Surface className="w-[min(100%,440px)] pb-2">
      <SurfaceHeader
        label="Frontier feed"
        meta={
          <span className="inline-flex items-center gap-1.5 font-mono tracking-wider uppercase">
            <LiveDot /> Direct line
          </span>
        }
      />
      <ul className="flex flex-col">
        <AnimatePresence initial={false}>
          {step >= 1 && (
            <motion.li
              key="new"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="overflow-hidden"
            >
              <ReleaseRow name="Next-generation model" meta="Briefed ahead of release" fresh>
                <Chip tone="accent">Early access</Chip>
              </ReleaseRow>
            </motion.li>
          )}
        </AnimatePresence>
        <li>
          <ReleaseRow name={RELEASES[0].name} meta={RELEASES[0].meta}>
            <Chip tone={step >= 2 ? "accent" : "neutral"}>{step >= 2 ? "Live" : "Evaluating"}</Chip>
          </ReleaseRow>
        </li>
        <li>
          <ReleaseRow name={RELEASES[1].name} meta={RELEASES[1].meta}>
            <Chip tone="accent">Live</Chip>
          </ReleaseRow>
        </li>
      </ul>
    </Surface>
  );
}

function ReleaseRow({ name, meta, fresh = false, children }: {
  name: string;
  meta: string;
  fresh?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-t border-black/[0.05] py-2.5">
      <span
        className={cn(
          "grid size-7 shrink-0 place-items-center",
          fresh ? "bg-accent text-white" : "bg-black/[0.04] text-foreground/60"
        )}
      >
        <svg viewBox="0 0 12 12" aria-hidden className="size-3">
          <path d="M6 1V11M1 6H11M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-[12px] leading-none text-foreground">{name}</span>
        <span className="truncate font-mono text-[9px] leading-none tracking-wide text-muted uppercase">{meta}</span>
      </span>
      {children}
    </div>
  );
}

/* ───────────────────────── 02 · Problem ───────────────────────── */

const WORKFLOWS = [
  { label: "Lead routing", hours: 14 },
  { label: "Weekly reporting", hours: 9 },
  { label: "Invoice matching", hours: 6 },
  { label: "Onboarding", hours: 4 },
];
const PROBLEM_TIMINGS = [250, 550, 850, 1150, 1900] as const;

/** A workflow audit: rows measure in one by one, then the worst one gets flagged. */
export function ProblemMock({ play }: { play: boolean }) {
  const step = useSequence(play, PROBLEM_TIMINGS);
  const flagged = step >= PROBLEM_TIMINGS.length;

  return (
    <Surface className="w-[88%]">
      <SurfaceHeader label="Workflow audit" meta="Hours lost / week" />
      <ul className="flex flex-col gap-2.5">
        {WORKFLOWS.map(({ label, hours }, i) => {
          const isJam = i === 0 && flagged;
          return (
            <li key={label} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5">
              <span className={cn("text-[11px] leading-none", isJam ? "text-foreground" : "text-foreground/70")}>
                {label}
              </span>
              <span className="flex items-center gap-2">
                {isJam && <Chip tone="accent">Bottleneck</Chip>}
                <span className="font-mono text-[10px] leading-none text-muted tabular-nums">{hours}h</span>
              </span>
              <motion.span
                aria-hidden
                className={cn(
                  "col-span-2 h-2 origin-left transition-colors duration-300",
                  isJam ? "text-accent" : "text-foreground/20"
                )}
                style={{ width: `${(hours / WORKFLOWS[0].hours) * 100}%`, backgroundImage: TICKS }}
                initial={false}
                animate={{ scaleX: step > i ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </li>
          );
        })}
      </ul>
    </Surface>
  );
}

/* ───────────────────────── 03 · Design ───────────────────────── */

const TRACKING = [0, -0.6, -1.2];
const DESIGN_TIMINGS = [800, 1600] as const;

/** A type inspector dialling in the tracking of our own heading style. */
export function DesignMock({ play }: { play: boolean }) {
  const step = useSequence(play, DESIGN_TIMINGS);
  const tracking = TRACKING[step];
  const tuning = play && step < DESIGN_TIMINGS.length;

  const properties = [
    { label: "Font", value: "Geist" },
    { label: "Size", value: "40" },
    { label: "Tracking", value: tracking.toFixed(1), live: true },
  ];

  return (
    <Surface className="w-[88%]">
      <SurfaceHeader label="Type" meta="Heading / Display" />
      <div className="flex gap-4">
        <div className="relative grid size-22 shrink-0 place-items-center bg-black/[0.025]">
          <span aria-hidden className="absolute inset-x-0 top-[62%] h-px bg-accent/30" />
          <motion.span
            className="text-[44px] leading-none text-foreground"
            animate={{ letterSpacing: `${tracking * 2.4}px` }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            Aa
          </motion.span>
        </div>
        <dl className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          {properties.map(({ label, value, live }) => (
            <div
              key={label}
              className={cn(
                "flex items-center justify-between px-1.5 py-1 transition-colors duration-300",
                live && tuning ? "bg-accent/[0.07]" : "bg-transparent"
              )}
            >
              <dt className="font-mono text-[9px] tracking-wider text-muted uppercase">{label}</dt>
              <dd className={cn("text-[11px] tabular-nums", live && tuning ? "text-accent" : "text-foreground")}>
                {value}
              </dd>
            </div>
          ))}
          <div className="flex items-center justify-between px-1.5 py-1">
            <span className="font-mono text-[9px] tracking-wider text-muted uppercase">Colour</span>
            <span className="flex gap-1">
              <span className="size-2.5 bg-foreground" />
              <span className="size-2.5 bg-accent" />
              <span className="size-2.5 bg-muted" />
            </span>
          </div>
        </dl>
      </div>
    </Surface>
  );
}

/* ───────────────────────── 04 · Experience ───────────────────────── */

const PROMPT = "Follow up with every lead that went quiet this quarter";
const TYPE_DELAY = 300;
const TYPE_SPEED = 26;
const TYPED_AT = TYPE_DELAY + PROMPT.length * TYPE_SPEED;
const EXPERIENCE_TIMINGS = [TYPED_AT + 350, TYPED_AT + 2000] as const;

/** Our agentic GTM system taking a plain-language instruction and doing the work. */
export function ExperienceMock({ play }: { play: boolean }) {
  const typed = useTypewriter(play, PROMPT, TYPE_DELAY, TYPE_SPEED);
  const step = useSequence(play, EXPERIENCE_TIMINGS);
  const typing = typed.length < PROMPT.length;

  return (
    <Surface className="w-[88%]">
      <SurfaceHeader label="GTM agent" meta="Replaces 5 tools" />
      <div className="flex items-end gap-2 border border-black/[0.08] p-2.5">
        <p className="min-h-[2lh] flex-1 text-[11.5px] leading-[1.45] text-foreground">
          {typed}
          {typing && (
            <motion.span
              aria-hidden
              className="ml-px inline-block h-[1.1em] w-px translate-y-[2px] bg-accent"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            />
          )}
        </p>
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center text-white transition-colors duration-300",
            typing ? "bg-foreground/25" : "bg-accent"
          )}
        >
          <svg viewBox="0 0 10 10" aria-hidden className="size-2.5">
            <path d="M5 8.5V1.5M2 4.5L5 1.5L8 4.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </span>
      </div>

      <div className="mt-3 flex h-5 items-center gap-2 text-[10.5px] leading-none">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.span
              key="working"
              className="flex items-center gap-2 text-foreground/70"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <Spinner /> Drafting follow-ups
              <Chip>CRM</Chip>
              <Chip>Email</Chip>
            </motion.span>
          )}
          {step >= 2 && (
            <motion.span
              key="done"
              className="flex items-center gap-2 text-foreground/70"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="grid size-3.5 place-items-center bg-accent text-white">
                <CheckIcon className="size-2" />
              </span>
              Sent · pipeline updated
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Surface>
  );
}

/* ───────────────────────── 05 · Transformation ───────────────────────── */

const STAGES = [
  { label: "Diagnose", note: "Map the business" },
  { label: "Roadmap", note: "Rank the wins" },
  { label: "Build", note: "Ship real systems" },
  { label: "Deploy", note: "Into production" },
  { label: "Evolve", note: "Grow with models" },
];
const TRANSFORMATION_TIMINGS = [500, 1000, 1500, 2000] as const;

/** An engagement checklist that ticks through every stage and never closes out. */
export function TransformationMock({ play }: { play: boolean }) {
  const step = useSequence(play, TRANSFORMATION_TIMINGS);

  return (
    <Surface className="w-[88%]">
      <SurfaceHeader label="Engagement" meta="Your team + Scrunity" />
      <ol className="flex flex-col">
        {STAGES.map(({ label, note }, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={label} className="flex items-center gap-2.5 border-t border-black/[0.05] py-[7px]">
              <span
                className={cn(
                  "grid size-3.5 shrink-0 place-items-center transition-colors duration-300",
                  done ? "bg-accent text-white" : current ? "ring-1 ring-accent" : "ring-1 ring-black/15"
                )}
              >
                {done && <CheckIcon className="size-2" />}
              </span>
              <span className={cn("text-[11.5px] leading-none", done || current ? "text-foreground" : "text-muted")}>
                {label}
              </span>
              <span className="ml-auto flex">
                {current ? (
                  <Chip tone="accent">{i === STAGES.length - 1 ? "Ongoing" : "In progress"}</Chip>
                ) : (
                  <span className="font-mono text-[8.5px] tracking-wider text-muted uppercase">{note}</span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </Surface>
  );
}
