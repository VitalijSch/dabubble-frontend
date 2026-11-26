import { expect, test } from "@playwright/test";

test("auth pages show the logo, the sign-up link and the legal links", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("img", { name: "DABubble" })).toBeVisible();
  await expect(page.getByText("Neu bei DABubble?")).toBeVisible();
  await expect(page.getByRole("link", { name: "Konto erstellen" })).toHaveAttribute(
    "href",
    "/register",
  );

  const legal = page.getByRole("navigation", { name: "Rechtliches" });
  await expect(legal.getByRole("link", { name: "Impressum" })).toHaveAttribute(
    "href",
    "/impressum",
  );
  await expect(legal.getByRole("link", { name: "Datenschutz" })).toHaveAttribute(
    "href",
    "/datenschutz",
  );
});

test("the frame matches the Figma positions at 1920 × 1080", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/login");

  const logo = await page.getByRole("img", { name: "DABubble" }).boundingBox();
  expect(logo).toMatchObject({ x: 75, y: 75, height: 70 });

  const signUp = await page.getByRole("link", { name: "Konto erstellen" }).boundingBox();
  expect(signUp!.y).toBeCloseTo(110, 0);
  expect(signUp!.x + signUp!.width).toBeCloseTo(1855, 0);

  const legal = await page.getByRole("navigation", { name: "Rechtliches" }).boundingBox();
  expect(legal!.y + legal!.height).toBeCloseTo(1080 - 48, 0);
  expect(legal!.x + legal!.width / 2).toBeCloseTo(960, 0);
});

test("the frame does not overflow on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/login");

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375);
});
