import { expect, test } from "@playwright/test";

import { reachAvatarStep } from "./signUpSteps";

test("the avatar step shows the name entered on the sign-up card", async ({ page }) => {
  await reachAvatarStep(page, "Ada Lovelace");

  await expect(page).toHaveURL(/\/register\/avatar$/);
  await expect(page.getByText("Ada Lovelace", { exact: true })).toBeVisible();
});

test("opening the avatar step directly sends you to the sign-up card", async ({ page }) => {
  await page.goto("/register/avatar");

  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole("heading", { name: "Konto erstellen" })).toBeVisible();
});

test("a reload on the avatar step starts the sign-up again", async ({ page }) => {
  await reachAvatarStep(page);

  await page.reload();

  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByLabel("Passwort", { exact: true })).toHaveValue("");
});

test("details changed after going back must be checked again", async ({ page }) => {
  await reachAvatarStep(page);
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Konto erstellen" })).toBeVisible();

  await page.getByLabel("Name und Nachname").fill("Ada Lovelace");
  await page.goForward();

  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByLabel("Name und Nachname")).toHaveValue("Ada Lovelace");

  // Weiter checks them and shows the new name.
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByText("Ada Lovelace", { exact: true })).toBeVisible();
});

test("the avatar card shows the empty preview, the six avatars and the way back", async ({
  page,
}) => {
  await reachAvatarStep(page);

  await expect(page).toHaveTitle("Avatar wählen · DABubble");
  await expect(page.getByRole("heading", { name: "Wähle deinen Avatar" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Zurück" })).toHaveAttribute("href", "/register");
  await expect(page.getByRole("img", { name: "Noch kein Avatar gewählt" })).toBeVisible();

  const avatars = page.getByRole("group", { name: "Aus der Liste wählen" }).getByRole("radio");
  await expect(avatars).toHaveCount(6);
  await expect(page.getByRole("button", { name: "Weiter" })).toBeDisabled();
});

test("picking an avatar shows it in the preview and enables Weiter", async ({ page }) => {
  await reachAvatarStep(page);

  await page.getByRole("img", { name: "Avatar 4" }).click();
  await expect(page.getByRole("radio", { name: "Avatar 4" })).toBeChecked();
  await expect(page.getByRole("img", { name: "Gewählter Avatar" })).toHaveAttribute(
    "src",
    /avatar_4\.png/,
  );
  await expect(page.getByRole("img", { name: "Noch kein Avatar gewählt" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Weiter" })).toBeEnabled();

  await page.getByRole("img", { name: "Avatar 2" }).click();
  await expect(page.getByRole("radio", { name: "Avatar 4" })).not.toBeChecked();
  await expect(page.getByRole("img", { name: "Gewählter Avatar" })).toHaveAttribute(
    "src",
    /avatar_2\.png/,
  );
});

test("the avatars can be picked with the keyboard", async ({ page }) => {
  await reachAvatarStep(page);

  await page.getByRole("radio", { name: "Avatar 1" }).focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Avatar 2" })).toBeChecked();
});

test("the header does not offer to create an account while signing up", async ({ page }) => {
  await reachAvatarStep(page);

  await expect(page.getByRole("heading", { name: "Wähle deinen Avatar" })).toBeVisible();
  await expect(page.getByText("Neu bei DABubble?")).toHaveCount(0);
});

test("the card matches the Figma positions at 1920 × 1080", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await reachAvatarStep(page);

  const card = (await page.getByRole("region", { name: "Wähle deinen Avatar" }).boundingBox())!;
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
  // "82. Choose avatar component": 472 × 367, centred in the card.
  expect(
    await inCard(page.getByRole("img", { name: "Noch kein Avatar gewählt" }).boundingBox()),
  ).toEqual({ x: 219, y: 151 });
  expect(
    await inCard(page.getByRole("radio", { name: "Avatar 1" }).locator("..").boundingBox()),
  ).toEqual({ x: 67, y: 446 });

  const button = (await page.getByRole("button", { name: "Weiter" }).boundingBox())!;
  expect(Math.round(button.x + button.width - card.x)).toBe(553);
  expect(Math.round(button.y - card.y)).toBe(580);
});

test("the card does not overflow on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await reachAvatarStep(page);

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375);
});
