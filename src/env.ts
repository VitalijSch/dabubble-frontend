import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:8000"),
});

const result = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!result.success) {
  throw new Error(`Invalid environment variables:\n${listProblems(result.error.issues)}`);
}

export const env = result.data;

function listProblems(issues: z.core.$ZodIssue[]): string {
  return issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
}
