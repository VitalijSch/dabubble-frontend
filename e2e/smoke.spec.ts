import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/DABubble/);
});

test("unknown route shows the 404 page to a logged-in user", async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: "dabubble_session", value: "test", url: baseURL! }]);
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ status: "ok" });
});

test("security headers are set", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("the DABubble logo is the favicon", async ({ page, request }) => {
  await page.goto("/login");
  const icons = page.locator('head link[rel="icon"], head link[rel="apple-touch-icon"]');
  const hrefs = await icons.evaluateAll((links) => links.map((l) => l.getAttribute("href")!));

  expect(hrefs.some((href) => href.startsWith("/favicon.ico"))).toBe(true);
  expect(hrefs.some((href) => href.startsWith("/icon.svg"))).toBe(true);
  expect(hrefs.some((href) => href.startsWith("/apple-icon.png"))).toBe(true);
  for (const href of hrefs) {
    expect((await request.get(href)).ok(), href).toBe(true);
  }
});
