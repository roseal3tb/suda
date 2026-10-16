import { useEffect, useRef, useState } from "react";
import { ExternalLink, Pause, Play } from "lucide-react";
import { AtelierFilm } from "@/components/suda/atelier-film";
import { Reveal, WordsReveal } from "@/components/suda/reveal";

const runwayFilms = [
  { id: 1, title: "لحظات من الإطلالة", detail: "اللمسات الأولى" },
  { id: 2, title: "حضور على السجادة", detail: "النسيج والحركة" },
  { id: 3, title: "تفاصيل تحت الضوء", detail: "قصة القطعة" },
  { id: 4, title: "الفستان يحكي", detail: "اللمسة الأخيرة" },
] as const;

function RunwayClip({ item }: { item: (typeof runwayFilms)[number] }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const base = `/editorial/runway/runway-${item.id}`;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pause = () => { video.pause(); setPlaying(false); };
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || document.hidden || preference.matches) {
        pause();
        return;
      }
      void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }, { threshold: 0.3 });
    observer.observe(video);
    const onVisibility = () => { if (document.hidden) pause(); };
    const onPreferenceChange = () => { if (preference.matches) pause(); };
    document.addEventListener("visibilitychange", onVisibility);
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      preference.removeEventListener("change", onPreferenceChange);
      video.pause();
    };
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video || error) return;
    if (!video.paused) { video.pause(); setPlaying(false); }
    else void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }

  return (
    <article className="runway-clip">
      <div className="runway-clip-media">
        <video
          ref={ref}
          src={`${base}-preview.mp4`}
          poster={`${base}-poster.jpg`}
          muted
          playsInline
          loop
          preload="none"
          aria-label={`مقتطف مصور: ${item.title}`}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onError={() => { setError(true); setPlaying(false); }}
        />
        {!error && (
          <button type="button" className="runway-play-control" onClick={toggle} aria-label={`${playing ? "إيقاف" : "تشغيل"} ${item.title}`}>
            {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
          </button>
        )}
        <span className="runway-clip-number" aria-hidden="true">0{item.id}</span>
      </div>
      <div className="runway-clip-meta">
        <div><h3>{item.title}</h3><p>{item.detail}</p></div>
        <a href={`${base}-full.mp4`} target="_blank" rel="noopener noreferrer" aria-label={`عرض المقطع الكامل: ${item.title}`}>
          المقطع كاملًا <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

/** Original fashion-making montage + four restored user-provided clips.
 * Muted previews load on demand. Full unmodified MP4s remain linked. */
export function EditorialMotionStory() {
  return (
    <section className="suda-motion-story section-wrap" aria-labelledby="suda-motion-title">
      <div className="suda-motion-header">
        <Reveal className="suda-motion-copy">
          <span className="eyebrow"><span className="tiny-line" /> من مشغل الأزياء إلى الإطلالة</span>
          <h2 id="suda-motion-title"><WordsReveal text="حكاية تتشكّل بالتفاصيل" /></h2>
          <p>تبدأ الرحلة من العمل على القماش والخياطة، ثم تتحوّل إلى إطلالة تعيش تحت الأضواء.</p>
        </Reveal>
        <Reveal className="suda-motion-film" delay={.1}><AtelierFilm /></Reveal>
      </div>
      <Reveal className="runway-collection-heading">
        <div><span className="eyebrow"><span className="tiny-line" /> لقطات مختارة</span><h2>لحظات من عالم الأزياء</h2></div>
        <p>أربعة مقاطع من المواد التي اخترتِها، مع إمكانية مشاهدة النسخة الكاملة لكل مقطع.</p>
      </Reveal>
      <div className="runway-video-grid">
        {runwayFilms.map((item) => <RunwayClip key={item.id} item={item} />)}
      </div>
    </section>
  );
}
