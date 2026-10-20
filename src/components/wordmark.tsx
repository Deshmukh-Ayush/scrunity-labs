import Link from "next/link";
import { LiquidMetalWordmark } from "./liquid-metal-wordmark";

/** Scrunity wordmark with the liquid-metal shader, linking home. Size it with a height class. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Scrunity home" className="w-fit">
      <LiquidMetalWordmark className={className} />
    </Link>
  );
}
