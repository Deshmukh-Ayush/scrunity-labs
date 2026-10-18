"use client";

import { useRef } from "react";
import { Container } from "./container";
import { Logo, NavLinks } from "./sidebar";
import { OnThisPage, type Section } from "./on-this-page";

export function MobileNav({ sections }: { sections: Section[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      {/* Sticky top bar, h-14 so it matches the sections' scroll-mt-14 */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur md:hidden">
        <Container className="flex h-14 items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            aria-controls="mobile-nav"
            className="eyebrow -mr-2 px-2 py-2 hover:text-foreground"
          >
            Menu
          </button>
        </Container>
      </header>

      {/* Native modal dialog: focus trap, Esc to close and inert background for free */}
      <dialog
        id="mobile-nav"
        ref={dialogRef}
        aria-label="Site navigation"
        // Clicks on the backdrop land on the <dialog> itself, not its content
        onClick={(e) => e.target === e.currentTarget && close()}
        className="fixed inset-y-0 right-auto left-0 m-0 h-dvh max-h-none w-[280px] max-w-[85vw] -translate-x-full border-r border-border bg-background text-foreground transition-[translate,overlay,display] transition-discrete duration-300 ease-out backdrop:bg-foreground/20 open:translate-x-0 motion-reduce:transition-none md:hidden starting:open:-translate-x-full"
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-10">
          <div className="flex h-14 shrink-0 items-center justify-between">
            <p className="eyebrow">Menu</p>
            <button
              type="button"
              onClick={close}
              className="eyebrow -mr-2 px-2 py-2 hover:text-foreground"
            >
              Close
            </button>
          </div>

          <div className="mt-4">
            <NavLinks onNavigate={close} />
          </div>

          <div className="mt-8 border-t border-dashed border-border" />

          <OnThisPage sections={sections} onNavigate={close} />
        </div>
      </dialog>
    </>
  );
}
