import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowUpLeft,
  ChevronDown,
  ExternalLink,
  Images,
  CheckCircle2,
} from "lucide-react";
import { Reveal } from "@/components/suda/reveal";
import { designers, designerQuotes } from "@/features/suda/designers";
import { pageHead } from "@/features/suda/mock-data";
export const Route = createFileRoute("/inspiration")({
  head: () =>
    pageHead(
      "إلهام سعودي",
      "تعرفي على مصممات أزياء سعوديات من خلال معلومات موثقة وروابط المصادر.",
    ),
  component: Inspiration,
});
function Inspiration() {
  const [selected, setSelected] = useState<string | null>(null);
  const detailRef = useRef<HTMLElement | null>(null);
  const current = designers.find((d) => d.id === selected);
  function select(id: string) {
    setSelected(id === selected ? null : id);
    if (id !== selected)
      requestAnimationFrame(() =>
        setTimeout(
          () =>
            detailRef.current?.scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
              block: "nearest",
            }),
          40,
        ),
      );
  }
  return (
    <div className="inspiration-page">
      <section className="inspiration-hero">
        <Reveal className="content-wrap">
          <span className="eyebrow">
            <span className="tiny-line" />
            أسماء من مشهد الأزياء السعودي
          </span>
          <h1>
            إلهام <em>سعودي</em>
          </h1>
          <p>
            دليل تحريري لمصممات سعوديات، مع مصادر منشورة حين تتوفر. بعض الأسماء
            المختارة قيد استكمال التوثيق، وصور الأعمال قيد التحقق من حقوق
            الاستخدام.
          </p>
          <span className="inspiration-counter">
            {designers.length.toLocaleString("ar-SA")} مصممات وعلامات
          </span>
        </Reveal>
        <div className="inspiration-hero-deco" aria-hidden="true">
          سُدى
        </div>
      </section>
      <section className="content-wrap designer-quote-section" aria-labelledby="designer-quote-heading">
        <Reveal className="designer-quote-intro">
          <span className="eyebrow"><span className="tiny-line" /> كلمات صنعت أثرًا</span>
          <h2 id="designer-quote-heading">من أقوال مصممات سعوديات</h2>
          <p>اقتباسات من مقابلات منشورة، مترجمة إلى العربية عن الإنجليزية، مع رابط مباشر للنص الأصلي لكل قول.</p>
        </Reveal>
        <div className="designer-quote-grid">
          {designerQuotes.map((item, index) => (
            <Reveal as="article" className="designer-quote-card" key={item.id} delay={(index % 4) * .08}>
              <span className="designer-quote-mark" aria-hidden="true">“</span>
              <blockquote><p>{item.quote}</p></blockquote>
              <div className="designer-quote-bottom">
                <div><strong>{item.name}</strong><small lang="en">{item.brand}</small></div>
                <a href={item.source} target="_blank" rel="noopener noreferrer" aria-label={`مصدر الاقتباس عن ${item.name}`}>
                  {item.sourceLabel} <ExternalLink size={15} aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section
        className="content-wrap inspiration-main"
        aria-label="دليل المصممات"
      >
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="tiny-line" />
              الدليل التحريري
            </span>
            <h2>المصممات</h2>
            <p>
              اختاري اسمًا لعرض التفاصيل. تظهر حالة التوثيق بوضوح لكل مصممة.
            </p>
          </div>
          <span className="verified-note">
            <CheckCircle2 size={17} />
            مصادر موثقة حيثما توفرت
          </span>
        </Reveal>
        <div className="designer-gallery">
          {designers.map((designer, index) => (
            <Reveal
              as="button"
              key={designer.id}
              delay={(index % 4) * 0.15}
              type="button"
              className={`designer-tile designer-tile-${index % 4} ${selected === designer.id ? "is-selected" : ""}`}
              aria-expanded={selected === designer.id}
              aria-controls="designer-details"
              onClick={() => select(designer.id)}
            >
              <span className="designer-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="designer-tile-body">
                <span className="designer-brand">{designer.brand}</span>
                <strong>{designer.name}</strong>
                <span className="designer-focus">{designer.focus}</span>
              </span>
              <span className="designer-more">
                {selected === designer.id ? "إغلاق التفاصيل" : "عرض التفاصيل"}{" "}
                <ChevronDown size={17} />
              </span>
            </Reveal>
          ))}
        </div>
        <section
          ref={detailRef}
          id="designer-details"
          className={`designer-expanded ${current ? "is-open" : ""}`}
          aria-live="polite"
          aria-label="تفاصيل المصممة"
        >
          {current ? (
            <>
              <div className="designer-expanded-copy">
                <span className="eyebrow">
                  <span className="tiny-line" />
                  {current.verified === false ? "قيد التوثيق" : "نبذة تعريفية"}
                </span>
                <h2>{current.name}</h2>
                <span className="designer-expanded-brand">
                  {current.brand} · {current.focus}
                </span>
                <p>{current.bio}</p>
                <h3>مجالات التصميم</h3>
                <div className="designer-tags">
                  {current.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                {current.source && (
                  <a
                    className="designer-source"
                    href={current.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    المصدر: {current.sourceLabel} <ExternalLink size={15} />
                  </a>
                )}
                {!current.source && (
                  <span className="designer-source-pending">
                    لم يُضف مصدر موثوق لهذا الملف بعد.
                  </span>
                )}
              </div>
              <div className="designer-expanded-media">
                <Images size={46} strokeWidth={1} />
                <strong>صور الأعمال قيد التوثيق</strong>
                <p>
                  لن نعرض صورًا أو ننسب مجموعات إلى هذه المصممة قبل التحقق من
                  المصدر وحقوق إعادة الاستخدام.
                </p>
                <button type="button" onClick={() => setSelected(null)}>
                  العودة إلى جميع المصممات <ArrowUpLeft size={15} />
                </button>
              </div>
            </>
          ) : (
            <div className="designer-empty-detail">
              <span>
                اختاري إحدى المصممات أعلاه لعرض التفاصيل داخل الصفحة نفسها.
              </span>
            </div>
          )}
        </section>
        <p className="inspiration-disclaimer">
          المحتوى تعريفي مستقل لأغراض مشروع جامعي. لا يمثل شراكة أو اعتمادًا من
          المصممات أو العلامات المذكورة. لم تُستخدم صور أعمال منسوبة إلى أي
          مصممة.
        </p>
      </section>
    </div>
  );
}
