import type { Metadata } from "next";
import { Typewriter } from "@/components/blog/typewriter/typewriter";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { Heading, Label, Para } from "@/components/utils/texts";

export const metadata: Metadata = {
  title: "Blog · Scrunity Labs",
  description:
    "Field notes on putting frontier models to work: evals, document extraction, reliability, AI-assisted coding, fine-tuning and interfaces for AI. The first posts are on the way.",
};

const topics = [
  "LLM evals",
  "Document extraction",
  "Reliability",
  "AI-assisted coding",
  "Fine-tuning",
  "UI design for AI",
];

export default function BlogPage() {
  return (
    <>
      <section id="hero" className="my-12 scroll-mt-14">
        <p className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
          Blog
          <span aria-hidden className="h-px w-4 bg-border" />
          <span className="flex items-center gap-2 text-foreground/70">
            <span aria-hidden className="relative inline-grid size-[5px] place-items-center">
              <span className="size-[5px] bg-accent" />
              <span className="absolute inset-0 animate-ping bg-accent/60 motion-reduce:hidden" />
            </span>
            Coming soon
          </span>
        </p>
        <Heading className="mt-5">
          field notes, <br /> still on the platen.
        </Heading>
        <Para className="max-w-[52ch] py-6 leading-[1.5] tracking-[-0.1px]">
          We&apos;re writing up what we learn putting frontier models into production: what holds, what breaks and
          what we&apos;d do again. The first posts are being typed now.
        </Para>

        <div className="flex flex-col gap-3">
          <p className="eyebrow">First up</p>
          <ul aria-label="First topics" className="flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <li
                key={topic}
                className="bg-black/[0.035] px-2 py-1 font-mono text-[10px] leading-none tracking-wider text-foreground/60 uppercase transition-colors duration-200 hover:bg-accent/[0.08] hover:text-accent"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Separator />
      <section id="workbench" className="my-12 scroll-mt-14">
        <Label>On the workbench</Label>
        <Para className="mt-3 max-w-[56ch] text-[15px] leading-[1.6]">
          The press is warm. Click the machine and type something; Enter returns the carriage.
        </Para>
        <Typewriter className="mt-8" />
      </section>
      <Footer />
    </>
  );
}
