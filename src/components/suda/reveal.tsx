import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/** The same viewport-based reveal approach used by Qamat.
 * Motion starts hidden on initial render, enters once when in view,
 * and uses the same viewport margin and cubic-bezier easing.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = '',
  as = 'div',
  id,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  delay?: number; // seconds, like Qamat's Reveal
  y?: number;
  className?: string;
  as?: 'div' | 'article' | 'header' | 'section' | 'p';
  id?: string;
  'aria-label'?: string;
}) {
  const reduce = useReducedMotion();
  const props = {
    className,
    id,
    'aria-label': ariaLabel,
    'data-suda-motion': 'true',
    initial: reduce ? false as const : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  };
  switch (as) {
    case 'article': return <motion.article {...props}>{children}</motion.article>;
    case 'header': return <motion.header {...props}>{children}</motion.header>;
    case 'section': return <motion.section {...props}>{children}</motion.section>;
    case 'p': return <motion.p {...props}>{children}</motion.p>;
    default: return <motion.div {...props}>{children}</motion.div>;
  }
}

/** Word-by-word reveal, as in Qamat's WordsReveal component. */
export function WordsReveal({text, className = '', delay = 0}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return <span className={className}>{text.split(' ').map((word, i) =>
    <span key={i} className="suda-word-mask"><motion.span
      className="suda-word-inner"
      initial={reduce ? false : {opacity: 0, y: '0.9em'}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-60px'}}
      transition={{duration: 0.7, delay: delay + i * 0.045, ease: [0.22, 1, 0.36, 1]}}
    >{word}{'\u00a0'}</motion.span></span>
  )}</span>;
}
