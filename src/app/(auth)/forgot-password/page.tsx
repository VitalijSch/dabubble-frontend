import BackButton from "@/components/BackButton";
import ForgotPasswordForm from "@/features/forgot-password/components/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <div className="max-w-[698px] max-h-[469px] w-full h-full flex flex-col gap-[20px] items-center py-[40px] px-[93px] bg-[#FFFFFF] rounded-[30px] shadow-[0px_2px_10px_0px_#00000014] relative">
      <BackButton className="absolute top-[50px] left-[32px]" />
      <h1 className="pl-[11px] text-[46px] text-[#444DF2] font-[700]">
        Passwort zurücksetzen
      </h1>
      <p className="text-[20px] text-center">
        Bitte geben Sie Ihre E-Mail-Adresse ein.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
