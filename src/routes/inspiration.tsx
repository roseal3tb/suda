import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowUpLeft,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Reveal } from "@/components/suda/reveal";
import { designers } from "@/features/suda/designers";
import { pageHead } from "@/features/suda/mock-data";
export const Route = createFileRoute("/inspiration")({
  head: () =>
    pageHead(
      "إلهام سعودي",
      "تعرفي على مصممات أزياء سعوديات من خلال معلومات موثقة وروابط المصادر",
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
            دليل تحريري لمصممات سعوديات، مع مصادر منشورة حين تتوفر، وصور
            تعريفية أضافها فريق المشروع من الملفات المرفقة
          </p>
          <span className="inspiration-counter">
            {designers.length.toLocaleString("ar-SA")} مصممات وعلامات
          </span>
        </Reveal>
        <div className="inspiration-hero-deco" aria-hidden="true">
          سُدى
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
              اختاري اسمًا لعرض التفاصيل. تظهر حالة التوثيق بوضوح لكل مصممة
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
        {current && <section
          ref={detailRef}
          id="designer-details"
          className="designer-expanded is-open"
          aria-live="polite"
          aria-label="تفاصيل المصممة"
        >
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
                    لم يُضف مصدر موثوق لهذا الملف بعد
                  </span>
                )}
              </div>
              <div className="designer-expanded-media">
                {current.image ? (
                  <figure className="designer-photo">
                    <img src={current.image} alt={`صورة مرفقة للمصممة ${current.name}`} loading="lazy" decoding="async" />
                    <figcaption>{current.name}</figcaption>
                  </figure>
                ) : (
                  <div className="designer-photo-unavailable" role="img" aria-label="لم تُرفق صورة لهذه المصممة">
                    <span aria-hidden="true">سُدى</span>
                    <p>لم تُرفق صورة لهذه المصممة</p>
                  </div>
                )}
              </div>
            </>
        </section>}
        <p className="inspiration-disclaimer">
          المحتوى تعريفي مستقل لأغراض مشروع جامعي، ولا يمثل شراكة أو اعتمادًا من
          المصممات أو العلامات المذكورة، والصور من الملفات المقدمة لفريق المشروع؛
          ويجب التحقق من حقوق إعادة استخدامها قبل النشر العام
        </p>
      </section>
    </div>
  );
}
