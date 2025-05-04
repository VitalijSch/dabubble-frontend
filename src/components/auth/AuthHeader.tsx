import Image from "next/image";

export default function AuthHeader() {
  return (
    <div className="max-w-[1920px] max-h-[70px] w-full h-full flex justify-between items-center pt-[75px] px-[75px] mx-auto">
      <Image
      className="animate-logoMoveToTopLeft"
        src="/images/auth/auth-header/logo-animation.svg"
        alt="logo animation icon"
        width={242.11}
        height={70}
      />
      <div className="flex flex-col justify-between items-end">
            <span className="text-[18px] text-[#000000]">Neu bei DABubble?</span>
            <button className="w-[153px] h-[42px] flex justify-center items-center text-[18px] text-[#797EF3] leading-[120%] figtree border border-transparent rounded-[25px] cursor-pointer hover:font-[500] hover:border-[#686868] hover:text-[#444DF2] transition-all duration-300 ease-in">Konto erstellen</button>
      </div>
    </div>
  );
}
