import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/features/suda/auth-page";
import { pageHead } from "@/features/suda/mock-data";
export const Route = createFileRoute("/register")({
  head: () =>
    pageHead(
      "إنشاء حساب",
      "أنشئي حسابك لحفظ ملفك المهني ومعرض أعمالك ودوراتك في سُدى",
    ),
  component: () => <AuthPage register />,
});
