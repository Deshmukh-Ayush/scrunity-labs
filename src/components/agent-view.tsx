"use client";

/**
 * The main column in Agent view: the current page exactly as agents are served it, as
 * Markdown. The text is the raw document (copy it and you get the file); colour only
 * picks out its structure: heading marks, list markers, bold runs and links.
 *
 *   <PageView>{children}</PageView>   // in the layout: swaps the page for its Markdown
 *   <ForAgents />                     // sidebar block: this page's .md and /llms.txt
 *
 * The designed page stays mounted (hidden) in Agent view, so switching back keeps its state.
 *
 * Styling hooks: `data-slot="agent-view" | "agent-view-source" | "for-agents"`.
 */

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "cn";
import { agentDocFor, mdPathOf } from "@/lib/agent-docs";
import { EASE } from "@/components/bento/primitives";
import { useViewMode } from "./view-mode";

/* ───────────────────────── layout wrapper ───────────────────────── */

export function PageView({ children }: { children: ReactNode }) {
  const mode = useViewMode();
  const pathname = usePathname();
  const agent = mode === "agent";

  return (
    <>
      {agent && <AgentView key={pathname} route={pathname} />}
      <div hidden={agent}>{children}</div>
    </>
  );
}

/* ───────────────────────── markdown, lightly coloured ───────────────────────── */

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g;

function Inline({ text }: { text: string }) {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className="font-medium text-foreground">
          {part}
        </span>
      );
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        <span key={i}>
          <span className="text-muted">[</span>
          <span className="text-foreground underline decoration-border underline-offset-2">{link[1]}</span>
          <span className="text-muted">]({link[2]})</span>
        </span>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <span key={i} className="text-accent">
          {part}
        </span>
      );
    }
    return part;
  });
}

function Line({ text }: { text: string }) {
  const heading = /^(#{1,6})(\s.*)$/.exec(text);
  if (heading) {
    return (
      <span className="font-medium text-foreground">
        <span className="text-accent">{heading[1]}</span>
        {heading[2]}
      </span>
    );
  }
  const quote = /^(>)(\s.*)$/.exec(text);
  if (quote) {
    return (
      <span className="text-foreground/80">
        <span className="text-accent">{quote[1]}</span>
        <Inline text={quote[2]} />
      </span>
    );
  }
  const item = /^(\s*)(-|\d+\.)(\s.*)$/.exec(text);
  if (item) {
    return (
      <span>
        {item[1]}
        <span className="text-accent">{item[2]}</span>
        <Inline text={item[3]} />
      </span>
    );
  }
  return <Inline text={text} />;
}

/* ───────────────────────── agent view ───────────────────────── */

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function AgentView({ route, className }: { route: string; className?: string }) {
  const doc = agentDocFor(route);
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const mdPath = mdPathOf(route);
  const lines = doc?.markdown.split("\n") ?? [];

  const copy = async () => {
    if (!doc || !(await copyText(doc.markdown))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <motion.section
      aria-labelledby={titleId}
      data-slot="agent-view"
      className={cn("my-12", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <p className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
        <span aria-hidden className="size-[5px] bg-accent" />
        Agent view
        <span aria-hidden className="h-px w-4 bg-border" />
        text/markdown
      </p>
      <h1 id={titleId} className="mt-5 text-[24px] leading-[1.25] font-normal tracking-[-0.5px] text-foreground">
        {doc ? "This page, as agents read it." : "No Markdown for this page yet."}
      </h1>
      <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.6] text-muted">
        Agents get this instead of the designed page: at <span className="font-mono text-[13px] text-foreground/80">{mdPath}</span>, or
        at this URL with <span className="font-mono text-[13px] text-foreground/80">Accept: text/markdown</span>. Every page is listed
        in <a href="/llms.txt" className="font-mono text-[13px] text-foreground/80 underline decoration-border underline-offset-2 hover:text-accent hover:decoration-accent">/llms.txt</a>.
      </p>

      {doc && (
        <div data-slot="agent-view-source" className="mt-8">
          {/* file bar */}
          <div className="flex items-center justify-between gap-3 bg-black/[0.04] px-4 py-2.5">
            <span className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-foreground/70">
              <svg viewBox="0 0 12 12" aria-hidden className="size-3 shrink-0 text-muted">
                <path d="M3 1.5h4l2.5 2.5v6.5h-6.5z" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M7 1.5v2.5h2.5" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
              <span className="truncate">{mdPath.slice(1)}</span>
              <span className="shrink-0 text-muted">· {lines.length} lines</span>
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={copy}
                className="relative grid h-7 min-w-[64px] place-items-center px-2 font-mono text-[10px] tracking-wider text-foreground/70 uppercase transition-colors outline-none hover:bg-black/[0.04] hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={copied ? "copied" : "copy"}
                    initial={{ opacity: 0, y: 5, filter: "blur(2px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -5, filter: "blur(2px)" }}
                    transition={{ duration: reduceMotion ? 0 : 0.18 }}
                    className={cn(copied && "text-accent")}
                  >
                    {copied ? "Copied" : "Copy"}
                  </motion.span>
                </AnimatePresence>
                <span className="sr-only" role="status">
                  {copied ? "Markdown copied" : ""}
                </span>
              </button>
              <a
                href={mdPath}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-7 items-center gap-1.5 px-2 font-mono text-[10px] tracking-wider text-foreground/70 uppercase transition-colors outline-none hover:bg-black/[0.04] hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
              >
                Raw
                <svg viewBox="0 0 10 10" aria-hidden className="size-2 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px">
                  <path d="M1.5 8.5 8.5 1.5M3 1.5h5.5V7" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
            </span>
          </div>

          {/* the document */}
          <div className="overflow-x-auto bg-black/[0.025] py-4">
            <pre className="font-mono text-[12.5px] leading-[1.75] text-foreground/70">
              <code className="grid grid-cols-[auto_1fr]">
                {lines.map((text, i) => (
                  <span key={i} className="contents">
                    <span aria-hidden className="pr-4 pl-4 text-right text-muted/60 select-none tabular-nums">
                      {i + 1}
                    </span>
                    <span className="pr-4 break-words whitespace-pre-wrap">
                      {text ? <Line text={text} /> : " "}
                    </span>
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </div>
      )}
    </motion.section>
  );
}

/* ───────────────────────── sidebar block ───────────────────────── */

export function ForAgents({ className, ...props }: Omit<ComponentProps<"div">, "children">) {
  const pathname = usePathname();
  const links = [
    ...(agentDocFor(pathname) ? [{ href: mdPathOf(pathname), label: "This page", meta: mdPathOf(pathname) }] : []),
    { href: "/llms.txt", label: "Every page", meta: "/llms.txt" },
  ];

  return (
    <div data-slot="for-agents" className={cn("mt-7", className)} {...props}>
      <p className="eyebrow">For agents</p>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map(({ href, label, meta }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col gap-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="flex items-center gap-2 text-[14px] text-muted transition-colors group-hover:text-foreground">
                {label}
                <svg viewBox="0 0 10 10" aria-hidden className="size-2 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-px group-hover:-translate-y-px group-hover:opacity-100">
                  <path d="M1.5 8.5 8.5 1.5M3 1.5h5.5V7" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
              <span className="font-mono text-[10px] text-muted/80">{meta}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
