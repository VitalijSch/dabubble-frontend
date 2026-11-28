import { expect, type Page, test } from "@playwright/test";

import { mockRegister, reachAvatarStep } from "./signUpSteps";

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

const ANY_TEXT = /\S/;

const ONE_PIXEL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

test("the big preview says it can be clicked to upload an own picture", async ({ page }) => {
  await reachAvatarStep(page);

  const upload = page.getByLabel("Eigenes Bild hochladen");
  await expect(upload).toHaveAttribute("type", "file");
  await expect(upload).toHaveAttribute(
    "accept",
    ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp",
  );
  await expect(upload).toHaveAccessibleDescription("JPG, PNG oder WEBP max. 2 MB");

  const filePickerOpens = page.waitForEvent("filechooser");
  await page.getByRole("img", { name: "Noch kein Avatar gewählt" }).click();
  await filePickerOpens;

  await page.getByRole("img", { name: "Noch kein Avatar gewählt" }).hover();
  await expect(page.getByText("Bild hochladen", { exact: true })).toBeVisible();
});

test("uploading a picture shows it in the preview and enables Weiter", async ({ page }) => {
  await reachAvatarStep(page);
  await page.getByRole("img", { name: "Avatar 3" }).click();

  await page
    .getByLabel("Eigenes Bild hochladen")
    .setInputFiles({ name: "ich.png", mimeType: "image/png", buffer: ONE_PIXEL_PNG });

  await expect(page.getByRole("img", { name: "Hochgeladenes Bild" })).toHaveAttribute(
    "src",
    /^blob:/,
  );
  await expect(page.getByRole("radio", { name: "Avatar 3" })).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Weiter" })).toBeEnabled();

  await page.getByRole("img", { name: "Avatar 5" }).click();
  await expect(page.getByRole("img", { name: "Hochgeladenes Bild" })).toHaveCount(0);
  await expect(page.getByRole("img", { name: "Gewählter Avatar" })).toHaveAttribute(
    "src",
    /avatar_5\.png/,
  );
});

