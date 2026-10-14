import { createElement, useEffect, useRef, useState, type CSSProperties, type Key, type ReactNode } from 'react';

/**
 * Inspired by the *behavior* of Qamat's Reveal.tsx (initial opacity 0,
 * animate when in view, once, with a bottom viewport margin). No extra
 * animation package is required by Suda.
 *
 * Unlike a global DOM query after render, each element owns its observer,
 * so it starts hidden from its very first React render.
 */
export function useInViewReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const className = `suda-enter${visible ? ' suda-enter-visible' : ''}`;
  const style = { '--suda-enter-delay': `${delay}ms` } as CSSProperties;
  return { ref, className, style };
}

/** Render an actual element with in-view motion; no wrapper is added. */
export function Reveal({
  children, as = 'div', className = '', delay = 0, id, 'aria-label': ariaLabel,
}: {
  children: ReactNode;
  as?: 'div' | 'article' | 'header' | 'section' | 'p';
  className?: string;
  delay?: number;
  id?: string;
  'aria-label'?: string;
  key?: Key;
}) {
  const motion = useInViewReveal<HTMLElement>(delay);
  return createElement(as, {
    ref: motion.ref,
    id,
    'aria-label': ariaLabel,
    className: `${className} ${motion.className}`.trim(),
    style: motion.style,
  }, children);
}
