"use client";

/**
 * Typewriter: the /blog "coming soon" figure, built with the anatomy skill.
 *
 * The static drawing (every solid, line and the card) is generated at build time by
 * scripts/figures/typewriter.mjs into figure.generated.ts. This component only brings it
 * to life, writing attributes through refs from one frame loop (no React re-renders):
 *
 * - A typed character presses its key, throws its typebar from the basket to the platen,
 *   prints on the sheet and lets the carriage escape one pitch to the left.
 * - The margin scale on the carriage reads the column against the fixed pointer; the bell
 *   rings five characters before the margin, and the margin locks the carriage.
 * - Enter (or the return lever) glides the carriage home and feeds the paper one line;
 *   Backspace steps the carriage back one pitch, as it does on the real thing.
 * - While nobody is typing, an idle tour types the coming-soon note. It pauses on any
 *   interaction and resumes after a quiet spell. It stops offscreen and when settled.
 * - Under reduced motion there is no tour: the note is already on the sheet and every
 *   part jumps to its target, but typing still works.
 */

import { useEffect, useRef } from "react";
import { cn } from "cn";
import "@/components/iso/iso.css";
import "./typewriter.css";
import { FIGURE_HTML, MODEL } from "./figure.generated";

type Vec3 = readonly [number, number, number];

const SVG_NS = "http://www.w3.org/2000/svg";
const NOTE = ["coming soon.", "notes from the bench on", "frontier ai at work."];
const STRIKE_UP = 0.05; // s for a bar to reach the platen
const STRIKE_DOWN = 0.09; // s to fall back to the basket
const IDLE_RESUME = 6000; // ms of quiet before the tour comes back
const FEED_LINES_KEPT = 12; // lines kept in the DOM after they scroll off the sheet

const { basis } = MODEL;
const KEYS: readonly string[] = MODEL.keys;
const BARS: readonly string[] = MODEL.bars;
const toScreen = ([x, y, z]: Vec3): [number, number] => [
  basis.o[0] + x * basis.x[0] + y * basis.y[0] + z * basis.z[0],
  basis.o[1] + x * basis.x[1] + y * basis.y[1] + z * basis.z[1],
];
const pathOf = (points: Vec3[], closed = false) =>
  points.map((p, i) => `${i ? "L" : "M"}${toScreen(p).map((n) => n.toFixed(1)).join(" ")}`).join("") + (closed ? "Z" : "");
const shift = ([dx, dy, dz]: Vec3) =>
  `translate(${(dx * basis.x[0] + dy * basis.y[0] + dz * basis.z[0]).toFixed(2)} ${(dx * basis.x[1] + dy * basis.y[1] + dz * basis.z[1]).toFixed(2)})`;
const offsetAt = (col: number) => MODEL.travelStart - col * MODEL.pitch;
const follow = (value: number, target: number, dt: number, seconds: number, calm: boolean) => {
  if (calm) return target;
  const next = value + (target - value) * (1 - Math.exp(-dt / seconds));
  return Math.abs(target - next) < 0.01 ? target : next;
};
const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

