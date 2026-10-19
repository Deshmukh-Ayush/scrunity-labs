"use client";

/**
 * Pseudo-UI scenes for the process story, one per chapter. Same contract as the bento
 * mockups: with `play` on they run their sequence from the start, otherwise they rest
 * on their final frame. One fictional client runs through all six; figures are illustrative.
 */

import { useEffect } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { cn } from "cn";
import {
  CheckIcon,
  Chip,
  EASE,
  LiveDot,
  Spinner,
  Surface,
  SurfaceHeader,
  TICKS,
  useSequence,
} from "@/components/bento/primitives";

const MONO_META = "font-mono text-[9px] leading-none tracking-wide text-muted uppercase";

/** A number that counts from `from` to `to` while playing, and rests on `to`. */
function CountUp({ play, from, to, duration, delay = 0, format = (n: number) => n.toLocaleString("en-US") }: {
  play: boolean;
  from: number;
  to: number;
  duration: number;
  delay?: number;
  format?: (n: number) => string;
}) {
  const value = useMotionValue(play ? from : to);
  const text = useTransform(value, (v) => format(Math.round(v)));

  useEffect(() => {
    if (!play) return;
    const controls = animate(value, to, { duration, delay, ease: EASE });
    return () => controls.stop();
  }, [play, value, to, duration, delay]);

  return <motion.span className="tabular-nums">{text}</motion.span>;
}

/* ───────────────────────── 01 · The friction ───────────────────────── */

const TASKS = [
  { label: "Re-key invoice #4471 into ERP", age: "3d" },
  { label: "Chase missing PO from supplier", age: "5d" },
  { label: "Copy inbound lead into CRM", age: "6d" },
  { label: "Rebuild Monday ops report", age: "1w" },
];
const FRICTION_TIMINGS = [300, 750, 1200, 1650, 2300] as const;

