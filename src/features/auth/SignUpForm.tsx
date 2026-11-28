"use client";

import { useRouter } from "next/navigation";
import { type FocusEvent, type FormEvent, useId, useState, useTransition } from "react";

import { api } from "@/lib/api";

import { primaryButton } from "./buttons";
import { MailIcon, PersonIcon } from "./icons";
import { PasswordField } from "./PasswordField";
import { PrivacyCheckbox } from "./PrivacyCheckbox";
import { AVATAR_PATH } from "./routing";
import { useSignUp } from "./SignUpContext";
import {
  checkSignUpDetails,
  checkSignUpField,
  type FieldMessages,
  hasMessages,
  type RegisterDetails,
  type SignUpField,
  toRegisterDetails,
} from "./signUpChecks";
import { validateSignUp } from "./signUpRequests";
import { TextField } from "./TextField";

type Errors = { fieldErrors: FieldMessages; formError?: string };
const NO_ERRORS: Errors = { fieldErrors: {} };

const BACKEND_FIELD_OF_INPUT: Record<string, SignUpField> = {
  name: "full_name",
  email: "email",
  password: "password",
  privacy: "accept_privacy_policy",
};

export function SignUpForm() {
  const { signUpRun } = useSignUp();
  return <SignUpFormFields key={signUpRun} />;
}

function SignUpFormFields() {
  const router = useRouter();
  const { setDetails } = useSignUp();
  const messageId = useId();
  const [isAskingBackend, startTransition] = useTransition();
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);
  const privacyError = errors.fieldErrors.accept_privacy_policy;

  function handleChange(event: FormEvent<HTMLFormElement>) {
    requireCheckingAgain();
    const field = fieldOf(event.target);
    const details = readForm(event.currentTarget);
    setErrors((errors) => errorsAfterEdit(errors, field, details));
  }

  function requireCheckingAgain() {
    setDetails(null);
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    const field = fieldOf(event.target);
    if (!field || field === "accept_privacy_policy") return;
    const message = checkSignUpField(field, readForm(event.currentTarget)[field]);
    if (message) setErrors((errors) => withFieldMessage(errors, field, message));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isAskingBackend) return;
    const form = event.currentTarget;
    const details = readForm(form);
    const problems = checkSignUpDetails(details);
    if (hasMessages(problems)) {
      showErrors(form, { fieldErrors: { ...errors.fieldErrors, ...problems } });
    } else {
      askBackendThenContinue(form, details);
    }
  }

  function showErrors(form: HTMLFormElement, errors: Errors) {
    setErrors(errors);
    focusFirstFieldWithMessage(form, errors.fieldErrors);
  }

  function askBackendThenContinue(form: HTMLFormElement, details: RegisterDetails) {
    startTransition(async () => {
      const result = await validateSignUp(api, details);
      startTransition(() => {
        if (result.ok) goToAvatarStep(details);
        else showErrors(form, { fieldErrors: result.fieldErrors, formError: result.formError });
      });
    });
  }

  function goToAvatarStep(details: RegisterDetails) {
    setDetails(details);
    router.push(AVATAR_PATH);
  }

  return (
    <form noValidate onChange={handleChange} onBlur={handleBlur} onSubmit={handleSubmit}>
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

      <div className="mt-[7px] flex min-h-8 items-center">
        <PrivacyCheckbox hasError={!!privacyError} messageId={messageId} />
      </div>

      <p
        id={messageId}
        role="alert"
        className="text-error flex min-h-10 items-center text-sm leading-[19px]"
      >
        {privacyError ?? errors.formError}
      </p>

      <div className="flex justify-end">
        <button type="submit" disabled={isAskingBackend} className={primaryButton}>
          Weiter
        </button>
      </div>
    </form>
  );
}

function readForm(form: HTMLFormElement): RegisterDetails {
  return toRegisterDetails(new FormData(form));
}

function fieldOf(target: EventTarget): SignUpField | undefined {
  return target instanceof HTMLInputElement ? BACKEND_FIELD_OF_INPUT[target.name] : undefined;
}

function errorsAfterEdit(
  errors: Errors,
  field: SignUpField | undefined,
  details: RegisterDetails,
): Errors {
  if (!field || !errors.fieldErrors[field]) return { fieldErrors: errors.fieldErrors };
  return { fieldErrors: { ...errors.fieldErrors, [field]: recheck(field, details) } };
}

function recheck(field: SignUpField, details: RegisterDetails): string | undefined {
  if (field === "accept_privacy_policy") return undefined;
  return checkSignUpField(field, details[field]);
}

function withFieldMessage(errors: Errors, field: SignUpField, message: string): Errors {
  return { ...errors, fieldErrors: { ...errors.fieldErrors, [field]: message } };
}

function focusFirstFieldWithMessage(form: HTMLFormElement, fieldErrors: FieldMessages) {
  const inputName = Object.keys(BACKEND_FIELD_OF_INPUT).find(
    (name) => fieldErrors[BACKEND_FIELD_OF_INPUT[name]!],
  );
  const input = inputName ? form.elements.namedItem(inputName) : null;
  if (input instanceof HTMLInputElement) input.focus();
}
