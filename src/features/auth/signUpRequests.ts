import type { Api, Schema } from "@/lib/api";

import {
  type FieldMessages,
  hasMessages,
  type RegisterDetails,
  SIGN_UP_FIELDS,
} from "./signUpChecks";

export const SIGN_UP_FAILED =
  "Das hat leider nicht geklappt. Bitte versuche es in einem Moment noch einmal.";

const BAD_REQUEST = 400;
const TOO_MANY_REQUESTS = 429;

export type SignUpResult =
  { ok: true } | { ok: false; fieldErrors: FieldMessages; formError?: string };

export type AvatarPick = { default_avatar: Schema<"DefaultAvatarEnum"> } | { avatar: File };

export type CreateAccountResult =
  | { ok: true; confirmationSentTo: string }
  | { ok: false; avatarError?: string; formError?: string };

export async function validateSignUp(api: Api, details: RegisterDetails): Promise<SignUpResult> {
  const answer = await send(() => api.POST("/api/v1/auth/register/validate/", { body: details }));
  switch (answer.kind) {
    case "accepted":
      return { ok: true };
    case "invalid":
      return explainInvalidDetails(answer.errors);
    case "failed":
      return { ok: false, fieldErrors: {}, formError: answer.message };
  }
}

function explainInvalidDetails(errors: Schema<"RegisterDetailsValidationError">): SignUpResult {
  const fieldErrors = firstMessageOfEachField(errors);
  const formError = firstMessage(errors.non_field_errors);
  if (formError) return { ok: false, fieldErrors, formError };
  const isRejectedWithoutReason = !hasMessages(fieldErrors);
  if (isRejectedWithoutReason) return { ok: false, fieldErrors, formError: SIGN_UP_FAILED };
  return { ok: false, fieldErrors };
}

export async function createAccount(
  api: Api,
  details: RegisterDetails,
  avatar: AvatarPick,
): Promise<CreateAccountResult> {
  const answer = await send(() =>
    api.POST("/api/v1/auth/register/", {
      body: { ...details, ...avatar },
      bodySerializer: toMultipart,
    }),
  );
  switch (answer.kind) {
    case "accepted":
      return { ok: true, confirmationSentTo: answer.data.email };
    case "invalid":
      return explainRefusedAccount(answer.errors);
    case "failed":
      return { ok: false, formError: answer.message };
  }
}

function toMultipart(body: Schema<"RegisterRequest">): FormData {
  const form = new FormData();
  for (const [name, value] of Object.entries(body)) {
    if (value !== undefined) form.append(name, value instanceof Blob ? value : String(value));
  }
  return form;
}

function explainRefusedAccount(errors: Schema<"RegisterValidationError">): CreateAccountResult {
  const avatarError = firstMessage(errors.avatar) ?? firstMessage(errors.default_avatar);
  if (avatarError) return { ok: false, avatarError };
  const detailsError = Object.values(firstMessageOfEachField(errors))[0];
  return {
    ok: false,
    formError: detailsError ?? firstMessage(errors.non_field_errors) ?? SIGN_UP_FAILED,
  };
}

function firstMessage(messages: string[] | undefined): string | undefined {
  return messages?.[0];
}

function firstMessageOfEachField(errors: Partial<Record<string, string[]>>): FieldMessages {
  const messages: FieldMessages = {};
  for (const field of SIGN_UP_FIELDS) {
    const message = firstMessage(errors[field]);
    if (message) messages[field] = message;
  }
  return messages;
}

type Answer<Data, Errors> =
  | { kind: "accepted"; data: Data }
  | { kind: "invalid"; errors: Errors }
  | { kind: "failed"; message: string };

type ErrorDetail = Schema<"ErrorDetail">;

async function send<Data, Errors extends object>(
  request: () => Promise<{ data?: Data; error?: Errors | ErrorDetail; response: Response }>,
): Promise<Answer<Data, Exclude<Errors, ErrorDetail>>> {
  let result;
  try {
    result = await request();
  } catch {
    return { kind: "failed", message: SIGN_UP_FAILED };
  }
  const { data, error, response } = result;
  if (response.ok) return { kind: "accepted", data: data as Data };
  if (response.status === BAD_REQUEST && isFieldErrors(error)) {
    return { kind: "invalid", errors: error as Exclude<Errors, ErrorDetail> };
  }
  if (response.status === TOO_MANY_REQUESTS && isErrorDetail(error)) {
    return { kind: "failed", message: error.detail };
  }
  return { kind: "failed", message: SIGN_UP_FAILED };
}

function isJsonObject(body: unknown): body is object {
  return typeof body === "object" && body !== null;
}

function isErrorDetail(body: unknown): body is ErrorDetail {
  return isJsonObject(body) && "detail" in body && typeof body.detail === "string";
}

function isFieldErrors(body: unknown): body is object {
  return isJsonObject(body) && !isErrorDetail(body);
}
