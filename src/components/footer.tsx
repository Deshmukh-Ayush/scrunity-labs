import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { Wordmark } from "./wordmark";

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.128 2.062 2.062 0 0 1 0 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const company = [
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Talk to Sales" },
];

// TODO: swap in the real profile URLs
const connect: { href: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { href: "https://x.com/", label: "X", Icon: XIcon },
  { href: "https://www.linkedin.com/", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://www.instagram.com/", label: "Instagram", Icon: InstagramIcon },
];

const LINK = "w-fit text-[14px] text-muted transition-colors duration-200 hover:text-foreground";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border pt-12">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Wordmark className="h-6" />
          <p className="max-w-[30ch] text-[14px] leading-[1.6] text-muted">
            AI infrastructure that puts frontier models to work for modern businesses.
          </p>
          <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-foreground/70 uppercase">
            <span aria-hidden className="size-[5px] bg-accent" />
            India
          </p>
        </div>

        <nav aria-label="Company" className="flex flex-col gap-4">
          <p className="eyebrow">Company</p>
          <ul className="flex flex-col gap-3">
            {company.map(({ href, label }) => (
              <li key={label}>
                <Link href={href} className={LINK}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Connect" className="flex flex-col gap-4">
          <p className="eyebrow">Connect</p>
          <ul className="flex flex-col gap-3">
            {connect.map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" className={`${LINK} group flex items-center gap-2.5`}>
                  <Icon aria-hidden className="size-3.5 opacity-70 transition-opacity group-hover:opacity-100" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-14 flex flex-wrap justify-between gap-2 border-t border-dashed border-border pt-6 font-mono text-[10px] tracking-[0.08em] text-muted uppercase">
        <span>© 2026 Scrunity Labs</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}
