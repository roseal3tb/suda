import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * One continuous decorative thread running alongside the editorial and
 * inspiration sections, crossing only the dedicated breathing space.
 * The thread draws progressively as visitors scroll.
 */
export function ThreadJourney({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const viewport = window.innerHeight || 1;
        const fraction =
          (viewport * 0.78 - rect.top) / (rect.height + viewport * 0.45);
        setProgress(Math.max(0, Math.min(1, fraction)));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  const threadPath =
    "M 974 0 C 920 95, 960 170, 985 260 S 920 410, 965 530 C 1020 650, 850 680, 715 720 S 320 770, 135 800 C 35 830, 80 955, 42 1060 S 110 1240, 78 1400";

  return (
    <div ref={ref} className="home-thread-story">
      <svg
        className="home-thread-journey"
        viewBox="0 0 1000 1400"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="home-thread-shadow"
          d={threadPath}
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="home-thread-line"
          d={threadPath}
          pathLength={1000}
          vectorEffect="non-scaling-stroke"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: 1000 * (1 - progress),
          }}
        />
      </svg>
      {children}
    </div>
  );
}
