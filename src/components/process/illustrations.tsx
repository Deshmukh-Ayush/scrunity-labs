"use client";

/**
 * Line-art tile for the first process chapter. Same system as the "What we do" and
 * Services tiles: a 72×72 grid in currentColor, animated with SMIL, still under reduced motion.
 */

import { useReducedMotion } from "motion/react";
import { Frame } from "@/components/what-we-do/illustrations";

const LANES = [
  { d: "M6 18C26 18 30 34 46 36", dur: 2.6, begin: 0 },
  { d: "M6 36H46", dur: 2.2, begin: 0.7 },
  { d: "M6 54C26 54 30 38 46 36", dur: 3, begin: 1.3 },
];

/** Friction: three lanes of work squeeze through one narrow gate and back up behind it. */
export function FrictionIllustration() {
  const animate = !useReducedMotion();

  return (
    <Frame>
      {LANES.map(({ d }) => (
        <path key={d} d={d} strokeOpacity={0.35} />
      ))}
      <path d="M52 36H66" strokeOpacity={0.35} strokeDasharray="1.5 2.5" />

      {/* the gate */}
      <path d="M48 26V33M48 39V46" strokeWidth={1.1} />

      {/* work backing up in front of it */}
      {[38, 33, 28].map((x, i) => (
        <rect key={x} x={x - 1.5} y={34.5} width={3} height={3} fill="currentColor" stroke="none" opacity={1 - i * 0.25}>
          {animate && (
            <animate attributeName="opacity" values="1;0.35;1" dur="1.8s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          )}
        </rect>
      ))}

      {/* new work arriving, stalling short of the queue */}
      {animate &&
        LANES.map(({ d, dur, begin }) => (
          <circle key={d} r={1.3} fill="currentColor" stroke="none">
            <animateMotion
              path={d}
              dur={`${dur}s`}
              begin={`${begin}s`}
              repeatCount="indefinite"
              keyPoints="0;0.7;0.7"
              keyTimes="0;0.75;1"
              calcMode="linear"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.8;1"
              dur={`${dur}s`}
              begin={`${begin}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

      {/* a trickle getting through */}
      <circle r={1.3} cx={animate ? 0 : 58} cy={animate ? 0 : 36} fill="currentColor" stroke="none">
        {animate && <animateMotion path="M50 36H66" dur="3s" repeatCount="indefinite" />}
      </circle>
    </Frame>
  );
}
