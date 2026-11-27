import { expect, type Page, test } from "@playwright/test";

import { fillSignUp, mockValidate } from "./signUpSteps";

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

test("Weiter is enabled only while every field is filled and the privacy box is ticked", async ({
  page,
}) => {
  await page.goto("/register");
  const weiter = page.getByRole("button", { name: "Weiter" });
  await expect(weiter).toBeDisabled();

  await page.getByLabel("Name und Nachname").fill("Frederik Beck");
  await page.getByLabel("E-Mail-Adresse").fill("frederik@beispiel.de");
  await page.getByLabel("Passwort").fill("geheim123");
  await expect(weiter).toBeDisabled();

  await page.getByTestId("privacy-box").click();
  await expect(weiter).toBeEnabled();

  await page.getByLabel("E-Mail-Adresse").fill("");
  await expect(weiter).toBeDisabled();
  await page.getByLabel("E-Mail-Adresse").fill("frederik@beispiel.de");
  await expect(weiter).toBeEnabled();

  await page.getByTestId("privacy-box").click();
  await expect(weiter).toBeDisabled();
});

test("the password field says how long the password must be before anything is sent", async ({
  page,
}) => {
  await page.goto("/register");

  const password = page.getByLabel("Passwort");
  await expect(password).toHaveAccessibleDescription("Mindestens 8 Zeichen");
  await expect(password).not.toHaveAttribute("aria-invalid");
});

test("Weiter checks the details with the backend and goes on to the avatar step", async ({
  page,
}) => {
  const requests = await mockValidate(page, 204);
  await page.goto("/register");

  await fillSignUp(page);
  await page.getByRole("button", { name: "Weiter" }).click();

  await expect(page).toHaveURL(/\/register\/avatar$/);
  await expect(page.getByRole("heading", { name: "Wähle deinen Avatar" })).toBeVisible();
  expect(requests).toEqual([
    {
      full_name: "Frederik Beck",
      email: "frederik@beispiel.de",
      password: "geheim123",
      accept_privacy_policy: true,
    },
  ]);
});

test("Weiter is disabled while the backend checks, so it is sent only once", async ({ page }) => {
  let answer = () => {};
  const answered = new Promise<void>((resolve) => (answer = resolve));
  const requests = await mockValidate(page, 204, undefined, answered);
  await page.goto("/register");
  await fillSignUp(page);

  const weiter = page.getByRole("button", { name: "Weiter" });
  await weiter.click();
  await expect(weiter).toBeDisabled();
  await weiter.press("Enter").catch(() => {});

  answer();
  await expect(page).toHaveURL(/\/register\/avatar$/);
  expect(requests).toHaveLength(1);
});

test.describe("coming back from the avatar step", () => {
  for (const [how, goBack] of [
    ["with Zurück", (page: Page) => page.getByRole("link", { name: "Zurück" }).click()],
    ["with the browser's back button", (page: Page) => page.goBack()],
  ] as const) {
    test(`keeps the values and Weiter enabled ${how}`, async ({ page }) => {
      await mockValidate(page, 204);
      await page.goto("/register");
      await fillSignUp(page);
      await page.getByRole("button", { name: "Weiter" }).click();
      await expect(page).toHaveURL(/\/register\/avatar$/);

      await goBack(page);

      await expect(page).toHaveURL(/\/register$/);
      await expect(page.getByLabel("Name und Nachname")).toHaveValue("Frederik Beck");
      await expect(page.getByLabel("E-Mail-Adresse")).toHaveValue("frederik@beispiel.de");
      await expect(page.getByRole("button", { name: "Weiter" })).toBeEnabled();
    });
  }
});

test("the backend's messages show under the inputs and clear when the input is edited", async ({
  page,
}) => {
  await mockValidate(page, 400, {
    email: ["Diese E-Mail-Adresse wird bereits verwendet."],
    password: [
      "Dieses Passwort ist zu kurz. Es muss mindestens 8 Zeichen enthalten.",
      "Dieses Passwort ist zu üblich.",
      "Dieses Passwort ist komplett numerisch.",
    ],
  });
  await page.goto("/register");

  await fillSignUp(page);
  await page.getByRole("button", { name: "Weiter" }).click();

  const email = page.getByLabel("E-Mail-Adresse");
  const password = page.getByLabel("Passwort");
  await expect(email).toHaveAccessibleDescription("Diese E-Mail-Adresse wird bereits verwendet.");
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(password).toHaveAccessibleDescription(
    "Dieses Passwort ist zu kurz. Es muss mindestens 8 Zeichen enthalten.",
  );
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole("button", { name: "Weiter" })).toBeEnabled();

  await email.fill("frederik@neu.de");
  await expect(email).not.toHaveAttribute("aria-invalid");
  await expect(password).toHaveAccessibleDescription(
    "Dieses Passwort ist zu kurz. Es muss mindestens 8 Zeichen enthalten.",
  );
});

test("a message for the whole form shows above Weiter", async ({ page }) => {
  await mockValidate(page, 429, { detail: "Zu viele Anfragen. Bitte warte kurz." });
  await page.goto("/register");

  await fillSignUp(page);
  await page.getByRole("button", { name: "Weiter" }).click();

  const card = page.getByRole("region", { name: "Konto erstellen" });
  await expect(card.getByRole("alert")).toHaveText("Zu viele Anfragen. Bitte warte kurz.");
  await expect(page).toHaveURL(/\/register$/);
});

test("submitting never puts the password in the URL", async ({ page }) => {
  await mockValidate(page, 400, { email: ["Diese E-Mail-Adresse wird bereits verwendet."] });
  await page.goto("/register");

  await fillSignUp(page);
  await page.getByRole("button", { name: "Weiter" }).click();

  await expect(page.getByLabel("E-Mail-Adresse")).toHaveAttribute("aria-invalid", "true");
  expect(page.url()).not.toContain("geheim123");
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
