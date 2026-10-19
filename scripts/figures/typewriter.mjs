// Builds the /blog typewriter figure with the anatomy kit (.agents/skills/anatomy).
//
//   node scripts/figures/typewriter.mjs            writes src/components/blog/typewriter/figure.generated.ts
//   node scripts/figures/typewriter.mjs --page f   also writes a standalone light page to f, for the skill's checks
//
// Every static path is computed here once. The live component only moves groups and
// rebuilds a few lines (the struck typebar, spool marks, the bell ring) from the screen
// basis exported in MODEL, so no geometry code ships to the browser.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../.agents/skills/anatomy/kit/iso-kit.mjs";
import * as G from "../../.agents/skills/anatomy/kit/lathe.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = join(ROOT, "src/components/blog/typewriter/figure.generated.ts");
const pageAt = process.argv.indexOf("--page");
const PAGE = pageAt > 0 ? process.argv[pageAt + 1] : null;

/* ───────────────────────── the model: a 10-pitch portable ───────────────────────── */

const WIDTH = 600;
const HEIGHT = 420;

const PITCH = 3; // carriage step per character
const COLS = 23; // characters per line between the margins
const BELL_AT = COLS - 5; // the bell rings five characters before the margin, as on a real machine
const LINE = 6.4; // line feed
const TRAVEL_START = 35; // carriage offset at column 0
const offsetAt = (col) => TRAVEL_START - col * PITCH;

/* ───────────────────────── world layout ───────────────────────── */

const PLATE = { x: -128, y: -78, w: 256, d: 170, r: 10 };
const PLATE_H = 10;
const FOOT_H = 5;

const BODY = { x: -74, y: -50, w: 148, d: 64, r: 8 };
const DECK = 34; // top of the body
const FRONT = BODY.y + BODY.d; // y of the body's front face
const KEYBED = { x: -74, y: FRONT, w: 148, d: 48, r: 6 };
const BED = 10; // top of the keybed

const RAIL_Z = 2.4;
const CAR_Z = DECK + RAIL_Z;
const CAR = { x: -72, y: -50, w: 144, d: 23, r: 3 };
const CAR_TOP = CAR_Z + 4.6;
const CAR_FRONT = CAR.y + CAR.d;

const PLATEN = { y: -38, z: 51, r: 9, half: 66 };
const PAPER = { x0: -40, x1: 40, y: -45, z0: 44, z1: 120 };
const PAPER_FACE = PAPER.y + 0.8;
const PRINT_Z = PLATEN.z + PLATEN.r + 4.2; // the line being typed, just above the platen
const MARGIN = -TRAVEL_START; // carriage-local x of column 0
const BAIL = { y: -42.6, z: 92, r: 1.1, half: 50 }; // high enough to leave the first lines of the note in view

const FAN = { c: [0, -12], r0: 7.5, r1: 20.5 };
const STRIKE = [0, PLATEN.y + PLATEN.r * Math.cos(0.7), PLATEN.z + PLATEN.r * Math.sin(0.7)];
const GUIDE = { x: -4, y: -27.6, w: 8, d: 2.6, r: 0.6 };
const GUIDE_TOP = 53;

const SPOOL_R = 11;
const SPOOLS = [
  [-48, -27.6 + 1.3 + SPOOL_R],
  [48, -27.6 + 1.3 + SPOOL_R],
];
const POINTER = [-30, -24.6]; // fixed index the margin scale is read against
const BELL = [61, 4];

const ROWS = [
  { keys: "qwertyuiop", x: -54, y: 22, z: 26 },
  { keys: "asdfghjkl", x: -49, y: 34, z: 21 },
  { keys: "zxcvbnm,.", x: -44, y: 46, z: 16 },
];
const KEY_PITCH = 12;
const KEY_R = 4;
const CAP_H = 1.8;
const SPACE = { x: -36, y: 55, w: 72, d: 5.4, r: 2.6 };
const SPACE_Z = 12.2;

