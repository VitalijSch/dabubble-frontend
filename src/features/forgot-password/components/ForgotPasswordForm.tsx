"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  forgotPasswordSchema,
  FormData,
} from "../schemas/forgotPassword.schema";
import FormInput from "@/components/FormInput";
import EmailIcon from "@/components/icons/EmailIcon";
import BackgroundButton from "@/components/BackgroundButton";
import { useState } from "react";
import { checkIfUserExists } from "@/utils/user.util";
import { useRouter } from "next/navigation";
import { forgotPassword } from "../api/forgotPassword.api";
import ToastMessage from "@/components/ToastMessage";
import EmailSendIcon from "@/components/icons/EmailSendIcon";

export default function ForgotPasswordForm() {
  const [existEmailMessage, setExistEmailMessage] = useState<string>("");
  const [showToastMessage, setShowToastMessage] = useState<boolean>(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  function handleToastMessage() {
    setShowToastMessage(true);
    setTimeout(() => {
      setShowToastMessage(false);
      reset();
      router.push("login");
    }, 3000);
  }

  async function onSubmit(data: FormData) {
    if (existEmailMessage === "") {
      await forgotPassword(data.email);
      handleToastMessage();
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col justify-between"
      >
        <FormInput
          placeholder="beispielname@email.com"
          type="email"
          id="email"
          Icon={EmailIcon}
          {...register("email", {
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
              setExistEmailMessage(
                (await checkIfUserExists("email", e.target.value))
                  ? ""
                  : "Die E-Mail exisitert nicht."
              );
            },
          })}
          error={existEmailMessage || errors.email?.message || undefined}
        />
        <p className="px-[66px] text-[20px] text-[#686868] text-center">
          Wir senden Ihnen eine E-Mail, über die Sie Ihr Passwort ändern können.
        </p>
        <div className="self-end flex justify-center items-center gap-[30px] mt-[30px]">
          <BackgroundButton
            type="submit"
            className={
              existEmailMessage === "" && isValid
                ? ""
                : "bg-[#686868] text-[#FFFFFF] pointer-events-none"
            }
            name="E-Mail senden"
          />
        </div>
      </form>
      {showToastMessage && (
        <ToastMessage
          className="absolute right-[75px] bottom-[48px]"
          Icon={EmailSendIcon}
          text="E-Mail gesendet"
        />
      )}
    </>
  );
}
