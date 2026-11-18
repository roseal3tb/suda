import { useEffect, useRef, useState } from "react";
import { INTRO_KEY } from "@/features/suda/storage";
import { INTRO_THREAD, INTRO_TIMING } from "./thread-geometry";

/** «الغرزة الأولى» — The First Stitch.
 * One thread, one needle: the needle swoops in from the right, sews the Suda
 * artwork into place as it passes, ties a single loop and leaves a line of
 * running stitches under «رُؤى تُنسَج». Shown once per tab session;
 * skippable with the button or Escape; never shown with reduced motion. */
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
      setTimeout(() => setLeaving(true), INTRO_TIMING.leaveAt),
      setTimeout(() => latestFinish.current(), INTRO_TIMING.finishAt),
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
  const begin = `${INTRO_TIMING.threadStart}s`;
  const dur = `${INTRO_TIMING.threadDuration}s`;
  return (
    <div
      ref={surface}
      className={`thread-intro stitch-intro ${leaving ? "is-leaving" : ""} ${skipping ? "is-skipping" : ""}`}
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
      <div className="stitch-intro-guides" aria-hidden="true">
        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <path d="M0 170 Q360 30 690 170 T1200 130" />
          <path d="M0 638 Q300 520 580 663 T1200 634" />
          <circle cx="110" cy="630" r="92" />
          <circle cx="1110" cy="168" r="112" />
        </svg>
      </div>

      <div className="stitch-intro-band" aria-hidden="true">
        <svg
          viewBox="0 0 1000 350"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <defs>
            <linearGradient id="stitch-intro-steel" x1="0" x2="1">
              <stop offset="0" stopColor="#6f6573" />
              <stop offset="0.55" stopColor="#c9bfc8" />
              <stop offset="1" stopColor="#8a8191" />
            </linearGradient>
          </defs>
          <path className="stitch-intro-shadow" d={INTRO_THREAD} pathLength={1}>
            <animate
              attributeName="stroke-dashoffset"
              values="1;0"
              keyTimes="0;1"
              calcMode="spline"
              keySplines={INTRO_TIMING.ease}
              begin={begin}
              dur={dur}
              fill="freeze"
            />
          </path>
          <path className="stitch-intro-thread" d={INTRO_THREAD} pathLength={1}>
            <animate
              attributeName="stroke-dashoffset"
              values="1;0"
              keyTimes="0;1"
              calcMode="spline"
              keySplines={INTRO_TIMING.ease}
              begin={begin}
              dur={dur}
              fill="freeze"
            />
          </path>
          <g className="stitch-intro-needle" opacity="0">
            <path d="M-2 0 H58 L66 0" stroke="url(#stitch-intro-steel)" />
            <ellipse cx="7" cy="0" rx="5" ry="2.1" />
            <animateMotion
              path={INTRO_THREAD}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="spline"
              keySplines={INTRO_TIMING.ease}
              begin={begin}
              dur={dur}
              rotate="auto"
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.06;0.9;1"
              begin={begin}
              dur={dur}
              fill="freeze"
            />
          </g>
        </svg>
      </div>

      <div className="stitch-intro-center">
        <span className="stitch-intro-kicker">كل حكاية تبدأ بخيط</span>
        <div className="stitch-intro-logo">
          <img
            src="/suda-logo-transparent.png"
            alt="سُدى"
            width={1582}
            height={1128}
          />
        </div>
        <span className="stitch-intro-tagline">رُؤى تُنسَج</span>
        <span className="stitch-intro-stitches" aria-hidden="true" />
      </div>

      <button
        type="button"
        className="stitch-intro-skip thread-intro-skip"
        autoFocus
        onClick={skip}
      >
        تخطّي المقدمة
      </button>
    </div>
  );
}
