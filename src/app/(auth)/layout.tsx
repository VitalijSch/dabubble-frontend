import { AuthLayout } from "@/features/auth";

export default function LoginAndSignUpLayout({ children }: LayoutProps<"/">) {
  return <AuthLayout>{children}</AuthLayout>;
}
