import { useEffect, useRef, useState } from "react";
import { INTRO_KEY } from "@/features/suda/storage";

/** The First Stitch: a single drawn thread reveals the unaltered Suda artwork.
 * No cloth panels, video dependency, or blocking animation for reduced-motion
 * visitors. The intro is shown only once per browser tab session. */
export function Intro() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const surface = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const latestFinish = useRef<() => void>(() => {});

  function finish() {
    if (surface.current?.contains(document.activeElement)) {
      document.querySelector<HTMLAnchorElement>(".skip-link")?.focus({ preventScroll: true });
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
      setTimeout(() => setLeaving(true), 2220),
      setTimeout(() => latestFinish.current(), 2900),
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
  return (
    <div
      ref={surface}
      className={`thread-intro first-stitch-intro ${leaving ? "is-leaving" : ""} ${skipping ? "is-skipping" : ""}`}
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
      <div className="first-stitch-guides" aria-hidden="true">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <path d="M0 170 Q360 30 690 170 T1200 130" />
          <path d="M90 0 V800 M1110 0 V800" />
          <path d="M0 638 Q300 520 580 663 T1200 634" />
          <circle cx="110" cy="630" r="92" />
          <circle cx="1110" cy="168" r="112" />
          <path d="M120 0 C220 185 210 365 90 510" />
          <path d="M1000 360 C1150 450 1180 655 1050 800" />
        </svg>
      </div>
      <div className="first-stitch-art" aria-hidden="true">
        <svg className="first-stitch-sweep" viewBox="0 0 1000 350" fill="none" preserveAspectRatio="xMidYMid meet">
          <path className="first-stitch-trail" pathLength="1" d="M-35 246 C124 250 174 143 292 182 C365 207 380 249 473 177 C521 137 558 207 510 224 C452 243 477 139 597 170 C720 198 772 64 900 129 C953 156 996 145 1030 123" />
          <g className="first-stitch-needle" transform="translate(904 130) rotate(-28)">
            <path d="M0 0 H92" />
            <ellipse cx="74" cy="0" rx="10" ry="4.5" />
          </g>
          <path className="first-stitch-dashes" d="M205 286h95m50 0h25m244-202h145m28 0h19" />
        </svg>
      </div>
      <div className="first-stitch-center">
        <span className="first-stitch-kicker">كل حكاية تبدأ بخيط</span>
        <div className="first-stitch-logo">
          <img
            src="/suda-logo-transparent.png"
            alt="سُدى"
            width={1582}
            height={1128}
          />
        </div>
        <span className="first-stitch-tagline">رُؤى تُنسَج</span>
        <span className="first-stitch-accent" aria-hidden="true" />
      </div>
      <button type="button" className="first-stitch-skip thread-intro-skip" autoFocus onClick={skip}>
        تخطّي المقدمة
      </button>
    </div>
  );
}
