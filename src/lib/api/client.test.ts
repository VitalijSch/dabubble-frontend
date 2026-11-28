import { describe, expect, expectTypeOf, it } from "vitest";

import { type Api, createApi, readCookie, type Schema } from "./client";

function fakeFetchThatRecordsRequests(response: () => Response) {
  const requests: Request[] = [];
  const fetch = async (request: Request) => {
    requests.push(request);
    return response();
  };
  return { fetch, requests };
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("readCookie", () => {
  it("finds a cookie among others", () => {
    expect(readCookie("sessionid=abc; csrftoken=t0k3n; theme=dark", "csrftoken")).toBe("t0k3n");
  });

  it("decodes the value", () => {
    expect(readCookie("csrftoken=a%20b", "csrftoken")).toBe("a b");
  });

  it("keeps an equals sign that is part of the value", () => {
    expect(readCookie("csrftoken=a=b==", "csrftoken")).toBe("a=b==");
  });

  it("returns undefined when the cookie is missing", () => {
    expect(readCookie("sessionid=abc", "csrftoken")).toBeUndefined();
    expect(readCookie("", "csrftoken")).toBeUndefined();
  });
});

describe("createApi", () => {
  it("calls the backend under the base URL and sends the session cookie", async () => {
    const { fetch, requests } = fakeFetchThatRecordsRequests(
      () => new Response(null, { status: 204 }),
    );
    const api = createApi({ baseUrl: "http://api.test", fetch, getCookies: () => "" });

    await api.POST("/api/v1/auth/register/validate/", {
      body: {
        full_name: "Ada Lovelace",
        email: "ada@example.com",
        password: "c0rrect-horse-battery",
        accept_privacy_policy: true,
      },
    });

    expect(requests[0]?.url).toBe("http://api.test/api/v1/auth/register/validate/");
    expect(requests[0]?.credentials).toBe("include");
  });

  it("sends the CSRF token from the cookie on unsafe methods", async () => {
    const { fetch, requests } = fakeFetchThatRecordsRequests(
      () => new Response(null, { status: 204 }),
    );
    const api = createApi({
      baseUrl: "http://api.test",
      fetch,
      getCookies: () => "sessionid=abc; csrftoken=t0k3n",
    });

    await api.POST("/api/v1/auth/verify-email/", { body: { uid: "MQ", token: "abc" } });

    expect(requests[0]?.headers.get("X-CSRFToken")).toBe("t0k3n");
  });

  it("doesn't send a CSRF token on safe methods", async () => {
    const { fetch, requests } = fakeFetchThatRecordsRequests(() => json({}));
    const api = createApi({ baseUrl: "http://api.test", fetch, getCookies: () => "csrftoken=x" });

    await api.GET("/api/v1/me/");

    expect(requests[0]?.headers.has("X-CSRFToken")).toBe(false);
  });

  it("returns field errors typed from the schema", async () => {
    const { fetch } = fakeFetchThatRecordsRequests(() =>
      json({ email: ["Diese E-Mail-Adresse wird bereits verwendet."] }, 400),
    );
    const api = createApi({ baseUrl: "http://api.test", fetch, getCookies: () => "" });

    const { error, response } = await api.POST("/api/v1/auth/register/validate/", {
      body: {
        full_name: "Ada Lovelace",
        email: "ada@example.com",
        password: "c0rrect-horse-battery",
        accept_privacy_policy: true,
      },
    });

    expect(response.status).toBe(400);
    expect(error && "email" in error ? error.email : undefined).toEqual([
      "Diese E-Mail-Adresse wird bereits verwendet.",
    ]);
  });

  it("knows only the endpoints the backend has", () => {
    type GetPath = Parameters<Api["GET"]>[0];

    expectTypeOf<"/api/v1/me/">().toExtend<GetPath>();
    expectTypeOf<"/api/v1/does-not-exist/">().not.toExtend<GetPath>();
  });

  it("asks for every field the backend requires in a request body", () => {
    type SignUpDetails = Schema<"RegisterDetailsRequest">;
    const details = { full_name: "Ada", email: "ada@example.com", password: "secret" };

    expectTypeOf({ ...details, accept_privacy_policy: true }).toExtend<SignUpDetails>();
    expectTypeOf(details).not.toExtend<SignUpDetails>();
  });
});
