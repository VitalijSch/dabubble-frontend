"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FocusEvent, type FormEvent, useId, useState, useTransition } from "react";

import { api } from "@/lib/api";

import { primaryButton } from "./buttons";
import { AVATAR_PATH } from "./routing";
import { useSignUp } from "./SignUpContext";
import {
  checkSignUpDetails,
  checkSignUpField,
  type RegisterDetails,
  type SignUpField,
  type SignUpResult,
  toRegisterDetails,
  validateSignUp,
} from "./signUp";
import { CheckBoxBlankIcon, CheckBoxIcon, MailIcon, PersonIcon } from "./icons";
import { PasswordField } from "./PasswordField";
import { TextField } from "./TextField";

/**
 * The privacy square: Purple 2, Purple 1 while the row is hovered (but not while the link is).
 * Rosa while "Weiter" asks for it.
 */
const squareIcon = (error: boolean) =>
  `${error ? "text-error" : "text-purple-2 group-hover:text-purple-1 group-has-[a:hover]:text-purple-2"} relative size-6 transition-colors`;

/** Input `name` → the API field its errors come back under, in the order of the form. */
const API_FIELD: Record<string, SignUpField> = {
  name: "full_name",
  email: "email",
  password: "password",
  privacy: "accept_privacy_policy",
};

type Errors = Omit<Extract<SignUpResult, { ok: false }>, "ok">;
type FieldErrors = Errors["fieldErrors"];
const NO_ERRORS: Errors = { fieldErrors: {} };

/** The API field of the input an event came from, if it is one of the form's inputs. */
function fieldOf(target: EventTarget): SignUpField | undefined {
  return target instanceof HTMLInputElement ? API_FIELD[target.name] : undefined;
}

/** Puts the focus on the first input with a message, so keyboard and screen reader users land there. */
function focusFirstError(form: HTMLFormElement, fieldErrors: FieldErrors) {
  const name = Object.keys(API_FIELD).find((input) => fieldErrors[API_FIELD[input]!]);
  const input = name ? form.elements.namedItem(name) : null;
  if (input instanceof HTMLInputElement) input.focus();
}

/**
 * A field's message after an edit: checked again, so it goes once the field is fixed. The
 * privacy box's goes with any click; an empty field gets none until "Weiter" is clicked again.
 */
function recheck(field: SignUpField, details: RegisterDetails): string | undefined {
  return field === "accept_privacy_policy" ? undefined : checkSignUpField(field, details[field]);
}

/**
 * Fields of the "Konto erstellen" card.
 *
 * Feedback follows "reward early, punish late": the browser checks email and password when
 * the user leaves the field, not while they're still typing. Once a field has a message it's
 * checked on every keystroke, so the message goes as soon as it's fixed.
 *
 * "Weiter" is always enabled (a disabled button can't say what's missing, and keyboard and
 * screen reader users can't reach it). On click it asks for every missing field and runs the
 * same checks, moving the focus to the first message. Only if all pass does the backend check
 * the details; its messages appear the same way, and if all is well the details go to the
 * avatar step.
 */
export function SignUpForm() {
  const router = useRouter();
  const { setDetails } = useSignUp();
  const privacyErrorId = useId();
  // A transition, not a flag: it ends by itself once the avatar page is shown. Next.js keeps
  // this page alive (hidden) for the way back, so a flag left `true` would disable "Weiter".
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);
  const privacyError = errors.fieldErrors.accept_privacy_policy;

  function handleChange(event: FormEvent<HTMLFormElement>) {
    const details = toRegisterDetails(new FormData(event.currentTarget));
    // Changed details must be checked again before the avatar step accepts them.
    setDetails(null);
    // An input with a message is checked again on every edit: the message goes once it's
    // fixed (the backend's too, it'll check again). Without a message, typing shows none.
    // The form message goes with any edit.
    const field = fieldOf(event.target);
    setErrors(({ fieldErrors }) => ({
      fieldErrors:
        field && fieldErrors[field]
          ? { ...fieldErrors, [field]: recheck(field, details) }
          : fieldErrors,
    }));
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    const field = fieldOf(event.target);
    if (!field || field === "accept_privacy_policy") return;
    const message = checkSignUpField(
      field,
      toRegisterDetails(new FormData(event.currentTarget))[field],
    );
    // Only adds a message: one from the backend (email already used) stays until edited.
    if (message)
      setErrors((errors) => ({
        ...errors,
        fieldErrors: { ...errors.fieldErrors, [field]: message },
      }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const details = toRegisterDetails(new FormData(form));

    // What the browser can catch doesn't need a request (the backend allows 30 an hour).
    const broken = checkSignUpDetails(details);
    if (Object.keys(broken).length > 0) {
      const fieldErrors = { ...errors.fieldErrors, ...broken };
      setErrors({ fieldErrors });
      focusFirstError(form, fieldErrors);
      return;
    }

    // `pending` covers the check and the navigation after it.
    startTransition(async () => {
      const result = await validateSignUp(api, details);
      // Updates after an `await` need their own startTransition to stay in the transition.
      startTransition(() => {
        if (result.ok) {
          setDetails(details);
          router.push(AVATAR_PATH);
        } else {
          setErrors(result);
          focusFirstError(form, result.fieldErrors);
        }
      });
    });
  }

  return (
    <form
      noValidate
      // React's onChange fires on every keystroke, tick and browser autofill in the form.
      onChange={handleChange}
      // React's onBlur bubbles: it fires for every input that loses the focus.
      onBlur={handleBlur}
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
        <PasswordField
          label="Passwort"
          name="password"
          autoComplete="new-password"
          placeholder="Passwort"
          error={errors.fieldErrors.password}
        />
      </div>

      {/*
        Figma "79. Privacy policy check mark". The whole row is the label, so the square,
        the gap and the text all toggle it; the link inside still just opens the policy.
      */}
      <div className="mt-[7px] flex min-h-8 items-center">
        <label className="group font-open-sans text-menu flex cursor-pointer items-center gap-2 leading-[1.2]">
          <span data-testid="privacy-box" className="relative size-6 shrink-0">
            <input
              type="checkbox"
              name="privacy"
              className="peer sr-only"
              aria-invalid={privacyError ? true : undefined}
              aria-describedby={privacyError ? privacyErrorId : undefined}
            />
            {/* 40 px round hit area around the 24 px square; tinted on hover and press. */}
            <span
              aria-hidden="true"
              className="group-hover:bg-surface group-active:bg-line/40 peer-focus-visible:outline-purple-1 absolute -inset-2 rounded-full transition-colors group-has-[a:hover]:bg-transparent peer-focus-visible:outline-2"
            />
            <CheckBoxBlankIcon className={`${squareIcon(!!privacyError)} peer-checked:hidden`} />
            <CheckBoxIcon className={`${squareIcon(false)} hidden peer-checked:block`} />
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

      {/*
        The 40 px gap above "Weiter" holds the privacy box's message or the form message, so
        nothing jumps when one appears.
      */}
      <p
        id={privacyErrorId}
        role="alert"
        className="text-error flex min-h-10 items-center text-sm leading-[19px]"
      >
        {privacyError ?? errors.formError}
      </p>

      <div className="flex justify-end">
        <button type="submit" disabled={pending} className={primaryButton}>
          Weiter
        </button>
      </div>
    </form>
  );
}
