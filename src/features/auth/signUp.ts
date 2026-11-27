import type { Api, Schema } from "@/lib/api";

function text(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}

/**
 * Whether the "Konto erstellen" form is filled out: name, email and password have a value
 * and the privacy box is ticked. Enables "Weiter". Name and email must be more than spaces;
 * the password counts as typed, since spaces are allowed in it. Whether the values are
 * valid (email format, password length) is checked on submit, not here.
 */
export function isSignUpFilled(data: FormData): boolean {
  return (
    text(data, "name").trim() !== "" &&
    text(data, "email").trim() !== "" &&
    text(data, "password") !== "" &&
    data.has("privacy")
  );
}

/**
 * Shown under the password field before anything is sent. Mirrors Django's
 * `MinimumLengthValidator` (default 8) in the backend's AUTH_PASSWORD_VALIDATORS; the backend
 * still decides. Its other rules (too common, all digits, like the name) aren't hinted: a
 * reasonable password passes them, and they come back as messages if it doesn't.
 */
export const PASSWORD_HINT = "Mindestens 8 Zeichen";

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

/** The inputs of the form that can show an error under them. */
export type SignUpField = "full_name" | "email" | "password";

export type SignUpResult =
  | { ok: true }
  | {
      ok: false;
      /** One message per input, shown under it. */
      fieldErrors: Partial<Record<SignUpField, string>>;
      /** A message for the whole form (privacy box, rate limit, backend down). */
      formError?: string;
    };

/** Shown when the backend can't be reached or answers with something unexpected. */
export const SIGN_UP_FAILED =
  "Das hat leider nicht geklappt. Bitte versuche es in einem Moment noch einmal.";

const FIELDS: SignUpField[] = ["full_name", "email", "password"];

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
    const formError = first([
      ...(error.accept_privacy_policy ?? []),
      ...(error.non_field_errors ?? []),
    ]);
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
