import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Pencil, Trash2, Check, Plus, ImagePlus } from "lucide-react";
import { Reveal } from "@/components/suda/reveal";
import { Button } from "@/components/ui/button";
import {
  AddButton,
  ConfirmDelete,
  DemoNote,
  EmptyState,
  FormField,
  MemberGate,
  Modal,
  PageIntro,
} from "@/components/suda/shared";
import { pageHead, type Work } from "@/features/suda/mock-data";
import { preparePortfolioImage } from "@/features/suda/image-utils";
import { useDemo } from "@/features/suda/demo-context";
export const Route = createFileRoute("/portfolio")({
  head: () =>
    pageHead(
      "معرض الأعمال",
      "معرض شخصي لحفظ أعمال تصميم الأزياء في حسابك، مع صور مؤقتة",
    ),
  component: () => (
    <MemberGate>
      <Portfolio />
    </MemberGate>
  ),
});
function Portfolio() {
  const { works, worksLoading, saveWork, deleteWork } = useDemo();
  const [form, setForm] = useState<Work | null>(null);
  const [view, setView] = useState<Work | null>(null);
  const [deleting, setDeleting] = useState<Work | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState(false);
  function start(work?: Work) {
    setError("");
    setSaved(false);
    setForm(
      work
        ? { ...work }
        : { id: `work-${Date.now()}`, title: "", description: "", image: "" },
    );
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form || busy) return;
    if (!form.title.trim() || !form.description.trim()) {
      setError("أضيفي عنوان العمل ووصفه قبل الحفظ");
      return;
    }
    setBusy(true);
    try {
      const ok = await saveWork({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      });
      if (!ok) {
        setError("تعذّر حفظ العمل. تحققي من الاتصال وحاولي مجددًا.");
        return;
      }
      setForm(null);
      setSaved(true);
    } catch (err) {
      console.error("Portfolio save failed:", err);
      setError("حدث خطأ أثناء حفظ العمل. حاولي مجددًا.");
    } finally {
      setBusy(false);
    }
  }
  async function chooseImage(file?: File) {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const data = await preparePortfolioImage(file);
      setForm((prev) => (prev ? { ...prev, image: data } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر قراءة الصورة");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="content-wrap portfolio-page">
      <PageIntro
        eyebrow="معرض الأعمال"
        title="معرض أعمالي"
        description="تُحفظ عناوين أعمالك وأوصافها في حسابك؛ الصور مؤقتة وتختفي بعد إغلاق الموقع أو تسجيل الخروج"
        action={
          works.length > 0 ? (
            <AddButton onClick={() => start()}>إضافة عمل</AddButton>
          ) : undefined
        }
      />
      {saved && (
        <p role="status" className="success-message">
          <Check size={16} />
          حُفظ عنوان العمل ووصفه في حسابك. الصورة مؤقتة
        </p>
      )}
      {worksLoading ? (
        <p role="status">جارٍ تحميل معرض الأعمال…</p>
      ) : works.length ? (
        <div className="work-grid">
          {works.map((work, i) => (
            <Reveal
              as="article"
              className="work-card"
              key={work.id}
              delay={(i % 3) * 0.15}
            >
              <button
                className="work-image"
                type="button"
                aria-label={`عرض ${work.title}`}
                onClick={() => setView(work)}
              >
                {work.image ? (
                  <img src={work.image} alt={work.title} loading="lazy" />
                ) : (
                  <span className="work-image-empty">
                    <ImagePlus size={36} />
                    عرض العمل
                  </span>
                )}
              </button>
              <div className="work-title-row">
                <h2>{work.title}</h2>
                <div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`تعديل ${work.title}`}
                    onClick={() => start(work)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`حذف ${work.title}`}
                    onClick={() => {
                      setDeleteError("");
                      setDeleting(work);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <p>{work.description}</p>
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState
          title="معرضك جاهز لأعمالك"
          description="لا توجد أعمال بعد. أضيفي تصميمًا أو مشروعًا دراسيًا لتبدئي معرضك"
          action={
            <Button variant="outline" onClick={() => start()}>
              <Plus />
              إضافة أول عمل
            </Button>
          }
        />
      )}
      <DemoNote />
      <Modal
        open={Boolean(form)}
        onClose={() => {
          if (!busy) setForm(null);
        }}
        title={
          form && works.some((w) => w.id === form.id)
            ? "تعديل العمل"
            : "إضافة عمل جديد"
        }
      >
        {form && (
          <form className="form-stack" onSubmit={submit} noValidate>
            <FormField label="عنوان العمل *">
              <input
                value={form.title}
                maxLength={90}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="عنوان التصميم"
              />
            </FormField>
            <FormField label="وصف العمل *">
              <textarea
                value={form.description}
                maxLength={1200}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="فكرة العمل والخامات والتقنيات المستخدمة"
              />
            </FormField>
            <FormField
              label="صورة عملك — اختيارية"
          
                 hint="يمكنك حفظ العمل بدون صورة وإضافتها لاحقًا، الصورة مؤقتة خلال هذه الزيارة فقط."

            >
              <div
                className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
                  dragging ? "border-primary bg-primary/10" : "border-border"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!busy) setDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  if (!busy) void chooseImage(e.dataTransfer.files[0]);
                }}
              >
                <input
                  id="suda-portfolio-image"
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  disabled={busy}
                  onChange={(e) => {
                    void chooseImage(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <label
                  htmlFor="suda-portfolio-image"
                  className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground ${
                    busy ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <ImagePlus size={18} />
                  اختاري أو افلتي صورة من الجهاز
                </label>
                <p className="mt-3 text-sm text-muted-foreground">
                </p>
              </div>
            </FormField>
            {form.image ? (
              <div className="portfolio-preview">
                <img
                  className="preview-image"
                  src={form.image}
                  alt="معاينة صورة العمل"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForm({ ...form, image: "" })}
                >
                  إزالة الصورة
                </Button>
              </div>
            ) : null}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              <Button type="submit" disabled={busy}>
                {busy ? "جارٍ الحفظ أو تجهيز الصورة…" : "حفظ العمل"} <Check />
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setForm(null)}
              >
                إلغاء
              </Button>
            </div>
          </form>
        )}
      </Modal>
      <Modal
        open={Boolean(view)}
        onClose={() => setView(null)}
        title={view?.title || "عرض العمل"}
        {...(view ? { description: view.description } : {})}
      >
        {view &&
          (view.image ? (
            <img
              className="work-view-image"
              src={view.image}
              alt={view.title}
            />
          ) : (
            <div className="upload-placeholder">
              هذا العمل لا يحتوي على صورة.
            </div>
          ))}
      </Modal>
      <ConfirmDelete
        open={Boolean(deleting)}
        onClose={() => {
          if (deletingBusy) return;
          setDeleting(null);
          setDeleteError("");
        }}
        name={deleting?.title || ""}
        error={deleteError}
        busy={deletingBusy}
        onConfirm={() => {
          if (!deleting || deletingBusy) return;
          setDeleteError("");
          setDeletingBusy(true);
          void (async () => {
            try {
              const ok = await deleteWork(deleting.id);
              if (ok) {
                setDeleting(null);
                setSaved(false);
              } else {
                setDeleteError("تعذّر حذف العمل. تحققي من الاتصال وحاولي مجددًا.");
              }
            } catch (err) {
              console.error("Portfolio delete failed:", err);
              setDeleteError("حدث خطأ أثناء حذف العمل. حاولي مجددًا.");
            } finally {
              setDeletingBusy(false);
            }
          })();
        }}
      />
    </div>
  );
}
