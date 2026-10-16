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
  const { enrollments, opportunities } = useDemo();
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
      {activeEnrollments.length ? (
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
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!achievement.trim()) {
      setError("اكتبي إنجازك أولًا");
      return;
    }
    if (!addAchievement(course.id, achievement)) {
      setError("تعذّر حفظ الإنجاز");
      return;
    }
    setAchievement("");
    setError("");
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
            aria-label={`تقدم ${course.title}`}
            value={progress}
            onChange={(e) => {
              setProgress(Number(e.target.value));
              setSaved(false);
            }}
          />
          <output>{progress.toLocaleString("ar-SA")}٪</output>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (updateProgress(course.id, progress)) setSaved(true);
              else setError("تعذّر حفظ التقدم");
            }}
          >
            <Check />
            حفظ التقدّم
          </Button>
        </div>
        {saved && (
          <p className="success-message" role="status">
            حُدّث التقدّم إلى {enrollment.progress.toLocaleString("ar-SA")}٪ في
            هذا المتصفح
          </p>
        )}
        <form className="achievement-form" onSubmit={submit}>
          <input
            aria-label={`إنجاز جديد في ${course.title}`}
            value={achievement}
            onChange={(e) => setAchievement(e.target.value)}
            placeholder="إنجازك، مثل: أتممت رسم الباترون الأول"
          />
          <Button type="submit" variant="outline">
            <Plus />
            إضافة إنجاز
          </Button>
        </form>
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
