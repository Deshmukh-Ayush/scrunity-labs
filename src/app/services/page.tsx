import type { Metadata } from "next";
import HeroCtas from "@/components/buttons/hero-cta";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";
import { Capabilities, EngagementStages } from "@/components/services";
import { Principles, type Principle } from "@/components/services/principles";
import { Separator } from "@/components/ui/separator";
import { Heading, Label, Para } from "@/components/utils/texts";

export const metadata: Metadata = {
  title: "Services · Scrunity Labs",
  description:
    "Strategy, production AI systems, evals, document intelligence, fine-tuning and AI-native product design, from roadmap to deployment.",
};

const principles: Principle[] = [
  {
    title: "Frontier",
    description: "A direct line to the people shaping frontier AI, so new capabilities reach your roadmap early.",
  },
  {
    title: "Production",
    description: "Systems engineered to scale with the business, measured in production rather than in a pitch.",
  },
  {
    title: "Elite",
    description: "Veteran engineers and former founders, fluent in both applied AI and full-stack product.",
  },
  {
    title: "Experience",
    description: "Deep applied-AI project experience that de-risks the work and shortens the path to value.",
  },
  {
    title: "Transformation",
    description: "End to end, from the first roadmap conversation to systems running in production.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section id="hero" className="my-12 scroll-mt-14">
        <p className="eyebrow">Services</p>
        <Heading className="mt-5">
          from roadmap <br /> to production, <br /> end to end.
        </Heading>
        <Para className="max-w-[52ch] py-6 leading-[1.5] tracking-[-0.1px]">
          We deploy frontier AI at scale: production systems built alongside your team, not proof-of-concept demos
          handed over in a repo.
        </Para>

        <HeroCtas processHref="#engagement" />
      </section>

      <Separator />
      <section id="capabilities" className="my-12 scroll-mt-14">
        <Label>What we offer</Label>
        <Para className="mt-3 max-w-[56ch] text-[15px] leading-[1.6]">
          Six ways we put frontier models to work. Most engagements combine several.
        </Para>
        <Capabilities />
      </section>

      <Separator />
      <section id="engagement" className="my-12 scroll-mt-14">
        <Label>How we engage</Label>
        <Para className="mt-3 max-w-[56ch] text-[15px] leading-[1.6]">
          One team from first conversation to production, and we stay once it&apos;s live.
        </Para>
        <EngagementStages />
      </section>

      <Separator />
      <section id="principles" className="my-12 scroll-mt-14">
        <Label>Our approach</Label>
        <Principles items={principles} />
      </section>

      <Separator />
      <section id="get-started" className="my-12 scroll-mt-14">
        <Cta />
      </section>
      <Footer />
    </>
  );
}
