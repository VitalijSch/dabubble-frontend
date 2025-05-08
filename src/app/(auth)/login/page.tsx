import EmailIcon from "@/components/icons/EmailIcon";
import LockIcon from "@/components/icons/LookIcon";
import BackgroundButton from "@/components/BackgroundButton";
import BorderButton from "@/components/BorderButton";
import FormInput from "@/components/FormInput";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="max-w-[606px] max-h-[769px] w-full h-full flex flex-col gap-[30px] items-center py-[50px] px-[60px] mb-[65px] bg-[#FFFFFF] rounded-[30px] shadow-[0px_2px_10px_0px_#00000014]">
      <h1 className="text-[46px] text-[#444DF2] font-[700]">Anmeldung</h1>
      <p className="text-[20px] text-center">
        Wir empfehlen dir, die E-Mail-Adresse zu nutzen, die du bei der Arbeit
        verwendest.
      </p>
      <form className="w-full h-full flex flex-col justify-between">
        <FormInput
          placeholder="beispielname@email.com"
          type="email"
          name="email"
          id="email"
          Icon={EmailIcon}
        />
        <FormInput
          placeholder="Passwort eingeben"
          type="password"
          name="password"
          id="password"
          Icon={LockIcon}
        />
        <Link
          href="/forgot-password"
          className="w-fit self-center text-[18px] text-[#797EF3] figtree py-[5px] px-[15px] rounded-[30px] cursor-pointer hover:bg-[#ECEEFE] hover:text-[#444DF2] transition-all duration-300 ease-in-out"
        >
          Passwort vergessen?
        </Link>
        <div className="flex items-center">
          <div className="w-full h-[1px] bg-[#ADB0D9]"></div>
          <span className="px-[15px]">ODER</span>
          <div className="w-full h-[1px] bg-[#ADB0D9]"></div>
        </div>
        <div className="group w-full h-[60px] flex justify-center items-center gap-[20px] bg-[#ECEEFE] border border-transparent rounded-[100px] cursor-pointer hover:border-[#444DF2] transition-colors duration-300 ease-in-out">
          <Image
            src="/images/auth/login/google.svg"
            alt="google icon"
            width={38}
            height={38}
          />
          <span className="text-[18px] text-[#797EF3] group-hover:text-[#444DF2]">
            Anmelden mit Google
          </span>
        </div>
        <div className="self-center flex justify-center items-center gap-[30px]">
          <BackgroundButton type="submit" name="Anmelden" />
          <BorderButton type="submit" name="Gäste-Login" />
        </div>
      </form>
    </div>
  );
}
