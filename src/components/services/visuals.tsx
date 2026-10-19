"use client";

/**
 * Pseudo-UI mockups for the Services bento. Same contract as the "Why work with us"
 * mockups: with `play` on they run their sequence from the start, otherwise they rest
 * on their final state. Figures are illustrative, not client results.
 */

import { AnimatePresence, motion } from "motion/react";
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
  useTypewriter,
} from "@/components/bento/primitives";

const MONO_META = "font-mono text-[9px] leading-none tracking-wide text-muted uppercase";

/* ───────────────────────── 01 · Strategy & roadmap ───────────────────────── */

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
const INITIATIVES = [
  { label: "Support triage", start: 0, span: 1 },
  { label: "Contract review", start: 1, span: 1.5 },
  { label: "Forecasting agent", start: 1.5, span: 2 },
  { label: "Sales copilot", start: 2.5, span: 1.5 },
];
const ROADMAP_TIMINGS = [250, 550, 850, 1150, 1800] as const;

/** A ranked roadmap: initiatives land on the timeline one by one, then the quick win is flagged. */
export function RoadmapMock({ play }: { play: boolean }) {
  const step = useSequence(play, ROADMAP_TIMINGS);
  const flagged = step >= ROADMAP_TIMINGS.length;

  return (
    <Surface className="w-[min(100%,500px)]">
      <SurfaceHeader label="AI roadmap" meta="Ranked by impact" />

      <div className="grid grid-cols-[96px_1fr] gap-x-3 sm:grid-cols-[120px_1fr]">
        <span />
        <div className="grid grid-cols-4 pb-2">
          {QUARTERS.map((q) => (
            <span key={q} className={MONO_META}>
              {q}
            </span>
          ))}
        </div>

        {INITIATIVES.map(({ label, start, span }, i) => {
          const isWin = i === 0;
          return (
            <div key={label} className="contents">
              <span
                className={cn(
                  "truncate border-t border-black/[0.05] py-2 text-[11px] leading-none",
                  isWin && flagged ? "text-foreground" : "text-foreground/70"
                )}
              >
                {label}
              </span>
              <div className="relative border-t border-black/[0.05]">
                {/* quarter gridlines */}
                <div aria-hidden className="absolute inset-0 grid grid-cols-4">
                  {QUARTERS.map((q) => (
                    <span key={q} className="border-l border-dashed border-black/[0.06]" />
                  ))}
                </div>
                <motion.span
                  className={cn(
                    "absolute top-1/2 h-2 origin-left -translate-y-1/2",
                    isWin ? "bg-accent" : "text-foreground/25"
                  )}
                  style={{
                    left: `${(start / 4) * 100}%`,
                    width: `${(span / 4) * 100}%`,
                    backgroundImage: isWin ? undefined : TICKS,
                  }}
                  initial={false}
                  animate={{ scaleX: step > i ? 1 : 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                />
                {isWin && (
                  <AnimatePresence initial={false}>
                    {flagged && (
                      <motion.span
                        className="absolute top-1/2 left-[27%] -translate-y-1/2"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <Chip tone="accent">Quick win</Chip>
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Surface>
  );
}

/* ───────────────────────── 02 · Production systems ───────────────────────── */

const RELEASE_STAGES = [
  { label: "Build", meta: "Typed · tested" },
  { label: "Eval suite", meta: "412 / 412 pass" },
  { label: "Canary", meta: "5% → 100%" },
  { label: "Production", meta: "Observed" },
];
const RELEASE_TIMINGS = [500, 1100, 1800, 2400] as const;
const METRICS = [
  { label: "p95", value: "820ms" },
  { label: "Uptime", value: "99.9%" },
  { label: "Errors", value: "0.02%" },
];

/** A release rolling through its gates into production, then reporting live health. */
export function DeployMock({ play }: { play: boolean }) {
  const step = useSequence(play, RELEASE_TIMINGS);
  const live = step >= RELEASE_STAGES.length;

  return (
    <Surface className="w-[88%]">
      <SurfaceHeader
        label="Release"
        meta={
          live ? (
            <span className="inline-flex items-center gap-1.5 font-mono tracking-wider uppercase">
              <LiveDot /> Live
            </span>
          ) : (
            <span className="font-mono tracking-wider uppercase">Rolling out</span>
          )
        }
      />
      <ol className="flex flex-col">
        {RELEASE_STAGES.map(({ label, meta }, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={label} className="flex items-center gap-2.5 border-t border-black/[0.05] py-[7px]">
              <span
                className={cn(
                  "grid size-3.5 shrink-0 place-items-center transition-colors duration-300",
                  done ? "bg-accent text-white" : current ? "" : "ring-1 ring-black/15"
                )}
              >
                {done ? <CheckIcon className="size-2" /> : current && <Spinner />}
              </span>
              <span className={cn("text-[11.5px] leading-none", done || current ? "text-foreground" : "text-muted")}>
                {label}
              </span>
              <span className={cn("ml-auto", MONO_META, "text-[8.5px] tracking-wider")}>{meta}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {METRICS.map(({ label, value }, i) => (
          <motion.div
            key={label}
            className="flex flex-col gap-1 bg-black/[0.025] px-2 py-1.5"
            initial={false}
            animate={{ opacity: live ? 1 : 0.35, y: live ? 0 : 3 }}
            transition={{ duration: 0.35, delay: live ? i * 0.06 : 0, ease: EASE }}
          >
            <span className={cn(MONO_META, "text-[8px]")}>{label}</span>
            <span className="text-[12px] leading-none text-foreground tabular-nums">{value}</span>
          </motion.div>
        ))}
      </div>
    </Surface>
  );
}

/* ───────────────────────── 03 · Evals & reliability ───────────────────────── */

const SUITES = ["Accuracy", "Grounding", "Tone", "Safety"];
const CASES = 12;
const REGRESSION = { row: 1, col: 8 };
const EVAL_TIMINGS = [150, 1900] as const;

/** An eval run on a model swap: cases pass in a sweep, one regression is caught and blocked. */
export function EvalMock({ play }: { play: boolean }) {
  const step = useSequence(play, EVAL_TIMINGS);
  const caught = step >= EVAL_TIMINGS.length;

  return (
    <Surface className="w-[88%]">
      <SurfaceHeader label="Eval suite" meta="Model swap check" />
      <div className="flex flex-col gap-2">
        {SUITES.map((suite, row) => (
          <div key={suite} className="grid grid-cols-[64px_1fr] items-center gap-3">
            <span className="text-[11px] leading-none text-foreground/70">{suite}</span>
            <div className="grid grid-cols-12 gap-[3px]">
              {Array.from({ length: CASES }).map((_, col) => {
                const isRegression = row === REGRESSION.row && col === REGRESSION.col;
                return (
                  <motion.span
                    key={col}
                    className={cn(
                      "aspect-square transition-shadow duration-300",
                      isRegression
                        ? cn("ring-1 ring-inset", caught ? "ring-foreground" : "ring-black/15")
                        : "bg-accent"
                    )}
                    initial={play ? { opacity: 0, scale: 0.4 } : false}
                    animate={step >= 1 ? { opacity: isRegression ? 1 : 0.85, scale: 1 } : undefined}
                    transition={{ duration: 0.25, delay: (row * CASES + col) * 0.025, ease: EASE }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex h-5 items-center gap-2 text-[10.5px] leading-none text-foreground/70">
        <AnimatePresence mode="wait" initial={false}>
          {caught ? (
            <motion.span
              key="caught"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Chip tone="accent">1 regression</Chip>
              Blocked before release
            </motion.span>
          ) : (
            <motion.span
              key="running"
              className="flex items-center gap-2"
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Spinner /> Running 48 cases
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Surface>
  );
}

/* ───────────────────────── 04 · Document intelligence ───────────────────────── */

const FIELDS = [
  { label: "Vendor", value: "Northwind Ltd", line: 1 },
  { label: "Total", value: "$48,230.00", line: 5 },
  { label: "Due", value: "12 Nov 2026", line: 7 },
];
const DOC_LINES = [38, 72, 58, 90, 64, 46, 80, 54];
const EXTRACT_TIMINGS = [400, 900, 1400, 2000] as const;

/** A document being read: fields light up on the page and land as structured data. */
export function ExtractMock({ play }: { play: boolean }) {
  const step = useSequence(play, EXTRACT_TIMINGS);
  const synced = step > FIELDS.length;

  return (
    <Surface className="w-[88%]">
      <SurfaceHeader label="Extraction" meta="invoice_0412.pdf" />
      <div className="flex gap-3">
        {/* the page */}
        <div aria-hidden className="flex w-[40%] shrink-0 flex-col gap-[7px] bg-black/[0.025] p-2.5">
          {DOC_LINES.map((width, line) => {
            const field = FIELDS.findIndex((f) => f.line === line);
            const lit = field !== -1 && step > field;
            return (
              <span key={line} className="relative h-1.5" style={{ width: `${width}%` }}>
                <span className={cn("absolute inset-0", lit ? "bg-accent/40" : "bg-foreground/10")} />
                {field !== -1 && (
                  <motion.span
                    className="absolute -inset-[3px] ring-1 ring-accent"
                    initial={false}
                    animate={{ opacity: lit ? 1 : 0, scale: lit ? 1 : 1.15 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                )}
              </span>
            );
          })}
        </div>

        {/* the data */}
        <dl className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          {FIELDS.map(({ label, value }, i) => {
            const shown = step > i;
            const fresh = step === i + 1;
            return (
              <div
                key={label}
                className={cn(
                  "flex items-center justify-between gap-2 px-1.5 py-1 transition-colors duration-300",
                  fresh ? "bg-accent/[0.07]" : "bg-transparent"
                )}
              >
                <dt className="font-mono text-[9px] tracking-wider text-muted uppercase">{label}</dt>
                <motion.dd
                  className="truncate text-[11px] text-foreground tabular-nums"
                  initial={false}
                  animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : 6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  {value}
                </motion.dd>
              </div>
            );
          })}
          <div className="mt-1 flex h-5 items-center px-1.5">
            <AnimatePresence initial={false}>
              {synced && (
                <motion.span
                  className="flex items-center gap-1.5 text-[10.5px] leading-none text-foreground/70"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="grid size-3.5 place-items-center bg-accent text-white">
                    <CheckIcon className="size-2" />
                  </span>
                  Synced to ERP
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </dl>
      </div>
    </Surface>
  );
}

/* ───────────────────────── 05 · Fine-tuning ───────────────────────── */

const CURVE = "M4 58C30 56 44 48 62 38S100 22 128 18S172 13 196 12";
const SCORES = [
  { label: "Base model", value: 71 },
  { label: "Tuned", value: 89 },
];
const TUNE_TIMINGS = [1500] as const;

/** A tuning run: the domain-eval curve climbs past the base model, then the lift is scored. */
export function TuneMock({ play }: { play: boolean }) {
  const step = useSequence(play, TUNE_TIMINGS);
  const scored = step >= 1;

  return (
    <Surface className="w-[88%]">
      <SurfaceHeader label="Fine-tune" meta="Domain eval" />
      <svg viewBox="0 0 200 64" aria-hidden className="w-full overflow-visible" fill="none">
        {[16, 32, 48].map((y) => (
          <path key={y} d={`M0 ${y}H200`} stroke="currentColor" strokeOpacity={0.06} />
        ))}
        {/* base model line */}
        <path d="M0 30H200" className="text-foreground/30" stroke="currentColor" strokeDasharray="2 3" />
        <text x="198" y="27" textAnchor="end" className="fill-muted font-mono text-[6px] uppercase">
          Base
        </text>
        <motion.path
          d={CURVE}
          className="text-accent"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          initial={{ pathLength: play ? 0 : 1 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        <motion.circle
          cx={196}
          cy={12}
          r={2.4}
          className="fill-accent"
          initial={false}
          animate={{ scale: scored ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
      </svg>

      <ul className="mt-3 flex flex-col gap-2">
        {SCORES.map(({ label, value }, i) => {
          const tuned = i === 1;
          return (
            <li key={label} className="grid grid-cols-[64px_1fr_auto] items-center gap-3">
              <span className={cn("text-[11px] leading-none", tuned ? "text-foreground" : "text-foreground/70")}>
                {label}
              </span>
              <motion.span
                aria-hidden
                className={cn("h-2 origin-left", tuned ? "bg-accent" : "text-foreground/25")}
                style={{ width: `${value}%`, backgroundImage: tuned ? undefined : TICKS }}
                initial={false}
                animate={{ scaleX: tuned && !scored ? 0 : 1 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
              <span className="w-8 text-right font-mono text-[10px] leading-none text-muted tabular-nums">
                {tuned && !scored ? "—" : `${value}%`}
              </span>
            </li>
          );
        })}
      </ul>
    </Surface>
  );
}

/* ───────────────────────── 06 · AI-native interfaces ───────────────────────── */

const QUESTION = "Which contracts renew this quarter without a price cap?";
const ANSWER = "Three renew before December with no cap: Acme, Globex and Initech.";
const SOURCES = ["Acme MSA §4.2", "Globex renewal", "Initech order form"];
const ANSWER_DELAY = 1500;
const ANSWER_SPEED = 22;
const ANSWERED_AT = ANSWER_DELAY + ANSWER.length * ANSWER_SPEED;
const INTERFACE_TIMINGS = [300, ANSWER_DELAY - 100, ANSWERED_AT + 250] as const;

/** An assistant that shows its work: it searches, streams a grounded answer and cites sources. */
export function InterfaceMock({ play }: { play: boolean }) {
  const step = useSequence(play, INTERFACE_TIMINGS);
  const answer = useTypewriter(play, ANSWER, ANSWER_DELAY, ANSWER_SPEED);
  const streaming = step >= 2 && answer.length < ANSWER.length;

  return (
    <Surface className="w-[min(100%,500px)]">
      <SurfaceHeader label="Assistant" meta="Contracts workspace" />

      <div className="flex justify-end">
        <p className="max-w-[80%] bg-black/[0.04] px-2.5 py-2 text-[11.5px] leading-[1.4] text-foreground">
          {QUESTION}
        </p>
      </div>

      <div className="mt-3 flex h-4 items-center text-[10.5px] leading-none text-foreground/70">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.span
              key="searching"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <Spinner /> Searching 214 contracts
            </motion.span>
          )}
          {step >= 2 && (
            <motion.span
              key="found"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="grid size-3.5 place-items-center bg-accent text-white">
                <CheckIcon className="size-2" />
              </span>
              Read 214 contracts
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-2 min-h-[2lh] text-[11.5px] leading-[1.45] text-foreground">
        {step >= 2 && answer}
        {streaming && (
          <motion.span
            aria-hidden
            className="ml-px inline-block h-[1.1em] w-px translate-y-[2px] bg-accent"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          />
        )}
      </p>

      <ul className="mt-2 flex h-4 flex-wrap gap-1.5">
        {step >= 3 &&
          SOURCES.map((source, i) => (
            <motion.li
              key={source}
              initial={play ? { opacity: 0, y: 4 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08, ease: EASE }}
            >
              <Chip>
                <span className="text-accent">{i + 1}</span> {source}
              </Chip>
            </motion.li>
          ))}
      </ul>
    </Surface>
  );
}
