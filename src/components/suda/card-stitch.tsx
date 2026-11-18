import { useEffect, useRef, useState } from "react";
import { cardThreadPath } from "./thread-geometry";

/**
 * Hover thread for cards: a needle pulls one thread across the whole card,
 * from the top-right corner, through a single soft loop, and rests at the
 * bottom-left with the needle still on the end of the thread. The thread sits *behind* the card's content, so photos and
 * text stay on top and the needle seems to sew underneath them. Shows on
 * hover, keyboard focus, or a tap.
 *
 * Purely decorative (aria-hidden) and built from spans and SVG only, so it is
 * valid inside buttons and links. Place it as a direct child of the card.
 */
export function CardStitch() {
  const holder = useRef<HTMLSpanElement>(null);
  const [shape, setShape] = useState<{
    w: number;
    h: number;
    d: string;
    endX: number;
    endY: number;
  }>();

  useEffect(() => {
    const card = holder.current?.parentElement;
    if (!card) return;
    card.classList.add("stitch-host");

    const measure = () => {
      const w = card.clientWidth;
      const h = card.clientHeight;
      if (w < 60 || h < 60) return;
      // A photo across the top of the card hides the thread behind it, so
      // the loop is tied in the visible part below the photo.
      const cardTop = card.getBoundingClientRect().top;
      const photo = [...card.querySelectorAll("img")].find(
        (img) => img.getBoundingClientRect().top - cardTop < 12,
      );
      const photoBottom = photo
        ? photo.getBoundingClientRect().bottom - cardTop
        : 0;
      const thread = cardThreadPath(w, h, photoBottom);
      setShape((current) =>
        current?.d === thread.d ? current : { w, h, ...thread },
      );
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    observer?.observe(card);

    // Touch screens have no hover: a tap sews the thread for a moment.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      card.classList.add("is-stitched");
      clearTimeout(timer);
      timer = setTimeout(() => card.classList.remove("is-stitched"), 1800);
    };
    card.addEventListener("pointerdown", onPointerDown);

    return () => {
      observer?.disconnect();
      clearTimeout(timer);
      card.removeEventListener("pointerdown", onPointerDown);
      card.classList.remove("stitch-host", "is-stitched");
    };
  }, []);

  return (
    <span ref={holder} className="card-thread" aria-hidden="true">
      {shape && (
        <>
          <svg
            className="card-thread-svg"
            width={shape.w}
            height={shape.h}
            viewBox={`0 0 ${shape.w} ${shape.h}`}
            focusable="false"
          >
            <path className="card-thread-line" d={shape.d} pathLength={1} />
          </svg>
          <span
            className="card-thread-needle"
            style={{ offsetPath: `path("${shape.d}")` }}
          >
            <svg viewBox="0 0 42 10" width="42" height="10" focusable="false">
              <path d="M2 5 H38 L42 5" />
              <ellipse cx="7" cy="5" rx="4.2" ry="2" />
            </svg>
          </span>
        </>
      )}
    </span>
  );
}
