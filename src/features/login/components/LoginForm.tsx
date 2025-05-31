"use client";

import EmailIcon from "@/components/icons/EmailIcon";
import LockIcon from "@/components/icons/LookIcon";
import BackgroundButton from "@/components/BackgroundButton";
import BorderButton from "@/components/BorderButton";
import FormInput from "@/components/FormInput";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schemas/login.schema";
import { userStore } from "@/stores/user.store";
import { useRouter } from "next/navigation";
import { loginUser } from "../api/login.api";
import { LoginSchema, LoginUser } from "../interfaces/login.interface";

export default function LoginForm() {
  const router = useRouter();

  const user = userStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<LoginSchema>({
    resolver: yupResolver(loginSchema),
  });

  function handleResponseError(data: LoginUser, field: "email" | "password") {
    if (data[field]) {
      setError(field, {
        type: "server",
        message: data[field],
      });
    }
  }

  function setTokens(response: LoginUser) {
    localStorage.setItem("accessToken", response.access);
    localStorage.setItem("refreshToken", response.refresh);
  }

  function handleResponseSuccess(response: LoginUser) {
    if (response.access) {
      setTokens(response);
      reset();
      router.push("/home");
    }
  }

  async function onSubmit(data: LoginSchema) {
    const response = await loginUser(data);
    handleResponseError(response, "email");
    handleResponseError(response, "password");
    handleResponseSuccess(response);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full flex flex-col justify-between"
    >
      <FormInput
        placeholder="beispielname@email.com"
        type="email"
        id="email"
        Icon={EmailIcon}
        {...register("email")}
        error={errors?.email?.message}
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
  );
}
