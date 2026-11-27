import { describe, expect, it } from "vitest";

import { createApi } from "@/lib/api";

import {
  checkSignUpDetails,
  checkSignUpField,
  EMAIL_INVALID,
  PASSWORD_TOO_SHORT,
  REQUIRED,
  SIGN_UP_FAILED,
  toRegisterDetails,
  validateSignUp,
} from "./signUp";

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

  it.each(["email", "password"] as const)("says nothing about an empty %s", (field) => {
    // An empty field is not a mistake yet: only "Weiter" asks for what's missing.
    expect(checkSignUpField(field, "")).toBeUndefined();
  });
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
    expect(REQUIRED.full_name).toBe("Bitte gib deinen Namen und Nachnamen ein.");
  });

  it("returns a message for each field that breaks a rule", () => {
    expect(checkSignUpDetails({ ...details, email: "frederik", password: "kurz" })).toEqual({
      email: EMAIL_INVALID,
      password: PASSWORD_TOO_SHORT,
    });
  });
});

describe("validateSignUp", () => {
  const details = toRegisterDetails(form(filled));

  function apiAnswering(response: () => Response) {
    const requests: Request[] = [];
    const api = createApi({
      baseUrl: "http://api.test",
      getCookies: () => "",
      fetch: async (request) => {
        requests.push(request);
        return response();
      },
    });
    return { api, requests };
  }

  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

  it("posts the details to the validate endpoint and succeeds on 204", async () => {
    const { api, requests } = apiAnswering(() => new Response(null, { status: 204 }));

    expect(await validateSignUp(api, details)).toEqual({ ok: true });
    expect(requests[0]?.method).toBe("POST");
    expect(requests[0]?.url).toBe("http://api.test/api/v1/auth/register/validate/");
    expect(await requests[0]?.json()).toEqual(details);
  });

  it("returns the first message of each field of a 400", async () => {
    const { api } = apiAnswering(() =>
      json(
        {
          email: ["Diese E-Mail-Adresse wird bereits verwendet."],
          password: ["Dieses Passwort ist zu kurz.", "Dieses Passwort ist zu üblich."],
        },
        400,
      ),
    );

    expect(await validateSignUp(api, details)).toEqual({
      ok: false,
      fieldErrors: {
        email: "Diese E-Mail-Adresse wird bereits verwendet.",
        password: "Dieses Passwort ist zu kurz.",
      },
    });
  });

  it("returns the privacy box's message as its field, the non-field one for the form", async () => {
    const { api } = apiAnswering(() =>
      json(
        {
          accept_privacy_policy: [
            "Bitte bestätige, dass du die Datenschutzerklärung gelesen hast.",
          ],
          non_field_errors: ["Etwas stimmt nicht."],
        },
        400,
      ),
    );

    expect(await validateSignUp(api, details)).toEqual({
      ok: false,
      fieldErrors: {
        accept_privacy_policy: "Bitte bestätige, dass du die Datenschutzerklärung gelesen hast.",
      },
      formError: "Etwas stimmt nicht.",
    });
  });

  it("shows the backend's detail when there were too many attempts", async () => {
    const { api } = apiAnswering(() => json({ detail: "Zu viele Anfragen." }, 429));

    expect(await validateSignUp(api, details)).toEqual({
      ok: false,
      fieldErrors: {},
      formError: "Zu viele Anfragen.",
    });
  });

  it("falls back to a generic message on a server error", async () => {
    const { api } = apiAnswering(() => new Response("Internal Server Error", { status: 500 }));

    expect(await validateSignUp(api, details)).toEqual({
      ok: false,
      fieldErrors: {},
      formError: SIGN_UP_FAILED,
    });
  });

  it("falls back to a generic message when the backend can't be reached", async () => {
    const api = createApi({
      baseUrl: "http://api.test",
      getCookies: () => "",
      fetch: () => Promise.reject(new TypeError("Failed to fetch")),
    });

    expect(await validateSignUp(api, details)).toEqual({
      ok: false,
      fieldErrors: {},
      formError: SIGN_UP_FAILED,
    });
  });
});
