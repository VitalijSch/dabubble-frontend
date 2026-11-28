import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BUILD_AND_START_FOR_PRODUCTION = "pnpm build && pnpm start";
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: BUILD_AND_START_FOR_PRODUCTION,
    env: { PORT: String(PORT), HOSTNAME: "127.0.0.1" },
    url: `${baseURL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
