"use client";

/**
 * Annotation: highlighted phrases inside prose that reveal a card on hover or focus.
 *
 *   <Annotation.Root>
 *     <p>
 *       Text with a{" "}
 *       <Annotation.Note>
 *         <Annotation.Trigger>highlighted phrase</Annotation.Trigger>
 *         <Annotation.Card>…anything: a quote, a chart, an image…</Annotation.Card>
 *       </Annotation.Note>
 *     </p>
 *   </Annotation.Root>
 *
 * Root is the positioning frame. Cards are portaled into a layer that covers it and
 * connected to the trigger's plus icon by a short line. A card opens below the phrase
 * (or `side="top"`), flips to the other side when it would be cut off by the viewport
 * or a clipping ancestor, and slides left/right to stay fully visible. The chosen
 * placement is exposed as `data-side` / `data-align` on the card. Only one note per
 * Root is open at a time.
 *
 * Interaction:
 * - Mouse: hovering the phrase opens it (after a short intent delay); the card stays
 *   open while the pointer travels onto it.
 * - Touch: tapping the phrase toggles it.
 * - Keyboard: the plus icon is a real button (Tab to focus, Enter/Space to toggle,
 *   Escape to close). It carries aria-expanded / aria-controls.
 */

import { createContext, use, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { ComponentProps, PointerEvent, ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "cn";

const OPEN_DELAY = 150; // ms of hover before a card opens
const CLOSE_DELAY = 150; // ms of grace to move the pointer from phrase to card
const CONNECTOR_LENGTH = 10; // px between the plus icon and the card's nearest edge
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ───────────────────────── context ───────────────────────── */

type RootContextValue = {
  activeId: string | null;
  layer: HTMLDivElement | null;
  frameRef: RefObject<HTMLDivElement | null>;
  requestOpen: (id: string) => void;
  requestClose: () => void;
  cancelClose: () => void;
  open: (id: string) => void;
  close: () => void;
};

type NoteContextValue = {
  id: string;
  contentId: string;
  anchorRef: RefObject<HTMLButtonElement | null>;
};

const RootContext = createContext<RootContextValue | null>(null);
const NoteContext = createContext<NoteContextValue | null>(null);

function useRootContext() {
  const context = use(RootContext);
  if (!context) throw new Error("Annotation parts must be rendered inside <Annotation.Root>.");
  return context;
}

function useNoteContext() {
  const context = use(NoteContext);
  if (!context) throw new Error("Annotation.Trigger and Annotation.Card must be inside <Annotation.Note>.");
  return context;
}

/** Whether the note this component belongs to is the open one. */
function useIsOpen() {
  const { activeId } = useRootContext();
  const { id } = useNoteContext();
  return activeId === id;
}

/* ───────────────────────── Root ───────────────────────── */

export type RootProps = ComponentProps<"div">;

export function Root({ className, children, ...props }: RootProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [layer, setLayer] = useState<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const clearTimers = () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  };

  const open = (id: string) => {
    clearTimers();
    setActiveId(id);
  };

  const close = () => {
    clearTimers();
    setActiveId(null);
  };

  const requestOpen = (id: string) => {
    clearTimers();
    // Moving straight from one open note to another switches without waiting
    if (activeId) setActiveId(id);
    else openTimer.current = setTimeout(() => setActiveId(id), OPEN_DELAY);
  };

  const requestClose = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setActiveId(null), CLOSE_DELAY);
  };

  const cancelClose = () => clearTimeout(closeTimer.current);

  // Drop any pending open/close when Root unmounts
  useEffect(() => {
    const openTimeout = openTimer;
    const closeTimeout = closeTimer;
    return () => {
      clearTimeout(openTimeout.current);
      clearTimeout(closeTimeout.current);
    };
  }, []);

  // While a card is open, Escape or a press outside any trigger/card closes it
  useEffect(() => {
    if (!activeId) return;

    const onPointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-slot=annotation-trigger], [data-slot=annotation-card]")) {
        setActiveId(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeId]);

  return (
    <RootContext
      value={{ activeId, layer, frameRef, requestOpen, requestClose, cancelClose, open, close }}
    >
      <div ref={frameRef} data-slot="annotation-root" className={cn("relative", className)} {...props}>
        {children}
        <div ref={setLayer} className="pointer-events-none absolute inset-0 z-20" />
      </div>
    </RootContext>
  );
}

