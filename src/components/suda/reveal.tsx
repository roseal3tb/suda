import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * SUDA scroll-linked reveal:
 * The element stays invisible until its top reaches 92% of the viewport.
 * It gradually becomes fully visible when its top reaches 54%.
 * Unlike whileInView, this animation follows scrolling in real time.
 * Scrolling back up reverses it, so the effect is easy to verify.
 */
export function Reveal({
  children, delay = 0, y = 54, className = '', as = 'div', id,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'article' | 'header' | 'section' | 'p';
  id?: string;
  'aria-label'?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 92%', 'start 54%'],
  });
  // Stagger by moving the beginning of the progress window.
  const stagger = Math.min(Math.max(delay, 0) * 0.12, 0.13);
  const opacity = useTransform(scrollYProgress, [stagger, 1], [0, 1], { clamp: true });
  const translateY = useTransform(scrollYProgress, [stagger, 1], [y, 0], { clamp: true });
  const style = reduce ? undefined : { opacity, y: translateY };
  const props = {
    ref: ref as React.Ref<any>, className, id, 'aria-label': ariaLabel,
    'data-suda-motion': 'scroll-linked',
    style,
  };
  switch (as) {
    case 'article': return <motion.article {...props}>{children}</motion.article>;
    case 'header': return <motion.header {...props}>{children}</motion.header>;
    case 'section': return <motion.section {...props}>{children}</motion.section>;
    case 'p': return <motion.p {...props}>{children}</motion.p>;
    default: return <motion.div {...props}>{children}</motion.div>;
  }
}

/** Reveal the headline words separately with Framer Motion. */
export function WordsReveal({ text, className = '', delay = 0 }: {
  text: string; className?: string; delay?: number;
}) {
  const reduce = useReducedMotion();
  return <span className={className}>{text.split(' ').map((word, i) =>
    <span key={i} className="suda-word-mask">
      <motion.span className="suda-word-inner"
        initial={reduce ? false : { opacity: 0, y: '0.9em' }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: delay + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
      >{word}{'\u00a0'}</motion.span>
    </span>
  )}</span>;
}
