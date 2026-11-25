import { expect, test } from "@playwright/test";

test("app starts with the intro screen", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "DABubble", level: 1 })).toBeAttached();
  await expect(page.getByRole("main")).toHaveCSS("background-image", /linear-gradient/);
});
