"use client";

import Image from "next/image";
import { PrimaryButton } from "./buttons/hero-cta";

/** Closing call to action: copy on the open blue sky of the artwork, the hero's process button below it. */
export function Cta() {
  return (
    <div className="group relative isolate flex min-h-[440px] flex-col overflow-hidden bg-[#0570fe] p-7 sm:aspect-[3818/2160] sm:min-h-0 sm:p-10">
      <Image
        src="/cta-img.png"
        alt=""
        fill
        sizes="(min-width: 956px) 668px, 100vw"
        className="-z-10 object-cover object-bottom transition-transform duration-[1.2s] ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
      />

      <p className="font-mono text-[10px] tracking-[0.12em] text-white/70 uppercase">Get started</p>
      <h2 className="mt-4 max-w-[16ch] text-[32px] leading-[1.15] font-normal tracking-[-0.9px] text-white">
        Put the frontier to work.
      </h2>
      <p className="mt-3 max-w-[42ch] text-[15px] leading-[1.55] text-white/80">
        Tell us where your business feels the friction. We&apos;ll show you what frontier intelligence can do about
        it.
      </p>

      <div className="mt-7 flex">
        <PrimaryButton href="/process">See the process</PrimaryButton>
      </div>
    </div>
  );
}
