import { SignUpProvider } from "@/features/auth";

/** Shares the sign-up details between the steps (/register, /register/avatar). */
export default function RegisterLayout({ children }: LayoutProps<"/register">) {
  return <SignUpProvider>{children}</SignUpProvider>;
}
