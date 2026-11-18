/** Pure geometry for Suda's thread motifs (card thread and intro). */

/**
 * The card thread: it enters at the top-right corner (where Arabic starts),
 * sweeps across the whole card, ties one soft loop, and settles near the
 * bottom-left where it ends in a knot. Built in pixels so the loop stays
 * round on any card shape.
 */
export function cardThreadPath(
  w: number,
  h: number,
  /** Height covered by a photo at the top of the card, so the loop lands
   * below it and stays visible (the thread runs behind the photo). */
  photoBottom = 0,
): { d: string; endX: number; endY: number } {
  const n = (value: number) => Math.round(value * 10) / 10;
  const r = Math.max(14, Math.min(30, Math.min(w, h) * 0.085));
  const clear =
    photoBottom > h * 0.25 && photoBottom < h * 0.8 ? photoBottom : 0;
  const ax = w * 0.62;
  const ay = clear ? clear + (h - clear) * 0.36 + r * 0.4 : h * 0.4;
  const ex = w * 0.13;
  const ey = Math.max(h * 0.85, Math.min(h - 14, ay + r * 2.6));
  const pt = (x: number, y: number) => `${n(x)} ${n(y)}`;
  const d = [
    `M${pt(w + 6, h * 0.12)}`,
    `C${pt(w * 0.86, h * 0.06)} ${pt(ax + r * 1.9, ay + r * 1.1)} ${pt(ax + r * 0.3, ay + r)}`,
    `C${pt(ax - r * 0.9, ay + r * 0.94)} ${pt(ax - r * 1.45, ay - r * 1.2)} ${pt(ax, ay - r * 1.2)}`,
    `C${pt(ax + r * 1.35, ay - r * 1.2)} ${pt(ax + r * 1.1, ay + r * 0.7)} ${pt(ax - r * 0.6, ay + r * 0.95)}`,
    `C${pt(w * 0.36, ay + r * 1.4)} ${pt(w * 0.38, h * 0.92)} ${pt(ex, ey)}`,
  ].join(" ");
  return { d, endX: n(ex), endY: n(ey) };
}

/* ── Intro: «الغرزة الأولى» ──
 * One thread, one needle. Drawn in a 1000 × 350 band centred on screen.
 * It enters on the right, ties a single loop before the logo, sews through
 * the base of the artwork and leaves on the left. */
export const INTRO_THREAD =
  "M1050 70 C990 60 960 150 900 160 C840 170 820 100 790 96 C752 92 742 140 772 152 C806 166 830 120 800 104 C770 88 720 150 660 182 C600 214 520 214 440 196 C360 178 330 120 250 128 C170 136 120 190 40 176 C10 171 -20 160 -50 150";

/** Intro timeline (seconds for SVG, milliseconds for timers). */
export const INTRO_TIMING = {
  threadStart: 0.3,
  threadDuration: 1.9,
  /** ease-in-out shared by the thread and the needle so they stay together */
  ease: "0.45 0 0.2 1",
  leaveAt: 2950,
  finishAt: 3600,
} as const;