const STACK = { x: 82, y: 22, w: 36, d: 48, r: 1 };

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [PAPER.x0 + TRAVEL_START, PAPER.y, PAPER.z1],
    [PAPER.x1 - (COLS * PITCH - TRAVEL_START), PAPER.y, PAPER.z1],
    [-98 + offsetAt(COLS), -26, 70],
  ],
  WIDTH,
  HEIGHT,
  { pad: 30, azimuth: 52, elevation: 32 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const depth = (x, y, z = 0) => k.depthOf([x, y, z], P);
const byDepth = (points) => [...points].sort((a, b) => depth(a[0], a[1]) - depth(b[0], b[1]));
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const alongX = (y, z, x = 0) => G.frameAlong([x, y, z], [1, 0, 0]);
const knurled = (F, s0, s1, r, count) => k.fadedSvg(G.ribsOf(F, s0, s1, r, count, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" });

/* ───────────────────────── bench plate ───────────────────────── */

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));

  // label plate with its printed lines
  const label = { x: -112, y: 70, w: 44, d: 11, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 3), { tone: "faint" }));
  out.push(L([30, 22, 14].map((w, i) => k.lineOnTop([label.x + 4.5, label.y + 3 + i * 2.5], [label.x + 4.5 + w, label.y + 3 + i * 2.5], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + label.w - 3.4, label.y + 3, 0.8]), at([label.x + label.w - 3.4, label.y + label.d - 3, 0.8])], { size: 0.45 }));

  // ruler strip along the front edge
  const strip = { x: -60, y: PLATE.y + PLATE.d - 13, w: 170, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [1.8, 3.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3, 0.6]), at([strip.x + strip.w - 2, strip.y + 3, 0.6])], { size: 0.45 }));
  return out.join("");
}

/* ───────────────────────── body, deck and basket ───────────────────────── */

const BARS = ROWS.flatMap((row) => [...row.keys]);
const barAngle = (i) => (12 + (i / (BARS.length - 1)) * 156) * (Math.PI / 180);
const barPivot = (i) => [FAN.c[0] + Math.cos(barAngle(i)) * FAN.r1, FAN.c[1] + Math.sin(barAngle(i)) * FAN.r1, DECK];
const barRest = (i) => [FAN.c[0] + Math.cos(barAngle(i)) * FAN.r0, FAN.c[1] + Math.sin(barAngle(i)) * FAN.r0, DECK];

function body() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BODY, 0, 10, P)}"/>`];
  out.push(S(k.slabOf(k.insetPlan(BODY, 3), 0, 3, P, 8), { tone: "lo" }));
  out.push(S(k.slabOf(BODY, 3, DECK - 3, P, 8, 1.2), { tone: "mid", inner: L(k.sideSeam(BODY, 12, P, 8), { tone: "faint" }) }));

  // vents on the right side
  const side = BODY.x + BODY.w;
  const slot = (y) => k.pathOf(k.roundedPlan({ x: y - 0.8, y: 17, w: 1.6, d: 9, r: 0.8 }, 4).map(([u, z]) => at([side, u, z])), true);
  out.push(L(Array.from({ length: 9 }, (_, i) => slot(BODY.y + 12 + i * 3.4)).join(""), { tone: "faint" }));

  // basket well and resting typebars
  const well = [];
  for (let a = 0; a <= 180; a += 6) well.push([FAN.c[0] + Math.cos((a * Math.PI) / 180) * (FAN.r1 + 2.4), FAN.c[1] + Math.sin((a * Math.PI) / 180) * (FAN.r1 + 2.4)]);
  out.push(L(k.onTop(well, DECK, P, true), { tone: "lo" }));
  // the padded typebar rest: every resting bar lies with its tip on it
  out.push(L(k.ring(FAN.c[0], FAN.c[1], FAN.r0, DECK, P, 32), { tone: "faint" }));
  out.push(`<g data-part="bars">${BARS.map((_, i) => L(k.segment(barPivot(i), barRest(i), P), { tone: "lo", className: "tw-bar" })).join("")}</g>`);
  out.push(D(BARS.map((_, i) => at(barPivot(i))), { size: 0.45, tone: "mid" }));

  // carriage rails and end stops
  for (const y of [BODY.y + 2, CAR_FRONT - 5]) {
    out.push(S(k.slabOf({ x: BODY.x + 2, y, w: BODY.w - 4, d: 3, r: 0.8 }, DECK, RAIL_Z, P, 3, 0.4), { tone: "mid" }));
  }
  for (const x of [BODY.x + 2, BODY.x + BODY.w - 6]) {
    out.push(S(k.slabOf({ x, y: BODY.y + 1, w: 4, d: CAR.d + 2, r: 1 }, DECK, RAIL_Z + 1.6, P, 3, 0.4), { tone: "mid" }));
    out.push(D([at([x + 2, BODY.y + 4, DECK + RAIL_Z + 1.6]), at([x + 2, CAR_FRONT - 3, DECK + RAIL_Z + 1.6])], { size: 0.4 }));
  }
  return out.join("");
}

