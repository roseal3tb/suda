import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import type { ReactNode } from "react";
import { initialOpportunities } from "@/features/suda/mock-data";
const demo = vi.hoisted(() => ({
  saveProfile: vi.fn(() => true),
  enrollments: [] as {
    courseId: string;
    progress: number;
    achievements: string[];
  }[],
}));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({ options }),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));
vi.mock("@/features/suda/demo-context", () => ({
  useDemo: () => ({
    profile: null,
    session: { name: "اختبار" },
    saveProfile: demo.saveProfile,
    enrollments: demo.enrollments,
    opportunities: initialOpportunities,
  }),
}));
vi.mock("@/components/suda/reveal", () => ({
  Reveal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
import { Route as ProfileRoute } from "@/routes/profile";
import { Route as LearningRoute } from "@/routes/learning";
const ProfilePage = ProfileRoute.options.component!;
const LearningPage = LearningRoute.options.component!;
describe("Audit regression cases", () => {
  beforeEach(() => {
    cleanup();
    demo.saveProfile.mockClear();
    demo.enrollments = [];
  });
  it("rejects separator-only profile lists, then saves real skills and interests", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: "إنشاء ملفي المهني" }));
    fireEvent.change(screen.getByLabelText("المهارات *", { exact: false }), {
      target: { value: "، , ،" },
    });
    fireEvent.change(screen.getByLabelText("الاهتمامات *", { exact: false }), {
      target: { value: ", ،" },
    });
    fireEvent.click(screen.getByRole("button", { name: /حفظ الملف/ }));
    expect(demo.saveProfile).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("مهارة واهتمامًا");
    fireEvent.change(screen.getByLabelText("المهارات *", { exact: false }), {
      target: { value: "رسم، خياطة" },
    });
    fireEvent.change(screen.getByLabelText("الاهتمامات *", { exact: false }), {
      target: { value: "أزياء" },
    });
    fireEvent.click(screen.getByRole("button", { name: /حفظ الملف/ }));
    expect(demo.saveProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        skills: ["رسم", "خياطة"],
        interests: ["أزياء"],
      }),
    );
  });
  it("shows a useful empty state for enrollments referencing removed courses or non-courses", () => {
    demo.enrollments = [
      { courseId: "removed-course", progress: 0, achievements: [] },
      { courseId: "heritage", progress: 0, achievements: [] },
    ];
    render(<LearningPage />);
    expect(
      screen.getByRole("heading", { name: "لا توجد دورات ملتحقة بعد" }),
    ).toBeInTheDocument();
  });
});