/* ───────────────────────── Note ───────────────────────── */

/** Pairs one Trigger with one Card. Renders no element of its own. */
export function Note({ children }: { children: ReactNode }) {
  const id = useId();
  const anchorRef = useRef<HTMLButtonElement>(null);

  return <NoteContext value={{ id, contentId: `${id}-card`, anchorRef }}>{children}</NoteContext>;
}

/* ───────────────────────── Trigger ───────────────────────── */

export type TriggerProps = ComponentProps<"span"> & {
  /** Accessible name for the icon button. Defaults to "Show note". */
  buttonLabel?: string;
};

export function Trigger({
  buttonLabel = "Show note",
  className,
  children,
  onClick,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
  ...props
}: TriggerProps) {
  const { requestOpen, requestClose, open, close } = useRootContext();
  const { id, contentId, anchorRef } = useNoteContext();
  const isOpen = useIsOpen();
  const lastPointerType = useRef<string>("");

  const isMouse = (event: PointerEvent) => event.pointerType === "mouse";

  return (
    <span
      data-slot="annotation-trigger"
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "group/trigger cursor-pointer text-accent transition-colors duration-200",
        "hover:text-accent/80 data-[state=open]:text-accent/80",
        className
      )}
      onPointerDown={(event) => {
        lastPointerType.current = event.pointerType;
        onPointerDown?.(event);
      }}
      onPointerEnter={(event) => {
        if (isMouse(event)) requestOpen(id);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        if (isMouse(event)) requestClose();
        onPointerLeave?.(event);
      }}
      onClick={(event) => {
        // A mouse user already opened it by hovering, so a click just keeps it open.
        // Touch and keyboard (which bubbles up from the button) toggle.
        if (lastPointerType.current === "mouse") open(id);
        else if (isOpen) close();
        else open(id);
        lastPointerType.current = "";
        onClick?.(event);
      }}
      {...props}
    >
      {children}
      {/* word joiner: keeps the icon on the same line as the last word */}
      {"⁠"}
      <button
        ref={anchorRef}
        type="button"
        aria-label={buttonLabel}
        aria-expanded={isOpen}
        aria-controls={isOpen ? contentId : undefined}
        className={cn(
          "relative ml-[3px] inline-grid size-[11px] cursor-pointer place-items-center align-[0.05em]",
          "rounded-[2px] border border-accent/45 text-accent",
          "transition-colors duration-200 motion-reduce:transition-none",
          "group-data-[state=open]/trigger:border-accent group-data-[state=open]/trigger:bg-accent group-data-[state=open]/trigger:text-white",
          "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        )}
      >
        <PlusIcon />
      </button>
    </span>
  );
}

