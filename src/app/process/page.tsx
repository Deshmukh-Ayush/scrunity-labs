import type { Metadata } from "next";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";
import { ProcessStory } from "@/components/process";
import { StoryArc } from "@/components/process/story-arc";
import { Separator } from "@/components/ui/separator";
import { Heading, Para } from "@/components/utils/texts";

export const metadata: Metadata = {
  title: "Process · Scrunity Labs",
  description:
    "How an engagement unfolds, chapter by chapter: from friction and listening to a roadmap, a build, a careful launch and a system that keeps improving.",
};

export default function ProcessPage() {
  return (
    <>
      <section id="hero" className="my-12 scroll-mt-14">
        <p className="eyebrow">Process</p>
        <Heading className="mt-5">
          every engagement <br /> follows one arc: <br /> friction, then flow.
        </Heading>
        <Para className="max-w-[52ch] py-6 leading-[1.5] tracking-[-0.1px]">
          Here&apos;s how a business goes from manual work to frontier AI in production, told one chapter at a
          time.
        </Para>

        <StoryArc className="mt-4" />

        <p className="mt-6 flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
          <span aria-hidden className="grid h-4 w-2.5 place-items-start justify-center ring-1 ring-black/15">
            <span className="mt-[3px] h-1 w-px animate-[scroll-hint_1.6s_ease-in-out_infinite] bg-accent motion-reduce:animate-none" />
          </span>
          Scroll to begin
        </p>
      </section>

      <Separator />
      <div className="my-16">
        <ProcessStory />
      </div>

      <Separator />
      <section id="get-started" className="my-12 scroll-mt-14">
        <Cta action={{ href: "/contact", label: "Book a call" }} />
      </section>
      <Footer />
    </>
  );
}
