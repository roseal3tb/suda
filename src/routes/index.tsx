import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpLeft,
  ArrowDown,
  Scissors,
  Images,
  UserRound,
  Sparkles,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryIcons } from "@/components/suda/shared";
import { fashionMedia, categories, pageHead } from "@/features/suda/mock-data";
import { AtelierFilm } from "@/components/suda/atelier-film";
import { HeroAtelierPattern } from "@/components/suda/hero-atelier-pattern";
import { ThreadJourney } from "@/components/suda/thread-interlude";
import { Reveal, WordsReveal } from "@/components/suda/reveal";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "الرئيسية",
      "سُـدى: مـنصة عربية لفـرص تـصميم الأزيـاء، المـلف المهـني، ومعـرض الأعمـال",
    ),
  component: Home,
});
const journeySteps = [
  {
    number: "01",
    title: "اكـتشفي ما يـناسبك",
    body: "تـصفّحي الـدورات والمسـابقات وفـرص التـدريب والعمـل، واختـاري الخطـوة المناسبـة لاهتماماتـك",
    to: "/opportunities" as const,
    action: "تصفّـحي الفـرص",
    Icon: Sparkles,
  },
  {
    number: "02",
    title: "تـابعي تعـلّمك",
    body: "سجّـلي التحـاقك بالـدورات المتـاحة في النـسخة التجـريبية، وتابـعي تقـدّمك التعـليمي بنـفسك",
    to: "/learning" as const,
    action: "رحلـتي التعـليمية",
    Icon: GraduationCap,
  },
  {
    number: "03",
    title: "اصـنعي حضـورك المهـني",
    body: "اجمـعي مهـاراتك وخبـراتك وأعمـال تصمـيم الأزيـاء في مـلف مهـني ومعـرض خـاص بك",
    to: "/portfolio" as const,
    action: "معـرض الأعمـال",
    Icon: BriefcaseBusiness,
  },
];
const voices = [
  {
    name: "أروى البنوي",
    quote:
      "نحتاج إلى مزيد من النساء اللواتي يعبّرن عمّا يردن. أعتقد أنني واحدة منهن، وأريد أن ألهم المزيد من الفتيات معي",
    source: "The National · 2017",
  },
  {
    name: "هنيدة صيرفي",
    quote:
      "العالم مليء بالفرص، وهناك مكان للجميع. أنصح المصممين الصاعدين بالتركيز على أهدافهم، والاستمرار في دفع أنفسهم نحو الأفضل",
    source: "Arab News · 2022",
  },
  {
    name: "مشاعل الراجحي",
    quote:
      "اسعوا لتحقيق أهدافكم. لا تتوقفوا عند أول عقبة. إذا استطعتم تخيّل ما تريدون تحقيقه، فغالبًا تستطيعون تحقيقه",
    source: "Sanah Sharma · 2016",
  },
  {
    name: "ريم الكنهل ",
    quote: "المصمّمة الحقيقية هي التي تترك مساحة للمرأة تكمل قصتها",
    source: "ZiiMag · 2025",
  },
] as const;
const subtitles = [
  "دورات مجـانية",
  "منـافسات تصمـيم",
  "تجـارب مهنـية",
  "مسـارات عمـل",
];
function Home() {
  const ribbonRef = useRef<HTMLElement>(null);
  const isRibbonInView = useInView(ribbonRef, {
    once: true,
    margin: "0px 0px -12% 0px",
  });
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <section className="atelier-hero" aria-labelledby="atelier-title">
        <div className="atelier-hero-copy">
          <HeroAtelierPattern />
          <div className="atelier-hero-identity">
            <h1 id="atelier-title" className="atelier-hero-brand-name">
              سُــــدى
            </h1>
            <p className="atelier-hero-tagline">رُؤى تُنــسَج</p>
          </div>
          <div className="atelier-hero-introduction">
            <p className="atelier-hero-kicker">مسـاحتـك في عـالم تصمـيم الأزيـاء</p>
            <p className="atelier-hero-body">
              اكتشـفي دورات ومسـابقات وفـرص تـدريب وعمـل في تصمـيم الأزيـاء، واجمعي
              مهـاراتك وأعمـالك في مسـاحة تُـعبّر عـنك
            </p>
          </div>
          <div className="atelier-hero-bottom">
            <div className="atelier-hero-foot">
              <span>صُمّـمت لبـدايتك، ولـما بعـدها</span>
              <a href="#suda-journey" aria-label="اكتشـفي رحـلتك في سُـدى">
                <ArrowDown size={16} />
                اكتشـفي سُـدى
              </a>
            </div>
            <div className="atelier-hero-actions">
              <Button asChild size="lg">
                <Link to="/opportunities">
                  اكتشـفي الفـرص <ArrowLeft />
                </Link>
              </Button>
              <Link to="/portfolio" className="text-link">
                ابني معرض أعمـالك <ArrowUpLeft size={17} />
              </Link>
            </div>
          </div>
        </div>
        <AtelierFilm />
      </section>
      <section
        className="couture-voices section-wrap"
        aria-labelledby="couture-voices-title"
      >
        <Reveal className="couture-voices-heading">
          <span className="eyebrow">
            <span className="tiny-line" /> كلمـات من عـالم الأزيـاء
          </span>
          <h2 id="couture-voices-title" aria-label="من وحي المصممات">
            من وحــي المصممــات
          </h2>
          <p>
            كلـمات ملـهمة من مصممـات سعوديـات عن الـشغف والطمـوح وابتكـار الطـريق الخـاص
            بك
          </p>
        </Reveal>
        <div className="couture-voices-grid">
          {voices.map((voice, index) => (
            <Reveal
              as="article"
              className={`couture-voice-card couture-voice-card-${index}`}
              delay={index * 0.1}
              key={voice.name}
            >
              <span className="couture-voice-mark" aria-hidden="true">
                ”
              </span>
              <blockquote dir="rtl">{voice.quote}</blockquote>
              <div className="couture-voice-author">
                <div>
                  <strong>{voice.name}</strong>
                </div>
                <small>{voice.source}</small>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section
        id="suda-journey"
        className="suda-journey section-wrap"
        aria-labelledby="suda-journey-title"
      >
        <Reveal className="suda-journey-intro">
          <div>
            <span className="eyebrow">
              <span className="tiny-line" />
              01 / رحلتـك مع سُـدى
            </span>
            <h2 id="suda-journey-title">
              <WordsReveal text="خطـواتك في عـالم الأزيـاء" />
            </h2>
          </div>
        </Reveal>
        <div className="suda-journey-grid">
          {journeySteps.map(({ number, title, body, to, action, Icon }, i) => (
            <Reveal
              as="article"
              className="suda-journey-step"
              delay={i * 0.15}
              key={number}
            >
              <div className="suda-journey-step-top">
                <span className="suda-journey-number" aria-hidden="true">
                  {number}
                </span>
                <Icon size={24} strokeWidth={1.35} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              <Link to={to} className="suda-journey-link">
                {action}
                <ArrowLeft size={17} />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section
        id="suda-opportunities"
        className="section-wrap home-opportunities"
      >
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="tiny-line" />
              02 / استكشـفي
            </span>
            <h2>
              <WordsReveal text="فـرص تصمـيم الأزيـاء" />
            </h2>
            <p>دورات ومسـابقات وتـدريب وفـرص وظيفيـة ضمـن تجـربة واحـدة</p>
          </div>
          <Link to="/opportunities" className="text-link">
            عـرض جميـع الفـرص <ArrowLeft size={15} />
          </Link>
        </Reveal>
        <nav
          ref={ribbonRef}
          className={`category-ribbon home-category-ribbon ${isRibbonInView || prefersReducedMotion ? "is-visible" : ""}`}
          aria-label="أنـواع الفـرص"
        >
          {categories.map((type, i) => {
            const Icon = categoryIcons[type];
            return (
              <Link key={type} to="/opportunities" search={{ category: type }}>
                <Icon className="ribbon-icon" size={27} strokeWidth={1} />
                <div>
                  <h3>{type}</h3>
                  <small>{subtitles[i]}</small>
                </div>
                <ArrowUpLeft className="ribbon-arrow" size={17} />
              </Link>
            );
          })}
        </nav>
      </section>
      <ThreadJourney>
        <section className="editorial-band">
          <Reveal className="editorial-copy">
            <span className="eyebrow">
              <span className="tiny-line" />
              03 / ملفـك المـهني
            </span>
            <h2 aria-label="مهاراتـك وأعمـالك في مسـاحة واحـدة">
              مهــاراتك وأعمــالك
              <br />
              في مســاحة واحــدة
            </h2>
            <p>
              أنشئي ملفًا مهنيًا يضم مهاراتك واهتماماتك وخبراتك، ثم أضيفي أعمال
              تصميم الأزياء إلى معرضك الخاص
            </p>
            <div className="editorial-actions">
              <Button asChild variant="outline">
                <Link to="/profile">
                  <UserRound size={16} />
                  الملـف المـهني <ArrowLeft />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/portfolio">
                  <Images size={16} />
                  معرض الأعمـال <ArrowLeft />
                </Link>
              </Button>
            </div>
          </Reveal>
          <Reveal className="profile-fashion-triptych" delay={0.13}>
            {fashionMedia.profile.map((photo, index) => (
              <figure
                key={photo.src}
                className={`profile-fashion-shot profile-fashion-shot-${index}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  width={720}
                  height={1280}
                />
              </figure>
            ))}
            <span className="profile-fashion-caption">
              من الفكـرة إلى الإطـلالة
            </span>
          </Reveal>
        </section>
        <div className="thread-journey-breath" aria-hidden="true" />
        <section className="inspiration-teaser section-wrap">
          <Reveal className="inspiration-teaser-copy">
            <span className="eyebrow">
              <span className="tiny-line" />
              04 / من مشهـد الأزيـاء المـحلي
            </span>
            <h2>
              <WordsReveal text="إلهـام سعـودي" />
            </h2>
            <p>
              إطـلالات وتفـاصيل تفتح لك آفـاقًا جديـدة في التصمـيم. تعرّفي على مصمـمات
              سعوديـات، واستكـشفي قصصـهن ومصـادر أعمـالهن
            </p>
            <Button asChild>
              <Link to="/inspiration">
                اكتـشفي المصممـات <ArrowLeft />
              </Link>
            </Button>
          </Reveal>
          <Reveal
            className="inspiration-teaser-art inspiration-fashion-collage"
            aria-label="صـور مختـارة من تصـاميم الأزيـاء"
          >
            {fashionMedia.inspiration.map((photo, index) => (
              <figure
                key={photo.src}
                className={`inspiration-fashion-shot inspiration-fashion-shot-${index}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  width={720}
                  height={1000}
                />
              </figure>
            ))}
            <span className="fashion-collage-caption">
              تفـاصيل تُـلهم، وتصـاميم تُـحكى
            </span>
          </Reveal>
        </section>
      </ThreadJourney>
    </>
  );
}
