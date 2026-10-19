"use client";

/**
 * HeroCtas: primary button, secondary button, and a "copy prompt" row with an
 * "open in" menu. Measurements and timings come from the reference recording.
 *
 * The primary label tweens font-weight 700 -> 400, which relies on Geist Mono
 * being a variable font (it is, via next/font in app/layout.tsx).
 */

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties, FocusEvent, ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import type { Transition } from "motion/react";
import { cn } from "cn";
import { SCRUNITY_PROMPT } from "./ask-ai";

/* ───────────────────────── tokens (sampled from the reference) ───────────────────────── */

const CTA = "#0562EF"; // button blue
const CTA_RGB = "5,98,239";
const INK = "#12181f"; // near-black label color
const ICON_GRAY = "#666a6c";
const ICON_HOVER = "#2a2e31";
const WASH = "rgba(0,190,255,0.05)"; // secondary hover: very pale cyan
const HATCH = `repeating-linear-gradient(-45deg, #f0f0f3 0, #f0f0f3 1px, transparent 1px, transparent 3.54px)`;

const HEIGHT = 44;
const BORDER = 2;
const TILE = HEIGHT - BORDER * 2; // white logo tile fills the inside height
const TEXT_SHIFT = -37; // how far the label slides left on hover
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]; // ease-out-quint

const LABEL =
  "font-mono text-[11px] uppercase leading-none tracking-[0.05em] whitespace-nowrap";

const CTA_LABEL =
  "font-mono text-[12px] font-medium uppercase leading-none tracking-[0.05em] whitespace-nowrap";

const FOCUS =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--cta)";

const isExternal = (href: string) => /^[a-z][a-z\d+.-]*:/i.test(href);

/* ───────────────────────── icons ───────────────────────── */

/** Scrunity mark (fill = currentColor). */
function ScrunityMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 595 516"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M173.484 291.968C196.11 273.319 209.027 250.36 208.629 220.999C208.459 208.482 204.84 196.793 197.593 186.543C186.492 170.845 181.629 153.411 182.066 134.358C182.623 110.14 180.842 85.8856 183.058 61.6968C186.188 27.535 214.673 0.842046 249.366 0.331365C280.848 -0.132075 312.348 -0.0928666 343.831 0.345853C381.175 0.866217 410.445 30.9534 410.568 68.303C410.646 92.2947 410.365 116.29 410.658 140.278C410.834 154.738 408.14 168.759 399.469 180.001C370.498 217.558 386.322 271.371 426.991 297.543C445.409 309.396 464.418 317.025 486.758 315.332C497.691 314.504 508.74 315.198 519.736 315.189C560.912 315.158 589.337 339.361 592.587 380.141C594.603 405.443 594.954 431.115 591.975 456.479C588.344 487.398 561.407 512.088 530.261 514.123C506.302 515.689 482.315 514.182 458.363 514.657C434.521 515.129 414.789 507.219 399.18 489.491C389.779 478.814 381.318 467.315 372.149 456.427C354.913 435.96 334.482 420.877 306.846 417.685C281.588 414.769 259.412 421.935 239.883 437.598C224.959 449.568 213.403 464.767 201.929 479.869C189.275 496.524 174.309 509.456 153.112 513.342C145.499 514.738 137.741 515.079 129.978 514.932C107.004 514.499 83.9937 516.045 61.0535 514.09C28.0133 511.273 0.898518 482.21 0.308415 448.745C-0.0836594 426.51 -0.11465 404.256 0.288914 382.021C0.955144 345.315 31.0258 315.76 67.7928 315.253C78.7869 315.102 89.8574 314.43 100.767 315.405C128.265 317.863 151.877 309.113 173.484 291.968ZM295.401 207.941C275.761 208.255 258.928 216.007 246.484 230.529C224.137 256.607 207.737 286.637 198.7 319.666C187.574 360.325 215.375 394.513 257.619 394.619C284.112 394.686 310.609 394.912 337.097 394.519C355.981 394.239 372.268 387.414 384.267 372.285C400.484 351.839 400.129 329.481 390.785 306.545C381.521 283.806 370.288 261.966 356.082 241.952C341.74 221.748 322.959 208.095 295.401 207.941Z"
      />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path
        d="M1.5 8.5 8.5 1.5M3 1.5h5.5V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="4.6" y="4.6" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M9.4 4.6V3.6a2 2 0 0 0-2-2h-3.8a2 2 0 0 0-2 2v3.8a2 2 0 0 0 2 2h1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="m3 7.4 2.8 2.8L11 4.2"
        stroke={CTA}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path
        d="m2 3.6 3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ───────────────────────── shared bits ───────────────────────── */

/** Hover state that also lights up on keyboard focus. */
function useHover() {
  const [hovered, setHovered] = useState(false);
  const handlers = {
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    onFocus: (e: FocusEvent<HTMLElement>) => {
      if (e.currentTarget.matches(":focus-visible")) setHovered(true);
    },
    onBlur: () => setHovered(false),
  };
  return [hovered, handlers] as const;
}

