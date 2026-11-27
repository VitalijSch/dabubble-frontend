import { env } from "@/env";

import { createApi } from "./client";

export { createApi, readCookie, type Schema } from "./client";
export type { components, paths } from "./schema";

/** The app's client for the Django backend. Use it for every API call. */
export const api = createApi({ baseUrl: env.NEXT_PUBLIC_API_URL });