/** Plus that turns into a cross (rotated 45°) while the note is open. */
function PlusIcon() {
  return (
    <svg
      viewBox="0 0 8 8"
      aria-hidden
      className="size-[7px] transition-transform duration-200 ease-out group-data-[state=open]/trigger:rotate-45 motion-reduce:transition-none"
    >
      <path d="M4 1v6M1 4h6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/* ───────────────────────── Card ───────────────────────── */

type Side = "top" | "bottom";
type Align = "start" | "center" | "end";
type Box = { top: number; right: number; bottom: number; left: number };

type Position = {
  side: Side;
  /** "start": card runs rightwards from the icon, "end": leftwards, "center": centered on it. */
  align: Align;
  /** Card offset inside Root's layer. */
  left: number;
  top: number;
  /** Where the connector line sits, measured from the card's left edge. */
  connectorX: number;
};

/**
 * The area a card can be fully seen in: the viewport, narrowed by every ancestor
 * that clips its overflow (e.g. a section with `overflow-hidden`), minus padding.
 */
function getVisibleArea(from: HTMLElement, padding: number): Box {
  const area: Box = { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight };

  for (let el = from.parentElement; el && el !== document.body; el = el.parentElement) {
    const { overflowX, overflowY } = getComputedStyle(el);
    if (overflowX === "visible" && overflowY === "visible") continue;

    const rect = el.getBoundingClientRect();
    area.top = Math.max(area.top, rect.top);
    area.left = Math.max(area.left, rect.left);
    area.right = Math.min(area.right, rect.right);
    area.bottom = Math.min(area.bottom, rect.bottom);
  }

  return {
    top: area.top + padding,
    left: area.left + padding,
    right: area.right - padding,
    bottom: area.bottom - padding,
  };
}

/**
 * Places the card next to the anchor, all in viewport coordinates:
 * - vertically on `preferredSide`, flipping to the other side when the card would
 *   be cut off there and the other side has more room;
 * - horizontally centered on the anchor, shifted left or right so it stays inside
 *   the visible area.
 */
function computePosition(
  anchor: DOMRect,
  card: { width: number; height: number },
  area: Box,
  preferredSide: Side
): { side: Side; align: Align; x: number; y: number; anchorX: number } {
  const needed = card.height + CONNECTOR_LENGTH;
  const spaceBelow = area.bottom - anchor.bottom;
  const spaceAbove = anchor.top - area.top;

  let side = preferredSide;
  if (side === "bottom" && spaceBelow < needed && spaceAbove > spaceBelow) side = "top";
  if (side === "top" && spaceAbove < needed && spaceBelow > spaceAbove) side = "bottom";

  const y = side === "bottom" ? anchor.bottom + CONNECTOR_LENGTH : anchor.top - needed;

  const anchorX = anchor.left + anchor.width / 2;
  const centered = anchorX - card.width / 2;
  const maxX = Math.max(area.left, area.right - card.width);
  const x = Math.min(Math.max(centered, area.left), maxX);
  const align: Align = x > centered ? "start" : x < centered ? "end" : "center";

  return { side, align, x, y, anchorX };
}

export type CardProps = Omit<ComponentProps<typeof motion.div>, "children"> & {
  children?: ReactNode;
  /** Side of the phrase the card prefers. It flips to the other side when it doesn't fit. */
  side?: Side;
  /** Minimum gap in px kept between the card and the edges of the visible area. */
  collisionPadding?: number;
};

export function Card({
  side: preferredSide = "bottom",
  collisionPadding = 12,
  className,
  style,
  children,
  onPointerEnter,
  onPointerLeave,
  ...props
}: CardProps) {
  const { layer, frameRef, requestClose, cancelClose } = useRootContext();
  const { contentId, anchorRef } = useNoteContext();
  const isOpen = useIsOpen();
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position | null>(null);

  // Measure before paint so the card never flashes in the wrong place, then keep it
  // placed while the page scrolls or anything involved resizes.
  useLayoutEffect(() => {
    if (!isOpen) return;

    const measure = () => {
      const anchor = anchorRef.current;
      const frame = frameRef.current;
      const card = cardRef.current;
      if (!anchor || !frame || !card) return;

      const frameRect = frame.getBoundingClientRect();
      const placed = computePosition(
        anchor.getBoundingClientRect(),
        { width: card.offsetWidth, height: card.offsetHeight },
        getVisibleArea(frame, collisionPadding),
        preferredSide
      );

      const next: Position = {
        side: placed.side,
        align: placed.align,
        left: placed.x - frameRect.left,
        top: placed.y - frameRect.top,
        connectorX: placed.anchorX - placed.x,
      };

      // skip the re-render when nothing moved (scroll fires a lot)
      setPosition((current) =>
        current &&
        current.side === next.side &&
        current.left === next.left &&
        current.top === next.top &&
        current.connectorX === next.connectorX
          ? current
          : next
      );
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(frameRef.current!);
    observer.observe(cardRef.current!); // e.g. an image inside the card finishing loading
    window.addEventListener("scroll", measure, { capture: true, passive: true });
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", measure, { capture: true });
      window.removeEventListener("resize", measure);
    };
  }, [isOpen, anchorRef, frameRef, preferredSide, collisionPadding]);

  if (!layer) return null;

  const fade = reduceMotion ? { duration: 0 } : { duration: 0.28, ease: EASE, delay: 0.05 };
  const grow = reduceMotion ? { duration: 0 } : { duration: 0.3, ease: EASE, delay: 0.12 };
  const leave = reduceMotion ? { duration: 0 } : { duration: 0.12, ease: "easeOut" as const };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={cardRef}
          id={contentId}
          data-slot="annotation-card"
          data-side={position?.side}
          data-align={position?.align}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)", transition: fade }}
          exit={{ opacity: 0, filter: "blur(2px)", transition: leave }}
          style={{
            left: position?.left ?? 0,
            top: position?.top ?? 0,
            visibility: position ? "visible" : "hidden",
            ...style,
          }}
          className={cn(
            "pointer-events-auto absolute flex w-[min(100%,440px)] flex-col gap-5 bg-background p-6",
            "shadow-[0_24px_48px_-24px_rgba(11,16,21,0.22)] ring-1 ring-black/[0.04]",
            className
          )}
          onPointerEnter={(event) => {
            cancelClose();
            onPointerEnter?.(event);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") requestClose();
            onPointerLeave?.(event);
          }}
          {...props}
        >
          {/* connector line growing from the plus icon towards the card, on whichever side it opened */}
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1, transition: grow }}
            style={{
              left: position?.connectorX ?? 0,
              height: CONNECTOR_LENGTH,
              ...(position?.side === "top" ? { bottom: -CONNECTOR_LENGTH } : { top: -CONNECTOR_LENGTH }),
            }}
            className={cn(
              "absolute w-px -translate-x-1/2 bg-accent",
              position?.side === "top" ? "origin-bottom" : "origin-top"
            )}
          />
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    layer
  );
}

