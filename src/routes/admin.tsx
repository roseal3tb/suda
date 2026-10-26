import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Pencil, Trash2, Check, Shield, Search } from "lucide-react";
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
import {
  categories,
  categoryMedia,
  emptyFilters,
  filterOpportunities,
  formatDate,
  pageHead,
  validateOpportunity,
  isValidZoomUrl,
  isValidExternalUrl,
  type Opportunity,
  type Category,
} from "@/features/suda/mock-data";
import { useDemo } from "@/features/suda/demo-context";
export const Route = createFileRoute("/admin")({
  head: () =>
    pageHead(
      "إدارة الفرص",
      "إدارة فرص الأزياء وإضافتها وتعديلها وحذفها لحساب الإدارة المصرّح له",
    ),
  component: () => (
    <MemberGate admin>
      <Admin />
    </MemberGate>
  ),
});
function Admin() {
  const {
    opportunities,
    saveOpportunity,
    deleteOpportunity,
    importOpportunities,
    opportunitiesLoading,
    meetingLinksLoading,
  } = useDemo();
  const [form, setForm] = useState<Opportunity | null>(null);
  const [deleting, setDeleting] = useState<Opportunity | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const items = filterOpportunities(opportunities, {
    ...emptyFilters,
    query,
    type,
  });
  function start(item?: Opportunity) {
    setError("");
    setSaved(false);
    setForm(
      item
        ? { ...item }
        : {
            id: `opportunity-${Date.now()}`,
            title: "",
            type: "الدورات",
            organization: "",
            location: "عن بُعد",
            mode: "عن بُعد",
            level: "مبتدئ",
            description: "",
            requirements: "",
            deadline: "",
            image: categoryMedia["الدورات"],
            externalUrl: "",
            zoomUrl: "",
          },
    );
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form || busy) return;
    if (!validateOpportunity(form) || !form.location.trim()) {
      setError("أكملي عنوان الفرصة والجهة والموقع والوصف والمتطلبات");
      return;
    }
    if (form.externalUrl && !isValidExternalUrl(form.externalUrl)) {
      setError(
        "رابط الجهة يجب أن يبدأ بـ https://. اتركيه فارغًا إذا لم يوجد رابط موثّق",
      );
      return;
    }
    if (
      form.type === "الدورات" &&
      form.zoomUrl &&
      !isValidZoomUrl(form.zoomUrl)
    ) {
      setError(
        "استخدمي رابط اجتماع Zoom رسميًا يبدأ بـ https:// وينتمي إلى zoom.us",
      );
      return;
    }
    const { externalUrl, zoomUrl, ...fields } = form;
    const links =
      form.type === "الدورات"
        ? zoomUrl?.trim()
          ? { zoomUrl: zoomUrl.trim() }
          : {}
        : externalUrl?.trim()
          ? { externalUrl: externalUrl.trim() }
          : {};
    setBusy(true);
    const ok = await saveOpportunity({
      ...fields,
      title: form.title.trim(),
      organization: form.organization.trim(),
      ...links,
    });
    setBusy(false);
    if (!ok) {
      setError("تعذّر حفظ الفرصة. تحققي من الاتصال وصلاحيات الحساب.");
      return;
    }
    setForm(null);
    setSaved(true);
  }
  return (
    <div className="content-wrap">
      <div className="admin-banner">
        <Shield size={17} />
        إدارة الفرص · تُحفظ التغييرات وتظهر لجميع المستخدمين.
      </div>
      <PageIntro
        eyebrow="مساحة الإدارة"
        title="إدارة الفرص"
        description="إضافة الدورات والمسابقات وفرص التدريب والعمل وتعديلها وحذفها"
        action={<AddButton onClick={() => start()}>إضافة فرصة</AddButton>}
      />
      <details className="demo-note">
        <summary>نقل الفرص السابقة إلى الحساب</summary>
        <p>
          ينقل الفرص المحلية في هذا المتصفح، أو الفرص النموذجية إذا لم توجد
          بيانات محلية. لا يستبدل الفرص المحفوظة مسبقًا.
        </p>
        <Button
          disabled={importing || opportunitiesLoading}
          onClick={async () => {
            setImporting(true);
            setImportMessage("");
            const ok = await importOpportunities();
            setImportMessage(
              ok ? "تم نقل الفرص بنجاح" : "تعذّر إكمال النقل. حاولي مجددًا.",
            );
            setImporting(false);
          }}
        >
          {importing ? "جارٍ النقل..." : "نقل الفرص السابقة"}
        </Button>
        {importMessage && <p role="status">{importMessage}</p>}
      </details>
      {saved && (
        <p role="status" className="success-message">
          <Check size={16} />
          حُفظت الفرصة بنجاح
        </p>
      )}
      <div className="form-grid mb-6">
        <div className="search-input">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="البحث في الفرص"
            aria-label="البحث في فرص الإدارة"
          />
        </div>
        <select
          aria-label="نوع الفرصة"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">جميع الأنواع</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      {opportunitiesLoading ? (
        <p role="status">جارٍ تحميل الفرص...</p>
      ) : items.length ? (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>الفرصة</th>
                  <th>النوع</th>
                  <th>الجهة</th>
                  <th>آخر موعد</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>
                      <span className="type-label">{item.type}</span>
                    </td>
                    <td>{item.organization}</td>
                    <td>{formatDate(item.deadline)}</td>
                    <td>
                      <div className="admin-actions">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="تعديل الفرصة"
                          aria-label={`تعديل ${item.title}`}
                          disabled={meetingLinksLoading}
                          onClick={() => start(item)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="حذف الفرصة"
                          aria-label={`حذف ${item.title}`}
                          onClick={() => {
                            setDeleteError("");
                            setDeleting(item);
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-mobile-cards">
            {items.map((item) => (
              <Reveal as="article" className="admin-mobile-card" key={item.id}>
                <span className="type-label">{item.type}</span>
                <h3>{item.title}</h3>
                <p>
                  {item.organization} · {formatDate(item.deadline)}
                </p>
                <div className="admin-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meetingLinksLoading}
                    onClick={() => start(item)}
                  >
                    <Pencil size={15} />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeleteError("");
                      setDeleting(item);
                    }}
                  >
                    <Trash2 size={15} />
                    حذف
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="لا توجد فرص تطابق البحث"
          description="عدّلي البحث أو أضيفي فرصة جديدة"
        />
      )}
      <DemoNote />
      <Modal
        open={Boolean(form)}
        onClose={() => {
          if (!busy) setForm(null);
        }}
        description="تظهر الفرصة المحفوظة لجميع المستخدمين، ويقتصر رابط الدورة على الملتحقين بها."
        title={
          form && opportunities.some((o) => o.id === form.id)
            ? "تعديل الفرصة"
            : "إضافة فرصة"
        }
      >
        {form && (
          <form className="form-stack" noValidate onSubmit={submit}>
            <FormField label="عنوان الفرصة *">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </FormField>
            <div className="form-grid">
              <FormField label="نوع الفرصة *">
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as Category,
                      image: categoryMedia[e.target.value as Category],
                    })
                  }
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </FormField>
              <FormField
                label="الجهة المنظمة *"
                hint="استخدمي اسمًا خياليًا واضحًا في العرض"
              >
                <input
                  value={form.organization}
                  onChange={(e) =>
                    setForm({ ...form, organization: e.target.value })
                  }
                />
              </FormField>
            </div>
            <div className="form-grid">
              <FormField label="طريقة المشاركة *">
                <select
                  value={form.mode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mode: e.target.value === "حضوري" ? "حضوري" : "عن بُعد",
                    })
                  }
                >
                  <option>عن بُعد</option>
                  <option>حضوري</option>
                </select>
              </FormField>
              <FormField label="الموقع *">
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </FormField>
              <FormField label="المستوى *">
                <select
                  value={form.level}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      level: e.target.value as Opportunity["level"],
                    })
                  }
                >
                  <option>مبتدئ</option>
                  <option>متوسط</option>
                  <option>جميع المستويات</option>
                </select>
              </FormField>
              <FormField label="آخر موعد — اختياري">
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                />
              </FormField>
            </div>
            <FormField label="وصف الفرصة *">
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </FormField>
            <FormField label="المتطلبات *">
              <textarea
                value={form.requirements}
                onChange={(e) =>
                  setForm({ ...form, requirements: e.target.value })
                }
              />
            </FormField>
            {form.type !== "الدورات" && (
              <FormField
                label="الرابط الرسمي — اختياري"
                hint="لا تضيفي رابطًا غير موثّق؛ الطلبات تُقدّم خارج سُدى"
              >
                <input
                  dir="ltr"
                  type="url"
                  value={form.externalUrl || ""}
                  onChange={(e) =>
                    setForm({ ...form, externalUrl: e.target.value })
                  }
                  placeholder="https://"
                />
              </FormField>
            )}
            {form.type === "الدورات" && (
              <>
                <FormField
                  label="رابط اجتماع Zoom — اختياري"
                  hint="أضيفي رابطًا رسميًا موثّقًا فقط. لا يظهر للمستخدمة إلا بعد الالتحاق"
                >
                  <input
                    dir="ltr"
                    type="url"
                    value={form.zoomUrl || ""}
                    onChange={(e) =>
                      setForm({ ...form, zoomUrl: e.target.value })
                    }
                    placeholder="https://us02web.zoom.us/j/..."
                  />
                </FormField>
                <p className="demo-note">
                  الدورات مجانية، ولا يُنشأ رابط اجتماع افتراضي إذا لم تُقدّمه
                  الجهة
                </p>
              </>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              <Button type="submit" disabled={busy}>
                {busy ? "جارٍ الحفظ..." : "حفظ الفرصة"} <Check />
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
      <ConfirmDelete
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        name={deleting?.title || ""}
        busy={busy}
        error={deleteError}
        onConfirm={async () => {
          if (!deleting || busy) return;
          setBusy(true);
          setDeleteError("");
          if (await deleteOpportunity(deleting.id)) setDeleting(null);
          else setDeleteError("تعذّر حذف الفرصة. حاولي مجددًا.");
          setBusy(false);
        }}
      />
    </div>
  );
}
