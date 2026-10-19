"use client";

/**
 * Line-art tiles for "What we do". Drawn on a 72×72 grid in currentColor and
 * animated with SMIL (path-following and dash offsets are awkward in CSS).
 * With reduced motion on, the animation elements are left out and the art is still.
 */

import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ELLIPSE = "M9 36a27 10 0 1 0 54 0a27 10 0 1 0 -54 0";

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 72 72"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={0.75}
      className="size-full"
    >
      {children}
    </svg>
  );
}

/** Frontier models: three orbits around a core, each carrying a signal. */
export function OrbitIllustration() {
  const animate = !useReducedMotion();
  const orbits = [
    { angle: 0, dur: 24, reverse: false, dot: 5 },
    { angle: 60, dur: 32, reverse: true, dot: 7 },
    { angle: 120, dur: 40, reverse: false, dot: 9 },
  ];

  return (
    <Frame>
      {orbits.map(({ angle, dur, reverse, dot }) => (
        <g key={angle} transform={`rotate(${angle} 36 36)`}>
          <g>
            {animate && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`${reverse ? 360 : 0} 36 36`}
                to={`${reverse ? 0 : 360} 36 36`}
                dur={`${dur}s`}
                repeatCount="indefinite"
              />
            )}
            <path d={ELLIPSE} strokeOpacity={0.55} />
            <circle r={1.4} fill="currentColor" stroke="none" cx={animate ? 0 : 63} cy={animate ? 0 : 36}>
              {animate && <animateMotion path={ELLIPSE} dur={`${dot}s`} repeatCount="indefinite" />}
            </circle>
          </g>
        </g>
      ))}

      <circle cx={36} cy={36} r={4.5} />
      <circle cx={36} cy={36} r={1.5} fill="currentColor" stroke="none" />
      {animate && (
        <circle cx={36} cy={36} r={4.5}>
          <animate attributeName="r" values="4.5;16" dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.8;0" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
    </Frame>
  );
}

/** Infrastructure: a node mesh with traffic routed across it. */
export function MeshIllustration() {
  const animate = !useReducedMotion();
  const steps = [12, 28, 44, 60];
  const routes = [
    { d: "M12 12H44V44H60", dur: 3.2, begin: 0 },
    { d: "M12 60H28V28H60", dur: 3.8, begin: 1.1 },
    { d: "M60 60V44H12", dur: 2.6, begin: 0.6 },
  ];
  const hot = [
    [44, 44, 0],
    [28, 28, 0.8],
    [12, 44, 1.6],
    [60, 12, 2.4],
  ];

  return (
    <Frame>
      {steps.map((v) => (
        <g key={v} strokeOpacity={0.22}>
          <path d={`M${v} 12V60`} />
          <path d={`M12 ${v}H60`} />
        </g>
      ))}

      {routes.map(({ d, dur, begin }) => (
        <g key={d}>
          <path d={d} strokeOpacity={0.4} />
          <path
            d={d}
            pathLength={100}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeDasharray={animate ? "14 86" : "0 100"}
          >
            {animate && (
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur={`${dur}s`}
                begin={`${begin}s`}
                repeatCount="indefinite"
              />
            )}
          </path>
        </g>
      ))}

      {steps.flatMap((x) =>
        steps.map((y) => (
          <rect key={`${x}-${y}`} x={x - 1.25} y={y - 1.25} width={2.5} height={2.5} fill="currentColor" stroke="none" />
        ))
      )}

      {hot.map(([x, y, begin]) => (
        <rect key={`${x}-${y}`} x={x - 3.5} y={y - 3.5} width={7} height={7} strokeOpacity={animate ? 0 : 0.7}>
          {animate && (
            <animate
              attributeName="stroke-opacity"
              values="0;0.9;0"
              dur="3.2s"
              begin={`${begin}s`}
              repeatCount="indefinite"
            />
          )}
        </rect>
      ))}
    </Frame>
  );
}

/** Built for the next model: layers that keep rising into place, one after another. */
export function LayersIllustration() {
  const animate = !useReducedMotion();
  const layers = [0, 1, 2, 3];
  const dur = 8;

  return (
    <Frame>
      <g strokeOpacity={0.22} strokeDasharray="1.5 2.5">
        <path d="M16 18V58" />
        <path d="M56 18V58" />
        <path d="M36 28V68" />
      </g>

      {layers.map((i) => {
        const begin = `${-(i * dur) / layers.length}s`;
        const still = 14 - i * 10;
        return (
          <g key={i} transform={animate ? undefined : `translate(0 ${still})`}>
            {animate && (
              <>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 16"
                  to="0 -18"
                  dur={`${dur}s`}
                  begin={begin}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.2;0.75;1"
                  dur={`${dur}s`}
                  begin={begin}
                  repeatCount="indefinite"
                />
              </>
            )}
            <path d="M36 30L56 40L36 50L16 40Z" />
            <path d="M26 35L46 45M26 45L46 35" strokeOpacity={0.35} />
            <circle cx={36} cy={40} r={1.3} fill="currentColor" stroke="none" />
          </g>
        );
      })}
    </Frame>
  );
}
