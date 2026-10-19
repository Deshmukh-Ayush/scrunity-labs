import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";

/** Scrunity wordmark (light-mode artwork), linking home. Size it with a height class. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Scrunity home" className="w-fit">
      <Image
        src="/logo/wordmark/light/scrunity-wordmark-light.svg"
        alt="Scrunity"
        width={3349}
        height={673}
        unoptimized
        className={cn("h-5.5 w-auto", className)}
      />
    </Link>
  );
}