/* ───────────────────────── carriage (moves along x) ───────────────────────── */

function carriage() {
  const out = [];
  out.push(S(k.slabOf(CAR, CAR_Z, CAR_TOP - CAR_Z, P, 4, 0.6), { tone: "mid" }));
  out.push(D([-60, -20, 20, 60].map((x) => at([x, CAR.y + 3, CAR_TOP])), { size: 0.4, tone: "lo" }));

  // margin scale on the front edge, read against the fixed pointer
  // carriage-local x of the zero mark: under the pointer when the carriage sits at column 0
  const zero = POINTER[0] - offsetAt(0);
  const strip = { x: zero - 4, y: CAR_FRONT - 4.2, w: COLS * PITCH + 8, d: 3.6, r: 0.8 };
  out.push(S(k.slabOf(strip, CAR_TOP, 0.5, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(zero, zero + COLS * PITCH, PITCH, 5, strip.y + 0.5, CAR_TOP + 0.5, [1.2, 2.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.lineOnTop([zero, strip.y + 0.5], [zero, strip.y + 3.1], CAR_TOP + 0.5, P), { tone: "hi" }));

  const F = alongX(PLATEN.y, PLATEN.z);
  const plateAt = (x) => S(k.slabOf({ x: x - 2, y: PLATEN.y - 7, w: 4, d: 14, r: 1.2 }, CAR_TOP, PLATEN.z + 3 - CAR_TOP, P, 3, 0.5), { tone: "mid" });
  const knob = (s0, s1) => S(G.disc(s0, s1, 8, F, P), { tone: "mid", inner: knurled(F, s0, s1, 8, 40) });

  // far end first: knob, axle, end plate
  out.push(knob(-79, -73), S(G.disc(-81, -79, 4.6, F, P), { tone: "mid" }));
  out.push(S(G.disc(-73, -70, 2.4, F, P), { tone: "mid" }));
  out.push(plateAt(-70));

  // paper, with the typed lines in its face plane
  out.push(S(k.slabOf({ x: PAPER.x0, y: PAPER.y, w: PAPER.x1 - PAPER.x0, d: 0.8, r: 0 }, PAPER.z0, PAPER.z1 - PAPER.z0, P, 1), { tone: "hi", lit: true, crease: "lo", className: "tw-paper" }));
  const clip = k.pathOf([[PAPER.x0 + 0.6, -(PAPER.z1 - 0.6)], [PAPER.x1 - 0.6, -(PAPER.z1 - 0.6)], [PAPER.x1 - 0.6, -(PLATEN.z + PLATEN.r)], [PAPER.x0 + 0.6, -(PLATEN.z + PLATEN.r)]], true);
  out.push(
    `<clipPath id="tw-paper"><path transform="${planeOf(PAPER_FACE)}" d="${clip}"/></clipPath>`,
    `<g clip-path="url(#tw-paper)"><g transform="${planeOf(PAPER_FACE)}"><g class="tw-ink" data-part="text"></g></g></g>`,
  );

  // paper bail: arms, rod, rollers
  for (const x of [-BAIL.half - 2.6, BAIL.half]) {
    out.push(S(k.slabOf({ x, y: BAIL.y - 1, w: 2.6, d: 2, r: 0.6 }, CAR_TOP, BAIL.z - CAR_TOP, P, 2), { tone: "mid", crease: "none" }));
  }
  const B = alongX(BAIL.y, BAIL.z);
  out.push(S(G.disc(-BAIL.half, BAIL.half, BAIL.r, B, P), { tone: "mid" }));
  for (const s of [-26, 22]) out.push(S(G.disc(s, s + 4, 2.2, B, P), { tone: "lo" }));

  // platen
  out.push(S(G.disc(-PLATEN.half, PLATEN.half, PLATEN.r, F, P), { tone: "mid", inner: L(G.arcOf(F, -PLATEN.half + 3, PLATEN.r, P) + G.arcOf(F, PLATEN.half - 3, PLATEN.r, P), { tone: "faint" }) }));

  // near end: end plate, axle, knob
  out.push(plateAt(70));
  out.push(S(G.disc(70, 73, 2.4, F, P), { tone: "mid" }));
  out.push(knob(73, 79), S(G.disc(79, 81, 4.6, F, P), { tone: "mid" }));

  // carriage return lever, on the left end
  const lever = [-74, CAR_FRONT - 3];
  out.push(`<g data-part="lever">`);
  out.push(S(k.slabOf({ x: lever[0] - 1.5, y: lever[1] - 1.5, w: 3, d: 3, r: 0.8 }, CAR_TOP, 20, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -98, y: lever[1] - 1.5, w: 25.5, d: 3, r: 1.2 }, CAR_TOP + 18, 3, P, 3, 0.4), { tone: "mid" }));
  out.push(S(k.cylinder(-96, lever[1], 2.4, CAR_TOP + 21, 6.5, P, 20, 0.4), { tone: "mid" }));
  out.push(L(k.knurl(-96, lever[1], 2.4, CAR_TOP + 22, CAR_TOP + 27.5, 16, P), { tone: "lo" }));
  out.push(`</g>`);
  return `<g data-part="carriage" class="tw-carriage">${out.join("")}</g>`;
}

/* ───────────────────────── fixed parts in front of the carriage ───────────────────────── */

function front() {
  const out = [];

  // ribbon: off the far spool, up through the guide, down to the near spool
  // it leaves each spool off the back of the wound ribbon, level with the guide's slot
  const ribbonY = GUIDE.y + 1.3;
  const ribbon = [
    [SPOOLS[0][0], ribbonY + 2.2, DECK + 4.2],
    [GUIDE.x - 6, ribbonY, DECK + 5],
    [GUIDE.x - 0.4, ribbonY, GUIDE_TOP - 3],
    [GUIDE.x + GUIDE.w + 0.4, ribbonY, GUIDE_TOP - 3],
    [GUIDE.x + GUIDE.w + 6, ribbonY, DECK + 5],
    [SPOOLS[1][0], ribbonY + 2.2, DECK + 4.2],
  ];
  out.push(`<path class="tw-ribbon" d="${k.pathOf(ribbon.map(at))}"/>`);

  // column pointer (in front of the ribbon)
  out.push(S(k.slabOf({ x: POINTER[0] - 1.4, y: POINTER[1], w: 2.8, d: 3, r: 0.6 }, DECK, CAR_TOP + 1 - DECK, P, 2), { tone: "mid" }));
  out.push(L(k.onTop([[POINTER[0] - 1.4, POINTER[1] + 3], [POINTER[0] + 1.4, POINTER[1] + 3], [POINTER[0], POINTER[1]]], CAR_TOP + 1, P, true), { tone: "lit" }));

  // type guide: the slotted post every bar lands on
  out.push(S(k.slabOf(GUIDE, DECK, GUIDE_TOP - DECK, P, 2, 0.4), { tone: "mid" }));
  out.push(L(k.planOutline({ x: -1.2, y: GUIDE.y + 0.6, w: 2.4, d: 1.4, r: 0.6 }, GUIDE_TOP, P, 3), { tone: "lo" }));

  // spools: flange, wound ribbon, flange, hub and a mark that turns
  SPOOLS.forEach(([x, y], i) => {
    out.push(S(k.cylinder(x, y, SPOOL_R, DECK, 1, P, 48), { tone: "lo" }));
    out.push(`<g class="tw-wound">${S(k.cylinder(x, y, SPOOL_R - 2.2, DECK + 1, 5.6, P, 48), { tone: "mid", crease: "none" })}</g>`);
    out.push(S(k.cylinder(x, y, SPOOL_R, DECK + 6.6, 1, P, 48, 0.5), { tone: "mid" }));
    out.push(L(k.ring(x, y, SPOOL_R - 2.4, DECK + 7.6, P, 40), { tone: "faint" }));
    out.push(S(k.cylinder(x, y, 2.6, DECK + 7.6, 1.6, P, 20), { tone: "mid" }));
    out.push(`<path class="iso-line" data-tone="mid" data-part="spool-${i}" d=""/>`);
  });

  // the struck bar, drawn live
  out.push(`<path class="iso-line" data-tone="lit" data-part="strike" d="" style="stroke-width:1.1px"/>`);

  // bell
  out.push(S(k.cylinder(BELL[0], BELL[1], 4.4, DECK, 1, P, 28), { tone: "lo" }));
  out.push(S(k.cylinder(BELL[0], BELL[1], 3.6, DECK + 1, 2.2, P, 28, 0.4), { tone: "mid" }));
  out.push(D([at([BELL[0], BELL[1], DECK + 3.2])], { size: 0.55, tone: "hi" }));
  out.push(`<path class="iso-line tw-ding" data-tone="mid" data-part="ding" d="" style="opacity:0"/>`);
  return out.join("");
}

/* ───────────────────────── keybed and keys ───────────────────────── */

const KEYS = [];
function keyboard() {
  const out = [`<path class="iso-halo" d="${k.haloOf(KEYBED, 0, 6, P)}"/>`];
  out.push(S(k.slabOf(k.insetPlan(KEYBED, 3), 0, 3, P, 6), { tone: "lo" }));
  out.push(S(k.slabOf(KEYBED, 3, BED - 3, P, 6, 1), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(KEYBED, 4), BED, P, 4), { tone: "faint" }));
  out.push(D([at([KEYBED.x + 6, KEYBED.y + KEYBED.d - 4, BED]), at([KEYBED.x + KEYBED.w - 6, KEYBED.y + KEYBED.d - 4, BED])], { size: 0.45 }));

  // engraved maker's plate on the front face (the drawing's one label)
  out.push(
    `<g transform="${planeOf(KEYBED.y + KEYBED.d)}"><path class="iso-line" data-tone="faint" d="${k.pathOf(k.roundedPlan({ x: -19, y: -9, w: 38, d: 5.6, r: 1.2 }, 4), true)}"/><text class="iso-face-text" data-tone="mid" x="0" y="-4.6" font-size="3.6" text-anchor="middle">SCRUNITY</text></g>`,
  );

  const placed = [];
  ROWS.forEach(({ keys, x, y, z }) => [...keys].forEach((char, i) => placed.push({ char, x: x + i * KEY_PITCH, y, z })));
  placed.push({ char: " ", x: 0, y: SPACE.y + SPACE.d / 2, z: SPACE_Z });
  placed.sort((a, b) => depth(a.x, a.y) - depth(b.x, b.y));

  for (const key of placed) {
    const index = KEYS.length;
    KEYS.push(key.char);
    const parts = [];
    if (key.char === " ") {
      for (const sx of [-22, 22]) parts.push(S(k.cylinder(sx, key.y, 0.9, BED, SPACE_Z - BED, P, 12), { tone: "mid", crease: "none" }));
      parts.push(S(k.slabOf(SPACE, SPACE_Z, 2.2, P, 4, 0.5), { tone: "mid" }));
    } else {
      parts.push(S(k.cylinder(key.x, key.y, 0.9, BED, key.z - BED, P, 12), { tone: "mid", crease: "none" }));
      parts.push(S(k.cylinder(key.x, key.y, KEY_R, key.z, CAP_H, P, 28, 0.5), { tone: "mid" }));
      parts.push(L(k.ring(key.x, key.y, KEY_R - 1.1, key.z + CAP_H, P, 24), { tone: "faint" }));
    }
    out.push(`<g class="tw-key" data-key="${index}">${parts.join("")}</g>`);
  }
  return out.join("");
}

/* ───────────────────────── paper stack ───────────────────────── */

function stack() {
  const out = [`<path class="iso-halo" d="${k.haloOf(STACK, 0, 2, P)}" style="filter:blur(4px)"/>`];
  [
    [0, 0],
    [0.8, -0.6],
    [-0.4, 0.5],
    [0.3, 0.2],
  ].forEach(([dx, dy], i) => {
    out.push(S(k.slabOf({ ...STACK, x: STACK.x + dx, y: STACK.y + dy }, i * 0.7, 0.7, P, 1), { tone: i === 3 ? "mid" : "lo", crease: "none", className: "tw-paper" }));
  });
  return out.join("");
}

/* ───────────────────────── ribbon tin ───────────────────────── */

const TIN = [-102, -50];
function tin() {
  const [x, y] = TIN;
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - 13, y: y - 13, w: 26, d: 26, r: 13 }, 0, 3, P)}" style="filter:blur(4px)"/>`];
  out.push(S(k.cylinder(x, y, 13, 0, 6.4, P, 56), { tone: "mid", inner: L(k.sideArc(x, y, 13, 2, P, 32), { tone: "faint" }) }));
  out.push(S(k.cylinder(x, y, 13.4, 6.4, 2.6, P, 56, 0.5), { tone: "mid" }));
  out.push(L(k.knurl(x, y, 13.4, 6.4, 9, 64, P), { tone: "faint" }));
  out.push(L(k.ring(x, y, 9.6, 9, P, 48), { tone: "faint" }));
  out.push(D([at([x, y, 9])], { size: 0.5, tone: "mid" }));
  return out.join("");
}

