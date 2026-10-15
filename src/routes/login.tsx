import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/features/suda/auth-page";
import { pageHead } from "@/features/suda/mock-data";
export const Route = createFileRoute("/login")({
  head: () =>
    pageHead(
      "تسجيل الدخول التجريبي",
      "دخول تجريبي إلى مساحتك في سُدى، دون مصادقة حقيقية أو إرسال بيانات.",
    ),
  component: () => <AuthPage />,
});
