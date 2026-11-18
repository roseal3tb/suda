/** Pure geometry for Suda's thread motifs (card stitch and loom intro). */

/** Inner frame path, starting at the top-right corner and running
 * right-to-left first, so the thread moves the way Arabic is read. */
export function roundedFrame(
  w: number,
  h: number,
  inset: number,
  r: { tl: number; tr: number; br: number; bl: number },
): string {
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = h - inset;
  const max = Math.max(0, Math.min((x1 - x0) / 2, (y1 - y0) / 2));
  const tl = Math.min(r.tl, max);
  const tr = Math.min(r.tr, max);
  const br = Math.min(r.br, max);
  const bl = Math.min(r.bl, max);
  const n = (value: number) => Math.round(value * 10) / 10;
  return [
    `M${n(x1 - tr)} ${n(y0)}`,
    `H${n(x0 + tl)}`,
    `A${n(tl)} ${n(tl)} 0 0 0 ${n(x0)} ${n(y0 + tl)}`,
    `V${n(y1 - bl)}`,
    `A${n(bl)} ${n(bl)} 0 0 0 ${n(x0 + bl)} ${n(y1)}`,
    `H${n(x1 - br)}`,
    `A${n(br)} ${n(br)} 0 0 0 ${n(x1)} ${n(y1 - br)}`,
    `V${n(y0 + tr)}`,
    `A${n(tr)} ${n(tr)} 0 0 0 ${n(x1 - tr)} ${n(y0)}`,
  ].join(" ");
}

/* ── Loom intro weave ── */

export const WARP_X = Array.from({ length: 15 }, (_, k) => 180 + k * 60);
const ROWS = Array.from({ length: 6 }, (_, r) => 318 + r * 34);
const LEFT = 150;
const RIGHT = 1050;
const OFF_RIGHT = 1300;
const WAVE = 7;
export const LOOM_STRIPS = 10;

/** Weaving timeline (seconds from mount). */
export const LOOM_TIMING = {
  weftStart: 0.55,
  weftDuration: 1.7,
  leaveAt: 2850,
  finishAt: 3650,
} as const;

export interface Crossing {
  x: number;
  y: number;
  at: number;
}

/** Serpentine weft path plus the moments it crosses under each warp thread. */
export function buildWeave() {
  const parts: string[] = [];
  const marks: { x: number; y: number; length: number; under: boolean }[] = [];
  let length = 0;
  let cx = OFF_RIGHT;
  ROWS.forEach((y, r) => {
    const leftward = r % 2 === 0;
    if (r === 0) parts.push(`M${OFF_RIGHT} ${y}`);
    const xs = leftward ? [...WARP_X].reverse() : WARP_X;
    const end = leftward ? LEFT : r === ROWS.length - 1 ? OFF_RIGHT : RIGHT;
    let wave = 0;
    for (const x of [...xs, end]) {
      const mid = (cx + x) / 2;
      const sign = wave++ % 2 === 0 ? 1 : -1;
      parts.push(`Q${mid} ${y + sign * WAVE} ${x} ${y}`);
      length += Math.abs(x - cx) * 1.01;
      cx = x;
      if (x !== end) {
        const k = WARP_X.indexOf(x);
        marks.push({ x, y, length, under: (k + r) % 2 === 0 });
      }
    }
    const next = ROWS[r + 1];
    if (next !== undefined) {
      const bulge = leftward ? cx - 42 : cx + 42;
      parts.push(`C${bulge} ${y} ${bulge} ${next} ${cx} ${next}`);
      length += 70;
    }
  });
  const crossings: Crossing[] = marks
    .filter((mark) => mark.under)
    .map(({ x, y, length: at }) => ({
      x,
      y,
      at:
        LOOM_TIMING.weftStart + (at / length) * LOOM_TIMING.weftDuration + 0.02,
    }));
  return { d: parts.join(" "), crossings };
}
