import { useEffect, useRef, useState } from "react";
import { INTRO_KEY } from "@/features/suda/storage";
import {
  LOOM_STRIPS as STRIPS,
  LOOM_TIMING,
  WARP_X,
  buildWeave,
} from "./thread-geometry";

/** «رُؤى تُنسَج» — The Loom.
 * Warp threads fall into place, a needle weaves the weft over and under them,
 * the Suda artwork rises from the woven band, and the cloth parts into strips
 * to reveal the site. Shown once per tab session; skippable with the button or
 * Escape; never shown with reduced motion. */

const WEAVE = buildWeave();

export function Intro() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const surface = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const latestFinish = useRef<() => void>(() => {});

  function finish() {
    if (surface.current?.contains(document.activeElement)) {
      document
        .querySelector<HTMLAnchorElement>(".skip-link")
        ?.focus({ preventScroll: true });
    }
    setShow(false);
  }
  latestFinish.current = finish;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
      if (!seen && !preference.matches) sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // When session storage is blocked, do not trap the visitor in the intro.
      seen = true;
    }
    if (seen || preference.matches) return;
    setShow(true);
    timers.current = [
      setTimeout(() => setLeaving(true), LOOM_TIMING.leaveAt),
      setTimeout(() => latestFinish.current(), LOOM_TIMING.finishAt),
    ];
    const simplify = () => {
      if (preference.matches) {
        timers.current.forEach(clearTimeout);
        latestFinish.current();
      }
    };
    preference.addEventListener("change", simplify);
    return () => {
      timers.current.forEach(clearTimeout);
      preference.removeEventListener("change", simplify);
    };
  }, []);

  function skip() {
    timers.current.forEach(clearTimeout);
    setSkipping(true);
    setLeaving(true);
    timers.current = [setTimeout(() => latestFinish.current(), 300)];
  }

  if (!show) return null;
  const begin = (seconds: number) => `${seconds.toFixed(3)}s`;
  return (
    <div
      ref={surface}
      className={`thread-intro loom-intro ${leaving ? "is-leaving" : ""} ${skipping ? "is-skipping" : ""}`}
      role="region"
      aria-label="مقدمة سُدى"
      dir="rtl"
      onKeyDown={(event) => {
        if (event.key === "Escape") skip();
        if (event.key === "Tab") {
          event.preventDefault();
          surface.current?.querySelector("button")?.focus();
        }
      }}
    >
      <div className="loom-strips" aria-hidden="true">
        {Array.from({ length: STRIPS }, (_, i) => (
          <span
            key={i}
            className={i % 2 ? "is-down" : "is-up"}
            style={{ transitionDelay: `${(STRIPS - 1 - i) * 0.035}s` }}
          />
        ))}
      </div>

      <div className="loom-art" aria-hidden="true">
        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <defs>
            <radialGradient id="loom-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#faf6f1" stopOpacity="0.96" />
              <stop offset="62%" stopColor="#faf6f1" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#faf6f1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {WARP_X.map((x, k) => (
            <line
              key={x}
              className="loom-warp"
              x1={x}
              y1={-10}
              x2={x}
              y2={810}
              pathLength={1}
              style={{
                animationDelay: `${0.04 + Math.abs(k - 7) * 0.035}s`,
              }}
            />
          ))}

          <path className="loom-weft" d={WEAVE.d} pathLength={1}>
            <animate
              attributeName="stroke-dashoffset"
              from="1"
              to="0"
              begin={begin(LOOM_TIMING.weftStart)}
              dur={begin(LOOM_TIMING.weftDuration)}
              fill="freeze"
            />
          </path>

          {WEAVE.crossings.map(({ x, y, at }) => (
            <g key={`${x}-${y}`} className="loom-over" opacity="0">
              <line x1={x} y1={y - 9} x2={x} y2={y + 9} className="gap" />
              <line x1={x} y1={y - 11} x2={x} y2={y + 11} className="warp" />
              <set
                attributeName="opacity"
                to="1"
                begin={begin(at)}
                fill="freeze"
              />
            </g>
          ))}

          <g className="loom-needle" opacity="0">
            <path d="M0 0 H46 L52 0" />
            <ellipse cx="6" cy="0" rx="4.6" ry="2" />
            <animateMotion
              path={WEAVE.d}
              begin={begin(LOOM_TIMING.weftStart)}
              dur={begin(LOOM_TIMING.weftDuration)}
              rotate="auto"
              fill="freeze"
            />
            <set
              attributeName="opacity"
              to="1"
              begin={begin(LOOM_TIMING.weftStart)}
              fill="freeze"
            />
          </g>

          <ellipse
            className="loom-glow"
            cx="600"
            cy="403"
            rx="330"
            ry="175"
            fill="url(#loom-glow)"
          />
        </svg>
      </div>

      <div className="loom-center">
        <span className="loom-kicker">كل حكاية تبدأ بخيط</span>
        <div className="loom-logo">
          <img
            src="/suda-logo-transparent.png"
            alt="سُدى"
            width={1582}
            height={1128}
          />
        </div>
        <span className="loom-tagline">رُؤى تُنسَج</span>
        <span className="loom-stitch" aria-hidden="true" />
      </div>

      <button
        type="button"
        className="loom-skip thread-intro-skip"
        autoFocus
        onClick={skip}
      >
        تخطّي المقدمة
      </button>
    </div>
  );
}
