import { defineConfig } from "vitest/config";

export default defineConfig({
  // Vite 8 resolves the "@/*" alias from tsconfig.json natively.
  resolve: { tsconfigPaths: true },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
