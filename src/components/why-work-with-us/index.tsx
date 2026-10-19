"use client";

/** "Why work with us" bento: five reasons, each with a pseudo-UI mockup. */

import { Bento, type BentoItem } from "@/components/bento/bento";
import { DesignMock, ExperienceMock, FrontierMock, ProblemMock, TransformationMock } from "./visuals";

const reasons: BentoItem[] = [
  {
    title: "A direct line to the frontier",
    description:
      "Scrunity Labs was purpose-built to put frontier AI to work. We stay close to the people shaping it, so new capabilities reach you early.",
    Mock: FrontierMock,
    wide: true,
  },
  {
    title: "We find what holds you back",
    description:
      "We sit with your team, learn how the whole company runs and pinpoint the bottlenecks. Then we clear them with frontier intelligence.",
    Mock: ProblemMock,
  },
  {
    title: "Crafted, never copied",
    description:
      "Every product gets a visual language of its own. Considered down to the detail, never lifted straight out of a Figma file.",
    Mock: DesignMock,
  },
  {
    title: "Proven in our own arena",
    description:
      "We're already building agentic systems that replace legacy CRMs and go-to-market tools. That depth comes with us into your work.",
    Mock: ExperienceMock,
  },
  {
    title: "With you, end to end",
    description:
      "We don't hand off a repo and disappear. We work alongside your team from roadmap to deployment, building what you need to compete.",
    Mock: TransformationMock,
  },
];

export const WhyWorkWithUs = () => <Bento items={reasons} />;
