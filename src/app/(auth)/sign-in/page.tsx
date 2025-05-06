import SignInCheckbox from "@/components/auth/sign-in/SignInCheckbox";
import EmailIcon from "@/components/icons/EmailIcon";
import LockIcon from "@/components/icons/LookIcon";
import PersonIcon from "@/components/icons/PersonIcon";
import BackButton from "@/components/ui/BackButton";
import BackgroundButton from "@/components/ui/BackgroundButton";
import FormInput from "@/components/ui/FormInput";

export default function SignInPage() {
  return (
    <div className="max-w-[606px] max-h-[669px] w-full h-full flex flex-col gap-[30px] items-center py-[40px] px-[67px] bg-[#FFFFFF] rounded-[30px] shadow-[0px_2px_10px_0px_#00000014] relative">
      <BackButton className="absolute top-[45px] left-[32px]" />
      <h1 className="text-[46px] text-[#444DF2] font-[700]">Konto erstellen</h1>
      <p className="text-[20px] text-center">
        Mit deinem Namen und deiner E-Mail-Adresse hast du dein neues
        DABubble-Konto.
      </p>
      <form className="w-full h-full flex flex-col justify-between">
        <FormInput
          placeholder="Name und Nachname"
          type="text"
          name="name"
          id="name"
          Icon={PersonIcon}
        />
        <FormInput
          placeholder="beispielname@email.com"
          type="email"
          name="email"
          id="email"
          Icon={EmailIcon}
        />
        <FormInput
          placeholder="Passwort"
          type="password"
          name="password"
          id="password"
          Icon={LockIcon}
        />
        <div>
          <SignInCheckbox />
        </div>
        <div className="self-end flex justify-center items-center gap-[30px]">
          <BackgroundButton type="button" name="Weiter" />
        </div>
      </form>
    </div>
  );
}
