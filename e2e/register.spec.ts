import { expect, type Page, test } from "@playwright/test";

test("the sign-up card shows the fields, the privacy check and the way back", async ({ page }) => {
  await page.goto("/register");

  await expect(page).toHaveTitle("Konto erstellen · DABubble");
  await expect(page.getByRole("heading", { name: "Konto erstellen" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Zurück" })).toHaveAttribute("href", "/login");

  await expect(page.getByLabel("Name und Nachname")).toHaveAttribute("autocomplete", "name");
  await expect(page.getByLabel("E-Mail-Adresse")).toHaveAttribute("type", "email");
  await expect(page.getByLabel("Passwort")).toHaveAttribute("type", "password");

  const privacy = page.getByRole("checkbox", { name: "Ich stimme der Datenschutzerklärung zu." });
  await expect(privacy).not.toBeChecked();
  await page.getByTestId("privacy-box").click();
  await expect(privacy).toBeChecked();
  await expect(page.getByRole("link", { name: "Datenschutzerklärung" })).toHaveAttribute(
    "href",
    "/datenschutz",
  );
});

test.describe("privacy checkbox", () => {
  const checkbox = (page: Page) =>
    page.getByRole("checkbox", { name: "Ich stimme der Datenschutzerklärung zu." });
  /** The drawn square (the icon that is currently visible). */
  const square = (page: Page) => page.getByTestId("privacy-box").locator("svg:visible");

  test("toggles when clicking around the square, in the gap and on the text", async ({ page }) => {
    await page.goto("/register");
    const box = (await page.getByTestId("privacy-box").boundingBox())!;
    const midY = box.y + box.height / 2;

    for (const [x, y] of [
      [box.x - 6, midY], // left of the square
      [box.x + box.width / 2, box.y - 6], // above it
      [box.x + box.width + 4, midY], // gap between square and text
      [box.x + box.width + 30, midY], // "Ich stimme der"
    ] as const) {
      const before = await checkbox(page).isChecked();
      await page.mouse.click(x, y);
      await expect(checkbox(page)).toBeChecked({ checked: !before });
    }
  });

  test("the privacy link opens the policy without ticking the box", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("link", { name: "Datenschutzerklärung" }).click();
    await expect(page).toHaveURL(/\/datenschutz$/);
  });

  test("hovering next to the square or the text highlights the square", async ({ page }) => {
    await page.goto("/register");
    const box = (await page.getByTestId("privacy-box").boundingBox())!;
    const midY = box.y + box.height / 2;
    const purple2 = "rgb(121, 126, 243)";
    const purple1 = "rgb(68, 77, 242)";

    await expect(square(page)).toHaveCSS("color", purple2);
    for (const x of [box.x - 6, box.x + box.width + 4, box.x + box.width + 30]) {
      await page.mouse.move(0, 0);
      await expect(square(page)).toHaveCSS("color", purple2);
      await page.mouse.move(x, midY);
      await expect(square(page)).toHaveCSS("color", purple1);
    }
  });
});

test("the header does not offer to create an account on the sign-up page", async ({ page }) => {
  await page.goto("/register");

  await expect(page.getByRole("img", { name: "DABubble" })).toBeVisible();
  await expect(page.getByText("Neu bei DABubble?")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Konto erstellen" })).toHaveCount(0);
});

test("submitting stays on the page and never puts the password in the URL", async ({ page }) => {
  await page.goto("/register");

  await page.getByLabel("Passwort").fill("geheim123");
  await page.getByRole("button", { name: "Weiter" }).click();

  await expect(page).toHaveURL(/\/register$/);
});

test("the card matches the Figma positions at 1920 × 1080", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/register");

  const card = (await page.getByRole("region", { name: "Konto erstellen" }).boundingBox())!;
  expect(card.width).toBe(606);
  expect(card.height).toBeCloseTo(669, 0);

  const inCard = async (box: Promise<{ x: number; y: number } | null>) => {
    const { x, y } = (await box)!;
    return { x: Math.round(x - card.x), y: Math.round(y - card.y) };
  };

  expect(await inCard(page.getByRole("link", { name: "Zurück" }).boundingBox())).toEqual({
    x: 32,
    y: 45,
  });
  expect(await inCard(page.getByRole("heading").boundingBox())).toMatchObject({ y: 40 });

  // The button is right-aligned and its width follows the text, which renders a few px
  // wider on Linux than on macOS. So check its right edge (Figma: 446 + 107 = 553), not x.
  const button = (await page.getByRole("button", { name: "Weiter" }).boundingBox())!;
  expect(Math.round(button.x + button.width - card.x)).toBe(553);
  expect(Math.round(button.y - card.y)).toBe(580);
  expect(button.height).toBe(49);
});

test("the card does not overflow on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/register");

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375);
});
