import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { cloud, resetCloud, signedIn } from "./firebase-double";
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
import { STORE_KEYS, readStore } from "@/features/suda/storage";
import type { Opportunity } from "@/features/suda/mock-data";
const ProfilePage = ProfileRoute.options.component!;
const PortfolioPage = PortfolioRoute.options.component!;
const DetailPage = DetailsRoute.options.component!;
const LearningPage = LearningRoute.options.component!;
const AdminPage = AdminRoute.options.component!;
const OpportunitiesPage = OpportunitiesRoute.options.component!;
function mount(children: ReactNode) {
  return render(<DemoProvider>{children}</DemoProvider>);
}
function change(label: string, value: string) {
  fireEvent.change(
    screen
      .getAllByLabelText(label, { exact: false })
      .find((element) => element.matches("input, textarea, select"))!,
    {
      target: { value },
    },
  );
}
function submit(name: RegExp | string) {
  fireEvent.click(screen.getByRole("button", { name }));
}
async function settled() {
  await waitFor(() =>
    expect(screen.queryByText(/جارٍ تحميل/)).not.toBeInTheDocument(),
  );
}
describe("Sprint 1 journeys with the real provider and an isolated Firebase SDK double", () => {
  beforeEach(() => {
    resetCloud();
    localStorage.clear();
    sessionStorage.clear();
    routing.navigate.mockClear();
    routing.id = "pattern";
    routing.search = {};
  });
  afterEach(cleanup);

  it("validates registration, creates an authenticated account and logs out", async () => {
    let view = mount(<AuthPage register />);
    submit("إنشاء الحساب");
    expect(screen.getByRole("alert")).toHaveTextContent("حرفين");
    change("الاسم", "مصممة اختبار");
    change("البريد الإلكتروني", "wrong");
    submit("إنشاء الحساب");
    expect(screen.getByRole("alert")).toHaveTextContent("بريدًا");
    change("البريد الإلكتروني", "designer@example.test");
    change("كلمة المرور", "123456");
    change("تأكيد كلمة المرور", "different");
    submit("إنشاء الحساب");
    expect(screen.getByRole("alert")).toHaveTextContent("غير متطابقتين");
    change("تأكيد كلمة المرور", "123456");
    submit("إنشاء الحساب");
    await waitFor(() =>
      expect(cloud.auth.currentUser?.displayName).toBe("مصممة اختبار"),
    );
    expect(localStorage.getItem("suda:v2:session")).toBeNull();
    view.unmount();
    view = mount(
      <Shell>
        <ProfilePage />
      </Shell>,
    );
    await settled();
    fireEvent.click(
      within(document.querySelector<HTMLElement>(".nav-account")!).getByRole(
        "button",
        { name: "تسجيل الخروج" },
      ),
    );
    await screen.findByRole("heading", { name: "يلزم تسجيل الدخول" });
    expect(cloud.auth.currentUser).toBeNull();
    expect(routing.navigate).toHaveBeenCalledWith({
      to: "/login",
      replace: true,
    });
  });

  it("reports invalid credentials and signs in with valid credentials", async () => {
    mount(<AuthPage />);
    change("البريد الإلكتروني", "designer@example.test");
    change("كلمة المرور", "123456");
    cloud.signInFailure = true;
    submit("تسجيل الدخول");
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("غير صحيحة"),
    );
    expect(cloud.auth.currentUser).toBeNull();
    cloud.signInFailure = false;
    submit("تسجيل الدخول");
    await waitFor(() => expect(cloud.auth.currentUser?.uid).toBe("designer-a"));
  });

  it("saves and reloads a profile under the authenticated UID", async () => {
    signedIn();
    let view = mount(<ProfilePage />);
    await settled();
    submit("إنشاء ملفي المهني");
    change("المهارات", "رسم، باترون");
    change("الاهتمامات", "الأقمشة، التراث");
    change("الخبرات", "مشروع تصميم جامعي");
    submit(/حفظ الملف/);
    await screen.findByText("مشروع تصميم جامعي");
    expect(cloud.records.get("users/designer-a")).toMatchObject({
      profile: { skills: ["رسم", "باترون"] },
    });
    view.unmount();
    view = mount(<ProfilePage />);
    await screen.findByText("مشروع تصميم جامعي");
    view.unmount();
    signedIn("designer-b");
    mount(<ProfilePage />);
    await settled();
    expect(screen.queryByText("مشروع تصميم جامعي")).not.toBeInTheDocument();
  });

  it("validates portfolio titles, persists metadata in works, edits and deletes with confirmation", async () => {
    signedIn();
    let view = mount(<PortfolioPage />);
    await settled();
    submit("إضافة أول عمل");
    submit(/حفظ العمل/);
    expect(screen.getByRole("alert")).toHaveTextContent("عنوان العمل");
    change("عنوان العمل", "تصميم دراسي");
    change("وصف العمل", "دراسة في تشكيل القماش");
    submit(/حفظ العمل/);
    await screen.findByRole("heading", { name: "تصميم دراسي" });
    const stored = [...cloud.records.entries()].find(([path]) =>
      path.startsWith("users/designer-a/works/"),
    );
    expect(stored?.[1]).toEqual({
      id: expect.any(String),
      title: "تصميم دراسي",
      description: "دراسة في تشكيل القماش",
    });
    view.unmount();
    view = mount(<PortfolioPage />);
    await screen.findByRole("heading", { name: "تصميم دراسي" });
    submit("تعديل تصميم دراسي");
    change("عنوان العمل", "   ");
    submit(/حفظ العمل/);
    expect(screen.getByRole("alert")).toHaveTextContent("عنوان العمل");
    change("عنوان العمل", "تصميم دراسي");
    change("وصف العمل", "باترون وتنفيذ أولي");
    submit(/حفظ العمل/);
    await screen.findByText("باترون وتنفيذ أولي");
    submit("حذف تصميم دراسي");
    submit("إلغاء");
    expect(cloud.records.has(stored![0])).toBe(true);
    submit("حذف تصميم دراسي");
    submit("حذف نهائي");
    await waitFor(() => expect(cloud.records.has(stored![0])).toBe(false));
    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: "تصميم دراسي" }),
      ).not.toBeInTheDocument(),
    );
  });

  it("keeps a failed portfolio save open and does not claim success", async () => {
    signedIn();
    mount(<PortfolioPage />);
    await settled();
    submit("إضافة أول عمل");
    change("عنوان العمل", "عمل لم يُحفظ");
    change("وصف العمل", "وصف");
    cloud.failure = true;
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    submit(/حفظ العمل/);
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("تعذّر حفظ"),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      [...cloud.records.keys()].some((path) => path.includes("/works/")),
    ).toBe(false);
    log.mockRestore();
  });

  it("persists enrollment, progress and achievements without resetting an existing enrollment", async () => {
    signedIn();
    let view = mount(<DetailPage />);
    await waitFor(() =>
      expect(screen.queryByText(/جارٍ التحقق/)).not.toBeInTheDocument(),
    );
    submit("الالتحاق مجانًا");
    await screen.findByText(/أنتِ ملتحقة/);
    expect(screen.getByText(/لم تُرفق الجهة/)).toBeInTheDocument();
    view.unmount();
    view = mount(<LearningPage />);
    await screen.findByRole("slider");
    fireEvent.change(screen.getByRole("slider"), { target: { value: "65" } });
    submit(/حفظ التقدّم/);
    await waitFor(() =>
      expect(
        cloud.records.get("users/designer-a/enrollments/pattern")?.["progress"],
      ).toBe(65),
    );
    change("إنجاز جديد", "أنجزت الباترون");
    submit("إضافة إنجاز");
    await screen.findByText("أنجزت الباترون");
    view.unmount();
    view = mount(<DetailPage />);
    await screen.findByText(/أنتِ ملتحقة/);
    expect(cloud.records.get("users/designer-a/enrollments/pattern")).toEqual({
      courseId: "pattern",
      progress: 65,
      achievements: ["أنجزت الباترون"],
    });
    expect(
      screen.queryByRole("button", { name: "الالتحاق مجانًا" }),
    ).not.toBeInTheDocument();
  });

  it("opens and closes an explicit Admin demonstration without granting a Firebase identity", () => {
    const view = mount(<AdminPage />);
    expect(
      screen.queryByRole("button", { name: "إضافة فرصة" }),
    ).not.toBeInTheDocument();
    submit("فتح لوحة الإدارة التجريبية");
    expect(
      screen.getByRole("button", { name: "إضافة فرصة" }),
    ).toBeInTheDocument();
    expect(cloud.auth.currentUser).toBeNull();
    expect(
      screen.queryByRole("link", { name: "تسجيل الدخول" }),
    ).not.toBeInTheDocument();
    submit("إنهاء العرض التجريبي");
    expect(
      screen.queryByRole("button", { name: "إضافة فرصة" }),
    ).not.toBeInTheDocument();
    submit("فتح لوحة الإدارة التجريبية");
    view.unmount();
    mount(<AdminPage />);
    expect(
      screen.getByRole("button", { name: "فتح لوحة الإدارة التجريبية" }),
    ).toBeInTheDocument();
  });

  it("adds, edits and deletes local Admin opportunities, keeping private pages gated", () => {
    const view = mount(<AdminPage />);
    submit("فتح لوحة الإدارة التجريبية");
    submit("إضافة فرصة");
    submit(/حفظ الفرصة/);
    expect(screen.getByRole("alert")).toHaveTextContent("أكملي");
    change("عنوان الفرصة", "فرصة اختبار");
    change("الجهة المنظمة", "مرسم تجريبي");
    change("وصف الفرصة", "دورة رسم أزياء");
    change("المتطلبات", "أدوات رسم");
    submit(/حفظ الفرصة/);
    expect(
      readStore<Opportunity[]>(STORE_KEYS.opportunities, []).some(
        (item) => item.title === "فرصة اختبار",
      ),
    ).toBe(true);
    fireEvent.click(
      screen.getAllByRole("button", { name: "تعديل فرصة اختبار" })[0]!,
    );
    change("عنوان الفرصة", "فرصة معدلة");
    submit(/حفظ الفرصة/);
    fireEvent.click(
      screen.getAllByRole("button", { name: "حذف فرصة معدلة" })[0]!,
    );
    submit("إلغاء");
    expect(
      screen.getAllByRole("button", { name: "حذف فرصة معدلة" }).length,
    ).toBeGreaterThan(0);
    fireEvent.click(
      screen.getAllByRole("button", { name: "حذف فرصة معدلة" })[0]!,
    );
    submit("حذف نهائي");
    expect(
      readStore<Opportunity[]>(STORE_KEYS.opportunities, []).some(
        (item) => item.title === "فرصة معدلة",
      ),
    ).toBe(false);
    view.rerender(
      <DemoProvider>
        <ProfilePage />
      </DemoProvider>,
    );
    expect(
      screen.getByRole("heading", { name: "يلزم تسجيل الدخول" }),
    ).toBeInTheDocument();
    expect(cloud.records.size).toBe(0);
  }, 15000);

  it("filters opportunities, combines filters, shows no results and resets", () => {
    mount(<OpportunitiesPage />);
    submit("الدورات");
    change("البحث عن الفرص", "الباترون");
    change("طريقة المشاركة", "عن بُعد");
    expect(screen.getByText("١ نتائج تجريبية")).toBeInTheDocument();
    change("الموقع", "الرياض");
    expect(
      screen.getByRole("heading", { name: "لا توجد نتائج" }),
    ).toBeInTheDocument();
    submit("مسح الفلاتر");
    expect(screen.getByText("٨ نتائج تجريبية")).toBeInTheDocument();
  });
});
