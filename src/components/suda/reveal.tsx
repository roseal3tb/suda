import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

/**
 * SUDA — the single scroll-reveal system for the whole site (Framer Motion).
 *
 * - Starts at opacity 0 and 40px below its final position.
 * - Fades/rises into place once, when it enters the viewport (80px inside the
 *   bottom edge), then stays visible.
 * - `delay` is in SECONDS; use STAGGER * index for neighbouring cards.
 * - With the OS "reduce motion" setting on, the vertical movement is dropped
 *   but the soft fade is kept so the reveal stays visible and accessible.
 */
export const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const STAGGER = 0.15;

const tags = {
  div: motion.div,
  article: motion.article,
  header: motion.header,
  section: motion.section,
  p: motion.p,
  aside: motion.aside,
  button: motion.button,
  li: motion.li,
  span: motion.span,
} as const;

type Tag = keyof typeof tags;

type RevealProps = Omit<HTMLMotionProps<"div">, "children" | "ref"> & {
  children?: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  as?: Tag;
  type?: "button";
};

export function Reveal({
  children,
  delay = 0,
  y = 40,
  duration = 0.95,
  as = "div",
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const Component = tags[as] as typeof motion.div;
  return (
    <Component
      {...rest}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{
        duration: reduce ? 0 : duration,
        delay: reduce ? 0 : delay,
        ease: REVEAL_EASE,
      }}
    >
      {children}
    </Component>
  );
}

/** Reveals headline words one after another with the same easing. */
export function WordsReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="suda-word-mask">
          <motion.span
            className="suda-word-inner"
            initial={reduce ? false : { opacity: 0, y: "0.9em" }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{
              duration: reduce ? 0 : 0.8,
              delay: reduce ? 0 : delay + i * 0.08,
              ease: REVEAL_EASE,
            }}
          >
            {word}
            {"\u00a0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
