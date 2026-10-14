import { useEffect, useRef, useState } from 'react';

/** Decorative scroll position cue, not a control. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    const update = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const distance = Math.max(1, doc.scrollHeight - window.innerHeight);
        setProgress(Math.max(0, Math.min(1, window.scrollY / distance)));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(raf.current);
    };
  }, []);
  return <div className="suda-scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>;
}
