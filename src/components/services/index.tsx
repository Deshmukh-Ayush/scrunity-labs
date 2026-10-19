"use client";

/** Services page content: the capability bento and the engagement stages, wired to their visuals. */

import { Bento, type BentoItem } from "@/components/bento/bento";
import { Engagement, type Stage } from "./engagement";
import { BuildIllustration, DeployIllustration, DiscoverIllustration, RoadmapIllustration } from "./illustrations";
import { DeployMock, EvalMock, ExtractMock, InterfaceMock, RoadmapMock, TuneMock } from "./visuals";

const capabilities: BentoItem[] = [
  {
    title: "Strategy & roadmap",
    description:
      "We learn how your business actually runs, find where frontier AI pays off and sequence the work from quick wins to the bigger bets.",
    Mock: RoadmapMock,
    wide: true,
    tags: ["Workflow audit", "Opportunity map", "Success metrics"],
  },
  {
    title: "Production AI systems",
    description:
      "Agents and AI features engineered for real traffic: integrated with your stack, observable and built to hold, not demos that stall.",
    Mock: DeployMock,
    tags: ["Agents", "Integrations", "Observability"],
  },
  {
    title: "Evals & reliability",
    description:
      "Evaluation suites that measure what matters, catch regressions before your users do and make every model swap a safe one.",
    Mock: EvalMock,
    tags: ["Eval suites", "Regression gates"],
  },
  {
    title: "Document intelligence",
    description:
      "Contracts, invoices and forms turned into clean, structured data your systems can trust, with a person in the loop where it counts.",
    Mock: ExtractMock,
    tags: ["Extraction", "Validation"],
  },
  {
    title: "Fine-tuning & adaptation",
    description:
      "When an off-the-shelf model isn't enough, we adapt it to your domain, data and voice, and prove the lift against a baseline.",
    Mock: TuneMock,
    tags: ["Fine-tuning", "Benchmarks"],
  },
  {
    title: "AI-native product design",
    description:
      "Interfaces designed for how AI really behaves: streaming, probabilistic and agentic. People see its work, so they trust the result.",
    Mock: InterfaceMock,
    wide: true,
    tags: ["Interaction design", "Front-end engineering"],
  },
];

const stages: Stage[] = [
  {
    title: "Discover",
    description:
      "We sit with your team, map how the business runs end to end and pinpoint where friction costs the most.",
    deliverables: ["Workflow audit", "Bottleneck map"],
    Illustration: DiscoverIllustration,
  },
  {
    title: "Roadmap",
    description:
      "A sequenced plan from quick wins to transformational bets, each with a clear owner and a measurable outcome.",
    deliverables: ["Ranked roadmap", "Success metrics"],
    Illustration: RoadmapIllustration,
  },
  {
    title: "Build",
    description:
      "Veteran engineers build alongside your people, not behind a wall: evaluated, observable, secure systems in your stack.",
    deliverables: ["Production code", "Eval suites"],
    Illustration: BuildIllustration,
  },
  {
    title: "Deploy & evolve",
    description:
      "We ship to production and stay on, upgrading as new models land so what you built keeps getting more capable.",
    deliverables: ["Rollout", "Model upgrades", "Team handover"],
    Illustration: DeployIllustration,
  },
];

export const Capabilities = () => <Bento items={capabilities} />;

export const EngagementStages = () => <Engagement stages={stages} />;
