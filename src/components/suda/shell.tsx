import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Menu, X, LogOut, UserRound, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark, Modal } from "./shared";
import { Intro } from "./intro";
import { PageThread } from "./page-motion";
import { ScrollProgress } from "./scroll-progress";
import { useDemo } from "@/features/suda/demo-context";
const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/opportunities", label: "الفرص" },
  { to: "/profile", label: "الملف المهني" },
  { to: "/portfolio", label: "معرض الأعمال" },
  { to: "/learning", label: "رحلتي التعليمية" },
  { to: "/inspiration", label: "إلهام سعودي" },
] as const;
export function Shell({ children }: { children: React.ReactNode }) {
  const { session, signOutUser, resetDemo, storageError, clearStorageError } =
    useDemo();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    setSignOutError("");
    try {
      await signOutUser();
      setOpen(false);
      await navigate({ to: "/login", replace: true });
    } catch (error) {
      console.error("Firebase sign-out failed:", error);
      setSignOutError("تعذّر تسجيل الخروج. تحققي من الاتصال وحاولي مجددًا.");
    } finally {
      setSigningOut(false);
    }
  }
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 980px)").matches) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    navigation.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuToggle.current?.focus();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  useEffect(() => {
    if (!resetDone) return;
    const t = setTimeout(() => setResetDone(false), 4000);
    return () => clearTimeout(t);
  }, [resetDone]);
  return (
    <>
      <Intro />
      <ScrollProgress />
      <a href="#main-content" className="skip-link">
        تخطّي إلى المحتوى
      </a>
      <button
        type="button"
        className={`mobile-nav-backdrop ${open ? "is-visible" : ""}`}
        aria-label="إغلاق قائمة التنقل"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => {
          setOpen(false);
          menuToggle.current?.focus();
        }}
      />
      <header
        className={`site-header ${scrolled ? "is-scrolled" : ""} ${pathname === "/" ? "is-home" : ""}`}
      >
        <div className="nav-wrap">
          <Link
            to="/"
            className="brand-link"
            aria-label="سُدى، الصفحة الرئيسية"
            onClick={() => setOpen(false)}
          >
            <Wordmark />
          </Link>
          <nav
            id="suda-primary-navigation"
            ref={navigation}
            className={`main-nav ${open ? "is-open" : ""}`}
            aria-label="التنقل الرئيسي"
          >
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            {session?.role === "admin" && (
              <Link to="/admin" onClick={() => setOpen(false)}>
                إدارة الفرص
              </Link>
            )}
            <div className="mobile-nav-account">
              {session ? (
                <>
                  <Link
                    to={session.role === "admin" ? "/admin" : "/profile"}
                    className="mobile-account-name"
                    onClick={() => setOpen(false)}
                    aria-label="الانتقال إلى حسابي"
                  >
                    <UserRound size={18} />
                    {session.name}
                  </Link>
                  <button
                    type="button"
                    className="mobile-logout"
                    onClick={() => void handleSignOut()}
                    disabled={signingOut}
                  >
                    <LogOut size={18} />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <UserRound size={18} />
                    تسجيل الدخول
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>
          </nav>
          <div className="nav-account">
            {session ? (
              <>
                <Link
                  to={session.role === "admin" ? "/admin" : "/profile"}
                  className="session-name account-profile-link"
                  aria-label="الانتقال إلى حسابي"
                >
                  <UserRound size={15} />
                  {session.name}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="desktop-account-button"
                  title="تسجيل الخروج"
                  aria-label="تسجيل الخروج"
                  onClick={() => void handleSignOut()}
                    disabled={signingOut}
                >
                  <LogOut />
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" className="login-button">
                <Link to="/login">
                  تسجيل الدخول <ArrowLeft />
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              ref={menuToggle}
              type="button"
              aria-controls="suda-primary-navigation"
              aria-expanded={open}
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>
      {signOutError && (
        <div role="alert" className="global-alert">
          <span>{signOutError}</span>
          <button onClick={() => setSignOutError("")} aria-label="إغلاق التنبيه">
            <X size={15} />
          </button>
        </div>
      )}
      {storageError && (
        <div role="alert" className="global-alert">
          <span>{storageError}</span>
          <button onClick={clearStorageError} aria-label="إغلاق التنبيه">
            <X size={15} />
          </button>
        </div>
      )}
      {resetDone && (
        <div role="status" className="global-alert is-success">
          <span>أُعيدت البيانات التجريبية إلى حالتها الأصلية</span>
        </div>
      )}
      <main
        id="main-content"
        className={
          pathname.startsWith("/opportunities")
            ? "suda-threaded-page"
            : undefined
        }
      >
        {pathname.startsWith("/opportunities") && (
          <PageThread pathname={pathname} />
        )}{" "}
        {children}
      </main>
      <footer className="site-footer suda-footer" aria-label="تذييل سُدى">
        <div className="suda-footer-main">
          <Link
            to="/"
            className="suda-footer-logo"
            aria-label="سُدى — العودة للرئيسية"
          >
            <Wordmark />
          </Link>
          <p className="suda-footer-motto">رُؤى تُنسَج</p>
          <span className="suda-footer-rule" aria-hidden="true" />
        </div>
        <div className="suda-footer-utility">
          <p>© ٢٠٢٦ سُدى · جميع الحقوق محفوظة</p>
          <span className="suda-footer-project">
            مشروع جامعي قيد التطوير · الحسابات عبر Firebase والفرص المعروضة تجريبية
          </span>
          <div className="suda-footer-utilities">
            <details className="suda-photo-sources">
              <summary>عن الصور والمقاطع</summary>
              <div className="suda-photo-sources-content">
                <p>
                  مواد بصرية مقدّمة للمشروع لتوضيح حرفة تصميم الأزياء. لا تمثّل
                  أعمال المستخدمات أو الجهات التجريبية، ولا تعني شراكة مع
                  المصممات
                </p>
              </div>
            </details>
            <button
              type="button"
              className="suda-reset"
              onClick={() => setResetting(true)}
            >
              <RotateCcw size={13} />
              إعادة ضبط البيانات
            </button>
          </div>
        </div>
      </footer>
      <Modal
        open={resetting}
        onClose={() => setResetting(false)}
        title="إعادة ضبط البيانات التجريبية"
        description="ستُستعاد الفرص الأصلية، ويُمسح الملف المهني ومعرض الأعمال والالتحاقات والتقدّم المحفوظ محليًا"
      >
        <div className="form-actions">
          <Button
            variant="destructive"
            onClick={() => {
              if (resetDemo()) {
                setResetting(false);
                setResetDone(true);
              }
            }}
          >
            تأكيد إعادة الضبط
          </Button>
          <Button variant="outline" onClick={() => setResetting(false)}>
            إلغاء
          </Button>
        </div>
      </Modal>
    </>
  );
}