/* ───────────────────────── assemble ───────────────────────── */

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A portable typewriter on a bench plate: round keys on stems, a basket of typebars, two ribbon spools, and a carriage with a knurled platen, paper bail, margin scale and return lever. A sheet stands in the platen and a stack of blank paper waits beside it.",
  body: [plate(), tin(), body(), carriage(), front(), keyboard(), stack()],
});

const iso0 = at([0, 0, 0]);
const vec = (d) => k.axisVector(P, d);
const MODEL = {
  pitch: PITCH,
  cols: COLS,
  bellAt: BELL_AT,
  line: LINE,
  travelStart: TRAVEL_START,
  margin: MARGIN,
  printZ: PRINT_Z,
  keys: KEYS,
  bars: BARS,
  basis: { o: iso0, x: vec([1, 0, 0]), y: vec([0, 1, 0]), z: vec([0, 0, 1]) },
  barPivots: BARS.map((_, i) => barPivot(i)),
  barRests: BARS.map((_, i) => barRest(i)),
  strike: STRIKE,
  spools: SPOOLS,
  spoolTop: DECK + 9.2,
  spoolMark: [2.6, SPOOL_R - 2.6],
  bell: [...BELL, DECK + 3.2],
  keyDrop: 2.2,
};

const plateHtml = k.plateHtml({
  fig: "Fig 1",
  title: "The press",
  hint: "Type on it · return to feed",
  readout: `line 1 · col 0 of ${COLS}`,
  keys: [
    { mark: "lit", label: "The sheet: whatever you type lands on it" },
    { mark: "raised", label: "Twenty-seven keys and a space bar on stems" },
    { mark: "edge", label: "The carriage steps one pitch left per character" },
  ],
  caption: `A portable typewriter on a bench plate. Each key throws its typebar from the basket to the platen and the carriage escapes one pitch to the left, so the margin scale reads the column against a fixed pointer. ${COLS} characters fit between the margins; the bell rings ${COLS - BELL_AT} before the end, and the return lever brings the carriage home and feeds the paper one line.`,
  body: `<div class="iso-stage tw-stage" tabindex="0" role="group" aria-label="Typewriter. Type to write on the sheet; Enter returns the carriage, Backspace steps it back.">${svg}<span class="tw-sr" role="status" aria-live="polite" data-status></span></div>`,
});

writeFileSync(
  OUT,
  `// Generated by scripts/figures/typewriter.mjs. Do not edit by hand.\n\nexport const FIGURE_HTML = ${JSON.stringify(plateHtml)};\n\nexport const MODEL = ${JSON.stringify(MODEL)} as const;\n`,
);
console.log("wrote", OUT.replace(ROOT + "/", ""), `(${(plateHtml.length / 1024).toFixed(0)} KB)`);

if (PAGE) {
  const css = `<style>${readFileSync(join(ROOT, "src/components/blog/typewriter/typewriter.css"), "utf8")}</style>`;
  writeFileSync(PAGE, k.pageHtml({ title: "Typewriter", theme: "light", body: css + plateHtml }));
  console.log("wrote", PAGE);
}
