import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/features/suda/auth-page";
import { pageHead } from "@/features/suda/mock-data";
export const Route = createFileRoute("/login")({
  head: () =>
    pageHead(
      "تسجيل الدخول",
      "سجّلي الدخول إلى حسابك للوصول إلى ملفك المهني وأعمالك ودوراتك",
    ),
  component: () => <AuthPage />,
});
