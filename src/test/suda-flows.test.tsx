import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { DemoProvider } from "@/features/suda/demo-context";
const routing = vi.hoisted(() => ({
  navigate: vi.fn(),
  id: "pattern",
  search: {} as { category?: string },
}));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({
    options,
    useParams: () => ({ id: routing.id }),
    useSearch: () => routing.search,
  }),
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a {...props} href={to}>
      {children}
    </a>
  ),
  useNavigate: () => routing.navigate,
  useRouterState: () => "/profile",
}));
vi.mock("@/components/suda/reveal", () => ({
  Reveal: ({
    children,
    as: Tag = "div",
    className,
  }: {
    children: ReactNode;
    as?: "div" | "article" | "section" | "header";
    className?: string;
  }) => <Tag className={className}>{children}</Tag>,
  WordsReveal: ({ text }: { text: string }) => <span>{text}</span>,
}));
vi.mock("@/components/suda/intro", () => ({ Intro: () => null }));
vi.mock("@/components/suda/page-motion", () => ({ PageThread: () => null }));
vi.mock("@/components/suda/scroll-progress", () => ({
  ScrollProgress: () => null,
}));
import { AuthPage } from "@/features/suda/auth-page";
import { Shell } from "@/components/suda/shell";
import { Route as ProfileRoute } from "@/routes/profile";
import { Route as PortfolioRoute } from "@/routes/portfolio";
import { Route as DetailsRoute } from "@/routes/opportunities.$id";
import { Route as LearningRoute } from "@/routes/learning";
import { Route as AdminRoute } from "@/routes/admin";
import { Route as OpportunitiesRoute } from "@/routes/opportunities.index";
import { STORE_KEYS, readStore, userStoreKey } from "@/features/suda/storage";
import type { Profile, Work, Enrollment } from "@/features/suda/mock-data";
const ProfilePage = ProfileRoute.options.component!;
const PortfolioPage = PortfolioRoute.options.component!;
const DetailPage = DetailsRoute.options.component!;
const LearningPage = LearningRoute.options.component!;
const AdminPage = AdminRoute.options.component!;
const OpportunitiesPage = OpportunitiesRoute.options.component!;
function mount(children: ReactNode) {
  return render(<DemoProvider>{children}</DemoProvider>);
}
function startDemo(admin = false) {
  const view = mount(<AuthPage />);
  fireEvent.click(
    screen.getByRole("button", {
      name: admin ? "تجربة حساب مشرفة" : "تجربة حساب مصممة",
    }),
  );
  expect(screen.getByRole("status")).toHaveTextContent(
    "تم الدخول التجريبي بنجاح",
  );
  view.unmount();
}
function change(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label, { exact: false }), {
    target: { value },
  });
}
function submit(name: RegExp | string) {
  fireEvent.click(screen.getByRole("button", { name }));
}
describe("Sprint 1 frontend user journeys (real provider and localStorage)", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    routing.navigate.mockClear();
    routing.id = "pattern";
    routing.search = {};
  });
  afterEach(cleanup);
  it("validates registration, toggles visibility and creates only a local mock session", () => {
    mount(<AuthPage register />);
    submit("إنشاء جلسة تجريبية");
    expect(screen.getByRole("alert")).toHaveTextContent("حرفين");
    change("الاسم", "مصممة اختبار");
    change("البريد الإلكتروني", "wrong");
    submit("إنشاء جلسة تجريبية");
    expect(screen.getByRole("alert")).toHaveTextContent("بريدًا");
    change("البريد الإلكتروني", "qa@example.test");
    change("كلمة المرور التجريبية", "123");
    submit("إنشاء جلسة تجريبية");
    expect(screen.getByRole("alert")).toHaveTextContent("٦ أحرف");
    change("كلمة المرور التجريبية", "fictional");
    change("تأكيد كلمة المرور", "different");
    submit("إنشاء جلسة تجريبية");
    expect(screen.getByRole("alert")).toHaveTextContent("غير متطابقتين");
    submit("إظهار كلمة المرور");
    expect(screen.getByLabelText(/كلمة المرور التجريبية/)).toHaveAttribute(
      "type",
      "text",
    );
    change("تأكيد كلمة المرور", "fictional");
    submit("إنشاء جلسة تجريبية");
    expect(screen.getByRole("status")).toHaveTextContent("لم يُنشأ حساب حقيقي");
    expect(readStore(STORE_KEYS.session, null)).toMatchObject({
      name: "مصممة اختبار",
      email: "qa@example.test",
      role: "user",
    });
    expect(localStorage.getItem("suda:v2:session")).not.toContain("fictional");
    submit(/الانتقال إلى/);
    expect(routing.navigate).toHaveBeenCalledWith({ to: "/profile" });
  });
  it("saves professional information and renders it after provider remount", () => {
    startDemo();
    let view = mount(<ProfilePage />);
    submit("إنشاء ملفي المهني");
    change("المهارات", "رسم، باترون");
    change("الاهتمامات", "الأقمشة، التراث");
    change("الخبرات", "مشروع تصميم جامعي");
    submit(/حفظ الملف/);
    expect(screen.getByRole("status")).toHaveTextContent("حُفظ ملفك");
    view.unmount();
    view = mount(<ProfilePage />);
    expect(screen.getByText("مشروع تصميم جامعي")).toBeInTheDocument();
    expect(
      readStore<Profile | null>(
        userStoreKey("designer@example.test", "profile"),
        null,
      )?.skills,
    ).toEqual(["رسم", "باترون"]);
  });
  it("validates portfolio input, adds a work, persists it, then edits its description", () => {
    startDemo();
    let view = mount(<PortfolioPage />);
    submit("إضافة أول عمل");
    submit(/حفظ العمل/);
    expect(screen.getByRole("alert")).toHaveTextContent("عنوان العمل");
    change("عنوان العمل", "تصميم دراسي");
    change("وصف العمل", "دراسة في تشكيل القماش");
    submit(/حفظ العمل/);
    expect(
      screen.getByRole("heading", { name: "تصميم دراسي" }),
    ).toBeInTheDocument();
    view.unmount();
    view = mount(<PortfolioPage />);
    submit("تعديل تصميم دراسي");
    change("وصف العمل", "باترون وتنفيذ أولي");
    submit(/حفظ العمل/);
    expect(screen.getByText("باترون وتنفيذ أولي")).toBeInTheDocument();
    expect(
      readStore<Work[]>(userStoreKey("designer@example.test", "portfolio"), []),
    ).toHaveLength(1);
  });
  it("enrolls once, updates progress, records an achievement and logs out to the member gate", () => {
    startDemo();
    let view = mount(<DetailPage />);
    submit("الالتحاق مجانًا");
    expect(screen.getByText(/أنتِ ملتحقة/)).toBeInTheDocument();
    expect(screen.getByText(/لم تُرفق الجهة/)).toBeInTheDocument();
    view.unmount();
    view = mount(<LearningPage />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "65" } });
    submit(/حفظ التقدّم/);
    change("إنجاز جديد", "أنجزت الباترون");
    submit("إضافة إنجاز");
    expect(screen.getByText("أنجزت الباترون")).toBeInTheDocument();
    expect(
      readStore<Enrollment[]>(
        userStoreKey("designer@example.test", "enrollments"),
        [],
      ),
    ).toEqual([
      { courseId: "pattern", progress: 65, achievements: ["أنجزت الباترون"] },
    ]);
    view.unmount();
    view = mount(
      <Shell>
        <ProfilePage />
      </Shell>,
    );
    fireEvent.click(
      within(document.querySelector<HTMLElement>(".nav-account")!).getByRole(
        "button",
        { name: "تسجيل الخروج" },
      ),
    );
    expect(readStore(STORE_KEYS.session, "missing")).toBeNull();
    expect(routing.navigate).toHaveBeenCalledWith({
      to: "/login",
      replace: true,
    });
    expect(
      screen.getByRole("heading", { name: "يلزم تسجيل الدخول" }),
    ).toBeInTheDocument();
  });
  it("adds and edits an admin opportunity, supports cancel, then confirms deletion", () => {
    startDemo(true);
    mount(<AdminPage />);
    submit("إضافة فرصة");
    submit(/حفظ الفرصة/);
    expect(screen.getByRole("alert")).toHaveTextContent("أكملي");
    change("عنوان الفرصة", "فرصة اختبار");
    change("الجهة المنظمة", "مرسم تجريبي");
    change("وصف الفرصة", "دورة رسم أزياء");
    change("المتطلبات", "أدوات رسم");
    submit(/حفظ الفرصة/);
    expect(screen.getByRole("status")).toHaveTextContent("حُفظت الفرصة");
    submit("تعديل فرصة اختبار");
    change("عنوان الفرصة", "فرصة معدلة");
    submit(/حفظ الفرصة/);
    submit("حذف فرصة معدلة");
    submit("إلغاء");
    expect(
      screen.getByRole("button", { name: "حذف فرصة معدلة" }),
    ).toBeInTheDocument();
    submit("حذف فرصة معدلة");
    submit("حذف نهائي");
    expect(
      screen.queryByRole("button", { name: "حذف فرصة معدلة" }),
    ).not.toBeInTheDocument();
  });
  it("filters all four categories, combines filters, shows no results, and resets", () => {
    mount(<OpportunitiesPage />);
    for (const category of [
      "الدورات",
      "المسابقات",
      "التدريب",
      "الفرص الوظيفية",
    ]) {
      submit(category);
      expect(screen.getByText("٢ نتائج تجريبية")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: category })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    }
    submit("الدورات");
    change("البحث عن الفرص", "الباترون");
    change("طريقة المشاركة", "عن بُعد");
    expect(screen.getByText("١ نتائج تجريبية")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "إزالة فلتر نوع الفرصة: الدورات" }),
    ).toBeInTheDocument();
    submit("إزالة فلتر طريقة المشاركة: عن بُعد");
    expect(
      screen.queryByRole("button", {
        name: "إزالة فلتر طريقة المشاركة: عن بُعد",
      }),
    ).not.toBeInTheDocument();
    change("طريقة المشاركة", "عن بُعد");
    change("الموقع", "الرياض");
    expect(
      screen.getByRole("heading", { name: "لا توجد نتائج" }),
    ).toBeInTheDocument();
    submit("مسح الفلاتر");
    expect(screen.getByText("٨ نتائج تجريبية")).toBeInTheDocument();
  });
  it("moves keyboard focus into the compact menu and returns it on Escape", () => {
    mount(
      <Shell>
        <p>محتوى</p>
      </Shell>,
    );
    fireEvent.click(screen.getByRole("button", { name: "فتح القائمة" }));
    const nav = screen.getByRole("navigation", { name: "التنقل الرئيسي" });
    expect(within(nav).getByRole("link", { name: "الرئيسية" })).toHaveFocus();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "فتح القائمة" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "فتح القائمة" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
  it("reports local storage failure rather than claiming login success", () => {
    mount(<AuthPage />);
    const storage = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota");
      });
    submit("تجربة حساب مصممة");
    expect(screen.getByRole("alert")).toHaveTextContent("تعذّر حفظ الجلسة");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    storage.mockRestore();
  });
});
