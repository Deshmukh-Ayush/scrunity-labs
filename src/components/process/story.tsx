"use client";

/**
 * Story: a scroll-told sequence of chapters joined by a thread.
 *
 *   <Story.Root>
 *     <Story.Chapter id="friction" index={0} illustration={<FrictionIllustration />}>
 *       <Story.Title>It starts with friction.</Story.Title>
 *       <Story.Lead>Words that light up as you read down the page…</Story.Lead>
 *       <Story.Scene mock={FrictionScene} />
 *       <Story.Outcome>What this chapter leaves you with.</Story.Outcome>
 *     </Story.Chapter>
 *   </Story.Root>
 *
 * - Chapter: a <section> whose line-art tile turns solid once the reader reaches it.
 *   Every chapter but the last draws its stretch of the thread, filled with scroll and
 *   tipped with an accent marker that rides the fill.
 * - Lead: a paragraph whose words brighten one by one as it scrolls through view.
 * - Scene: a soft tile holding a pseudo-UI mockup (`play` contract, see bento/primitives).
 *   It plays each time it scrolls into view, and a Replay button runs it again.
 *
 * Under reduced motion the thread is drawn full, words start lit and scenes rest on
 * their final frame.
 *
 * Styling hooks: `data-slot="story" | "story-chapter" | "story-title" | "story-lead" |
 * "story-scene" | "story-outcome"`, and `data-state="reached" | "upcoming"` on chapters.
 */

import { createContext, use, useId, useRef, useState } from "react";
import type { ComponentProps, ComponentType, ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import { cn } from "cn";
import { EASE } from "@/components/bento/primitives";

/* ───────────────────────── context ───────────────────────── */

const ChapterContext = createContext<{ titleId: string } | null>(null);

function useChapter() {
  const context = use(ChapterContext);
  if (!context) throw new Error("Story parts must be rendered inside <Story.Chapter>.");
  return context;
}

/* ───────────────────────── root ───────────────────────── */

export function Root({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="story" className={cn("flex flex-col", className)} {...props} />;
}

/* ───────────────────────── chapter ───────────────────────── */

export function Chapter({
  index,
  label,
  illustration,
  last = false,
  className,
  children,
  ...props
}: {
  index: number;
  /** Short chapter name shown in the eyebrow, e.g. "The friction". */
  label: string;
  illustration: ReactNode;
  /** The final chapter draws no thread below it. */
  last?: boolean;
} & ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 55%", "end 55%"] });
  const [reached, setReached] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => setReached(v > 0));

  const isReached = reduceMotion || reached;

  return (
    <ChapterContext value={{ titleId }}>
      <section
        ref={ref}
        aria-labelledby={titleId}
        data-slot="story-chapter"
        data-state={isReached ? "reached" : "upcoming"}
        className={cn(
          "group/chapter relative grid scroll-mt-14 grid-cols-[48px_1fr] gap-x-4 sm:grid-cols-[72px_1fr] sm:gap-x-6",
          !last && "pb-24",
          className
        )}
        {...props}
      >
        {!last && <Thread progress={scrollYProgress} full={!!reduceMotion} />}

        <div
          aria-hidden
          className="relative size-12 bg-accent/[0.07] text-accent transition-colors duration-500 group-data-[state=reached]/chapter:bg-accent group-data-[state=reached]/chapter:text-white motion-reduce:transition-none sm:size-18"
        >
          {illustration}
        </div>

        <div className="flex min-w-0 flex-col pt-0.5">
          <p className="flex items-center gap-2 font-mono text-[10px] leading-none tracking-[0.12em] text-muted uppercase">
            <span className="transition-colors duration-300 group-data-[state=reached]/chapter:text-accent">
              Chapter {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden className="h-px w-4 bg-border" />
            <span>{label}</span>
          </p>
          {children}
        </div>
      </section>
    </ChapterContext>
  );
}

/** This chapter's stretch of the thread, from below its tile to the next chapter's tile. */
function Thread({ progress, full }: { progress: MotionValue<number>; full: boolean }) {
  const tip = useTransform(progress, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);
  const tipOpacity = useTransform(progress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  return (
    <span aria-hidden className="absolute top-21 bottom-3 left-9 hidden w-px bg-border sm:block">
      <motion.span className="absolute inset-0 origin-top bg-accent" style={{ scaleY: full ? 1 : progress }} />
      {!full && (
        <motion.span
          className="absolute left-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 bg-accent ring-4 ring-background"
          style={{ top: tip, opacity: tipOpacity }}
        />
      )}
    </span>
  );
}

/* ───────────────────────── text parts ───────────────────────── */

export function Title({ className, ...props }: ComponentProps<"h2">) {
  const { titleId } = useChapter();
  return (
    <h2
      id={titleId}
      data-slot="story-title"
      className={cn("mt-4 text-[24px] leading-[1.25] font-normal tracking-[-0.5px] text-foreground", className)}
      {...props}
    />
  );
}

/** Lead paragraph. Takes plain text so it can be split into words that light up with scroll. */
export function Lead({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const words = children.split(" ");

  return (
    <p
      ref={ref}
      data-slot="story-lead"
      className={cn("mt-3 max-w-[54ch] text-[17px] leading-[1.6] text-foreground", className)}
    >
      {reduceMotion
        ? children
        : words.map((word, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {word}
            </Word>
          ))}
    </p>
  );
}

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  );
}

export function Outcome({ className, children, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="story-outcome"
      className={cn("mt-5 flex items-baseline gap-3 text-[14px] leading-[1.6] text-muted", className)}
      {...props}
    >
      <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-foreground/70 uppercase">
        <span aria-hidden className="size-[5px] -translate-y-px bg-accent" />
        Outcome
      </span>
      <span>{children}</span>
    </p>
  );
}

/* ───────────────────────── scene ───────────────────────── */

export function Scene({
  mock: Mock,
  label,
  className,
}: {
  mock: ComponentType<{ play: boolean }>;
  /** What the scene shows, for assistive tech (the mockup itself is decorative). */
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduceMotion = useReducedMotion();
  // bumped by Replay so the same mockup remounts and runs again
  const [run, setRun] = useState(0);
  const play = inView && !reduceMotion;

  return (
    <motion.figure
      ref={ref}
      data-slot="story-scene"
      className={cn("group/scene relative -ml-16 mt-7 sm:ml-0", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div
        aria-hidden
        className="relative flex h-64 items-center justify-center overflow-hidden bg-black/[0.025] transition-colors duration-500 group-hover/scene:bg-black/[0.04]"
      >
        <Mock key={play ? `play-${run}` : "rest"} play={play} />
      </div>
      <figcaption className="sr-only">{label}</figcaption>

      {!reduceMotion && (
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 bg-background/80 px-2 py-1 font-mono text-[9px] leading-none tracking-wider text-foreground/60 uppercase opacity-0 ring-1 ring-black/[0.06] backdrop-blur transition-[opacity,color] duration-200 outline-none group-hover/scene:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [@media(hover:none)]:opacity-100"
        >
          <ReplayIcon />
          Replay
        </button>
      )}
    </motion.figure>
  );
}

function ReplayIcon() {
  return (
    <svg
      viewBox="0 0 10 10"
      aria-hidden
      className="size-2.5 transition-transform duration-500 ease-out group-hover/scene:-rotate-180 motion-reduce:transition-none"
    >
      <path d="M8.2 5A3.2 3.2 0 1 1 7 2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7.4 0.8V2.9H5.3" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