/* ───────────────────────── card content parts ───────────────────────── */

export type HeaderProps = ComponentProps<"div">;

/** Top row of a card: a Label on the left, optional Meta on the right. */
export function Header({ className, ...props }: HeaderProps) {
  return (
    <div
      data-slot="annotation-header"
      className={cn("flex items-center justify-between gap-4", className)}
      {...props}
    />
  );
}

export type LabelProps = ComponentProps<"span">;

/** Small tag with an accent bullet, e.g. "Reference 01". */
export function Label({ className, children, ...props }: LabelProps) {
  return (
    <span
      data-slot="annotation-label"
      className={cn(
        "inline-flex items-center gap-2 bg-black/[0.025] px-2 py-1 text-[11px] font-medium leading-none text-foreground/80",
        className
      )}
      {...props}
    >
      <span aria-hidden className="size-[5px] bg-accent" />
      {children}
    </span>
  );
}

export type MetaProps = ComponentProps<"span">;

/** Secondary info aligned right in the Header: a source, a timeframe, a logo. */
export function Meta({ className, ...props }: MetaProps) {
  return (
    <span
      data-slot="annotation-meta"
      className={cn("shrink-0 text-[11px] text-muted", className)}
      {...props}
    />
  );
}

export type QuoteProps = ComponentProps<"blockquote">;

/** Quote body. Wrap the key line in <strong> to emphasise it. */
export function Quote({ className, ...props }: QuoteProps) {
  return (
    <blockquote
      data-slot="annotation-quote"
      className={cn(
        "text-[14px] leading-[1.65] text-foreground/70 [&_strong]:font-semibold [&_strong]:text-foreground",
        className
      )}
      {...props}
    />
  );
}

export type CiteProps = ComponentProps<"p">;

/** Attribution under a Quote. Wrap the name in <strong>. */
export function Cite({ className, ...props }: CiteProps) {
  return (
    <p
      data-slot="annotation-cite"
      className={cn("text-[11px] text-muted [&_strong]:font-medium [&_strong]:text-foreground", className)}
      {...props}
    />
  );
}

export type CaptionProps = ComponentProps<"p">;

/** Footnote under a chart or image. */
export function Caption({ className, ...props }: CaptionProps) {
  return (
    <p
      data-slot="annotation-caption"
      className={cn("text-[11px] leading-normal text-muted", className)}
      {...props}
    />
  );
}
