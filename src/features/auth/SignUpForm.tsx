"use client";

import Link from "next/link";
import { useState } from "react";

import { primaryButton } from "./buttons";
import { isSignUpFilled } from "./signUp";
import { CheckBoxBlankIcon, CheckBoxIcon, LockIcon, MailIcon, PersonIcon } from "./icons";
import { TextField } from "./TextField";

/** The privacy square: Purple 2, Purple 1 while the row is hovered (but not while the link is). */
const squareIcon =
  "text-purple-2 group-hover:text-purple-1 group-has-[a:hover]:text-purple-2 relative size-6 transition-colors";

/**
 * Fields of the "Konto erstellen" card. "Weiter" stays disabled until every field is
 * filled and the privacy box is ticked. UI only for now: submitting does nothing
 * (validation and the next step, choosing an avatar, come later).
 */
export function SignUpForm() {
  const [filled, setFilled] = useState(false);

  return (
    <form
      noValidate
      // React's onChange fires on every keystroke, tick and browser autofill in the form.
      onChange={(event) => setFilled(isSignUpFilled(new FormData(event.currentTarget)))}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex flex-col gap-[15px]">
        <TextField
          label="Name und Nachname"
          icon={PersonIcon}
          name="name"
          autoComplete="name"
          placeholder="Name und Nachname"
        />
        <TextField
          label="E-Mail-Adresse"
          icon={MailIcon}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="beispielname@email.com"
        />
        <TextField
          label="Passwort"
          icon={LockIcon}
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Passwort"
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

      <div className="mt-10 flex justify-end">
        <button type="submit" disabled={!filled} className={primaryButton}>
          Weiter
        </button>
      </div>
    </form>
  );
}
