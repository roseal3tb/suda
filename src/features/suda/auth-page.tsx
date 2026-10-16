import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Info } from "lucide-react";
import { Reveal } from "@/components/suda/reveal";
import { Button } from "@/components/ui/button";
import { FormField, Wordmark } from "@/components/suda/shared";
import { fashionMedia } from "./mock-data";
import { useDemo } from "./demo-context";

export function AuthPage({ register = false }: { register?: boolean }) {
  const { login, session } = useDemo();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  function begin(name: string, email: string, role: "user" | "admin") {
    if (!login(name, email, role)) {
      setError("تعذّر حفظ الجلسة التجريبية في المتصفح");
      return;
    }
    setPassword("");
    setConfirm("");
    setError("");
    setSuccess(true);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (register && name.trim().length < 2) {
      setError("اكتبي اسمًا من حرفين على الأقل");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("أدخلي بريدًا إلكترونيًا بصيغة صحيحة");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور التجريبية يجب أن تتكوّن من ٦ أحرف على الأقل");
      return;
    }
    if (register && password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setBusy(true);
    begin(
      register
        ? name.trim()
        : role === "admin"
          ? "المشرفة التجريبية"
          : "المصممة التجريبية",
      email,
      register ? "user" : role,
    );
    setBusy(false);
  }

  return (
    <section className="auth-layout">
      <Reveal className="auth-form-wrap">
        <Wordmark />
        <span className="eyebrow">
          {register ? "إنشاء حساب تجريبي" : "تسجيل الدخول"}
        </span>
        <h1>{register ? "إنشاء ملفك في سُدى" : "الدخول إلى سُدى"}</h1>
        <p>
          {register
            ? "أنشئي جلسة تجريبية لعرض الملف المهني ومعرض الأعمال"
            : "ادخلي إلى ملفك المهني والفرص التي التحقتِ بها"}
        </p>
        {success || session ? (
          <div className="form-stack">
            <p className="success-message" role="status">
              تم الدخول التجريبي بنجاح. لم يُنشأ حساب حقيقي ولم تُرسل بياناتك
              إلى أي خدمة
            </p>
            <Button
              onClick={() =>
                navigate({
                  to: session?.role === "admin" ? "/admin" : "/profile",
                })
              }
            >
              الانتقال إلى{" "}
              {session?.role === "admin" ? "إدارة الفرص" : "ملفي المهني"}{" "}
              <ArrowLeft />
            </Button>
          </div>
        ) : (
          <form
            className="auth-form"
            noValidate
            onSubmit={submit}
            aria-busy={busy}
          >
            {register && (
              <FormField label="الاسم">
                <input
                  required
                  aria-required="true"
                  value={name}
                  maxLength={100}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اسمك كما تحبين أن يظهر"
                  autoComplete="off"
                />
              </FormField>
            )}
            <FormField label="البريد الإلكتروني">
              <input
                required
                aria-required="true"
                dir="ltr"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="designer@example.test"
                autoComplete="off"
              />
            </FormField>
            <FormField
              label="كلمة المرور التجريبية"
              hint="استخدمي بيانات خيالية، وليس كلمة مرورك الحقيقية"
            >
              <div className="password-control">
                <input
                  required
                  aria-required="true"
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="٦ أحرف على الأقل"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  aria-label={
                    visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                  aria-pressed={visible}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </FormField>
            {register ? (
              <FormField label="تأكيد كلمة المرور">
                <input
                  required
                  aria-required="true"
                  type={visible ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="أعيدي كتابة كلمة المرور التجريبية"
                  autoComplete="new-password"
                />
              </FormField>
            ) : (
              <FormField label="وضع العرض التجريبي">
                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value === "admin" ? "admin" : "user")
                  }
                >
                  <option value="user">مصممة — حساب مستخدمة تجريبي</option>
                  <option value="admin">مشرفة — إدارة فرص تجريبية</option>
                </select>
              </FormField>
            )}
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <Button type="submit" disabled={busy}>
              {busy
                ? "جارٍ إعداد الجلسة…"
                : register
                  ? "إنشاء جلسة تجريبية"
                  : "تسجيل الدخول التجريبي"}
              <ArrowLeft />
            </Button>
            <p className="demo-note">
              <Info size={14} />
              <span>
                عرض واجهات فقط. أي بريد صحيح وكلمة مرور تجريبية من ٦ أحرف تعمل؛
                لا توجد مصادقة أو حماية فعلية للأدوار
              </span>
            </p>
            {!register && (
              <div className="demo-shortcuts" aria-label="حسابات جاهزة للعرض">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    begin("المصممة التجريبية", "designer@example.test", "user")
                  }
                >
                  تجربة حساب مصممة
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    begin("المشرفة التجريبية", "admin@example.test", "admin")
                  }
                >
                  تجربة حساب مشرفة
                </Button>
              </div>
            )}
            <p className="text-sm">
              {register ? "لديك جلسة بالفعل؟" : "خطوتك الأولى هنا؟"}{" "}
              <Link
                className="text-link"
                to={register ? "/login" : "/register"}
              >
                {register ? "تسجيل الدخول" : "إنشاء حساب تجريبي"}
              </Link>
            </p>
          </form>
        )}
      </Reveal>
      <Reveal className="auth-visual" delay={0.18}>
        <img
          src={register ? fashionMedia.register.src : fashionMedia.login.src}
          alt={register ? fashionMedia.register.alt : fashionMedia.login.alt}
          width={1000}
          height={1250}
        />
        <div>
          <span className="eyebrow">من الفكرة إلى التفاصيل</span>
          <h2>مساحة لبدايتك المهنية</h2>
          <p>ملف يجمع مهاراتك، ومعرض يحكي قصتك مع التصميم</p>
        </div>
      </Reveal>
    </section>
  );
}
