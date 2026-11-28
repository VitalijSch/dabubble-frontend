import { describe, expect, it } from "vitest";

import {
  checkSignUpDetails,
  checkSignUpField,
  EMAIL_INVALID,
  PASSWORD_TOO_SHORT,
  REQUIRED_FIELD_MESSAGES,
  toRegisterDetails,
} from "./signUpChecks";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
}

const filled = {
  name: "Frederik Beck",
  email: "frederik@beispiel.de",
  password: "geheim123",
  privacy: "on",
};

describe("toRegisterDetails", () => {
  it("maps the form to the API body, trimming name and email but not the password", () => {
    expect(
      toRegisterDetails(
        form({
          ...filled,
          name: "  Frederik Beck ",
          email: " frederik@beispiel.de ",
          password: " geheim ",
        }),
      ),
    ).toEqual({
      full_name: "Frederik Beck",
      email: "frederik@beispiel.de",
      password: " geheim ",
      accept_privacy_policy: true,
    });
  });

  it("sends accept_privacy_policy false while the box is not ticked", () => {
    const { privacy: _, ...rest } = filled;
    expect(toRegisterDetails(form(rest)).accept_privacy_policy).toBe(false);
  });
});

describe("checkSignUpField", () => {
  it.each(["frederik@beispiel.de", "f.beck+dabubble@mail.example.com", "a_b@beispiel.de"])(
    "accepts the email %s",
    (email) => {
      expect(checkSignUpField("email", email)).toBeUndefined();
    },
  );

  it.each([
    "frederik",
    "frederik@",
    "@beispiel.de",
    "frederik beck@beispiel.de",
    "frederik@@beispiel.de",
  ])("rejects the email %s", (email) => {
    expect(checkSignUpField("email", email)).toBe(EMAIL_INVALID);
  });

  it("accepts a password of 8 characters and rejects one of 7", () => {
    expect(checkSignUpField("password", "12345678")).toBeUndefined();
    expect(checkSignUpField("password", "1234567")).toBe(PASSWORD_TOO_SHORT);
  });

  it("uses the backend's wording, so a message reads the same wherever it comes from", () => {
    expect(PASSWORD_TOO_SHORT).toBe(
      "Dieses Passwort ist zu kurz. Es muss mindestens 8 Zeichen enthalten.",
    );
  });

  it.each(["email", "password"] as const)(
    "says nothing about an empty %s yet, because only Weiter asks for what is missing",
    (field) => {
      expect(checkSignUpField(field, "")).toBeUndefined();
    },
  );
});

describe("checkSignUpDetails", () => {
  const details = {
    full_name: "Frederik Beck",
    email: "frederik@beispiel.de",
    password: "geheim123",
    accept_privacy_policy: true,
  };

  it("finds nothing in valid details", () => {
    expect(checkSignUpDetails(details)).toEqual({});
  });

  it("asks for every missing field, the privacy box included", () => {
    expect(
      checkSignUpDetails({ full_name: "", email: "", password: "", accept_privacy_policy: false }),
    ).toEqual({
      full_name: "Bitte gib deinen Namen und Nachnamen ein.",
      email: "Bitte gib deine E-Mail-Adresse ein.",
      password: "Bitte gib ein Passwort ein.",
      accept_privacy_policy: "Bitte stimme der Datenschutzerklärung zu.",
    });
    expect(REQUIRED_FIELD_MESSAGES.full_name).toBe("Bitte gib deinen Namen und Nachnamen ein.");
  });

  it("returns a message for each field that breaks a rule", () => {
    expect(checkSignUpDetails({ ...details, email: "frederik", password: "kurz" })).toEqual({
      email: EMAIL_INVALID,
      password: PASSWORD_TOO_SHORT,
    });
  });
});
