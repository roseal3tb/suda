import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Check, Plus, ArrowLeft, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/suda/reveal";
import {
  DemoNote,
  EmptyState,
  MemberGate,
  PageIntro,
} from "@/components/suda/shared";
import {
  pageHead,
  isValidZoomUrl,
  type Enrollment,
  type Opportunity,
} from "@/features/suda/mock-data";
import { useDemo } from "@/features/suda/demo-context";

export const Route = createFileRoute("/learning")({
  head: () =>
    pageHead(
      "رحلتي التعليمية",
      "دوراتك المجانية وتقدّمك الذي تحدثينه يدويًا وإنجازاتك التعليمية في سُدى",
    ),
  component: () => (
    <MemberGate>
      <Learning />
    </MemberGate>
  ),
});

function Learning() {
  const { enrollments, enrollmentsLoading, opportunities } = useDemo();
  const activeEnrollments = enrollments.filter((enrollment) =>
    opportunities.some(
      (course) =>
        course.id === enrollment.courseId && course.type === "الدورات",
    ),
  );

  return (
    <div className="content-wrap">
      <PageIntro
        eyebrow="التعلّم"
        title="رحلتي التعليمية"
        description="تابعي دوراتك، حدّثي تقدّمك بنفسك، وسجّلي ما أنجزتِه"
      />
      {enrollmentsLoading ? (
        <p role="status">جارٍ تحميل دوراتك...</p>
      ) : activeEnrollments.length ? (
        activeEnrollments.map((enrollment) => {
          const course = opportunities.find(
            (o) => o.id === enrollment.courseId,
          );
          return course ? (
            <LearningRow
              key={course.id}
              course={course}
              enrollment={enrollment}
            />
          ) : null;
        })
      ) : (
        <EmptyState
          title="لا توجد دورات ملتحقة بعد"
          description="التحقي بإحدى الدورات المجانية، وستجدينها هنا مع رابط اللقاء ومتابعة تقدّمك"
          action={
            <Button asChild>
              <Link to="/opportunities" search={{ category: "الدورات" }}>
                استكشفي الدورات <ArrowLeft />
              </Link>
            </Button>
          }
        />
      )}
      <DemoNote />
    </div>
  );
}

function LearningRow({
  course,
  enrollment,
}: {
  course: Opportunity;
  enrollment: Enrollment;
}) {
  const { updateProgress, addAchievement } = useDemo();
  const [progress, setProgress] = useState(enrollment.progress);
  const [achievement, setAchievement] = useState("");
  const [savedProgress, setSavedProgress] = useState<number | null>(null);
  const [achievementSaved, setAchievementSaved] = useState(false);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!achievement.trim()) {
      setError("اكتبي إنجازك أولًا");
      return;
    }
    setBusy(true);
    setError("");
    setAchievementSaved(false);
    try {
      const ok = await addAchievement(course.id, achievement);
      if (!ok) {
        setError("تعذّر حفظ الإنجاز");
        return;
      }
      setAchievement("");
      setAchievementSaved(true);
    } catch (cause) {
      console.error("Failed to save achievement:", cause);
      setError("حدث خطأ أثناء حفظ الإنجاز. حاولي مجددًا.");
    } finally {
      setBusy(false);
    }
  }

  async function saveProgress() {
    if (busy) return;
    setBusy(true);
    setSavedProgress(null);
    setError("");
    try {
      const ok = await updateProgress(course.id, progress);
      if (ok) setSavedProgress(progress);
      else setError("تعذّر حفظ التقدّم. تحققي من الاتصال وحاولي مجددًا.");
    } catch (cause) {
      console.error("Failed to save progress:", cause);
      setError("حدث خطأ أثناء حفظ التقدّم. حاولي مجددًا.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Reveal as="article" className="learning-row">
      <img
        src={course.image}
        alt="تفاصيل تصميم أزياء توضيحية"
        width={720}
        height={900}
      />
      <div>
        <small>دورة مجانية · {course.organization}</small>
        <h2>
          <Link to="/opportunities/$id" params={{ id: course.id }}>
            {course.title}
          </Link>
        </h2>
        <small>التقدّم يُحدَّث يدويًا بواسطتك، ولا يُرصد تلقائيًا</small>
        <div className="progress-controls">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            disabled={busy}
            aria-label={`تقدم ${course.title}`}
            value={progress}
            onChange={(e) => {
              setProgress(Number(e.target.value));
              setSavedProgress(null);
            }}
          />
          <output>{progress.toLocaleString("ar-SA")}٪</output>
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => void saveProgress()}
          >
            <Check />
            {busy ? "جارٍ الحفظ..." : "حفظ التقدّم"}
          </Button>
        </div>
        {savedProgress !== null && (
          <p className="success-message" role="status">
            حُدّث التقدّم إلى {savedProgress.toLocaleString("ar-SA")}٪ وحُفظ في حسابك
          </p>
        )}
        <form className="achievement-form" onSubmit={(e) => void submit(e)}>
          <input
            aria-label={`إنجاز جديد في ${course.title}`}
            value={achievement}
            disabled={busy}
            onChange={(e) => {
              setAchievement(e.target.value);
              setAchievementSaved(false);
            }}
            placeholder="إنجازك، مثل: أتممت رسم الباترون الأول"
          />
          <Button type="submit" variant="outline" disabled={busy}>
            <Plus />
            إضافة إنجاز
          </Button>
        </form>
        {achievementSaved && (
          <p className="success-message" role="status">تم حفظ الإنجاز في حسابك بنجاح</p>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="achievement-list">
          {enrollment.achievements.map((text, i) => (
            <span key={i}>
              <Check size={14} />
              {text}
            </span>
          ))}
        </div>
        <Button variant="link" onClick={() => setZoom(!zoom)}>
          <Video />
          {zoom ? "إخفاء رابط اللقاء" : "عرض رابط زووم"}
        </Button>
        {zoom && (
          <div className="zoom-demo">
            {course.zoomUrl && isValidZoomUrl(course.zoomUrl) ? (
              <a
                className="zoom-link"
                href={course.zoomUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                فتح اجتماع Zoom الرسمي <Video size={15} />
              </a>
            ) : (
              <p>لم تُرفق الجهة المنظمة رابط Zoom موثّقًا بعد</p>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
}
