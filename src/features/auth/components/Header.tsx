"use client";

import LinkButton from "@/components/LinkButton";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const played = sessionStorage.getItem("introPlayed");
    if (!played) setShow(true);
  }, []);

  return (
    <div className="max-h-[70px] w-full h-full flex justify-between items-center">
      <Image
        className={show ? "animate-moveToTopLeft" : ""}
        src="/images/auth/auth-header/logo-animation.svg"
        alt="logo animation icon"
        width={242.11}
        height={70}
      />
      {pathname.includes("/login") && (
        <div className="flex flex-col justify-between items-end">
          <span className="text-[18px] text-[#000000]">Neu bei DABubble?</span>
          <LinkButton name="Konto erstellen" link="/sign-in" />
        </div>
      )}
    </div>
  );
}
