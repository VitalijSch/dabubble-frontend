import { z } from "zod";

/** The ONLY place that reads process.env. Import { env } from "@/env" everywhere else. */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
});

// NEXT_PUBLIC_ values must be listed one by one so Next.js can inline them for the browser.
const parsed = schema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  const problems = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
  throw new Error(`Invalid environment variables:\n${problems.join("\n")}`);
}

export const env = parsed.data;
// Server-only secrets: put them in src/server-env.ts starting with `import "server-only";`.
