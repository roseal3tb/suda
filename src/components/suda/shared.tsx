import { Link } from "@tanstack/react-router";
import {
  ArrowUpLeft,
  ArrowLeft,
  CalendarDays,
  MapPin,
  X,
  Scissors,
  BookOpen,
  Trophy,
  BriefcaseBusiness,
  Spool,
  Plus,
  Bookmark,
  BookmarkCheck,
  Clock,
} from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { editorialText } from "@/lib/editorial-text";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deadlineInfo,
  formatDate,
  opportunityImageAlt,
  type Opportunity,
} from "@/features/suda/mock-data";
import { useDemo } from "@/features/suda/demo-context";
export const categoryIcons = {
  الدورات: BookOpen,
  المسابقات: Trophy,
  التدريب: Scissors,
  "الفرص الوظيفية": BriefcaseBusiness,
};
export function Wordmark() {
  return (
    <span className="wordmark">
      <img
        src="/suda-logo-transparent.png"
        alt="سُدى"
        width={1582}
        height={1128}
      />
    </span>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Reveal as="header" className="page-intro">
      <div>
        <span className="eyebrow">
          <span className="tiny-line" />
          {eyebrow}
        </span>
        <h1 aria-label={title}>{editorialText(title)}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </Reveal>
  );
}
export function OpportunityCard({
  item,
  delay = 0,
}: {
  item: Opportunity;
  delay?: number;
}) {
  const Icon = categoryIcons[item.type];
  const deadline = deadlineInfo(item.deadline);
  return (
    <Reveal
      className={`suda-opportunity-reveal ${deadline.tone === "closed" ? "is-closed" : ""}`}
      delay={delay}
    >
      <SaveOpportunityButton id={item.id} title={item.title} floating />
      <Link
        to="/opportunities/$id"
        params={{ id: item.id }}
        className="opportunity-card"
      >
        <div className="card-image">
          <img
            src={item.image}
            alt={opportunityImageAlt[item.type]}
            loading="lazy"
            width={720}
            height={900}
          />
          <span className="category-tag">
            <Icon size={13} />
            {item.type}
          </span>
          {deadline.tone !== "open" && deadline.tone !== "flexible" && (
            <span className={`deadline-badge is-${deadline.tone}`}>
              <Clock size={12} aria-hidden="true" />
              {deadline.label}
            </span>
          )}
          <span className="image-arrow">
            <ArrowUpLeft size={19} />
          </span>
        </div>
        <div className="card-body">
          <span className="card-org">{item.organization}</span>
          <h3>{item.title}</h3>
          <div className="card-meta">
            <span>
              <MapPin size={13} />
              {item.location}
            </span>
            <span>{item.type === "الدورات" ? "مجانية" : item.level}</span>
          </div>
          <div className="card-bottom">
            <span>
              <CalendarDays size={13} />
              {item.deadline ? formatDate(item.deadline) : "موعد مرن"}
              {deadline.tone === "open" && (
                <em className="deadline-inline">· {deadline.label}</em>
              )}
            </span>
            <span>
              عرض التفاصيل <ArrowLeft size={14} />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
/** Bookmark toggle. Visitors are invited to sign in instead of failing silently. */
export function SaveOpportunityButton({
  id,
  title,
  floating = false,
}: {
  id: string;
  title: string;
  floating?: boolean;
}) {
  const { session, isSaved, toggleSaved, savedLoading } = useDemo();
  const [busy, setBusy] = useState(false);
  const saved = isSaved(id);
  if (!session)
    return floating ? null : (
      <Button asChild variant="outline">
        <Link to="/login">
          <Bookmark />
          سجّلي الدخول لحفظ الفرصة
        </Link>
      </Button>
    );
  const label = saved ? `إزالة ${title} من المحفوظة` : `حفظ ${title}`;
  return (
    <button
      type="button"
      className={`save-toggle ${floating ? "is-floating" : ""} ${saved ? "is-saved" : ""}`}
      aria-pressed={saved}
      aria-label={label}
      title={saved ? "محفوظة في حسابك" : "احفظي الفرصة"}
      disabled={busy || savedLoading}
      onClick={() => {
        setBusy(true);
        void toggleSaved(id).finally(() => setBusy(false));
      }}
    >
      {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
      {!floating && <span>{saved ? "محفوظة" : "احفظي الفرصة"}</span>}
    </button>
  );
}
/** Visually quiet placeholders that keep the layout stable while loading. */
export function LoadingCards({
  label,
  count = 3,
}: {
  label: string;
  count?: number;
}) {
  return (
    <div className="loading-cards" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <div className="loading-card" key={i} aria-hidden="true">
          <span className="shimmer loading-card-image" />
          <span className="shimmer loading-line" />
          <span className="shimmer loading-line is-short" />
        </div>
      ))}
    </div>
  );
}
/** Tag entry: type and press Enter or a comma; chips can be removed one by one.
 * Pending text is still read on submit so nothing typed is lost. */
