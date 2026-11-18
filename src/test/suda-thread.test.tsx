import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CardStitch } from "@/components/suda/card-stitch";
import {
  buildWeave,
  LOOM_TIMING,
  roundedFrame,
} from "@/components/suda/thread-geometry";

describe("card stitch thread", () => {
  it("starts at the top-right and runs right-to-left like Arabic", () => {
    const d = roundedFrame(300, 200, 9, { tl: 21, tr: 21, br: 21, bl: 21 });
    expect(d.startsWith("M270 9 H30")).toBe(true);
    expect(d.endsWith("270 9")).toBe(true);
  });

  it("never lets a corner radius exceed half the frame", () => {
    const d = roundedFrame(60, 40, 9, { tl: 99, tr: 99, br: 99, bl: 99 });
    // inner frame is 42 × 22, so radii clamp to 11
    expect(d).toContain("A11 11");
    expect(d).not.toContain("A99");
  });

  it("is decorative and marks its card as a stitch host", () => {
    const view = render(
      <article className="couture-voice-card">
        <p>نص</p>
        <CardStitch />
      </article>,
    );
    const card = view.container.querySelector("article");
    expect(card).toHaveClass("stitch-host");
    expect(view.container.querySelector(".card-stitch")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    view.unmount();
  });
});

describe("loom intro weave", () => {
  it("passes under alternate warp threads in order, within the weaving time", () => {
    const { d, crossings } = buildWeave();
    expect(d.startsWith("M1300 318")).toBe(true);
    expect(crossings.length).toBeGreaterThan(30);
    const end = LOOM_TIMING.weftStart + LOOM_TIMING.weftDuration + 0.05;
    let previous = 0;
    for (const crossing of crossings) {
      expect(crossing.at).toBeGreaterThan(LOOM_TIMING.weftStart);
      expect(crossing.at).toBeLessThan(end);
      expect(crossing.at).toBeGreaterThanOrEqual(previous);
      previous = crossing.at;
    }
  });

  it("finishes the intro after the cloth has parted", () => {
    expect(LOOM_TIMING.finishAt).toBeGreaterThan(LOOM_TIMING.leaveAt + 600);
  });
});
