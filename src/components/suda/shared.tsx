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
  Info,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
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
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </Reveal>
  );
}
export function DemoNote() {
  return (
    <Reveal as="p" className="demo-note">
      <Info size={14} />
      <span>
        نسخة تجريبية · جميع الفرص والجهات خيالية، والتغييرات محفوظة محليًا في
        المتصفح نفسه حتى إعادة ضبط البيانات.
      </span>
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
  return (
    <Reveal className="suda-opportunity-reveal" delay={delay}>
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
  const { session } = useDemo();
  if (!session || (admin && session.role !== "admin"))
    return (
      <div className="content-wrap">
        <PageIntro
          eyebrow={admin ? "مساحة الإدارة" : "مساحتك في سُدى"}
          title={admin ? "الدخول المخصص للإدارة" : "يلزم تسجيل الدخول"}
          description={
            admin
              ? "هذه الصفحة متاحة لوضع المشرفة التجريبي فقط. هذا تقييد للعرض، وليس حماية أمنية."
              : "سجّلي الدخول التجريبي لتكملي ملفك وتحتفظي بأعمالك ودوراتك في هذا المتصفح."
          }
        />
        <EmptyState
          title={admin ? "يلزم وضع المشرفة التجريبي" : "سجّلي الدخول للمتابعة"}
          description="لا تُنشأ حسابات حقيقية في هذه النسخة."
          action={
            <Button asChild>
              <Link to="/login">
                الدخول التجريبي <ArrowLeft />
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
          {description ||
            "التغييرات تجريبية ومحفوظة محليًا في هذا المتصفح فقط."}
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
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="تأكيد الحذف"
      description={`هل تريدين حذف «${name}»؟ لا يمكن التراجع عن هذه الخطوة بعد الحفظ.`}
    >
      <div className="form-actions">
        <Button variant="destructive" onClick={onConfirm}>
          حذف نهائي
        </Button>
        <Button variant="outline" onClick={onClose}>
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
