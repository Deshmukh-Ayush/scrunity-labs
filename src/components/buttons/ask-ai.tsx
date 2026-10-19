"use client";

/**
 * "Ask about Scrunity Labs on" row: each assistant opens in a new tab with a prompt
 * that carries everything it needs to know about us, since it can't be assumed to
 * know the company. Gemini has no URL parameter for a prompt, so its link copies the
 * prompt to the clipboard on the way out and the label says to paste it.
 */

import { useEffect, useRef, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { cn } from "cn";
import { ClaudeIcon, GeminiIcon, GrokIcon, OpenaiIcon, PerplexityAiIcon } from "./icons";

export const SCRUNITY_PROMPT = `I'm looking into Scrunity Labs, an AI infrastructure company. Here's what they say about themselves:

- Mission: put the world's frontier models to work for modern businesses, and carry the benefits of transformative AI across the whole economy, not just its edges.
- What they do: bring frontier models into a company's data, workflows and teams; build production-grade AI systems for demanding environments; and design model-agnostic foundations that absorb each new model release instead of being undone by it.
- How they work: they sit with your team to understand how the whole company runs and pinpoint the bottlenecks, then stay with you end to end, from roadmap through deployment, rather than handing off a repo and disappearing.
- Track record: they've built flagship AI systems in complex environments and are building agentic systems that replace legacy CRMs and go-to-market tools. They also treat product design as a craft.

Using this, explain what Scrunity Labs could do for a business like mine. Then ask me a few questions about my company so you can suggest where to start.`;

type Assistant = {
  name: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  /** No prompt parameter: copy the prompt and ask the user to paste it. */
  paste?: boolean;
};

const q = encodeURIComponent(SCRUNITY_PROMPT);

const ASSISTANTS: Assistant[] = [
  { name: "ChatGPT", Icon: OpenaiIcon, href: `https://chatgpt.com/?q=${q}` },
  { name: "Claude", Icon: ClaudeIcon, href: `https://claude.ai/new?q=${q}` },
  { name: "Perplexity", Icon: PerplexityAiIcon, href: `https://www.perplexity.ai/search?q=${q}` },
  { name: "Grok", Icon: GrokIcon, href: `https://grok.com/?q=${q}` },
  { name: "Gemini", Icon: GeminiIcon, href: "https://gemini.google.com/app", paste: true },
];

export function AskAi({ className }: { className?: string }) {
  const [pasteInto, setPasteInto] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyFor = (name: string) => {
    // the link still opens normally; copying runs alongside it
    navigator.clipboard?.writeText(SCRUNITY_PROMPT).then(
      () => {
        setPasteInto(name);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setPasteInto(null), 4000);
      },
      () => {}
    );
  };

  return (
    <div className={cn("flex max-w-fit flex-wrap items-center gap-x-6 gap-y-3", className)}>
      <span role="status" className="font-mono text-xs font-medium tracking-wide text-muted uppercase">
        {pasteInto ? `Prompt copied, paste it into ${pasteInto}` : "Ask about Scrunity Labs on:"}
      </span>
      <ul className="flex items-center gap-1">
        {ASSISTANTS.map(({ name, Icon, href, paste }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ask ${name} about Scrunity Labs${paste ? " (copies the prompt to paste in)" : ""}`}
              title={name}
              onClick={paste ? () => copyFor(name) : undefined}
              className={cn(
                "grid size-7.5 place-items-center opacity-70 transition-[opacity,background-color] duration-200 hover:bg-black/[0.04] hover:opacity-100",
                "outline-none focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                "[&_svg]:size-4.5"
              )}
            >
              <Icon aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
