import BackButton from "@/components/BackButton";
import SigninForm from "@/features/sign-in/components/SigninForm";

export default function SignIn() {
  return (
    <div className="max-w-[606px] max-h-[669px] w-full h-full flex flex-col gap-[30px] items-center py-[40px] px-[67px] bg-[#FFFFFF] rounded-[30px] shadow-[0px_2px_10px_0px_#00000014] relative">
      <BackButton className="absolute top-[50px] left-[32px]" />
      <h1 className="text-[46px] text-[#444DF2] font-[700]">Konto erstellen</h1>
      <p className="text-[20px] text-center">
        Mit deinem Namen und deiner E-Mail-Adresse hast du dein neues
        DABubble-Konto.
      </p>
      <SigninForm />
    </div>
  );
}
