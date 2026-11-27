import { describe, expect, it } from "vitest";

import { createApi, readCookie } from "./client";

/** A fake `fetch` that records every request and answers with `response`. */
function fakeFetch(response: () => Response) {
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

  it("returns undefined when the cookie is missing", () => {
    expect(readCookie("sessionid=abc", "csrftoken")).toBeUndefined();
    expect(readCookie("", "csrftoken")).toBeUndefined();
  });
});

describe("createApi", () => {
  it("calls the backend under the base URL and sends the session cookie", async () => {
    const { fetch, requests } = fakeFetch(() => new Response(null, { status: 204 }));
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
    const { fetch, requests } = fakeFetch(() => new Response(null, { status: 204 }));
    const api = createApi({
      baseUrl: "http://api.test",
      fetch,
      getCookies: () => "sessionid=abc; csrftoken=t0k3n",
    });

    await api.POST("/api/v1/auth/verify-email/", { body: { uid: "MQ", token: "abc" } });

    expect(requests[0]?.headers.get("X-CSRFToken")).toBe("t0k3n");
  });

  it("doesn't send a CSRF token on safe methods", async () => {
    const { fetch, requests } = fakeFetch(() => json({}));
    const api = createApi({ baseUrl: "http://api.test", fetch, getCookies: () => "csrftoken=x" });

    await api.GET("/api/v1/me/");

    expect(requests[0]?.headers.has("X-CSRFToken")).toBe(false);
  });

  it("returns field errors typed from the schema", async () => {
    const { fetch } = fakeFetch(() =>
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

  it("rejects unknown endpoints and wrong bodies at compile time", async () => {
    const { fetch } = fakeFetch(() => new Response(null, { status: 204 }));
    const api = createApi({ baseUrl: "http://api.test", fetch, getCookies: () => "" });

    // @ts-expect-error -- not an endpoint of the backend
    await api.GET("/api/v1/does-not-exist/");
    await api.POST("/api/v1/auth/register/validate/", {
      // @ts-expect-error -- `accept_privacy_policy` is missing
      body: { full_name: "Ada", email: "ada@example.com", password: "secret" },
    });
  });
});
