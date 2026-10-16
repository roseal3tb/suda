import { createFileRoute, Link } from "@tanstack/react-router";
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
import {
  OpportunityCard,
  categoryIcons,
  DemoNote,
} from "@/components/suda/shared";
import { fashionMedia, categories, pageHead } from "@/features/suda/mock-data";
import { AtelierFilm } from "@/components/suda/atelier-film";
import { HeroAtelierPattern } from "@/components/suda/hero-atelier-pattern";
import { ThreadJourney } from "@/components/suda/thread-interlude";
import { Reveal, WordsReveal } from "@/components/suda/reveal";
import { useDemo } from "@/features/suda/demo-context";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "الرئيسية",
      "سُدى: منصة عربية لفرص تصميم الأزياء، الملف المهني، ومعرض الأعمال",
    ),
  component: Home,
});
const journeySteps = [
  {
    number: "01",
    title: "اكتشفي ما يناسبك",
    body: "تصفّحي الدورات والمسابقات وفرص التدريب والعمل، واختاري الخطوة المناسبة لاهتماماتك",
    to: "/opportunities" as const,
    action: "تصفّحي الفرص",
    Icon: Sparkles,
  },
  {
    number: "02",
    title: "تابعي تعلّمك",
    body: "سجّلي التحاقك بالدورات المتاحة في النسخة التجريبية، وتابعي تقدّمك التعليمي بنفسك",
    to: "/learning" as const,
    action: "رحلتي التعليمية",
    Icon: GraduationCap,
  },
  {
    number: "03",
    title: "اصنعي حضورك المهني",
    body: "اجمعي مهاراتك وخبراتك وأعمال تصميم الأزياء في ملف مهني ومعرض خاص بك",
    to: "/portfolio" as const,
    action: "معرض الأعمال",
    Icon: BriefcaseBusiness,
  },
];
const voices = [
  {
    name: "أروى البنوي",
    english: "Arwa Al Banawi",
    quote: "نحتاج إلى مزيد من النساء اللواتي يعبّرن عمّا يردن. أعتقد أنني واحدة منهن، وأريد أن ألهم المزيد من الفتيات معي",
    source: "The National · 2017",
  },
  {
    name: "هنيدة صيرفي",
    english: "Honayda Serafi",
    quote: "العالم مليء بالفرص، وهناك مكان للجميع. أنصح المصممين الصاعدين بالتركيز على أهدافهم، والاستمرار في دفع أنفسهم نحو الأفضل",
    source: "Arab News · 2022",
  },
  {
    name: "مشاعل الراجحي",
    english: "Mashael AlRajhi",
    quote: "اسعوا لتحقيق أهدافكم. لا تتوقفوا عند أول عقبة. إذا استطعتم تخيّل ما تريدون تحقيقه، فغالبًا تستطيعون تحقيقه",
    source: "Sanah Sharma · 2016",
  },
  {
    name: "ريم الكنهل ",
    english: "Reem Alkanhal",
    quote: "المصمّمة الحقيقية هي التي تترك مساحة للمرأة تكمل قصتها",
    source: "مقتبس من النص المقدّم للمشروع",
  },
] as const;
const subtitles = [
  "دورات مجانية",
  "منافسات تصميم",
  "تجارب مهنية",
  "مسارات عمل",
];
function Home() {
  const { opportunities } = useDemo();
  return (
    <>
      <section className="atelier-hero" aria-labelledby="atelier-title">
        <div className="atelier-hero-copy">
          <HeroAtelierPattern />
          <span className="eyebrow">
            <span className="tiny-line" />
            مساحتك في عالم تصميم الأزياء
          </span>
          <img
            className="atelier-hero-logo"
            src="/suda-logo-transparent.png"
            alt="سُدى"
            width={1582}
            height={1128}
          />
          <h1 id="atelier-title">
            رُؤى <span>تُنسَج</span>
          </h1>
          <p className="atelier-hero-body">
            اكتشفي دورات ومسابقات وفرص تدريب وعمل في تصميم الأزياء، واجمعي
            مهاراتك وأعمالك في مساحة تُعبّر عنك
          </p>
          <div className="atelier-hero-actions">
            <Button asChild size="lg">
              <Link to="/opportunities">
                اكتشفي الفرص <ArrowLeft />
              </Link>
            </Button>
            <Link to="/portfolio" className="text-link">
              ابني معرض أعمالك <ArrowUpLeft size={17} />
            </Link>
          </div>
          <div className="atelier-hero-foot">
            <span>صُمّمت لبدايتك، ولما بعدها</span>
            <a href="#suda-journey" aria-label="اكتشفي رحلتك في سُدى">
              <ArrowDown size={16} />
              اكتشفي سُدى
            </a>
          </div>
        </div>
        <AtelierFilm />
      </section>
      <section className="couture-voices section-wrap" aria-labelledby="couture-voices-title">
        <Reveal className="couture-voices-heading">
          <span className="eyebrow"><span className="tiny-line" /> كلمات من عالم الأزياء</span>
          <h2 id="couture-voices-title">من وحي المصممات</h2>
          <p>كلمات ملهمة من مصممات سعوديات عن الشغف والطموح وابتكار الطريق الخاص بك</p>
        </Reveal>
        <div className="couture-voices-grid">
          {voices.map((voice, index) => (
            <Reveal as="article" className={`couture-voice-card couture-voice-card-${index}`} delay={index * 0.1} key={voice.english}>
              <span className="couture-voice-mark" aria-hidden="true">”</span>
              <blockquote dir="rtl">{voice.quote}</blockquote>
              <div className="couture-voice-author">
                <div><strong>{voice.name}</strong><span lang="en">{voice.english}</span></div>
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
              01 / رحلتك مع سُدى
            </span>
            <h2 id="suda-journey-title">
              <WordsReveal text="خطواتك في عالم الأزياء" />
            </h2>
          </div>
          <p>
            من اكتشاف الفرصة المناسبة إلى بناء معرض أعمالك، كل خطوة تجد مكانها
            في سُدى
          </p>
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
      <nav className="category-ribbon" aria-label="أنواع الفرص">
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
      <section
        id="suda-opportunities"
        className="section-wrap home-opportunities"
      >
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="tiny-line" />
              02 / استكشفي
            </span>
            <h2>
              <WordsReveal text="فرص تصميم الأزياء" />
            </h2>
            <p>دورات ومسابقات وتدريب وفرص وظيفية ضمن تجربة واحدة</p>
          </div>
          <Link to="/opportunities" className="text-link">
            عرض جميع الفرص <ArrowLeft size={15} />
          </Link>
        </Reveal>
        <div className="opportunity-grid home-opportunity-grid">
          {opportunities.slice(0, 4).map((item, i) => (
            <OpportunityCard key={item.id} item={item} delay={i * 0.15} />
          ))}
        </div>
        <DemoNote />
      </section>
      <ThreadJourney>
        <section className="editorial-band">
          <Reveal className="editorial-copy">
            <span className="eyebrow">
              <span className="tiny-line" />
              03 / ملفك المهني
            </span>
            <h2>
              مهاراتك وأعمالك
              <br />
              في مساحة واحدة
            </h2>
            <p>
              أنشئي ملفًا مهنيًا يضم مهاراتك واهتماماتك وخبراتك، ثم أضيفي أعمال
              تصميم الأزياء إلى معرضك الخاص
            </p>
            <div className="editorial-actions">
              <Button asChild variant="outline">
                <Link to="/profile">
                  <UserRound size={16} />
                  الملف المهني <ArrowLeft />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/portfolio">
                  <Images size={16} />
                  معرض الأعمال <ArrowLeft />
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
              من الفكرة إلى الإطلالة
            </span>
          </Reveal>
        </section>
        <div className="thread-journey-breath" aria-hidden="true" />
        <section className="inspiration-teaser section-wrap">
          <Reveal className="inspiration-teaser-copy">
            <span className="eyebrow">
              <span className="tiny-line" />
              04 / من مشهد الأزياء المحلي
            </span>
            <h2>
              <WordsReveal text="إلهام سعودي" />
            </h2>
            <p>
              إطلالات وتفاصيل تفتح لك آفاقًا جديدة في التصميم. تعرّفي على مصممات
              سعوديات، واستكشفي قصصهن ومصادر أعمالهن
            </p>
            <Button asChild>
              <Link to="/inspiration">
                اكتشفي المصممات <ArrowLeft />
              </Link>
            </Button>
          </Reveal>
          <Reveal
            className="inspiration-teaser-art inspiration-fashion-collage"
            aria-label="صور مختارة من تصاميم الأزياء"
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
              تفاصيل تُلهم، وتصاميم تُحكى
            </span>
          </Reveal>
        </section>
      </ThreadJourney>
    </>
  );
}
