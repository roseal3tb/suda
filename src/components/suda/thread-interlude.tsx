import { useEffect, useRef, useState } from 'react';

/** An editorial thread connecting the portfolio story to Saudi inspiration.
 * Decorative only; progressive drawing follows viewport scroll, not an endless animation.
 */
export function ThreadInterlude() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const viewport = window.innerHeight || 1;
        // Draw only while this small interlude passes through the viewport.
        const ratio = (viewport - rect.top) / (viewport + rect.height * .45);
        setProgress(Math.min(1, Math.max(0, ratio)));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={ref} className="thread-interlude" aria-hidden="true">
    <svg viewBox="0 0 1200 128" preserveAspectRatio="xMidYMid meet" focusable="false">
      <path className="thread-interlude-guide" d="M1145 24 C1030 24 1020 101 895 100 S705 34 580 61 S340 106 212 70 S98 48 55 97"/>
      <path className="thread-interlude-ink" style={{strokeDashoffset: 1500 * (1-progress)}} d="M1145 24 C1030 24 1020 101 895 100 S705 34 580 61 S340 106 212 70 S98 48 55 97"/>
    </svg>
  </div>;
}
