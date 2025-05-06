import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeader from "@/components/auth/AuthHeader";
import Intro from "@/components/auth/intro/IntroClient";

interface AuthLayoutProps {
  children: Readonly<React.ReactNode>;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="max-w-[1920px] w-full h-full flex flex-col justify-between items-center pt-[75px] pb-[48px] px-[75px] mx-auto">
      <Intro />
      <AuthHeader />
      {children}
      <AuthFooter />
    </div>
  );
}
