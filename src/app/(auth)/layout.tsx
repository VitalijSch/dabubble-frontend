import AuthHeader from "@/components/auth/AuthHeader";
import AuthIntro from "@/components/auth/AuthIntro";

interface AuthLayoutProps {
  children: Readonly<React.ReactNode>;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div>
      <AuthIntro />
      <AuthHeader />
      {children}
    </div>
  );
}
