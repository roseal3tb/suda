import { useEffect, useState } from "react";

/** Quiet, non-interactive thread for the opportunities pages only.
 * The home page has its own editorial thread journey; profile and portfolio
 * pages intentionally remain clear of these large decorative paths. */
export function PageThread({ pathname }: { pathname: string }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const main = document.getElementById("main-content");
        if (!main) return;
        const bounds = main.getBoundingClientRect();
        const viewHeight = window.innerHeight || 1;
        const amount =
          (viewHeight * 0.76 - bounds.top) /
          (bounds.height + viewHeight * 0.25);
        setProgress(Math.max(0, Math.min(1, amount)));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  const variant = ["/inspiration", "/portfolio", "/learning"].some((p) =>
    pathname.startsWith(p),
  );
  const path = variant
    ? "M 65 0 C 85 120 155 190 125 305 S 60 485 125 590 C 245 790 845 650 925 815 S 880 1110 940 1260 S 935 1410 890 1500"
    : "M 935 0 C 900 115 825 220 875 340 S 960 505 890 620 C 760 830 135 690 95 880 S 160 1120 75 1290 S 75 1450 115 1500";

  return (
    <svg
      className="suda-page-thread"
      viewBox="0 0 1000 1500"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="suda-page-thread-shadow"
        d={path}
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="suda-page-thread-ink"
        d={path}
        pathLength={1000}
        vectorEffect="non-scaling-stroke"
        style={{
          strokeDasharray: 1000,
          strokeDashoffset: 1000 * (1 - progress),
        }}
      />
    </svg>
  );
}
