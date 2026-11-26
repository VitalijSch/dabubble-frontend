import { expect, test } from "@playwright/test";

test.describe("guest", () => {
  test("lands on the login page when opening the app", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("is sent to the login page from any app page", async ({ page }) => {
    await page.goto("/channels/general");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("can open the legal pages without logging in", async ({ request }) => {
    const response = await request.get("/impressum", { maxRedirects: 0 });
    expect(response.status()).not.toBe(307);
  });
});

test.describe("logged-in user", () => {
  test.beforeEach(async ({ context, baseURL }) => {
    await context.addCookies([{ name: "dabubble_session", value: "test", url: baseURL! }]);
  });

  test("lands on the main page when opening the app", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
  });

  test("is sent from the login page to the main page", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/$/);
  });

  test("lands on the login page again after logging out", async ({ page, context }) => {
    await context.clearCookies({ name: "dabubble_session" });
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });
});