function useTransition(duration: number): Transition {
  const reduce = useReducedMotion();
  // memoized: a fresh object each render would restart animations that depend on it
  return useMemo(() => (reduce ? { duration: 0 } : { duration, ease: EASE }), [reduce, duration]);
}

/** Blur + vertical slide swap: old content exits up, new content enters from below. */
const swap = {
  initial: { opacity: 0, y: 6, filter: "blur(3px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -6, filter: "blur(3px)" },
};

/** Faint diagonal hatch that fades in while its parent `.group` is hovered or focused. */
function Hatch({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  return (
    <span
      aria-hidden
      style={{ backgroundImage: HATCH }}
      className={cn(
        "pointer-events-none absolute inset-0",
        alwaysVisible
          ? "opacity-100"
          : "opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
      )}
    />
  );
}

/* ───────────────────────── primary button ───────────────────────── */
/**
 * Rest:  blue fill, white logo tile on the left, bold white label.
 * Hover: the white tile grows to fill the button, the logo rides its right edge
 *        while spinning 360°, the label slides left and turns blue / regular weight.
 * One motion value (0 → 1) drives every property so interruptions reverse cleanly.
 */
export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  const [hovered, hoverHandlers] = useHover();
  const tween = useTransition(0.42);

  const p = useMotionValue(0);
  useEffect(() => {
    const controls = animate(p, hovered ? 1 : 0, tween);
    return () => controls.stop();
  }, [hovered, p, tween]);

  const panelWidth = useTransform(p, (v) => `calc(${TILE}px + (100% - ${TILE}px) * ${v})`);
  const spin = useTransform(p, [0, 1], [0, 360]);
  const textX = useTransform(p, [0, 1], [0, TEXT_SHIFT]);
  // color and weight flip early so the label reads clearly while the panel is still moving
  const textColor = useTransform(p, [0, 0.35], ["#ffffff", CTA]);

  return (
    <a
      href={href}
      {...hoverHandlers}
      // sets --cta itself so it also works outside HeroCtas
      style={{ "--cta": CTA, height: HEIGHT, borderWidth: BORDER } as CSSProperties}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer select-none items-center overflow-hidden border-(--cta) bg-(--cta)",
        FOCUS
      )}
    >
      {/* white panel: starts as the logo tile, grows to fill */}
      <motion.span aria-hidden style={{ width: panelWidth }} className="absolute inset-y-0 left-0 bg-white">
        <span
          style={{ width: TILE }}
          className="absolute inset-y-0 right-0 grid place-items-center text-(--cta)"
        >
          <motion.span style={{ rotate: spin }} className="grid place-items-center">
            <ScrunityMark className="h-[15px] w-auto" />
          </motion.span>
        </span>
      </motion.span>

      <motion.span
        style={{ x: textX, color: textColor, paddingLeft: TILE + 9.5 }}
        className={cn(CTA_LABEL, "relative pr-[9.5px]")}
      >
        {children}
      </motion.span>
    </a>
  );
}

/* ───────────────────────── secondary button ───────────────────────── */
/**
 * Rest:  transparent, faint corner brackets, dark label, arrow.
 * Hover: pale cyan wash, brackets pull inward and strengthen, arrow nudges up-right.
 */
const CORNERS = [
  { pos: "left-0 top-0 border-l border-t", dx: 1, dy: 1 },
  { pos: "right-0 top-0 border-r border-t", dx: -1, dy: 1 },
  { pos: "bottom-0 left-0 border-b border-l", dx: 1, dy: -1 },
  { pos: "bottom-0 right-0 border-b border-r", dx: -1, dy: -1 },
] as const;

function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  const [hovered, hoverHandlers] = useHover();
  const bracketTween = useTransition(0.3);
  const arrowTween = useTransition(0.25);
  const reduce = useReducedMotion();
  const external = isExternal(href);

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      {...hoverHandlers}
      initial={false}
      animate={{ backgroundColor: hovered ? WASH : "rgba(0,190,255,0)" }}
      transition={{ duration: reduce ? 0 : 0.15 }}
      style={{ height: HEIGHT, color: INK }}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer select-none items-center gap-[14px] pl-[11px] pr-[14px]",
        CTA_LABEL,
        FOCUS
      )}
    >
      {CORNERS.map(({ pos, dx, dy }) => (
        <motion.span
          key={pos}
          aria-hidden
          initial={false}
          animate={{
            x: hovered ? dx * 6 : 0,
            y: hovered ? dy * 4 : 0,
            borderColor: `rgba(${CTA_RGB},${hovered ? 0.45 : 0.2})`,
          }}
          transition={bracketTween}
          className={cn("pointer-events-none absolute size-[6px]", pos)}
        />
      ))}

      <span>{children}</span>

      <motion.span
        aria-hidden
        initial={false}
        animate={{ x: hovered ? 2 : 0, y: hovered ? -2 : 0 }}
        transition={arrowTween}
        className="grid place-items-center"
      >
        <ArrowUpRight />
      </motion.span>
    </motion.a>
  );
}

