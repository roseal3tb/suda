import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CardStitch } from "@/components/suda/card-stitch";
import {
  INTRO_THREAD,
  INTRO_TIMING,
  cardThreadPath,
} from "@/components/suda/thread-geometry";

describe("card thread", () => {
  it("crosses the whole card from the top-right to a knot at the bottom-left", () => {
    for (const [w, h] of [
      [300, 430],
      [380, 320],
      [560, 300],
    ] as const) {
      const { d, endX, endY } = cardThreadPath(w, h);
      const start = /^M([\d.]+) ([\d.]+)/.exec(d);
      expect(Number(start?.[1])).toBeGreaterThanOrEqual(w);
      expect(Number(start?.[2])).toBeLessThan(h * 0.25);
      expect(endX).toBeLessThan(w * 0.25);
      expect(endY).toBeGreaterThan(h * 0.75);
      expect(d.endsWith(`${endX} ${endY}`)).toBe(true);
    }
  });

  it("keeps the loop round on any card shape", () => {
    // the loop radius is in pixels, never stretched with the card
    const tall = cardThreadPath(200, 900).d;
    const wide = cardThreadPath(900, 200).d;
    expect(tall).toContain("C");
    expect(wide).toContain("C");
    expect(tall.split("C")).toHaveLength(5);
  });

  it("is decorative and marks its card as a stitch host", () => {
    const view = render(
      <article className="couture-voice-card">
        <CardStitch />
        <p>نص</p>
      </article>,
    );
    expect(view.container.querySelector("article")).toHaveClass("stitch-host");
    expect(view.container.querySelector(".card-thread")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    view.unmount();
  });
});

describe("intro thread", () => {
  it("enters from the right and leaves on the left", () => {
    const start = Number(/^M(-?[\d.]+)/.exec(INTRO_THREAD)?.[1]);
    const end = Number(/(-?[\d.]+) [\d.]+$/.exec(INTRO_THREAD)?.[1]);
    expect(start).toBeGreaterThan(1000);
    expect(end).toBeLessThan(0);
  });

  it("finishes sewing before the intro leaves", () => {
    const sewnAt =
      (INTRO_TIMING.threadStart + INTRO_TIMING.threadDuration) * 1000;
    expect(INTRO_TIMING.leaveAt).toBeGreaterThan(sewnAt + 400);
    expect(INTRO_TIMING.finishAt).toBeGreaterThan(INTRO_TIMING.leaveAt);
  });
});
