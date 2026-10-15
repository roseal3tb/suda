import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/features/suda/auth-page";
import { pageHead } from "@/features/suda/mock-data";
export const Route = createFileRoute("/register")({
  head: () =>
    pageHead(
      "إنشاء حساب تجريبي",
      "أنشئي جلسة عرض تجريبية لاكتشاف ملفك المهني ومعرض أعمالك في سُدى.",
    ),
  component: () => <AuthPage register />,
});
