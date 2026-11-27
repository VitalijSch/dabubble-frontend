"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { api } from "@/lib/api";

import { primaryButton } from "./buttons";
import { AVATAR_PATH } from "./routing";
import { useSignUp } from "./SignUpContext";
import {
  isSignUpFilled,
  PASSWORD_HINT,
  type SignUpField,
  type SignUpResult,
  toRegisterDetails,
  validateSignUp,
} from "./signUp";
import { CheckBoxBlankIcon, CheckBoxIcon, LockIcon, MailIcon, PersonIcon } from "./icons";
import { TextField } from "./TextField";

/** The privacy square: Purple 2, Purple 1 while the row is hovered (but not while the link is). */
const squareIcon =
  "text-purple-2 group-hover:text-purple-1 group-has-[a:hover]:text-purple-2 relative size-6 transition-colors";

/** Input `name` → the API field its errors come back under. */
const API_FIELD: Record<string, SignUpField> = {
  name: "full_name",
  email: "email",
  password: "password",
};

type Errors = Omit<Extract<SignUpResult, { ok: false }>, "ok">;
const NO_ERRORS: Errors = { fieldErrors: {} };

/**
 * Fields of the "Konto erstellen" card. "Weiter" stays disabled until every field is
 * filled and the privacy box is ticked. On "Weiter" the backend checks the details; its
 * messages appear under the inputs, and if all is well the details go to the avatar step.
 */
export function SignUpForm() {
  const router = useRouter();
  const { setDetails } = useSignUp();
  const [filled, setFilled] = useState(false);
  // A transition, not a flag: it ends by itself once the avatar page is shown. Next.js keeps
  // this page alive (hidden) for the way back, so a flag left `true` would disable "Weiter".
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);

  function handleChange(event: FormEvent<HTMLFormElement>) {
    setFilled(isSignUpFilled(new FormData(event.currentTarget)));
    // Changed details must be checked again before the avatar step accepts them.
    setDetails(null);
    // Editing an input clears its message; the form message goes with any edit.
    const target = event.target;
    const field = target instanceof HTMLInputElement ? API_FIELD[target.name] : undefined;
    setErrors(({ fieldErrors }) => ({
      fieldErrors: field ? { ...fieldErrors, [field]: undefined } : fieldErrors,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const details = toRegisterDetails(new FormData(event.currentTarget));
    // `pending` covers the check and the navigation after it.
    startTransition(async () => {
      const result = await validateSignUp(api, details);
      // Updates after an `await` need their own startTransition to stay in the transition.
      startTransition(() => {
        if (result.ok) {
          setDetails(details);
          router.push(AVATAR_PATH);
        } else setErrors(result);
      });
    });
  }

  return (
    <form
      noValidate
      // React's onChange fires on every keystroke, tick and browser autofill in the form.
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-[15px]">
        <TextField
          label="Name und Nachname"
          icon={PersonIcon}
          name="name"
          autoComplete="name"
          placeholder="Name und Nachname"
          error={errors.fieldErrors.full_name}
        />
        <TextField
          label="E-Mail-Adresse"
          icon={MailIcon}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="beispielname@email.com"
          error={errors.fieldErrors.email}
        />
        <TextField
          label="Passwort"
          icon={LockIcon}
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Passwort"
          error={errors.fieldErrors.password}
          hint={PASSWORD_HINT}
        />
      </div>

      {/*
        Figma "79. Privacy policy check mark". The whole row is the label, so the square,
        the gap and the text all toggle it; the link inside still just opens the policy.
      */}
      <div className="mt-[7px] flex min-h-8 items-center">
        <label className="group font-open-sans text-menu flex cursor-pointer items-center gap-2 leading-[1.2]">
          <span data-testid="privacy-box" className="relative size-6 shrink-0">
            <input type="checkbox" name="privacy" className="peer sr-only" />
            {/* 40 px round hit area around the 24 px square; tinted on hover and press. */}
            <span
              aria-hidden="true"
              className="group-hover:bg-surface group-active:bg-line/40 peer-focus-visible:outline-purple-1 absolute -inset-2 rounded-full transition-colors group-has-[a:hover]:bg-transparent peer-focus-visible:outline-2"
            />
            <CheckBoxBlankIcon className={`${squareIcon} peer-checked:hidden`} />
            <CheckBoxIcon className={`${squareIcon} hidden peer-checked:block`} />
          </span>
          <span>
            Ich stimme der{" "}
            <Link
              href="/datenschutz"
              className="font-figtree text-purple-2 hover:text-purple-1 focus-visible:outline-purple-1 rounded-full py-[5px] text-lg leading-[1.2] transition-colors focus-visible:outline-2"
            >
              Datenschutzerklärung
            </Link>{" "}
            zu.
          </span>
        </label>
      </div>

      {/* The 40 px gap above "Weiter" holds the form message, so nothing jumps when it appears. */}
      <p role="alert" className="text-error flex min-h-10 items-center text-sm leading-[19px]">
        {errors.formError}
      </p>

      <div className="flex justify-end">
        <button type="submit" disabled={!filled || pending} className={primaryButton}>
          Weiter
        </button>
      </div>
    </form>
  );
}
