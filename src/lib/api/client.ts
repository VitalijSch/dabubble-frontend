import createClient, { type Middleware } from "openapi-fetch";

import type { components, paths } from "./schema";

export type Schema<Name extends keyof components["schemas"]> = components["schemas"][Name];

const METHODS_THAT_NEED_A_CSRF_TOKEN = new Set(["POST", "PUT", "PATCH", "DELETE"]);

type ApiOptions = {
  baseUrl: string;
  fetch?: (request: Request) => Promise<Response>;
  getCookies?: () => string;
};

export function createApi({ baseUrl, fetch, getCookies = readBrowserCookies }: ApiOptions) {
  const client = createClient<paths>({ baseUrl, fetch, credentials: "include" });
  client.use(copyCsrfCookieIntoHeader(getCookies));
  return client;
}

export type Api = ReturnType<typeof createApi>;

function copyCsrfCookieIntoHeader(getCookies: () => string): Middleware {
  return {
    onRequest({ request }) {
      if (!METHODS_THAT_NEED_A_CSRF_TOKEN.has(request.method)) return;
      const token = readCookie(getCookies(), "csrftoken");
      if (token) request.headers.set("X-CSRFToken", token);
      return request;
    },
  };
}

function readBrowserCookies(): string {
  return typeof document === "undefined" ? "" : document.cookie;
}

export function readCookie(cookies: string, name: string): string | undefined {
  for (const cookie of cookies.split(";")) {
    const [cookieName, value] = splitAtFirstEqualsSign(cookie.trim());
    if (cookieName === name) return decodeURIComponent(value);
  }
  return undefined;
}

function splitAtFirstEqualsSign(text: string): [string, string] {
  const equalsSign = text.indexOf("=");
  if (equalsSign === -1) return [text, ""];
  return [text.slice(0, equalsSign), text.slice(equalsSign + 1)];
}
