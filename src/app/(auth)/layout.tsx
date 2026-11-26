import { AuthLayout } from "@/features/auth";

/** Shared frame for all auth pages (login, sign-up, avatar, password reset). */
export default function Layout({ children }: LayoutProps<"/">) {
  return <AuthLayout>{children}</AuthLayout>;
}
