"use client";

/**
 * Human / Agent view. "Human" is the designed page; "Agent" swaps the main column for the
 * same page in Markdown (see AgentView), which is also what AI agents are served.
 *
 * The choice lives in a tiny external store, so the sidebar, the mobile sheet and the main
 * column stay in sync without a provider. The server and the first client render are
 * always "human"; a stored choice applies right after hydration.
 *
 *   const mode = useViewMode();
 *   <ViewSwitch />   // a radiogroup: click, or arrow keys once focused
 *
 * Styling hooks: `data-slot="view-switch" | "view-switch-option"`, and
 * `data-state="checked" | "unchecked"` on each option.
 */

import { useId, useRef, useSyncExternalStore } from "react";
import type { ComponentProps, KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";

export type ViewMode = "human" | "agent";

const KEY = "scrunity:view";
const OPTIONS: { value: ViewMode; label: string }[] = [
  { value: "human", label: "Human" },
  { value: "agent", label: "Agent" },
];

/* ───────────────────────── store ───────────────────────── */

const listeners = new Set<() => void>();
let current: ViewMode | null = null;

function read(): ViewMode {
  try {
    return localStorage.getItem(KEY) === "agent" ? "agent" : "human";
  } catch {
    return "human";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    current = read();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => (current ??= read());
const getServerSnapshot = (): ViewMode => "human";

export function setViewMode(mode: ViewMode) {
  if (mode === getSnapshot()) return;
  current = mode;
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // private mode or blocked storage: the choice just won't outlive the tab
  }
  listeners.forEach((listener) => listener());
}

export function useViewMode() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ───────────────────────── switch ───────────────────────── */

export function ViewSwitch({ className, ...props }: Omit<ComponentProps<"div">, "children" | "role">) {
  const mode = useViewMode();
  const reduceMotion = useReducedMotion();
  const pillId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const choose = (value: ViewMode) => {
    if (value === mode) return;
    setViewMode(value);
    // each view starts at its top
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = OPTIONS.findIndex((option) => option.value === mode);
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    const target = event.key === "Home" ? 0 : event.key === "End" ? OPTIONS.length - 1 : step ? (index + step + OPTIONS.length) % OPTIONS.length : -1;
    if (target < 0) return;
    event.preventDefault();
    choose(OPTIONS[target].value);
    refs.current[target]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="View this site as"
      data-slot="view-switch"
      onKeyDown={onKeyDown}
      className={cn("inline-flex w-fit rounded-lg border border-border bg-border/30 p-[3px]", className)}
      {...props}
    >
      {OPTIONS.map(({ value, label }, i) => {
        const checked = value === mode;
        return (
          <button
            key={value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            data-slot="view-switch-option"
            data-state={checked ? "checked" : "unchecked"}
            onClick={() => choose(value)}
            className="relative rounded-md px-3 py-1.5 text-[11px] font-medium text-muted transition-colors outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent data-[state=checked]:text-foreground motion-reduce:transition-none"
          >
            {checked && (
              <motion.span
                layoutId={pillId}
                aria-hidden
                className="absolute inset-0 rounded-md bg-background shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 38 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {value === "agent" && (
                <span
                  aria-hidden
                  className={cn("size-[5px] transition-colors duration-200", checked ? "bg-accent" : "bg-muted/60")}
                />
              )}
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
