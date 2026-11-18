import { useEffect, useId, useRef, useState } from "react";
import { roundedFrame } from "./thread-geometry";

/**
 * Hover thread for cards: a running stitch traces the card's inner edge while
 * a needle leads the thread. Shows on hover, keyboard focus, or a tap.
 *
 * Purely decorative (aria-hidden) and built from spans and SVG only, so it is
 * valid inside buttons and links. Drop it in as the last child of a card.
 */
export function CardStitch({ inset = 9 }: { inset?: number }) {
  const holder = useRef<HTMLSpanElement>(null);
  const maskId = `stitch-${useId().replace(/:/g, "")}`;
  const [shape, setShape] = useState<{ w: number; h: number; d: string }>();

  useEffect(() => {
    const host = holder.current?.parentElement;
    if (!host) return;
    host.classList.add("stitch-host");

    const measure = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w < 40 || h < 40) return;
      const style = getComputedStyle(host);
      const radius = (value: string) =>
        Math.max(4, (Number.parseFloat(value) || 0) - inset);
      const d = roundedFrame(w, h, inset, {
        tl: radius(style.borderTopLeftRadius),
        tr: radius(style.borderTopRightRadius),
        br: radius(style.borderBottomRightRadius),
        bl: radius(style.borderBottomLeftRadius),
      });
      setShape((current) => (current?.d === d ? current : { w, h, d }));
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    observer?.observe(host);

    // Touch screens have no hover: a tap stitches the card for a moment.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      host.classList.add("is-stitched");
      clearTimeout(timer);
      timer = setTimeout(() => host.classList.remove("is-stitched"), 1800);
    };
    host.addEventListener("pointerdown", onPointerDown);

    return () => {
      observer?.disconnect();
      clearTimeout(timer);
      host.removeEventListener("pointerdown", onPointerDown);
      host.classList.remove("stitch-host", "is-stitched");
    };
  }, [inset]);

  return (
    <span ref={holder} className="card-stitch" aria-hidden="true">
      {shape && (
        <>
          <svg
            className="card-stitch-svg"
            width={shape.w}
            height={shape.h}
            viewBox={`0 0 ${shape.w} ${shape.h}`}
            focusable="false"
          >
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse">
                <path
                  className="card-stitch-reveal"
                  d={shape.d}
                  pathLength={1}
                />
              </mask>
            </defs>
            <path
              className="card-stitch-thread"
              d={shape.d}
              mask={`url(#${maskId})`}
            />
          </svg>
          <span
            className="card-stitch-needle"
            style={{ offsetPath: `path("${shape.d}")` }}
          >
            <svg viewBox="0 0 34 8" width="34" height="8" focusable="false">
              <path d="M2 4 H31 L34 4" />
              <ellipse cx="6" cy="4" rx="3.6" ry="1.7" />
            </svg>
          </span>
        </>
      )}
    </span>
  );
}

/**
 * A wavy thread that replaces a card's divider line on hover.
 * Starts on the right so it reads in the same direction as Arabic text.
 */
export function ThreadWave() {
  return (
    <span className="thread-wave" aria-hidden="true">
      <svg viewBox="0 0 300 24" preserveAspectRatio="none" focusable="false">
        <path
          d="M300 12 C287 2 275 2 262 12 S237 22 225 12 S200 2 187 12 S162 22 150 12 S125 2 112 12 S87 22 75 12 S50 2 37 12 S12 22 0 12"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="thread-wave-knot" />
    </span>
  );
}
