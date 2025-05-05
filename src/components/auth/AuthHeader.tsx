import Image from "next/image";
import LinkButton from "../ui/LinkButton";

export default function AuthHeader() {
  return (
    <div className="max-h-[70px] w-full h-full flex justify-between items-center">
      <Image
        className="animate-moveToTopLeft"
        src="/images/auth/auth-header/logo-animation.svg"
        alt="logo animation icon"
        width={242.11}
        height={70}
      />
      <div className="flex flex-col justify-between items-end">
        <span className="text-[18px] text-[#000000]">Neu bei DABubble?</span>
        <LinkButton name="Konto erstellen" link="/sign-up" />
      </div>
    </div>
  );
}
