import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  CalendarDays,
  ArrowLeft,
  ArrowUpLeft,
  Check,
  BookOpen,
} from "lucide-react";
import { Reveal } from "@/components/suda/reveal";
import { Button } from "@/components/ui/button";
import { DemoNote, EmptyState, categoryIcons } from "@/components/suda/shared";
import {
  canAccessZoom,
  formatDate,
  pageHead,
  isValidZoomUrl,
} from "@/features/suda/mock-data";
import { useDemo } from "@/features/suda/demo-context";

export const Route = createFileRoute("/opportunities/$id")({
  head: () =>
    pageHead(
      "تفاصيل الفرصة",
      "تعرّفي على تفاصيل فرصة الأزياء ومتطلباتها ومواعيدها أو التحقي بدورة مجانية",
    ),
  component: Details,
});

function Details() {
  const { id } = Route.useParams();
  const {
    opportunities,
    opportunitiesLoading,
    session,
    enroll,
    enrollments,
    enrollmentsLoading,
  } = useDemo();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const item = opportunities.find((o) => o.id === id);

  async function handleEnroll() {
    if (!item || busy || enrollmentsLoading) return;
    setBusy(true);
    setError("");
    try {
      const ok = await enroll(item);
      if (!ok)
        setError("تعذّر الالتحاق بالدورة. تحققي من الاتصال وحاولي مجددًا.");
    } catch (cause) {
      console.error("Failed to enroll:", cause);
      setError("تعذّر الالتحاق بالدورة. حاولي مجددًا.");
    } finally {
      setBusy(false);
    }
  }

  if (opportunitiesLoading)
    return (
      <div className="content-wrap">
        <p role="status">جارٍ تحميل الفرصة...</p>
      </div>
    );

  if (!item)
    return (
      <div className="content-wrap">
        <EmptyState
          title="هذه الفرصة غير متاحة"
          description="قد تكون حُذفت من قائمة الفرص"
          action={
            <Button asChild>
              <Link to="/opportunities">العودة إلى الفرص</Link>
            </Button>
          }
        />
      </div>
    );

  const Icon = categoryIcons[item.type];
  const enrolled = canAccessZoom(enrollments, id);

  return (
    <div className="content-wrap">
      <Reveal className="breadcrumb">
        <Link to="/">الرئيسية</Link>
        <span>/</span>
        <Link to="/opportunities">الفرص</Link>
        <span>/</span>
        <span>{item.type}</span>
      </Reveal>
      <div className="detail-grid">
        <Reveal className="detail-copy" delay={0.1}>
          <span className="eyebrow">
            <Icon size={16} />
            {item.type} · فرصة تجريبية
          </span>
          <h1>{item.title}</h1>
          <span className="org">{item.organization}</span>
          <div className="detail-tags">
            <span>
              <MapPin size={15} />
              {item.location}
            </span>
            <span>{item.mode}</span>
            <span>{item.level}</span>
            {item.deadline && (
              <span>
                <CalendarDays size={15} />
                آخر موعد: {formatDate(item.deadline)}
              </span>
            )}
          </div>
          <h2>عن الفرصة</h2>
          <p>{item.description}</p>
          <h2>المتطلبات</h2>
          <p>{item.requirements}</p>
          <div className="enrollment-box">
            {item.type === "الدورات" ? (
              <>
                <h3>الالتحاق بالدورة</h3>
                <p>
                  دورة مجانية · في حال توفّر اجتماع رسمي عبر Zoom، يظهر رابطه
                  بعد الالتحاق. لا تُستضاف فيديوهات داخل سُدى
                </p>
                {session && enrollmentsLoading ? (
                  <p role="status">جارٍ التحقق من تسجيلك في الدورة...</p>
                ) : enrolled ? (
                  <>
                    <span className="success-message">
                      <Check size={17} />
                      أنتِ ملتحقة بهذه الدورة في حسابك
                    </span>
                    <div className="zoom-demo">
                      <strong>رابط اللقاء عبر زووم</strong>
                      {item.zoomUrl && isValidZoomUrl(item.zoomUrl) ? (
                        <a
                          className="zoom-link"
                          href={item.zoomUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          فتح اجتماع Zoom الرسمي <ArrowUpLeft size={15} />
                        </a>
                      ) : (
                        <p>لم تُرفق الجهة المنظمة رابط Zoom موثّقًا بعد</p>
                      )}
                    </div>
                    <Button asChild variant="outline">
                      <Link to="/learning">
                        متابعة رحلتي التعليمية <ArrowLeft />
                      </Link>
                    </Button>
                  </>
                ) : session ? (
                  <Button disabled={busy} onClick={() => void handleEnroll()}>
                    <BookOpen />
                    {busy ? "جارٍ الالتحاق..." : "الالتحاق مجانًا"}
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/login">
                      سجّلي الدخول للالتحاق <ArrowLeft />
                    </Link>
                  </Button>
                )}
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
              </>
            ) : (
              <>
                <h3>التقديم لدى الجهة المنظمة</h3>
                <p>
                  لا تُقدَّم الطلبات داخل سُدى.{" "}
                  {item.externalUrl
                    ? "انتقلي إلى الرابط الرسمي لدى الجهة المنظمة"
                    : "لم يُرفق رابط رسمي لهذه الفرصة الخيالية"}
                </p>
                {item.externalUrl && item.externalUrl.startsWith("https://") ? (
                  <Button asChild>
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      الرابط الرسمي للتقديم <ArrowUpLeft />
                    </a>
                  </Button>
                ) : (
                  <Button disabled variant="outline">
                    رابط التقديم غير متاح <ArrowUpLeft />
                  </Button>
                )}
              </>
            )}
          </div>
        </Reveal>
        <Reveal as="aside" className="detail-visual" delay={0.25}>
          <img
            src={item.image}
            alt="صورة توضيحية لعملية تصميم الأزياء"
            width={720}
            height={900}
          />
          <DemoNote />
        </Reveal>
      </div>
    </div>
  );
}
