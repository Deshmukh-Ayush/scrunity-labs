"use client";

/** The process story: six chapters following one engagement from friction to flow. */

import { OrbitIllustration } from "@/components/what-we-do/illustrations";
import {
  BuildIllustration,
  DeployIllustration,
  DiscoverIllustration,
  RoadmapIllustration,
} from "@/components/services/illustrations";
import { chapters } from "./chapters-data";
import { FrictionIllustration } from "./illustrations";
import { BuildScene, EvolveScene, FrictionScene, LaunchScene, ListenScene, MapScene } from "./scenes";
import * as Story from "./story";

const [friction, listen, map, build, launch, evolve] = chapters;

export function ProcessStory() {
  return (
    <Story.Root>
      <Story.Chapter id={friction.id} index={0} label={friction.label} illustration={<FrictionIllustration />}>
        <Story.Title>It starts with friction.</Story.Title>
        <Story.Lead>
          Somewhere in your business, smart people are doing work a model could do: re-keying invoices, chasing
          handoffs, rebuilding the same report every Monday.
        </Story.Lead>
        <Story.Scene mock={FrictionScene} label="An operations inbox filling with manual tasks faster than it clears." />
        <Story.Outcome>You know AI could help. The hard part is knowing where, and getting it to production.</Story.Outcome>
      </Story.Chapter>

      <Story.Chapter id={listen.id} index={1} label={listen.label} illustration={<DiscoverIllustration />}>
        <Story.Title>First, we listen.</Story.Title>
        <Story.Lead>
          We sit with the people closest to the work, watch how it really gets done and write down every place it
          snags.
        </Story.Lead>
        <Story.Scene mock={ListenScene} label="Quotes from finance, sales and ops, each tagged with the theme it reveals." />
        <Story.Outcome>A workflow audit and a map of where friction costs you the most.</Story.Outcome>
      </Story.Chapter>

      <Story.Chapter id={map.id} index={2} label={map.label} illustration={<RoadmapIllustration />}>
        <Story.Title>Then we draw the map.</Story.Title>
        <Story.Lead>
          Every opportunity is weighed by impact and effort, so the first thing we build is the one that pays for
          the rest.
        </Story.Lead>
        <Story.Scene mock={MapScene} label="Opportunities plotted by impact and effort, with invoice capture picked first." />
        <Story.Outcome>A ranked roadmap, with a success metric for every step on it.</Story.Outcome>
      </Story.Chapter>

      <Story.Chapter id={build.id} index={3} label={build.label} illustration={<BuildIllustration />}>
        <Story.Title>We build it with you.</Story.Title>
        <Story.Lead>
          Our engineers work inside your team, not behind a wall. Every change is measured against evals, so
          quality climbs with each commit.
        </Story.Lead>
        <Story.Scene mock={BuildScene} label="Paired commits raising the eval pass rate past the release bar." />
        <Story.Outcome>Production code your team understands, owns and can extend.</Story.Outcome>
      </Story.Chapter>

      <Story.Chapter id={launch.id} index={4} label={launch.label} illustration={<DeployIllustration />}>
        <Story.Title>It goes live, carefully.</Story.Title>
        <Story.Lead>
          We roll out in stages, watch every metric and only widen the release once the numbers hold.
        </Story.Lead>
        <Story.Scene mock={LaunchScene} label="A staged rollout from 5% to 100% of traffic with error rates holding steady." />
        <Story.Outcome>A system in production, observed and supported from day one.</Story.Outcome>
      </Story.Chapter>

      <Story.Chapter id={evolve.id} index={5} label={evolve.label} illustration={<OrbitIllustration />} last>
        <Story.Title>And the story keeps going.</Story.Title>
        <Story.Lead>
          New models land every few months. We test each one against your workload and upgrade when it wins, so
          what you built keeps getting better.
        </Story.Lead>
        <Story.Scene mock={EvolveScene} label="A new model passing evals on cost and latency, then replacing the old one." />
        <Story.Outcome>A system that compounds instead of expiring.</Story.Outcome>
      </Story.Chapter>
    </Story.Root>
  );
}
