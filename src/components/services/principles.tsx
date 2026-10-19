/**
 * Principles: a ruled list of numbered principles. Hovering a row lifts its text,
 * drops in the accent marker and draws an accent rule along its base, all in CSS.
 *
 * Styling hooks: `data-slot="principles" | "principle"`.
 */

import type { ComponentProps } from "react";
import { cn } from "cn";

export type Principle = { title: string; description: string };

export function Principles({
  items,
  className,
  ...props
}: { items: Principle[] } & Omit<ComponentProps<"ol">, "children">) {
  return (
    <ol data-slot="principles" className={cn("mt-8 border-b border-border", className)} {...props}>
      {items.map(({ title, description }, index) => (
        <li
          key={title}
          data-slot="principle"
          className="group relative grid grid-cols-[32px_1fr] gap-x-4 gap-y-1.5 border-t border-border py-5 sm:grid-cols-[32px_168px_1fr]"
        >
          <span className="font-mono text-[10px] leading-[22px] text-muted transition-colors duration-300 group-hover:text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3 className="relative flex items-center gap-2.5 text-[15px] leading-[22px] font-medium text-foreground">
            <span
              aria-hidden
              className="size-[5px] shrink-0 scale-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-100 motion-reduce:transition-none"
            />
            <span className="-ml-[15px] transition-transform duration-300 ease-out group-hover:translate-x-[15px] motion-reduce:transition-none">
              {title}
            </span>
          </h3>

          <p className="col-start-2 text-[14px] leading-[1.6] text-muted transition-colors duration-300 group-hover:text-foreground/80 sm:col-start-3 sm:leading-[22px]">
            {description}
          </p>

          <span
            aria-hidden
            className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
          />
        </li>
      ))}
    </ol>
  );
}
