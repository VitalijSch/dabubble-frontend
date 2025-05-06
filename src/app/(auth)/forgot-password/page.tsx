import EmailIcon from "@/components/icons/EmailIcon";
import BackButton from "@/components/ui/BackButton";
import BackgroundButton from "@/components/ui/BackgroundButton";
import FormInput from "@/components/ui/FormInput";

export default function ForgotPassword() {
  return (
    <div className="max-w-[698px] max-h-[469px] w-full h-full flex flex-col gap-[20px] items-center py-[40px] px-[93px] bg-[#FFFFFF] rounded-[30px] shadow-[0px_2px_10px_0px_#00000014] relative">
      <BackButton className="absolute top-[50px] left-[32px]" />
      <h1 className="pl-[11px] text-[46px] text-[#444DF2] font-[700]">Passwort zurücksetzen</h1>
      <p className="text-[20px] text-center">
        Bitte geben Sie Ihre E-Mail-Adresse ein.
      </p>
      <form className="w-full h-full flex flex-col justify-between">
        <FormInput
          placeholder="beispielname@email.com"
          type="email"
          name="email"
          id="email"
          Icon={EmailIcon}
        />
        <p className="px-[66px] text-[20px] text-[#686868] text-center">
          Wir senden Ihnen eine E-Mail, über die Sie Ihr Passwort ändern können.
        </p>
        <div className="self-end flex justify-center items-center gap-[30px] mt-[30px]">
          <BackgroundButton type="button" className="bg-[#686868] text-[#FFFFFF] pointer-events-none" name="E-Mail senden" />
        </div>
      </form>
    </div>
  );
}
