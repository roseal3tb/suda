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
      "معرض شخصي لإضافة وتعديل وحذف أعمال تصميم الأزياء محليًا.",
    ),
  component: () => (
    <MemberGate>
      <Portfolio />
    </MemberGate>
  ),
});
function Portfolio() {
  const { works, saveWork, deleteWork } = useDemo();
  const [form, setForm] = useState<Work | null>(null);
  const [view, setView] = useState<Work | null>(null);
  const [deleting, setDeleting] = useState<Work | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  function start(work?: Work) {
    setError("");
    setSaved(false);
    setForm(
      work
        ? { ...work }
        : { id: `work-${Date.now()}`, title: "", description: "", image: "" },
    );
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form || busy) return;
    if (!form.title.trim() || !form.description.trim()) {
      setError("أضيفي عنوان العمل ووصفه قبل الحفظ.");
      return;
    }
    if (
      !saveWork({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      })
    ) {
      setError(
        "تعذّر حفظ العمل في المتصفح. جرّبي صورة أصغر أو امسحي بيانات قديمة.",
      );
      return;
    }
    setForm(null);
    setSaved(true);
  }
  async function chooseImage(file?: File) {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const data = await preparePortfolioImage(file);
      setForm((prev) => (prev ? { ...prev, image: data } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر قراءة الصورة.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="content-wrap portfolio-page">
      <PageIntro
        eyebrow="معرض الأعمال"
        title="معرض أعمالي"
        description="أضيفي مشروعاتك وصور تصاميمك الحقيقية، واحتفظي بها محليًا في هذا المتصفح."
        action={
          works.length > 0 ? (
            <AddButton onClick={() => start()}>إضافة عمل</AddButton>
          ) : undefined
        }
      />
      {saved && (
        <p role="status" className="success-message">
          <Check size={16} />
          حُفظ العمل في هذا المتصفح.
        </p>
      )}
      {works.length ? (
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
                    onClick={() => setDeleting(work)}
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
          description="لا توجد أعمال بعد. أضيفي تصميمًا أو مشروعًا دراسيًا لتبدئي معرضك."
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
              hint="اختاري صورة من جهازك؛ ستُضغط وتُحفظ محليًا في هذا المتصفح فقط. لا تستخدمي صور أعمال الآخرين."
            >
              <input
                className="file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={busy}
                onChange={(e) => {
                  void chooseImage(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
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
            ) : (
              <div className="upload-placeholder">
                <ImagePlus size={25} />
                يمكنك حفظ العمل بدون صورة وإضافتها لاحقًا.
              </div>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              <Button type="submit" disabled={busy}>
                {busy ? "جارٍ تجهيز الصورة…" : "حفظ العمل"} <Check />
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
        onClose={() => setDeleting(null)}
        name={deleting?.title || ""}
        onConfirm={() => {
          if (deleting && deleteWork(deleting.id)) {
            setDeleting(null);
            setSaved(false);
          }
        }}
      />
    </div>
  );
}
