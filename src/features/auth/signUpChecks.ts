import { z } from "zod";

import type { Schema } from "@/lib/api";

export type RegisterDetails = Schema<"RegisterDetailsRequest">;

export type TextField = "full_name" | "email" | "password";
export type SignUpField = TextField | "accept_privacy_policy";
export type FieldMessages = Partial<Record<SignUpField, string>>;

export const TEXT_FIELDS: TextField[] = ["full_name", "email", "password"];
export const SIGN_UP_FIELDS: SignUpField[] = [...TEXT_FIELDS, "accept_privacy_policy"];

const BACKEND_PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_TOO_SHORT = `Dieses Passwort ist zu kurz. Es muss mindestens ${BACKEND_PASSWORD_MIN_LENGTH} Zeichen enthalten.`;

export const EMAIL_INVALID = "Bitte gib eine gültige E-Mail-Adresse ein.";

export const REQUIRED_FIELD_MESSAGES: Record<SignUpField, string> = {
  full_name: "Bitte gib deinen Namen und Nachnamen ein.",
  email: "Bitte gib deine E-Mail-Adresse ein.",
  password: "Bitte gib ein Passwort ein.",
  accept_privacy_policy: "Bitte stimme der Datenschutzerklärung zu.",
};

const FORMAT_RULES: Partial<Record<TextField, z.ZodType<string>>> = {
  email: z.email({ pattern: z.regexes.html5Email, error: EMAIL_INVALID }),
  password: z.string().min(BACKEND_PASSWORD_MIN_LENGTH, { error: PASSWORD_TOO_SHORT }),
};

export function toRegisterDetails(form: FormData): RegisterDetails {
  return {
    full_name: readText(form, "name").trim(),
    email: readText(form, "email").trim(),
    password: readText(form, "password"),
    accept_privacy_policy: form.has("privacy"),
  };
}

function readText(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}

export function checkSignUpField(field: TextField, value: string): string | undefined {
  const rule = FORMAT_RULES[field];
  const isStillEmpty = value === "";
  if (!rule || isStillEmpty) return undefined;
  return rule.safeParse(value).error?.issues[0]?.message;
}

export function checkSignUpDetails(details: RegisterDetails): FieldMessages {
  const messages: FieldMessages = {};
  for (const field of TEXT_FIELDS) {
    const message = checkRequiredField(field, details[field]);
    if (message) messages[field] = message;
  }
  if (!details.accept_privacy_policy) {
    messages.accept_privacy_policy = REQUIRED_FIELD_MESSAGES.accept_privacy_policy;
  }
  return messages;
}

function checkRequiredField(field: TextField, value: string): string | undefined {
  return value === "" ? REQUIRED_FIELD_MESSAGES[field] : checkSignUpField(field, value);
}

export function hasMessages(messages: FieldMessages): boolean {
  return Object.keys(messages).length > 0;
}
