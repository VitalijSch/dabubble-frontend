import { z } from "zod";

import type { Api, Schema } from "@/lib/api";

function text(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}

/**
 * Mirrors Django's `MinimumLengthValidator` (default 8) in the backend's
 * AUTH_PASSWORD_VALIDATORS; the backend still decides.
 */
const PASSWORD_MIN_LENGTH = 8;

/** Django's own message for a short password, so it reads the same as the backend's. */
export const PASSWORD_TOO_SHORT = `Dieses Passwort ist zu kurz. Es muss mindestens ${PASSWORD_MIN_LENGTH} Zeichen enthalten.`;

export const EMAIL_INVALID = "Bitte gib eine gültige E-Mail-Adresse ein.";

/**
 * The rules the browser can check without the backend, for feedback while filling in. Kept
 * lenient on purpose: a rule stricter than the backend's would lock out valid users, while
 * one that's too loose only means the backend's message comes on "Weiter" instead.
 * The email pattern is the one browsers use for `type="email"` (WHATWG HTML).
 */
const RULES = {
  email: z.email({ pattern: z.regexes.html5Email, error: EMAIL_INVALID }),
  password: z.string().min(PASSWORD_MIN_LENGTH, { error: PASSWORD_TOO_SHORT }),
} satisfies Partial<Record<SignUpField, z.ZodType<string>>>;

/** What "Weiter" says about a field that's left empty (or a privacy box left unticked). */
export const REQUIRED: Record<SignUpField, string> = {
  full_name: "Bitte gib deinen Namen und Nachnamen ein.",
  email: "Bitte gib deine E-Mail-Adresse ein.",
  password: "Bitte gib ein Passwort ein.",
  accept_privacy_policy: "Bitte stimme der Datenschutzerklärung zu.",
};

/**
 * The message for a text field's value, or `undefined` if it passes. An empty field gets
 * none: it isn't a mistake yet while filling in, only when "Weiter" is clicked.
 */
export function checkSignUpField(field: TextField, value: string): string | undefined {
  const rule: z.ZodType<string> | undefined = field === "full_name" ? undefined : RULES[field];
  if (!rule || value === "") return undefined;
  return rule.safeParse(value).error?.issues[0]?.message;
}

/**
 * Everything "Weiter" would find wrong before asking the backend: missing fields, an unticked
 * privacy box and broken rules, one message each. Empty if the details may go to the backend.
 */
export function checkSignUpDetails(details: RegisterDetails): Partial<Record<SignUpField, string>> {
  const messages: Partial<Record<SignUpField, string>> = {};
  for (const field of TEXT_FIELDS) {
    const value = details[field];
    const message = value === "" ? REQUIRED[field] : checkSignUpField(field, value);
    if (message) messages[field] = message;
  }
  if (!details.accept_privacy_policy)
    messages.accept_privacy_policy = REQUIRED.accept_privacy_policy;
  return messages;
}

export type RegisterDetails = Schema<"RegisterDetailsRequest">;

/** The form as the backend expects it. Name and email are trimmed; the password is sent as typed. */
export function toRegisterDetails(data: FormData): RegisterDetails {
  return {
    full_name: text(data, "name").trim(),
    email: text(data, "email").trim(),
    password: text(data, "password"),
    accept_privacy_policy: data.has("privacy"),
  };
}

/** The text inputs of the form, by their API name. */
export type TextField = "full_name" | "email" | "password";

/** Every input of the form that can have a message, by its API name. */
export type SignUpField = TextField | "accept_privacy_policy";

export type SignUpResult =
  | { ok: true }
  | {
      ok: false;
      /** One message per input, shown under it (the privacy box's above "Weiter"). */
      fieldErrors: Partial<Record<SignUpField, string>>;
      /** A message for the whole form (rate limit, backend down). */
      formError?: string;
    };

/** Shown when the backend can't be reached or answers with something unexpected. */
export const SIGN_UP_FAILED =
  "Das hat leider nicht geklappt. Bitte versuche es in einem Moment noch einmal.";

const TEXT_FIELDS: TextField[] = ["full_name", "email", "password"];
const FIELDS: SignUpField[] = [...TEXT_FIELDS, "accept_privacy_policy"];

/**
 * The first of a field's messages. Django sends every failed rule (for "123": too short, too
 * common, all digits); one clear message reads better, and fixing it often fixes the rest.
 */
const first = (messages: string[] | undefined) => messages?.[0];

/**
 * Checks the first sign-up step with the backend (`/auth/register/validate/`) without saving
 * anything. On success the user continues to the avatar step; otherwise the backend's German
 * messages come back ready to show under the inputs.
 */
export async function validateSignUp(api: Api, details: RegisterDetails): Promise<SignUpResult> {
  let result;
  try {
    result = await api.POST("/api/v1/auth/register/validate/", { body: details });
  } catch {
    return { ok: false, fieldErrors: {}, formError: SIGN_UP_FAILED };
  }

  const { response, error } = result;
  if (response.ok) return { ok: true };

  if (response.status === 400 && error && !("detail" in error)) {
    const fieldErrors: Partial<Record<SignUpField, string>> = {};
    for (const field of FIELDS) {
      const message = first(error[field]);
      if (message) fieldErrors[field] = message;
    }
    const formError = first(error.non_field_errors);
    // A 400 without any message we know how to show still must not pass silently.
    if (!formError && Object.keys(fieldErrors).length === 0) {
      return { ok: false, fieldErrors, formError: SIGN_UP_FAILED };
    }
    return formError ? { ok: false, fieldErrors, formError } : { ok: false, fieldErrors };
  }

  if (response.status === 429 && error && "detail" in error && typeof error.detail === "string") {
    return { ok: false, fieldErrors: {}, formError: error.detail };
  }

  return { ok: false, fieldErrors: {}, formError: SIGN_UP_FAILED };
}
