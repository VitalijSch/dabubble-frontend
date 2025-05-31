"use client";

import { createUser } from "@/api/user.api";
import BackButton from "@/components/BackButton";
import BackgroundButton from "@/components/BackgroundButton";
import ToastMessage from "@/components/ToastMessage";
import { avatars } from "@/data/avatars.data";
import { userStore } from "@/stores/user.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChooseAvatar() {
  const [avatar, setAvatar] = useState<string>(
    "/images/auth/choose-avatar/profile.svg"
  );
  const [showToastMessage, setShowToastMessage] = useState<boolean>(false);

  const router = useRouter();

  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);
  const resetUser = userStore((state) => state.resetUser);

  function handleToastMessage() {
    setShowToastMessage(true);
    setTimeout(() => {
      setShowToastMessage(false);
      resetUser();
      router.push("login");
    }, 3000);
  }

  async function handleCreateUser() {
    const updatedUser = {
      ...user!,
      avatar,
    };
    setUser(updatedUser);
    if (!user) return;
    await createUser(updatedUser);
    handleToastMessage();
  }

  return (
    <>
      <div className="max-w-[606px] max-h-[669px] w-full h-full flex flex-col gap-[30px] items-center py-[40px] px-[67px] bg-[#FFFFFF] rounded-[30px] shadow-[0px_2px_10px_0px_#00000014] relative">
        <BackButton className="absolute top-[50px] left-[32px]" />
        <h1 className="pl-[16px] text-[46px] text-[#444DF2] font-[700]">
          Wähle deinen Avatar
        </h1>
        <Image
          className="border-[8px] rounded-full cursor-pointer hover:border-[#E6E6E6] transition-colors duration-300 ease-in-out"
          src={avatar}
          alt="profile svg"
          width={168}
          height={168}
        />
        <span className="text-[32px] font-[700]">Frederick Beck</span>
        <div className="w-full flex flex-col gap-[16px]">
          <span className="text-[20px]">Aus der Liste wählen</span>
          <div className="w-full flex justify-between items-center">
            {avatars.map((avatar, index) => (
              <Image
                key={avatar}
                onClick={() => setAvatar(avatar)}
                className="border-[4px] rounded-full cursor-pointer hover:border-[#E6E6E6] transition-colors duration-300 ease-in-out"
                src={avatar}
                alt={`avatar ${index}`}
                width={64}
                height={64}
              />
            ))}
          </div>
        </div>
        <div className="self-end flex justify-center items-center gap-[30px]">
          <BackgroundButton
            onClick={handleCreateUser}
            type="button"
            name="Weiter"
          />
        </div>
      </div>
      {showToastMessage && (
        <ToastMessage
          className="absolute right-[75px] bottom-[48px]"
          text="Konto erfolgreich erstellt!"
        />
      )}
    </>
  );
}