export function TagInput({
  label,
  hint,
  tags,
  draft,
  onTagsChange,
  onDraftChange,
  suggestions = [],
  placeholder,
  error,
  max = 30,
}: {
  label: string;
  hint?: string;
  tags: string[];
  draft: string;
  onTagsChange: (tags: string[]) => void;
  onDraftChange: (draft: string) => void;
  suggestions?: string[];
  placeholder?: string;
  error?: string;
  max?: number;
}) {
  const id = useId();
  const add = (values: string[]) => {
    const next = [...tags];
    for (const value of values.map((v) => v.trim()).filter(Boolean))
      if (!next.includes(value) && next.length < max) next.push(value);
    onTagsChange(next);
  };
  const available = suggestions.filter((s) => !tags.includes(s)).slice(0, 8);
  return (
    <div className={`form-field tag-field ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="tag-input">
        <input
          id={id}
          value={draft}
          placeholder={tags.length ? "أضيفي المزيد…" : placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-hint`}
          onChange={(e) => {
            const value = e.target.value;
            if (/[,،\n]/.test(value)) {
              const parts = value.split(/[,،\n]/);
              const rest = parts.pop() ?? "";
              add(parts);
              onDraftChange(rest);
            } else onDraftChange(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              e.preventDefault();
              add([draft]);
              onDraftChange("");
            } else if (e.key === "Backspace" && !draft && tags.length) {
              onTagsChange(tags.slice(0, -1));
            }
          }}
        />
        {tags.map((tag) => (
          <span className="tag-chip" key={tag}>
            {tag}
            <button
              type="button"
              aria-label={`إزالة ${tag}`}
              onClick={() => onTagsChange(tags.filter((t) => t !== tag))}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <small id={`${id}-hint`}>
        {error ? <span className="field-error">{error}</span> : hint}
      </small>
      {available.length > 0 && (
        <div
          className="tag-suggestions"
          role="group"
          aria-label="اقتراحات للإضافة"
        >
          {available.map((s) => (
            <button type="button" key={s} onClick={() => add([s])}>
              <Plus size={12} />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
/** Split free text the same way the tag input does. */
export function splitTags(text: string): string[] {
  return text
    .split(/[,،\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Reveal className="empty-state">
      <Spool size={38} strokeWidth={1} />
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </Reveal>
  );
}
export function MemberGate({
  children,
  admin = false,
}: {
  children: ReactNode;
  admin?: boolean;
}) {
  const { session, authLoading } = useDemo();
  if (authLoading)
    return (
      <div className="content-wrap">
        <p role="status">جارٍ التحقق من الحساب...</p>
      </div>
    );
  if (admin && session && session.role !== "admin")
    return (
      <div className="content-wrap">
        <EmptyState
          title="الوصول غير مسموح"
          description="هذه الصفحة مخصصة لحساب الإدارة"
        />
      </div>
    );
  if (!session)
    return (
      <div className="content-wrap">
        <PageIntro
          eyebrow="مساحتك في سُدى"
          title="يلزم تسجيل الدخول"
          description="سجّلي الدخول للوصول إلى ملفك المهني وأعمالك ودوراتك المحفوظة في حسابك"
        />
        <EmptyState
          title="سجّلي الدخول للمتابعة"
          description="استخدمي حسابك، أو أنشئي حسابًا جديدًا"
          action={
            <Button asChild>
              <Link to="/login">
                تسجيل الدخول <ArrowLeft />
              </Link>
            </Button>
          }
        />
      </div>
    );
  return <>{children}</>;
}
export function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent dir="rtl" className="suda-modal">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {description || "راجعي البيانات ثم احفظي التغييرات"}
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
export function ConfirmDelete({
  open,
  onClose,
  onConfirm,
  name,
  error,
  busy = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
  error?: string;
  busy?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={() => {
        if (!busy) onClose();
      }}
      title="تأكيد الحذف"
      description={`هل تريدين حذف «${name}»؟ لا يمكن التراجع عن هذه الخطوة بعد الحفظ`}
    >
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions" aria-busy={busy}>
        <Button variant="destructive" onClick={onConfirm} disabled={busy}>
          {busy ? "جارٍ الحذف…" : "حذف نهائي"}
        </Button>
        <Button variant="outline" onClick={onClose} disabled={busy}>
          إلغاء
        </Button>
      </div>
    </Modal>
  );
}
export function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button onClick={onClick}>
      <Plus />
      {children}
    </Button>
  );
}
