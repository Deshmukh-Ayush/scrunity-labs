"use client";

/**
 * Line-art tiles for the Services engagement stages. Same system as the "What we do"
 * tiles: a 72×72 grid in currentColor, animated with SMIL, still under reduced motion.
 */

import { useReducedMotion } from "motion/react";
import { Frame } from "@/components/what-we-do/illustrations";

const GRID = [12, 24, 36, 48, 60];

/** Discover: a sweep passes over the business and marks what it finds. */
export function DiscoverIllustration() {
  const animate = !useReducedMotion();
  const finds = [
    [24, 24, 0.4],
    [48, 36, 1.4],
    [36, 60, 2.6],
  ];

  return (
    <Frame>
      {GRID.flatMap((x) =>
        GRID.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={0.8} fill="currentColor" stroke="none" opacity={0.45} />)
      )}

      <circle cx={36} cy={36} r={26} strokeOpacity={0.3} strokeDasharray="1.5 2.5" />
      <circle cx={36} cy={36} r={13} strokeOpacity={0.2} />

      <g>
        {animate && (
          <animateTransform attributeName="transform" type="rotate" from="0 36 36" to="360 36 36" dur="4s" repeatCount="indefinite" />
        )}
        <path d="M36 36L36 10" strokeWidth={1.1} strokeLinecap="round" />
        <path d="M36 10A26 26 0 0 0 20.7 15" strokeOpacity={0.4} />
      </g>

      {finds.map(([x, y, begin]) => (
        <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width={6} height={6} strokeOpacity={animate ? 0 : 0.8}>
          {animate && (
            <animate attributeName="stroke-opacity" values="0;1;0" dur="4s" begin={`${begin}s`} repeatCount="indefinite" />
          )}
        </rect>
      ))}
      <rect x={34.75} y={34.75} width={2.5} height={2.5} fill="currentColor" stroke="none" />
    </Frame>
  );
}

const ROUTE = "M12 58C28 58 22 36 36 36S46 14 60 14";
const MILESTONES = [
  [12, 58, 0],
  [36, 36, 0.48],
  [60, 14, 0.96],
];

/** Roadmap: a signal travels the route and each milestone lights as it passes. */
export function RoadmapIllustration() {
  const animate = !useReducedMotion();
  const dur = 4;

  return (
    <Frame>
      <path d={ROUTE} strokeOpacity={0.35} strokeDasharray="2 2.5" />
      <path d="M12 66H60" strokeOpacity={0.2} />
      {[12, 36, 60].map((x) => (
        <path key={x} d={`M${x} 63V69`} strokeOpacity={0.35} />
      ))}

      {MILESTONES.map(([x, y, at]) => (
        <g key={x}>
          <rect x={x - 3.5} y={y - 3.5} width={7} height={7} fill="currentColor" fillOpacity={animate ? 0 : 1}>
            {animate && (
              <animate
                attributeName="fill-opacity"
                values="0;0;1;1;0"
                keyTimes={`0;${Math.max(at - 0.01, 0)};${Math.min(at + 0.02, 0.97)};0.97;1`}
                dur={`${dur}s`}
                repeatCount="indefinite"
              />
            )}
          </rect>
        </g>
      ))}

      {animate && (
        <circle r={1.6} fill="currentColor" stroke="none">
          <animateMotion path={ROUTE} dur={`${dur}s`} repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.96;1" calcMode="linear" />
        </circle>
      )}
    </Frame>
  );
}

const BLOCKS = [
  [16, 48],
  [30, 48],
  [44, 48],
  [23, 34],
  [37, 34],
  [30, 20],
];

/** Build: blocks set into place one after another, then the structure resets. */
export function BuildIllustration() {
  const animate = !useReducedMotion();
  const dur = 6;

  return (
    <Frame>
      <path d="M8 60H64" strokeOpacity={0.4} />
      <path d="M12 60V64M60 60V64" strokeOpacity={0.25} />

      {BLOCKS.map(([x, y], i) => {
        const at = 0.05 + i * 0.1;
        const keyTimes = `0;${at.toFixed(2)};${(at + 0.08).toFixed(2)};0.88;1`;
        return (
          <g key={`${x}-${y}`}>
            {animate && (
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 -10;0 -10;0 0;0 0;0 0"
                keyTimes={keyTimes}
                dur={`${dur}s`}
                repeatCount="indefinite"
              />
            )}
            <g opacity={animate ? 0 : 1}>
              {animate && (
                <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={keyTimes} dur={`${dur}s`} repeatCount="indefinite" />
              )}
              <rect x={x} y={y} width={12} height={12} />
              <path d={`M${x + 3} ${y + 6}H${x + 9}`} strokeOpacity={0.45} />
            </g>
          </g>
        );
      })}
    </Frame>
  );
}

const SIGNALS = [
  { d: "M36 52V18", begin: 0 },
  { d: "M36 52C36 36 16 38 16 22", begin: 0.5 },
  { d: "M36 52C36 36 56 38 56 22", begin: 1 },
];

/** Deploy & evolve: releases leave the core and reach every system, again and again. */
export function DeployIllustration() {
  const animate = !useReducedMotion();
  const ends = [
    [36, 14],
    [16, 18],
    [56, 18],
  ];

  return (
    <Frame>
      {SIGNALS.map(({ d, begin }) => (
        <g key={d}>
          <path d={d} strokeOpacity={0.3} />
          <path d={d} pathLength={100} strokeWidth={1.25} strokeLinecap="round" strokeDasharray={animate ? "16 84" : "0 100"}>
            {animate && (
              <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2.4s" begin={`${begin}s`} repeatCount="indefinite" />
            )}
          </path>
        </g>
      ))}

      {ends.map(([x, y], i) => (
        // centred on the node so the pulse ring scales around it
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <rect x={-2.5} y={-2.5} width={5} height={5} fill="currentColor" stroke="none" />
          {animate && (
            <rect x={-2.5} y={-2.5} width={5} height={5}>
              <animate attributeName="stroke-opacity" values="0.9;0" dur="2.4s" begin={`${0.4 + i * 0.5}s`} repeatCount="indefinite" />
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1;2.2"
                dur="2.4s"
                begin={`${0.4 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </rect>
          )}
        </g>
      ))}

      <rect x={30} y={52} width={12} height={8} />
      <path d="M33 56H39" strokeOpacity={0.5} />
      <path d="M22 64H50" strokeOpacity={0.25} />
    </Frame>
  );
}
