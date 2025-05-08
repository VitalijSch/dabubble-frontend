import Footer from "@/features/auth/components/Footer";
import Header from "@/features/auth/components/Header";
import Intro from "@/features/auth/components/Intro";


interface AuthLayoutProps {
  children: Readonly<React.ReactNode>;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="max-w-[1920px] w-full h-full flex flex-col justify-between items-center pt-[75px] pb-[48px] px-[75px] mx-auto">
      <Intro />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
