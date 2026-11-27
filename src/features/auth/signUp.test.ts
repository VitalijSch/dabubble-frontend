import { describe, expect, it } from "vitest";

import { createApi } from "@/lib/api";

import { isSignUpFilled, SIGN_UP_FAILED, toRegisterDetails, validateSignUp } from "./signUp";

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

describe("isSignUpFilled", () => {
  it("is true when every field has a value and the privacy box is ticked", () => {
    expect(isSignUpFilled(form(filled))).toBe(true);
  });

  it("is false for an empty form", () => {
    expect(isSignUpFilled(form({}))).toBe(false);
  });

  it.each(["name", "email", "password"])("is false while %s is empty", (field) => {
    expect(isSignUpFilled(form({ ...filled, [field]: "" }))).toBe(false);
  });

  it.each(["name", "email"])("is false while %s has only spaces", (field) => {
    expect(isSignUpFilled(form({ ...filled, [field]: "   " }))).toBe(false);
  });

  it("is false while the privacy box is not ticked", () => {
    const { privacy: _, ...rest } = filled;
    expect(isSignUpFilled(form(rest))).toBe(false);
  });
});

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

  it("shows the first privacy or non-field error as the form message", async () => {
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
      fieldErrors: {},
      formError: "Bitte bestätige, dass du die Datenschutzerklärung gelesen hast.",
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
