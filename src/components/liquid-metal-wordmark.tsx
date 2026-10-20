"use client";

import { LiquidMetal } from "@paper-design/shaders-react";
import { cn } from "cn";
import { useReducedMotion } from "motion/react";

/**
 * Wordmark rendered through the "Scrunity-labs-metal-animation" LiquidMetal shader from Paper.
 * Settings match that node; only `scale` differs, since the canvas here hugs the wordmark
 * instead of the 4200×700 banner. The shader pauses itself when off-screen or the tab is hidden.
 */
export function LiquidMetalWordmark({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <LiquidMetal
      role="img"
      aria-label="Scrunity"
      image="/logo/wordmark/light/scrunity-wordmark-light.svg"
      speed={reduceMotion ? 0 : 0.47}
      softness={0}
      repetition={5.77}
      shiftRed={-1}
      shiftBlue={-0.21}
      distortion={0}
      contour={0}
      scale={1}
      rotation={0}
      shape="diamond"
      angle={-60}
      colorBack="#00000000"
      colorTint="#FFFFFF"
      className={cn("aspect-799/134 h-7", className)}
    />
  );
}