/* ───────────────────────── copy row ───────────────────────── */

export type OpenTarget = { label: string; href: (prompt: string) => string };

const DEFAULT_TARGETS: OpenTarget[] = [
  { label: "Claude", href: (q) => `https://claude.ai/new?q=${encodeURIComponent(q)}` },
  { label: "ChatGPT", href: (q) => `https://chatgpt.com/?q=${encodeURIComponent(q)}` },
  {
    label: "Cursor",
    href: (q) => `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(q)}`,
  },
];

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for insecure contexts / older browsers
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function CopyRow({
  prompt,
  label,
  copiedLabel,
  targets,
}: {
  prompt: string;
  label: string;
  copiedLabel: string;
  targets: OpenTarget[];
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const menuId = useId();
  const swapTransition = useTransition(0.2);
  const menuTransition = useTransition(0.16);

  const copy = useCallback(async () => {
    if (!(await writeClipboard(prompt))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }, [prompt]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // close the menu on outside press / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative w-full">
      <div style={{ color: INK }} className="flex h-[28px] items-stretch">
        {/* label + copy icon share one click target */}
        <button
          type="button"
          onClick={copy}
          className={cn(
            "relative flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-[10px] text-left",
            FOCUS
          )}
        >
          <Hatch alwaysVisible />

          <span className="relative h-[13px] flex-1 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={copied ? "copied" : "idle"}
                {...swap}
                transition={swapTransition}
                className={cn(LABEL, "absolute inset-y-0 left-0 flex items-center")}
              >
                {copied ? copiedLabel : label}
              </motion.span>
            </AnimatePresence>
          </span>

          <span
            style={{ "--icon": ICON_GRAY } as CSSProperties}
            className="relative grid size-[13px] place-items-center text-(--icon)"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={copied ? "check" : "copy"}
                {...swap}
                transition={swapTransition}
                className="grid place-items-center"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </motion.span>
            </AnimatePresence>
          </span>

          <span className="sr-only" role="status">
            {copied ? copiedLabel : ""}
          </span>
        </button>

        {/* divider + menu trigger */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label="Open prompt in another app"
          onClick={() => setOpen((v) => !v)}
          style={{ "--icon": ICON_GRAY, "--icon-hover": ICON_HOVER } as CSSProperties}
          className={cn(
            "group relative grid w-7 cursor-pointer place-items-center border-l border-black/[0.07] text-(--icon) transition-colors hover:text-(--icon-hover)",
            open && "text-(--icon-hover)",
            FOCUS
          )}
        >
          <Hatch />
          <motion.span
            initial={false}
            animate={{ rotate: open ? 180 : 0 }}
            transition={swapTransition}
            className="relative grid place-items-center"
          >
            <Chevron />
          </motion.span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={menuTransition}
            className="absolute right-0 top-full z-20 mt-1.5 w-[154px] border border-[#e4e4e7] bg-white pb-1 shadow-[0_12px_24px_-12px_rgba(0,0,0,0.2)]"
          >
            <p className="px-2.5 pb-1.5 pt-3 font-mono text-[10px] uppercase leading-none tracking-[0.1em] text-[#a8a8b0]">
              Open in
            </p>
            <ul>
              {targets.map((t) => (
                <li key={t.label}>
                  <a
                    href={t.href(prompt)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    style={{ color: INK }}
                    className={cn(
                      LABEL,
                      "flex h-[26px] items-center justify-between px-2.5 transition-colors hover:bg-[#f4f4f6]",
                      FOCUS
                    )}
                  >
                    {t.label}
                    <span style={{ color: ICON_GRAY }}>
                      <ArrowUpRight />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────── public component ───────────────────────── */

export type HeroCtasProps = {
  /** The prompt that gets copied / sent to the AI apps. */
  prompt?: string;
  processHref?: string;
  bookHref?: string;
  targets?: OpenTarget[];
  className?: string;
};

const DEFAULT_PROMPT = SCRUNITY_PROMPT;

export default function HeroCtas({
  prompt = DEFAULT_PROMPT,
  processHref = "/process",
  bookHref = "/contact",
  targets = DEFAULT_TARGETS,
  className,
}: HeroCtasProps) {
  return (
    <div
      style={{ "--cta": CTA } as CSSProperties}
      className={cn("inline-flex flex-col gap-[11px]", className)}
    >
      <div className="flex flex-wrap items-center gap-[11px]">
        <PrimaryButton href={processHref}>See the process</PrimaryButton>
        <SecondaryButton href={bookHref}>Book a call</SecondaryButton>
      </div>

      <CopyRow
        prompt={prompt}
        label="Copy prompt about scrunity labs"
        copiedLabel="Prompt copied"
        targets={targets}
      />
    </div>
  );
}