export function Typewriter({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const stage = host.querySelector<HTMLDivElement>(".tw-stage")!;
    const svg = stage.querySelector("svg")!;
    const q = <T extends Element>(selector: string) => svg.querySelector<T>(selector)!;
    const carriageEl = q<SVGGElement>('[data-part="carriage"]');
    const textEl = q<SVGGElement>('[data-part="text"]');
    const strikeEl = q<SVGPathElement>('[data-part="strike"]');
    const dingEl = q<SVGPathElement>('[data-part="ding"]');
    const spoolEls = MODEL.spools.map((_, i) => q<SVGPathElement>(`[data-part="spool-${i}"]`));
    const barEls = [...svg.querySelectorAll<SVGPathElement>('[data-part="bars"] path')];
    const keyEls = MODEL.keys.map((_, i) => q<SVGGElement>(`[data-key="${i}"]`));
    const readout = host.querySelector<HTMLElement>("[data-readout]")!;
    const status = host.querySelector<HTMLElement>("[data-status]")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)");

    /* ── model ── */
    const state = {
      col: 0,
      line: 0,
      carriage: offsetAt(0),
      feed: 0,
      spool: 0,
      spoolShown: -1,
      dingAge: Infinity,
    };
    const keys = MODEL.keys.map(() => ({ held: 0, at: 0 }));
    const activeKeys = new Set<number>();
    let strike: { bar: number; age: number; char: string; col: number; printed: boolean } | null = null;
    const queue: string[] = []; // characters waiting for the current strike to clear
    const lineEls: SVGGElement[] = [];

    const newLine = () => {
      const g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("transform", `translate(0 ${(state.line * MODEL.line).toFixed(2)})`);
      textEl.append(g);
      lineEls.push(g);
      if (lineEls.length > FEED_LINES_KEPT) lineEls.shift()!.remove();
    };
    const print = (char: string, col: number, fresh: boolean) => {
      const t = document.createElementNS(SVG_NS, "text");
      t.setAttribute("x", (MODEL.margin + col * MODEL.pitch).toFixed(2));
      t.setAttribute("y", (-MODEL.printZ + 1.6).toFixed(2));
      if (fresh) t.setAttribute("data-fresh", "");
      t.textContent = char;
      lineEls[lineEls.length - 1].append(t);
    };

    const say = () => {
      const text = `line ${state.line + 1} · col ${state.col} of ${MODEL.cols}${state.dingAge < 0.9 ? " · ding" : ""}`;
      if (readout.textContent !== text) readout.textContent = text;
    };
    const announce = (text: string) => {
      status.textContent = text;
    };

    /* ── actions: the same ones the tour and the reader drive ── */
    const press = (char: string, hold = 0.09) => {
      const i = KEYS.indexOf(char);
      if (i < 0) return;
      keys[i].held = hold;
      activeKeys.add(i);
    };
    const type = (raw: string) => {
      const char = raw.toLowerCase();
      if (char !== " " && !BARS.includes(char)) return;
      press(char);
      if (state.col >= MODEL.cols) {
        // margin lock: the key goes down but nothing prints
        state.dingAge = 0;
        run();
        return;
      }
      // one bar in flight at a time; everything else waits its turn, in order
      queue.push(char);
      drain();
      run();
    };
    const fire = (char: string) => {
      const col = state.col;
      if (col >= MODEL.cols) {
        // a character queued before the carriage reached the margin
        state.dingAge = 0;
        return;
      }
      if (char === " ") {
        escape();
        return;
      }
      strike = { bar: BARS.indexOf(char), age: 0, char, col, printed: false };
      if (still.matches) {
        print(char, col, false);
        strike = null;
        escape();
      }
    };
    const drain = () => {
      while (!strike && queue.length) fire(queue.shift()!);
    };
    const escape = () => {
      state.col = Math.min(MODEL.cols, state.col + 1);
      state.spool += 0.32;
      if (state.col === MODEL.bellAt) {
        state.dingAge = 0;
        announce(`Bell: ${MODEL.cols - MODEL.bellAt} characters to the margin.`);
      }
      say();
    };
    const back = () => {
      state.col = Math.max(0, state.col - 1);
      say();
      run();
    };
    const carriageReturn = () => {
      queue.length = 0;
      state.col = 0;
      state.line += 1;
      newLine();
      announce(`Carriage returned. Line ${state.line + 1}.`);
      say();
      run();
    };

    /* ── the idle tour ── */
    let touring = !still.matches;
    let tour = { line: 0, index: 0, wait: 1.4, step: "type" as "type" | "rest" | "feed", fed: 0 };
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const tourStep = (dt: number) => {
      tour.wait -= dt;
      if (tour.wait > 0) return;
      const text = NOTE[tour.line];
      if (tour.step === "type") {
        if (tour.index < text.length) {
          // read, then advance, as two statements: the React Compiler (1.0) rewrites
          // `text[tour.index++]` into increment-then-read, which skips every other character
          const char = text.charAt(tour.index);
          tour.index += 1;
          type(char);
          tour.wait = 0.12 + Math.random() * 0.1 + (char === " " ? 0.06 : 0) + (".,".includes(char) ? 0.25 : 0);
        } else if (tour.line < NOTE.length - 1) {
          carriageReturn();
          tour = { ...tour, line: tour.line + 1, index: 0, wait: 0.9 };
        } else {
          tour = { ...tour, step: "rest", wait: 4.5 };
        }
      } else if (tour.step === "rest") {
        tour = { ...tour, step: "feed", fed: 0, wait: 0 };
      } else if (tour.fed < 4) {
        carriageReturn();
        tour = { ...tour, fed: tour.fed + 1, wait: 0.55 };
      } else {
        tour = { line: 0, index: 0, wait: 1.2, step: "type", fed: 0 };
      }
    };
    const takeOver = () => {
      if (touring) {
        touring = false;
        if (state.col > 0) carriageReturn();
      }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (still.matches) return;
        if (state.col > 0) carriageReturn();
        touring = true;
        tour = { line: 0, index: 0, wait: 1.2, step: "type", fed: 0 };
        run();
      }, IDLE_RESUME);
    };

    /* ── frame loop ── */
    let frame = 0;
    let previous = 0;
    let visible = false;
    const tick = (now: number) => {
      const dt = previous ? Math.min((now - previous) / 1000, 1 / 30) : 1 / 60;
      previous = now;
      const calm = still.matches;
      if (touring) tourStep(dt);

      // typebar: up to the platen, print at the top of the swing, back down
      if (strike) {
        strike.age += dt;
        const { bar } = strike;
        const up = strike.age < STRIKE_UP;
        const e = up ? smooth(strike.age / STRIKE_UP) : 1 - smooth((strike.age - STRIKE_UP) / STRIKE_DOWN);
        if (!up && !strike.printed) {
          strike.printed = true;
          print(strike.char, strike.col, true);
          escape();
        }
        const pivot = MODEL.barPivots[bar];
        const rest = MODEL.barRests[bar];
        const tip: Vec3 = [
          rest[0] + (MODEL.strike[0] - rest[0]) * e,
          rest[1] + (MODEL.strike[1] - rest[1]) * e,
          rest[2] + (MODEL.strike[2] - rest[2]) * e + Math.sin(Math.PI * e) * 6,
        ];
        strikeEl.setAttribute("d", pathOf([pivot as Vec3, tip]));
        barEls[bar]?.toggleAttribute("data-hidden", true);
        if (strike.age >= STRIKE_UP + STRIKE_DOWN) {
          barEls[bar]?.removeAttribute("data-hidden");
          strikeEl.setAttribute("d", "");
          strike = null;
          drain();
        }
      }

      // keys go down and come back
      for (const i of activeKeys) {
        const k = keys[i];
        k.held = Math.max(0, k.held - dt);
        const want = k.held > 0 ? MODEL.keyDrop : 0;
        k.at = calm ? want : follow(k.at, want, dt, want ? 0.02 : 0.06, calm);
        keyEls[i].setAttribute("transform", shift([0, 0, -k.at]));
        keyEls[i].toggleAttribute("data-down", k.at > MODEL.keyDrop * 0.5);
        if (!k.held && k.at === 0) {
          keyEls[i].removeAttribute("transform");
          activeKeys.delete(i);
        }
      }

      // carriage escapes fast and returns with a glide; the sheet feeds with it
      const target = offsetAt(state.col);
      state.carriage = follow(state.carriage, target, dt, target > state.carriage + MODEL.pitch * 1.5 ? 0.22 : 0.035, calm);
      carriageEl.setAttribute("transform", shift([state.carriage, 0, 0]));
      state.feed = follow(state.feed, state.line, dt, 0.16, calm);
      textEl.setAttribute("transform", `translate(0 ${(-state.feed * MODEL.line).toFixed(2)})`);

      // spool marks turn as the ribbon advances
      if (state.spoolShown !== state.spool) {
        state.spoolShown = state.spool;
        MODEL.spools.forEach(([x, y], i) => {
          const a = state.spool * (i ? -1 : 1);
          const [r0, r1] = MODEL.spoolMark;
          spoolEls[i].setAttribute("d", pathOf([[x + Math.cos(a) * r0, y + Math.sin(a) * r0, MODEL.spoolTop], [x + Math.cos(a) * r1, y + Math.sin(a) * r1, MODEL.spoolTop]]));
        });
      }

      // bell: a ring that spreads off the dome and fades
      if (state.dingAge < 0.9) {
        state.dingAge += dt;
        const t = calm ? 1 : Math.min(1, state.dingAge / 0.9);
        const r = 4.4 + t * 7;
        const ring: Vec3[] = Array.from({ length: 33 }, (_, j) => {
          const a = (j / 32) * Math.PI * 2;
          return [MODEL.bell[0] + Math.cos(a) * r, MODEL.bell[1] + Math.sin(a) * r, MODEL.bell[2] - 2.2];
        });
        dingEl.setAttribute("d", pathOf(ring, true));
        dingEl.style.opacity = calm ? "0" : (smooth(state.dingAge / 0.06) * (1 - t)).toFixed(2);
        if (state.dingAge >= 0.9) say();
      }

      const busy =
        touring ||
        !!strike ||
        activeKeys.size > 0 ||
        state.carriage !== target ||
        state.feed !== state.line ||
        state.dingAge < 0.9;
      frame = visible && busy ? requestAnimationFrame(tick) : 0;
    };
    function run() {
      if (!frame && visible) {
        previous = 0;
        frame = requestAnimationFrame(tick);
      }
    }

    /* ── input ── */
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.key === "Tab") return;
      if (event.key === "Enter") {
        event.preventDefault();
        takeOver();
        carriageReturn();
      } else if (event.key === "Backspace") {
        event.preventDefault();
        takeOver();
        back();
      } else if (event.key.length === 1) {
        event.preventDefault();
        takeOver();
        type(event.key);
      }
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element;
      const key = target.closest<SVGGElement>("[data-key]");
      if (key) {
        takeOver();
        type(KEYS[Number(key.dataset.key)]);
      } else if (target.closest('[data-part="lever"]')) {
        takeOver();
        carriageReturn();
      } else return;
      stage.focus({ preventScroll: true });
    };
    stage.addEventListener("keydown", onKeyDown);
    svg.addEventListener("click", onClick);

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) run();
      },
      { rootMargin: "120px 0px" }
    );
    observer.observe(stage);

    // first frame: an empty line to type on, or the finished note when motion is reduced
    newLine();
    if (still.matches) {
      NOTE.forEach((text, i) => {
        if (i) carriageReturn();
        [...text].forEach((char, col) => char !== " " && print(char, col, false));
      });
      carriageReturn();
      state.feed = state.line;
    }
    say();
    run();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer);
      observer.disconnect();
      stage.removeEventListener("keydown", onKeyDown);
      svg.removeEventListener("click", onClick);
      textEl.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={root}
      data-slot="typewriter"
      className={cn("iso tw", className)}
      data-theme="light"
      // generated at build time from our own geometry, see scripts/figures/typewriter.mjs
      dangerouslySetInnerHTML={{ __html: FIGURE_HTML }}
    />
  );
}