/** An ops inbox that keeps filling faster than anyone can clear it. */
export function FrictionScene({ play }: { play: boolean }) {
  const step = useSequence(play, FRICTION_TIMINGS);
  // newest task lands on top, so the pile visibly grows downward
  const visible = TASKS.slice(0, Math.min(step, TASKS.length)).reverse();
  const breached = step > TASKS.length;

  return (
    <Surface className="w-[min(88%,440px)]">
      <SurfaceHeader
        label="Ops inbox"
        meta={
          <span className="font-mono tracking-wider uppercase">
            <CountUp play={play} from={1180} to={1284} duration={2.2} delay={0.2} /> open
          </span>
        }
      />
      <ul className="flex h-[132px] flex-col">
        <AnimatePresence initial={false}>
          {visible.map(({ label, age }) => (
            <motion.li
              key={label}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex items-center gap-2.5 border-t border-black/[0.05] py-2"
            >
              <span aria-hidden className="size-3 shrink-0 ring-1 ring-black/15" />
              <span className="min-w-0 flex-1 truncate text-[11.5px] leading-none text-foreground/80">{label}</span>
              <span className={cn(MONO_META, "text-[8.5px]")}>{age}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <div className="mt-2 flex h-5 items-center gap-2 text-[10.5px] leading-none text-foreground/70">
        <AnimatePresence initial={false}>
          {breached && (
            <motion.span
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="bg-foreground px-1.5 py-[3px] font-mono text-[8.5px] leading-none tracking-wider text-background uppercase">
                SLA missed
              </span>
              62 hours of manual work this week
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Surface>
  );
}

/* ───────────────────────── 02 · We listen ───────────────────────── */

const NOTES = [
  { quote: "I copy every invoice in by hand.", who: "Finance", theme: "Re-keying" },
  { quote: "Leads sit for days before anyone sees them.", who: "Sales", theme: "Handoffs" },
  { quote: "The Monday report eats my whole morning.", who: "Ops", theme: "Reporting" },
];
const LISTEN_TIMINGS = [300, 800, 1300, 1900, 2300, 2700] as const;

/** Field notes from the floor: each quote arrives, then gets tagged with its theme. */
export function ListenScene({ play }: { play: boolean }) {
  const step = useSequence(play, LISTEN_TIMINGS);

  return (
    <Surface className="w-[min(88%,440px)]">
      <SurfaceHeader label="Field notes" meta={step >= 6 ? "3 themes found" : "Listening"} />
      <ul className="flex flex-col gap-1.5">
        {NOTES.map(({ quote, who, theme }, i) => {
          const shown = step > i;
          const tagged = step > i + 3;
          return (
            <motion.li
              key={quote}
              initial={false}
              animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex items-center gap-3 bg-black/[0.025] px-2.5 py-2"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-[11.5px] leading-none text-foreground">&ldquo;{quote}&rdquo;</span>
                <span className={MONO_META}>{who}</span>
              </span>
              <motion.span
                initial={false}
                animate={{ opacity: tagged ? 1 : 0, scale: tagged ? 1 : 0.85 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <Chip tone="accent">{theme}</Chip>
              </motion.span>
            </motion.li>
          );
        })}
      </ul>
    </Surface>
  );
}

/* ───────────────────────── 03 · The map ───────────────────────── */

// x = effort (left is easy), y = impact (top is high), both 0..1
const OPPORTUNITIES = [
  { x: 0.22, y: 0.2, label: "Invoice capture", pick: true },
  { x: 0.64, y: 0.28, label: "Forecasting" },
  { x: 0.4, y: 0.64, label: "Lead routing" },
  { x: 0.8, y: 0.58, label: "Custom CRM" },
  { x: 0.62, y: 0.86, label: "Report bot" },
];
const MAP_TIMINGS = [250, 450, 650, 850, 1050, 1700] as const;

/** Impact versus effort: opportunities settle onto the grid and the first build is picked. */
export function MapScene({ play }: { play: boolean }) {
  const step = useSequence(play, MAP_TIMINGS);
  const picked = step >= MAP_TIMINGS.length;

  return (
    <Surface className="w-[min(88%,440px)]">
      <SurfaceHeader label="Opportunity map" meta="Impact × effort" />
      <div className="grid grid-cols-[12px_1fr] gap-2">
        <span className={cn(MONO_META, "self-center text-[8px] [writing-mode:vertical-rl] rotate-180")}>Impact</span>
        <div>
          <div className="relative h-[124px] border-b border-l border-black/10">
            {/* quadrant split */}
            <span aria-hidden className="absolute inset-y-0 left-1/2 border-l border-dashed border-black/[0.08]" />
            <span aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dashed border-black/[0.08]" />
            <motion.span
              aria-hidden
              className="absolute top-0 left-0 h-1/2 w-1/2 bg-accent/[0.06]"
              initial={false}
              animate={{ opacity: picked ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />
            {OPPORTUNITIES.map(({ x, y, label, pick }, i) => {
              const shown = step > i;
              return (
                <motion.span
                  key={label}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5"
                  style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
                  initial={false}
                  animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : -8 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 transition-colors duration-300",
                      pick && picked ? "bg-accent" : "bg-foreground/30"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] leading-none whitespace-nowrap transition-colors duration-300",
                      pick && picked ? "text-foreground" : "text-foreground/55"
                    )}
                  >
                    {label}
                  </span>
                </motion.span>
              );
            })}
            <AnimatePresence initial={false}>
              {picked && (
                <motion.span
                  className="absolute top-[30%] left-[22%] -translate-x-1/2"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <Chip tone="accent">Start here</Chip>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className={cn(MONO_META, "mt-1.5 block text-[8px]")}>Effort →</span>
        </div>
      </div>
    </Surface>
  );
}

/* ───────────────────────── 04 · The build ───────────────────────── */

const COMMITS = [
  { message: "Invoice extraction agent", score: 72 },
  { message: "Validate totals against POs", score: 86 },
  { message: "Human review for low confidence", score: 94 },
];
const BUILD_TIMINGS = [400, 1200, 2000] as const;

/** Paired commits, each one moving the eval score up. */
export function BuildScene({ play }: { play: boolean }) {
  const step = useSequence(play, BUILD_TIMINGS);
  const score = step > 0 ? COMMITS[step - 1].score : 0;

  return (
    <Surface className="w-[min(88%,440px)]">
      <SurfaceHeader label="invoice-agent" meta="Your team + Scrunity" />
      <ol className="flex flex-col">
        {COMMITS.map(({ message, score: s }, i) => {
          const shown = step > i;
          const latest = step === i + 1;
          return (
            <motion.li
              key={message}
              initial={false}
              animate={{ opacity: shown ? 1 : 0.25 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-2.5 border-t border-black/[0.05] py-2"
            >
              {/* pair of authors */}
              <span aria-hidden className="flex shrink-0">
                <span className="grid size-4 place-items-center bg-foreground/[0.08] font-mono text-[7px] text-foreground/70">
                  YT
                </span>
                <span className="-ml-1 grid size-4 place-items-center bg-accent font-mono text-[7px] text-white ring-2 ring-background">
                  SL
                </span>
              </span>
              <span className="min-w-0 flex-1 truncate text-[11.5px] leading-none text-foreground">{message}</span>
              <span className={cn(MONO_META, "text-[8.5px]", latest && "text-accent")}>
                {shown ? `evals ${s}%` : "—"}
              </span>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className={MONO_META}>Pass rate</span>
        <span className="relative h-2 text-foreground/15" style={{ backgroundImage: TICKS }}>
          <motion.span
            className="absolute inset-y-0 left-0 bg-accent"
            initial={false}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.6, ease: EASE }}
          />
          {/* the bar a release has to clear */}
          <span className="absolute -inset-y-1 left-[90%] w-px bg-foreground/50" />
        </span>
        <span className="w-8 text-right text-[11px] leading-none text-foreground tabular-nums">{score}%</span>
      </div>
    </Surface>
  );
}

/* ───────────────────────── 05 · The launch ───────────────────────── */

const RAMP = [5, 25, 50, 100];
const LAUNCH_TIMINGS = [500, 1100, 1700, 2300] as const;

/** A staged rollout: traffic widens one gate at a time while health holds steady. */
export function LaunchScene({ play }: { play: boolean }) {
  const step = useSequence(play, LAUNCH_TIMINGS);
  const traffic = step > 0 ? RAMP[step - 1] : 0;
  const live = step >= RAMP.length;

  return (
    <Surface className="w-[min(88%,440px)]">
      <SurfaceHeader
        label="Rollout"
        meta={
          <span className="inline-flex items-center gap-1.5 font-mono tracking-wider uppercase">
            {live ? (
              <>
                <LiveDot /> Live
              </>
            ) : (
              <>
                <Spinner /> Ramping
              </>
            )}
          </span>
        }
      />

      <div className="flex items-end justify-between">
        <span className="text-[32px] leading-none tracking-[-1px] text-foreground tabular-nums">
          {traffic}
          <span className="text-[16px] text-muted">%</span>
        </span>
        <span className={cn(MONO_META, "pb-1")}>of invoice traffic</span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1">
        {RAMP.map((gate, i) => (
          <div key={gate} className="flex flex-col gap-1.5">
            <span className="relative h-1.5 overflow-hidden bg-black/[0.05]">
              <motion.span
                className="absolute inset-0 origin-left bg-accent"
                initial={false}
                animate={{ scaleX: step > i ? 1 : 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              />
            </span>
            <span className={cn(MONO_META, "text-[8px]", step > i && "text-foreground/70")}>{gate}%</span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {[
          { label: "Error rate", value: "0.02%" },
          { label: "Auto-processed", value: live ? "92%" : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between bg-black/[0.025] px-2 py-1.5">
            <span className={cn(MONO_META, "text-[8px]")}>{label}</span>
            <span className="text-[11.5px] leading-none text-foreground tabular-nums">{value}</span>
          </div>
        ))}
      </div>
    </Surface>
  );
}

/* ───────────────────────── 06 · What's next ───────────────────────── */

const CHECKS = [
  { label: "Evals", value: "48 / 48" },
  { label: "Cost", value: "−38%" },
  { label: "Latency", value: "−21%" },
];
const EVOLVE_TIMINGS = [600, 1000, 1400, 1800, 2500] as const;

/** A new model lands, is checked against your workload, and quietly takes over. */
export function EvolveScene({ play }: { play: boolean }) {
  const step = useSequence(play, EVOLVE_TIMINGS);
  const arrived = step >= 1;
  const upgraded = step >= EVOLVE_TIMINGS.length;

  return (
    <Surface className="w-[min(88%,440px)]">
      <SurfaceHeader label="Model watch" meta="Your workload" />

      <div className="flex items-center gap-2">
        <ModelCard label="In production" name={upgraded ? "Gen 5" : "Gen 4"} active />
        <span aria-hidden className="text-muted">
          <svg viewBox="0 0 12 8" className="h-2 w-3">
            <path d="M0 4H11M8 1L11 4L8 7" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </span>
        <motion.div
          className="flex-1"
          initial={false}
          animate={{ opacity: arrived && !upgraded ? 1 : 0.3, x: arrived ? 0 : 10 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <ModelCard label={upgraded ? "Next release" : "New release"} name={upgraded ? "Watching…" : "Gen 5"} />
        </motion.div>
      </div>

      <ul className="mt-3 grid grid-cols-3 gap-1.5">
        {CHECKS.map(({ label, value }, i) => {
          const done = step > i + 1;
          return (
            <li key={label} className="flex flex-col gap-1 bg-black/[0.025] px-2 py-1.5">
              <span className={cn(MONO_META, "flex items-center gap-1 text-[8px]")}>
                <span
                  className={cn(
                    "grid size-2.5 place-items-center text-white transition-colors duration-300",
                    done ? "bg-accent" : "ring-1 ring-black/15"
                  )}
                >
                  {done && <CheckIcon className="size-[7px]" />}
                </span>
                {label}
              </span>
              <span className={cn("text-[11.5px] leading-none tabular-nums", done ? "text-foreground" : "text-muted")}>
                {done ? value : "…"}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex h-5 items-center text-[10.5px] leading-none text-foreground/70">
        <AnimatePresence initial={false}>
          {upgraded && (
            <motion.span
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="grid size-3.5 place-items-center bg-accent text-white">
                <CheckIcon className="size-2" />
              </span>
              Upgraded with zero downtime
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Surface>
  );
}

function ModelCard({ label, name, active = false }: { label: string; name: string; active?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-1.5 px-2.5 py-2",
        active ? "bg-background ring-1 ring-accent/40" : "bg-black/[0.025]"
      )}
    >
      <span className={cn(MONO_META, "text-[8px]")}>{label}</span>
      <span className="relative h-3.5 overflow-hidden text-[12px] leading-none text-foreground">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={name}
            className="block"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {name}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
