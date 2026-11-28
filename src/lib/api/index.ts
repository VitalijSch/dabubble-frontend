import { env } from "@/env";

import { createApi } from "./client";

export { type Api, createApi, readCookie, type Schema } from "./client";
export type { components, paths } from "./schema";

export const api = createApi({ baseUrl: env.NEXT_PUBLIC_API_URL });
