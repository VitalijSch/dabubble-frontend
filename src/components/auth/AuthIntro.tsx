import Image from "next/image";

export default function AuthIntro() {
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-10 flex justify-center items-center bg-gradient-to-b from-[#797EF3] to-[#313AE5] animate-fadeOut">
      <div className="max-w-[470px] min-w-[187px] w-fit h-[184px] flex justify-center items-center relative animate-introMoveToTopLeft">
        <Image
          className="absolute top-1/2 left-0 -translate-y-1/2 animate-moveLeft"
          src="/images/intro/logo.svg"
          alt="logo icon"
          width={186.98}
          height={184}
        />
        <div className="absolute top-1/2 -left-0 -translate-y-1/2 w-[470px] h-[105px] overflow-hidden">
          <Image
            className="w-full h-full translate-x-[-470px] animate-moveRight"
            src="/images/intro/logo-name.svg"
            alt="logo name icon"
            width={470}
            height={105}
          />
        </div>
      </div>
    </div>
  );
}
