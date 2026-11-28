import { SignUpProvider } from "@/features/auth";

export default function SignUpStepsLayout({ children }: LayoutProps<"/register">) {
  return <SignUpProvider>{children}</SignUpProvider>;
}
