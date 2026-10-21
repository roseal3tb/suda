import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Info } from "lucide-react";
import { Reveal } from "@/components/suda/reveal";
import { Button } from "@/components/ui/button";
import { FormField, Wordmark } from "@/components/suda/shared";
import { toast } from "sonner";
import { fashionMedia } from "./mock-data";
import { useDemo } from "./demo-context";
function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "هذا البريد الإلكتروني مسجّل بالفعل. جرّبي تسجيل الدخول.";
    case "auth/invalid-email":
      return "البريد الإلكتروني غير صحيح.";
    case "auth/weak-password":
      return "كلمة المرور ضعيفة. اختاري كلمة مرور أقوى.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    case "auth/too-many-requests":
      return "محاولات كثيرة لتسجيل الدخول. انتظري قليلًا ثم حاولي مرة أخرى.";
    case "auth/network-request-failed":
      return "تعذّر الاتصال بالشبكة. تحققي من الإنترنت وحاولي مجددًا.";
    case "auth/operation-not-allowed":
      return "طريقة تسجيل الدخول غير مفعّلة في Firebase.";
    default:
      return "حدث خطأ غير متوقع. حاولي مرة أخرى.";
  }
}
export function AuthPage({ register = false }: { register?: boolean }) {
  const { signIn, signUp, session } = useDemo();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session && !busy) {
      void navigate({ to: "/", replace: true });
    }
  }, [session, busy, navigate]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (register && name.trim().length < 2) {
      setError("اكتبي اسمًا من حرفين على الأقل.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("أدخلي بريدًا إلكترونيًا بصيغة صحيحة.");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تتكوّن من ٦ أحرف على الأقل.");
      return;
    }
    if (register && password !== confirm) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    setBusy(true);
    try {
      if (register) {
        await signUp(name.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      setPassword("");
      setConfirm("");
      setError("");
      toast.success(
        register ? "تم إنشاء حسابك بنجاح" : "تم تسجيل الدخول بنجاح",
        {
          duration: 3000,
          style: {
            background: "#166534",
            color: "#ffffff",
            border: "1px solid #15803d",
          },
        },
      );
      await navigate({ to: "/", replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-layout">
      <Reveal className="auth-form-wrap">
        <Wordmark />
        <span className="eyebrow">
          {register ? "إنشاء حساب" : "تسجيل الدخول"}
        </span>
        <h1>{register ? "إنشاء ملفك في سُدى" : "الدخول إلى سُدى"}</h1>
        <p>
          {register
            ? "أنشئي حسابك لبدء بناء ملفك المهني ومعرض أعمالك"
            : "ادخلي إلى ملفك المهني والفرص التي التحقتِ بها"}
        </p>
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
                autoComplete="name"
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
              placeholder="designer@example.com"
              autoComplete="email"
            />
          </FormField>
          <FormField label="كلمة المرور">
            <div className="password-control">
              <input
                required
                aria-required="true"
                type={visible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="٦ أحرف على الأقل"
                autoComplete={register ? "new-password" : "current-password"}
              />
              <button
                type="button"
                aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                aria-pressed={visible}
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>
          {register && (
            <FormField label="تأكيد كلمة المرور">
              <input
                required
                aria-required="true"
                type={visible ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="أعيدي كتابة كلمة المرور"
                autoComplete="new-password"
              />
            </FormField>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy}>
            {busy
              ? "جارٍ المعالجة…"
              : register
                ? "إنشاء الحساب"
                : "تسجيل الدخول"}
            <ArrowLeft />
          </Button>
          <p className="demo-note">
            <Info size={14} />
            <span>
              حسابك محمي باستخدام Firebase Authentication. لا تشاركي كلمة مرورك
              مع أي شخص.
            </span>
          </p>
          <p className="text-sm">
            {register ? "لديك حساب بالفعل؟" : "خطوتك الأولى هنا؟"}{" "}
            <Link className="text-link" to={register ? "/login" : "/register"}>
              {register ? "تسجيل الدخول" : "إنشاء حساب"}
            </Link>
          </p>
        </form>
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
