import { useEffect, useRef, useState } from "react";
import { editorialMedia } from "@/features/suda/mock-data";

/** One small, silent editorial film. No video is requested for reduced-motion
 * visitors; the same poster remains visible if playback fails or is blocked. */
export function AtelierFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element || !allowed || failed) return;
    // Set both the DOM properties and attributes before requesting playback.
    // Safari must see a silent, inline element from the outset.
    element.muted = true;
    element.defaultMuted = true;
    element.controls = false;
    element.playsInline = true;
    element.setAttribute("muted", "");
    const play = () => {
      if (!element.paused) return;
      void element.play().catch(() => setReady(false));
    };
    const resume = () => {
      if (!document.hidden) play();
    };
    element.addEventListener("canplay", play);
    document.addEventListener("visibilitychange", resume);
    play();
    return () => {
      element.removeEventListener("canplay", play);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [allowed, failed]);

  return (
    <figure className="atelier-film" aria-label="من الخيط إلى التصميم">
      <div className="atelier-film-frame">
        <img
          className={`atelier-film-poster ${ready ? "is-hidden" : ""}`}
          src={editorialMedia.poster}
          alt="يد تعمل على قص باترون أزياء، من مقاطع حرفة التصميم المقدمة للمشروع"
          width={720}
          height={800}
          fetchPriority="high"
        />
        {allowed && !failed && (
          <video
            ref={video}
            className="atelier-film-video"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            tabIndex={-1}
            preload="metadata"
            poster={editorialMedia.poster}
            aria-hidden="true"
            onPlaying={() => {
              setReady(true);
            }}
            onPause={() => setReady(false)}
            onError={() => {
              setFailed(true);
              setReady(false);
            }}
          >
            <source src={editorialMedia.montageMp4} type="video/mp4" />
            <source src={editorialMedia.montageWebm} type="video/webm" />
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
