import createClient, { type Middleware } from "openapi-fetch";

import type { components, paths } from "./schema";

/** A schema type from the backend's API contract, e.g. `Schema<"User">`. */
export type Schema<Name extends keyof components["schemas"]> = components["schemas"][Name];

/** Methods that change data. Django requires a CSRF token for them. */
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** The value of cookie `name` in a `document.cookie`-style string, or undefined. */
export function readCookie(cookies: string, name: string): string | undefined {
  for (const part of cookies.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return undefined;
}

function browserCookies(): string {
  return typeof document === "undefined" ? "" : document.cookie;
}

/** Copies Django's `csrftoken` cookie into the `X-CSRFToken` header on unsafe methods. */
function csrfMiddleware(getCookies: () => string): Middleware {
  return {
    onRequest({ request }) {
      if (!UNSAFE_METHODS.has(request.method)) return;
      const token = readCookie(getCookies(), "csrftoken");
      if (token) request.headers.set("X-CSRFToken", token);
      return request;
    },
  };
}

type ApiOptions = {
  /** The backend's origin, e.g. "http://localhost:8000". */
  baseUrl: string;
  /** Replace `fetch` (tests). */
  fetch?: (request: Request) => Promise<Response>;
  /** Where cookies are read from; defaults to `document.cookie` in the browser. */
  getCookies?: () => string;
};

/**
 * A fetch client typed from the backend's OpenAPI schema: URLs, request bodies, responses and
 * error bodies are all checked by TypeScript. It sends the session cookie and the CSRF token.
 *
 * Calls return `{ data, error, response }`: `data` on success, `error` (the typed error body)
 * otherwise. It doesn't throw on 4xx/5xx; only network failures throw.
 */
export function createApi({ baseUrl, fetch, getCookies = browserCookies }: ApiOptions) {
  const client = createClient<paths>({ baseUrl, fetch, credentials: "include" });
  client.use(csrfMiddleware(getCookies));
  return client;
}
