import type { ComponentType } from "react";
import { Para } from "@/components/utils/texts";
import { LayersIllustration, MeshIllustration, OrbitIllustration } from "./illustrations";

const items: { title: string; description: string; Illustration: ComponentType }[] = [
  {
    title: "Frontier intelligence, delivered.",
    description:
      "The world's most capable models, woven into your data, workflows and teams, so their power arrives as results rather than research.",
    Illustration: OrbitIllustration,
  },
  {
    title: "Infrastructure that holds.",
    description:
      "Production-grade AI systems engineered for demanding environments: secure, observable and composed under pressure.",
    Illustration: MeshIllustration,
  },
  {
    title: "Built for the next model.",
    description:
      "Model-agnostic foundations that absorb every new release, so today's investment compounds instead of expiring.",
    Illustration: LayersIllustration,
  },
];

export const WhatWeDo = () => {
  return (
    <div className="mt-8 flex flex-col gap-10">
      {items.map(({ title, description, Illustration }) => (
        <div key={title} className="flex items-start gap-6">
          <div className="size-18 shrink-0 bg-accent text-white">
            <Illustration />
          </div>
          <div className="flex flex-col gap-1">
            <Para tone="foreground" className="leading-[1.5] font-medium">
              {title}
            </Para>
            <Para className="leading-[1.5]">{description}</Para>
          </div>
        </div>
      ))}
    </div>
  );
};