test("a wrong file is refused with a message and changes nothing", async ({ page }) => {
  await reachAvatarStep(page);
  const upload = page.getByLabel("Eigenes Bild hochladen");
  const alertsInCard = page.getByRole("main").getByRole("alert");
  const message = alertsInCard.filter({ hasText: ANY_TEXT });

  await upload.setInputFiles({ name: "anim.gif", mimeType: "image/gif", buffer: ONE_PIXEL_PNG });
  await expect(message).toHaveText("Bitte wähle ein Bild im Format JPG, PNG oder WEBP.");

  await upload.setInputFiles({
    name: "riesig.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.alloc(2 * 1024 * 1024 + 1),
  });
  await expect(message).toHaveText("Das Bild ist zu groß (max. 2 MB).");
  await expect(page.getByRole("img", { name: "Noch kein Avatar gewählt" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Weiter" })).toBeDisabled();

  await page.getByRole("img", { name: "Avatar 1" }).click();
  await expect(message).toHaveCount(0);
});

const CREATED_USER = {
  id: 1,
  email: "frederik@beispiel.de",
  full_name: "Frederik Beck",
  avatar: null,
  default_avatar: "avatar_4",
  date_joined: "2026-11-28T10:00:00Z",
};

test("Weiter creates the account, says to confirm the email, then goes to login", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  let answer!: () => void;
  const requests = await mockRegister(
    page,
    201,
    CREATED_USER,
    new Promise((resolve) => (answer = resolve)),
  );
  await reachAvatarStep(page);
  await page.getByRole("img", { name: "Avatar 4" }).click();

  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByRole("button", { name: "Weiter" })).toBeDisabled();
  answer();

  const box = page.getByRole("status").filter({ hasText: "Prüfe dein Postfach!" });
  await expect(box).toBeVisible();
  await expect(box).toContainText("frederik@beispiel.de");
  await expect(box).toContainText("Bestätige darin deine Adresse");
  const main = page.getByRole("main");
  const unusablePart = main.locator("[inert]");
  await expect(main.getByText("Wähle deinen Avatar", { exact: true })).toBeVisible();
  await expect(unusablePart).toContainText("Wähle deinen Avatar");

  expect(requests).toHaveLength(1);
  for (const [name, value] of [
    ["full_name", "Frederik Beck"],
    ["email", "frederik@beispiel.de"],
    ["password", "geheim123"],
    ["accept_privacy_policy", "true"],
    ["default_avatar", "avatar_4"],
  ])
    expect(requests[0]).toMatch(new RegExp(`name="${name}"\\r\\n\\r\\n${value}\\r\\n`));

  const slideFrom = await box.evaluate(
    (el) => (el.getAnimations()[0]!.effect as KeyframeEffect).getKeyframes()[0]!.transform,
  );
  const card = (await main.getByRole("region").boundingBox())!;
  await expect
    .poll(() =>
      page.evaluate(() => {
        const rect = document.querySelector('[role="status"]')!.getBoundingClientRect();
        return {
          centre: Math.round(rect.left + rect.width / 2),
          bottom: Math.round(innerHeight - rect.bottom),
        };
      }),
    )
    .toEqual({ centre: Math.round((card.x + card.width + 1920) / 2), bottom: 50 });
  const { x } = (await box.boundingBox())!;
  expect(slideFrom).toBe(`translateX(${1920 - x}px)`);
  await expect(page).toHaveURL(/\/register\/avatar$/);

  await expect(page).toHaveURL(/\/login$/, { timeout: 5000 });
  await expect(box).toHaveCount(0);

  await page.goBack();
  await expect(page).toHaveURL(/\/register$/);
});

test("an uploaded picture is sent as the avatar file", async ({ page }) => {
  const requests = await mockRegister(page, 201, { ...CREATED_USER, default_avatar: "" });
  await reachAvatarStep(page);
  await page
    .getByLabel("Eigenes Bild hochladen")
    .setInputFiles({ name: "ich.png", mimeType: "image/png", buffer: ONE_PIXEL_PNG });

  await page.getByRole("button", { name: "Weiter" }).click();

  await expect(page.getByRole("status").filter({ hasText: "Prüfe dein Postfach!" })).toBeVisible();
  expect(requests[0]).toContain('name="avatar"; filename="ich.png"');
  expect(requests[0]).not.toContain('name="default_avatar"');
});

test("a refused avatar shows its message under the preview", async ({ page }) => {
  await mockRegister(page, 400, { avatar: ["Die hochgeladene Datei ist kein Bild."] });
  await reachAvatarStep(page);
  await page
    .getByLabel("Eigenes Bild hochladen")
    .setInputFiles({ name: "ich.png", mimeType: "image/png", buffer: ONE_PIXEL_PNG });

  await page.getByRole("button", { name: "Weiter" }).click();

  await expect(page.getByLabel("Eigenes Bild hochladen")).toHaveAccessibleDescription(
    /Die hochgeladene Datei ist kein Bild\./,
  );
  await expect(page.getByRole("button", { name: "Weiter" })).toBeEnabled();
});

test("an email taken meanwhile shows the backend's message above Weiter", async ({ page }) => {
  await mockRegister(page, 400, { email: ["Diese E-Mail-Adresse wird bereits verwendet."] });
  await reachAvatarStep(page);
  await page.getByRole("img", { name: "Avatar 1" }).click();

  await page.getByRole("button", { name: "Weiter" }).click();

  await expect(page.getByRole("main").getByRole("alert")).toHaveText(
    "Diese E-Mail-Adresse wird bereits verwendet.",
  );
  await expect(page).toHaveURL(/\/register\/avatar$/);
});

for (const [way, goToSignUp] of [
  ["the back button", (page: Page) => page.goBack()],
  [
    "Konto erstellen on the login page",
    (page: Page) => page.getByRole("link", { name: "Konto erstellen" }).click(),
  ],
] as const) {
  test(`after the account is created, ${way} leads to an empty sign-up card`, async ({ page }) => {
    await mockRegister(page, 201, CREATED_USER);
    await reachAvatarStep(page);
    await page.getByRole("img", { name: "Avatar 4" }).click();
    await page.getByRole("button", { name: "Weiter" }).click();
    await expect(page).toHaveURL(/\/login$/, { timeout: 6000 });

    await goToSignUp(page);

    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByLabel("Name und Nachname")).toHaveValue("");
    await expect(page.getByLabel("E-Mail-Adresse")).toHaveValue("");
    await expect(page.getByLabel("Passwort", { exact: true })).toHaveValue("");
    await expect(
      page.getByRole("checkbox", { name: "Ich stimme der Datenschutzerklärung zu." }),
    ).not.toBeChecked();
  });
}
