import { describe, expect, it } from "vitest";

import { createApi } from "@/lib/api";

import type { RegisterDetails } from "./signUpChecks";
import { createAccount, SIGN_UP_FAILED, validateSignUp } from "./signUpRequests";

const details: RegisterDetails = {
  full_name: "Frederik Beck",
  email: "frederik@beispiel.de",
  password: "geheim123",
  accept_privacy_policy: true,
};

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

describe("validateSignUp", () => {
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

describe("createAccount", () => {
  const user = {
    id: 1,
    email: "frederik@beispiel.de",
    full_name: "Frederik Beck",
    avatar: null,
    default_avatar: "avatar_2",
    date_joined: "2026-11-28T10:00:00Z",
  };

  it("posts the details with a built-in avatar as multipart and returns the email on 201", async () => {
    const { api, requests } = apiAnswering(() => json(user, 201));

    expect(await createAccount(api, details, { default_avatar: "avatar_2" })).toEqual({
      ok: true,
      confirmationSentTo: "frederik@beispiel.de",
    });
    const request = requests[0]!;
    expect(request.method).toBe("POST");
    expect(request.url).toBe("http://api.test/api/v1/auth/register/");
    expect(request.headers.get("Content-Type")).toMatch(/^multipart\/form-data; boundary=/);
    const body = await request.formData();
    expect(Object.fromEntries(body)).toEqual({
      full_name: "Frederik Beck",
      email: "frederik@beispiel.de",
      password: "geheim123",
      accept_privacy_policy: "true",
      default_avatar: "avatar_2",
    });
  });

  it("sends an uploaded picture as the avatar file", async () => {
    const { api, requests } = apiAnswering(() => json(user, 201));
    const picture = new File(["png"], "ich.png", { type: "image/png" });

    await createAccount(api, details, { avatar: picture });

    const body = await requests[0]!.formData();
    const sent = body.get("avatar");
    expect(sent).toBeInstanceOf(File);
    expect((sent as File).name).toBe("ich.png");
    expect(body.has("default_avatar")).toBe(false);
  });

  it("returns the avatar's message for the preview", async () => {
    const { api } = apiAnswering(() =>
      json({ avatar: ["Die hochgeladene Datei ist kein Bild.", "Noch etwas."] }, 400),
    );

    expect(await createAccount(api, details, { default_avatar: "avatar_1" })).toEqual({
      ok: false,
      avatarError: "Die hochgeladene Datei ist kein Bild.",
    });
  });

  it("returns a first-step message (e.g. email taken meanwhile) for the form", async () => {
    const { api } = apiAnswering(() =>
      json({ email: ["Diese E-Mail-Adresse wird bereits verwendet."] }, 400),
    );

    expect(await createAccount(api, details, { default_avatar: "avatar_1" })).toEqual({
      ok: false,
      formError: "Diese E-Mail-Adresse wird bereits verwendet.",
    });
  });

  it("shows the backend's detail when there were too many attempts", async () => {
    const { api } = apiAnswering(() => json({ detail: "Zu viele Anfragen." }, 429));

    expect(await createAccount(api, details, { default_avatar: "avatar_1" })).toEqual({
      ok: false,
      formError: "Zu viele Anfragen.",
    });
  });

  it.each([
    ["a server error", () => Promise.resolve(new Response("oops", { status: 500 }))],
    ["an empty 400", () => Promise.resolve(json({}, 400))],
    ["no connection", () => Promise.reject(new TypeError("Failed to fetch"))],
  ])("falls back to a generic message on %s", async (_, answer) => {
    const api = createApi({ baseUrl: "http://api.test", getCookies: () => "", fetch: answer });

    expect(await createAccount(api, details, { default_avatar: "avatar_1" })).toEqual({
      ok: false,
      formError: SIGN_UP_FAILED,
    });
  });
});
