"use client";

import FormInput from "@/components/FormInput";
import EmailIcon from "@/components/icons/EmailIcon";
import LockIcon from "@/components/icons/LookIcon";
import PersonIcon from "@/components/icons/PersonIcon";
import Checkbox from "./Checkbox";
import BackgroundButton from "@/components/BackgroundButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signinSchema, FormData } from "../schemas/signin.schema";
import { signinStore } from "../stores/signin.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { checkIfUserExists } from "@/utils/user.util";
import { userStore } from "@/stores/user.store";

export default function SigninForm() {
  const [existUsernameMessage, setExistUsernameMessage] = useState<string>("");
  const [existEmailMessage, setExistEmailMessage] = useState<string>("");

  const router = useRouter();

  const isChecked = signinStore((state) => state.isChecked);
  const setIsChecked = signinStore((state) => state.setIsChecked);
  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(signinSchema),
  });

  function checkIfUsernameAndEmailExist(): boolean {
    return existUsernameMessage === "" && existEmailMessage === "";
  }

  function handleSetUser(data: FormData) {
    if (checkIfUsernameAndEmailExist()) {
      setUser(data);
      router.push("choose-avatar");
    }
  }

  function onSubmit(data: FormData) {
    if (!isChecked) setIsChecked(false);
    if (isChecked) handleSetUser(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full flex flex-col justify-between"
    >
      <FormInput
        placeholder="Name und Nachname"
        type="text"
        id="username"
        Icon={PersonIcon}
        {...register("username", {
          onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
            setExistUsernameMessage(
              (await checkIfUserExists("username", e.target.value))
                ? "Der Benutzername ist bereits vergeben."
                : ""
            );
          },
        })}
        error={existUsernameMessage || errors.username?.message || undefined}
        value={user?.username}
      />
      <FormInput
        placeholder="beispielname@email.com"
        type="email"
        id="email"
        Icon={EmailIcon}
        {...register("email", {
          onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
            setExistEmailMessage(
              (await checkIfUserExists("email", e.target.value))
                ? "Die E-Mail ist bereits vergeben."
                : ""
            );
          },
        })}
        error={existEmailMessage || errors.email?.message || undefined}
        value={user?.email}
      />
      <FormInput
        placeholder="Passwort"
        type="password"
        id="password"
        Icon={LockIcon}
        {...register("password")}
        error={errors ? errors.password?.message : undefined}
        value={user?.password}
      />
      <Checkbox />
      <div className="self-end flex justify-center items-center gap-[30px]">
        <BackgroundButton
          type="submit"
          className={
            isValid && isChecked && checkIfUsernameAndEmailExist()
              ? ""
              : "bg-[#686868] text-[#FFFFFF] hover:!bg-[#686868]"
          }
          name="Weiter"
        />
      </div>
    </form>
  );
}
