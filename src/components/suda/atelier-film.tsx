import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { editorialMedia } from "@/features/suda/mock-data";

/** One small, silent editorial film. No video is requested for reduced-motion
 * visitors; the same poster remains visible if playback fails or is blocked. */
export function AtelierFilm() {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!preference.matches);
    update();
    preference.addEventListener("change", update);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => setInView(Boolean(entry?.isIntersecting)),
            { threshold: 0.05 },
          );
    if (frame.current) observer?.observe(frame.current);
    return () => {
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (allowed && inView && pageVisible && !paused && !failed) {
      void element.play().catch(() => setPlaying(false));
    } else {
      element.pause();
    }
  }, [allowed, inView, pageVisible, paused, failed]);

  function toggle() {
    if (playing) {
      setPaused(true);
      video.current?.pause();
    } else {
      setPaused(false);
      void video.current?.play().catch(() => setPlaying(false));
    }
  }

  return (
    <figure className="atelier-film" aria-label="من الخيط إلى التصميم">
      <div className="atelier-film-frame" ref={frame}>
        <img
          className="atelier-film-poster"
          src={editorialMedia.poster}
          alt="يد تعمل على قص باترون أزياء، من مقاطع حرفة التصميم المقدمة للمشروع"
          width={540}
          height={960}
          fetchPriority="high"
        />
        {allowed && !failed && (
          <video
            ref={video}
            className={`atelier-film-video ${ready ? "is-playing" : ""}`}
            muted
            loop
            playsInline
            preload="none"
            poster={editorialMedia.poster}
            aria-hidden="true"
            onPlaying={() => {
              setReady(true);
              setPlaying(true);
            }}
            onPause={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              setPlaying(false);
            }}
          >
            <source src={editorialMedia.montageWebm} type="video/webm" />
            <source src={editorialMedia.montageMp4} type="video/mp4" />
          </video>
        )}
        <span className="atelier-film-index" aria-hidden="true">
          01 — 05
        </span>
        {allowed && !failed && (
          <button
            className="atelier-film-toggle"
            type="button"
            onClick={toggle}
            aria-label={playing ? "إيقاف حركة الفيلم" : "تشغيل فيلم الحرفة"}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
            <span>{playing ? "إيقاف الحركة" : "تشغيل الفيلم"}</span>
          </button>
        )}
        <div className="atelier-film-caption" aria-hidden="true">
          <span>من الخيط تبدأ الحكاية</span>
          <small>قصّ · خياطة · تشكيل · تطريز</small>
        </div>
      </div>
      <figcaption>
        <span>حرفةٌ تصنع الفارق</span>
        <span>لقطات من مراحل صناعة الأزياء</span>
      </figcaption>
    </figure>
  );
}
