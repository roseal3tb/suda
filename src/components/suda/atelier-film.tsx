import { useEffect, useRef, useState } from "react";
import { editorialMedia } from "@/features/suda/mock-data";

/** One small, silent editorial film. No video is requested for reduced-motion
 * visitors; the same poster remains visible if playback fails or is blocked. */
export function AtelierFilm() {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);
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
    if (allowed && inView && pageVisible && !failed) {
      void element.play().catch(() => setReady(false));
    } else {
      element.pause();
    }
  }, [allowed, inView, pageVisible, failed]);

  return (
    <figure className="atelier-film" aria-label="من الخيط إلى التصميم">
      <div className="atelier-film-frame" ref={frame}>
        <img
          className="atelier-film-poster"
          src={editorialMedia.poster}
          alt="يد تعمل على قص باترون أزياء، من مقاطع حرفة التصميم المقدمة للمشروع"
          width={720}
          height={800}
          fetchPriority="high"
        />
        {allowed && !failed && (
          <video
            ref={video}
            className={`atelier-film-video ${ready ? "is-playing" : ""}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={editorialMedia.poster}
            aria-hidden="true"
            onPlaying={() => {
              setReady(true);
            }}
            onError={() => {
              setFailed(true);
              setReady(false);
            }}
          >
            <source src={editorialMedia.montageWebm} type="video/webm" />
            <source src={editorialMedia.montageMp4} type="video/mp4" />
          </video>
        )}
        <div className="atelier-film-caption" aria-hidden="true">
          <span>من الخيط تبدأ الحكاية</span>
          <small>حرفة · تفاصيل · إطلالات</small>
        </div>
      </div>
      <figcaption>
        <span>حرفةٌ تصنع الفارق</span>
        <span>من الأتيليه إلى الإطلالة</span>
      </figcaption>
    </figure>
  );
}
