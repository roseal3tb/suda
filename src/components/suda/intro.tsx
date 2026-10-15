import { useEffect, useRef, useState } from "react";
import { INTRO_KEY } from "@/features/suda/storage";

/** Thread-drawn logo wipe followed by two fabric panels opening apart.
 * Never waits for media, never changes the logo pixels, and runs once/session. */
export function Intro() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const surface = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function finish() {
    if (surface.current?.contains(document.activeElement)) {
      document
        .querySelector<HTMLAnchorElement>(".skip-link")
        ?.focus({ preventScroll: true });
    }
    setShow(false);
  }

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      seen = true;
    }
    if (seen || preference.matches) return;
    setShow(true);
    timers.current = [
      setTimeout(() => setLeaving(true), 1650),
      setTimeout(finish, 2500),
    ];
    const simplify = () => {
      if (preference.matches) {
        timers.current.forEach(clearTimeout);
        finish();
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
    timers.current = [setTimeout(finish, 300)];
  }
  if (!show) return null;
  return (
    <div
      ref={surface}
      className={`thread-intro ${leaving ? "is-leaving" : ""} ${skipping ? "is-skipping" : ""}`}
      role="region"
      aria-label="مقدمة سُدى"
      onKeyDown={(event) => {
        if (event.key === "Escape") skip();
        if (event.key === "Tab") {
          event.preventDefault();
          surface.current?.querySelector("button")?.focus();
        }
      }}
    >
      <div className="thread-intro-panel panel-top" aria-hidden="true" />
      <div className="thread-intro-panel panel-bottom" aria-hidden="true" />
      <div className="thread-intro-composition">
        <span className="thread-intro-kicker" aria-hidden="true">
          كل حكاية تبدأ بخيط
        </span>
        <div className="thread-intro-logo">
          <img
            src="/suda-logo-transparent.png"
            alt="سُدى — رُؤى تُنسَج"
            width={1582}
            height={1128}
          />
        </div>
        <svg
          className="thread-intro-line"
          viewBox="0 0 1000 180"
          fill="none"
          aria-hidden="true"
        >
          <path
            pathLength="1"
            d="M-20 114 C100 114 130 54 235 80 C350 110 376 160 472 90 C530 44 540 130 494 116 C445 100 535 60 600 94 C710 145 760 28 840 72 C910 108 960 94 1020 76"
          />
        </svg>
        <span className="thread-intro-tagline" aria-hidden="true">
          رُؤى تُنسَج
        </span>
      </div>
      <button
        type="button"
        className="thread-intro-skip"
        autoFocus
        onClick={skip}
      >
        تخطّي المقدمة
      </button>
    </div>
  );
}
