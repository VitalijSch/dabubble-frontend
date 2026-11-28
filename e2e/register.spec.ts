import { expect, type Page, test } from "@playwright/test";

import { fillSignUp, mockValidate } from "./signUpSteps";

test("the sign-up card shows the fields, the privacy check and the way back", async ({ page }) => {
  await page.goto("/register");

  await expect(page).toHaveTitle("Konto erstellen · DABubble");
  await expect(page.getByRole("heading", { name: "Konto erstellen" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Zurück" })).toHaveAttribute("href", "/login");

  await expect(page.getByLabel("Name und Nachname")).toHaveAttribute("autocomplete", "name");
  await expect(page.getByLabel("E-Mail-Adresse")).toHaveAttribute("type", "email");
  await expect(page.getByLabel("Passwort", { exact: true })).toHaveAttribute("type", "password");

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
  const visibleSquareIcon = (page: Page) => page.getByTestId("privacy-box").locator("svg:visible");

  test("toggles when clicking around the square, in the gap and on the text", async ({ page }) => {
    await page.goto("/register");
    const box = (await page.getByTestId("privacy-box").boundingBox())!;
    const midY = box.y + box.height / 2;

    const leftOfSquare = [box.x - 6, midY] as const;
    const aboveSquare = [box.x + box.width / 2, box.y - 6] as const;
    const gapBeforeText = [box.x + box.width + 4, midY] as const;
    const onText = [box.x + box.width + 30, midY] as const;

    for (const [x, y] of [leftOfSquare, aboveSquare, gapBeforeText, onText]) {
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

    await expect(visibleSquareIcon(page)).toHaveCSS("color", purple2);
    for (const x of [box.x - 6, box.x + box.width + 4, box.x + box.width + 30]) {
      await page.mouse.move(0, 0);
      await expect(visibleSquareIcon(page)).toHaveCSS("color", purple2);
      await page.mouse.move(x, midY);
      await expect(visibleSquareIcon(page)).toHaveCSS("color", purple1);
    }
  });
});

test("the header does not offer to create an account on the sign-up page", async ({ page }) => {
  await page.goto("/register");

  await expect(page.getByRole("img", { name: "DABubble" })).toBeVisible();
  await expect(page.getByText("Neu bei DABubble?")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Konto erstellen" })).toHaveCount(0);
});

test.describe("showing the password", () => {
  const password = (page: Page) => page.getByLabel("Passwort", { exact: true });
  const show = (page: Page) => page.getByRole("button", { name: "Passwort anzeigen" });
  const hide = (page: Page) => page.getByRole("button", { name: "Passwort verbergen" });

  test("the lock turns into the eye once something is typed, same size and place", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/register");
    const lock = page.locator("label", { has: password(page) }).locator("svg");
    await expect(lock).toBeVisible();
    await expect(show(page)).toHaveCount(0);
    const lockBox = (await lock.boundingBox())!;

    await password(page).pressSequentially("g");
    await expect(lock).toHaveCount(0);
    const eyeBox = (await show(page).locator("svg").boundingBox())!;
    for (const key of ["x", "y", "width", "height"] as const) {
      expect(eyeBox[key]).toBeCloseTo(lockBox[key], 0);
    }

    await password(page).press("Backspace");
    await expect(show(page)).toHaveCount(0);
    await expect(lock).toBeVisible();
  });

  test("emptying the field hides the password again", async ({ page }) => {
    await page.goto("/register");
    await password(page).pressSequentially("geheim");
    await show(page).click();
    await expect(password(page)).toHaveAttribute("type", "text");

    await password(page).fill("");
    await password(page).pressSequentially("neu");
    await expect(password(page)).toHaveAttribute("type", "password");
  });

  test("the eye shows what was typed and hides it again", async ({ page }) => {
    await page.goto("/register");
    await expect(password(page)).toHaveAttribute("type", "password");

    await password(page).pressSequentially("kurz");
    await show(page).click();
    await expect(password(page)).toHaveAttribute("type", "text");
    await expect(password(page)).toHaveValue("kurz");
    await expect(password(page)).toBeFocused();
    await expect(password(page)).not.toHaveAttribute("aria-invalid");

    await password(page).pressSequentially("1234");
    await hide(page).click();
    await expect(password(page)).toHaveAttribute("type", "password");
    await expect(password(page)).toHaveValue("kurz1234");
  });

  test("works with the keyboard", async ({ page }) => {
    await page.goto("/register");
    await password(page).fill("geheim123");
    await password(page).press("Tab");
    await expect(show(page)).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(password(page)).toHaveAttribute("type", "text");
    await expect(hide(page)).toBeFocused();
  });

  test("stays as the user left it when Weiter is clicked", async ({ page }) => {
    await mockValidate(page, 400, { email: ["Diese E-Mail-Adresse wird bereits verwendet."] });
    await page.goto("/register");
    await fillSignUp(page);
    await show(page).click();

    await page.getByRole("button", { name: "Weiter" }).click();

    await expect(page.getByLabel("E-Mail-Adresse")).toHaveAttribute("aria-invalid", "true");
    await expect(password(page)).toHaveAttribute("type", "text");
    await expect(hide(page)).toBeVisible();
  });
});

test.describe("Weiter on an incomplete form", () => {
  const privacy = (page: Page) =>
    page.getByRole("checkbox", { name: "Ich stimme der Datenschutzerklärung zu." });

  test("is enabled and says what's missing, without asking the backend", async ({ page }) => {
    const requests = await mockValidate(page, 204);
    await page.goto("/register");
    const weiter = page.getByRole("button", { name: "Weiter" });
    await expect(weiter).toBeEnabled();

    await weiter.click();

    const name = page.getByLabel("Name und Nachname");
    await expect(name).toHaveAccessibleDescription("Bitte gib deinen Namen und Nachnamen ein.");
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toBeFocused();
    await expect(page.getByLabel("E-Mail-Adresse")).toHaveAccessibleDescription(
      "Bitte gib deine E-Mail-Adresse ein.",
    );
    await expect(page.getByLabel("Passwort", { exact: true })).toHaveAccessibleDescription(
      "Bitte gib ein Passwort ein.",
    );
    await expect(privacy(page)).toHaveAccessibleDescription(
      "Bitte stimme der Datenschutzerklärung zu.",
    );
    await expect(privacy(page)).toHaveAttribute("aria-invalid", "true");
    expect(requests).toHaveLength(0);

    await name.pressSequentially("Frederik Beck");
    await expect(name).not.toHaveAttribute("aria-invalid");
    await page.getByTestId("privacy-box").click();
    await expect(privacy(page)).not.toHaveAttribute("aria-invalid");
    await expect(page.getByLabel("Passwort", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("points to the privacy box when it's the only thing missing", async ({ page }) => {
    const requests = await mockValidate(page, 204);
    await page.goto("/register");
    await fillSignUp(page);
    await page.getByTestId("privacy-box").click();

    await page.getByRole("button", { name: "Weiter" }).click();

    await expect(privacy(page)).toBeFocused();
    await expect(privacy(page)).toHaveAccessibleDescription(
      "Bitte stimme der Datenschutzerklärung zu.",
    );
    await expect(page.getByLabel("E-Mail-Adresse")).not.toHaveAttribute("aria-invalid");
    expect(requests).toHaveLength(0);
  });
});

test.describe("checks while filling in", () => {
  const EMAIL_INVALID = "Bitte gib eine gültige E-Mail-Adresse ein.";
  const PASSWORD_TOO_SHORT = "Dieses Passwort ist zu kurz. Es muss mindestens 8 Zeichen enthalten.";

  test("an email is checked when leaving the field, not while typing it", async ({ page }) => {
    await page.goto("/register");
    const email = page.getByLabel("E-Mail-Adresse");

    await email.pressSequentially("frederik");
    await expect(email).not.toHaveAttribute("aria-invalid");

    await email.blur();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAccessibleDescription(EMAIL_INVALID);

    await email.pressSequentially("@beispiel.de");
    await expect(email).toBeFocused();
    await expect(email).not.toHaveAttribute("aria-invalid");
  });

  test("leaving a field empty shows no message", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Name und Nachname").focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    for (const label of ["Name und Nachname", "E-Mail-Adresse", "Passwort"]) {
      await expect(page.getByLabel(label, { exact: true })).not.toHaveAttribute("aria-invalid");
    }
    await expect(page.getByLabel("Passwort", { exact: true })).toHaveAccessibleDescription("");
  });

  test("a password is checked when leaving the field, not while typing it", async ({ page }) => {
    await page.goto("/register");
    const password = page.getByLabel("Passwort", { exact: true });

    await expect(password).toHaveAccessibleDescription("");
    await password.pressSequentially("kurz");
    await expect(password).not.toHaveAttribute("aria-invalid");
    await expect(password).toHaveAccessibleDescription("");

    await password.blur();
    await expect(password).toHaveAttribute("aria-invalid", "true");
    await expect(password).toHaveAccessibleDescription(PASSWORD_TOO_SHORT);

    await password.pressSequentially("1234");
    await expect(password).toBeFocused();
    await expect(password).not.toHaveAttribute("aria-invalid");
    await expect(password).toHaveAccessibleDescription("");
  });

  test("pressing Enter while a rule is broken doesn't ask the backend", async ({ page }) => {
    const requests = await mockValidate(page, 204);
    await page.goto("/register");
    await fillSignUp(page);

    const email = page.getByLabel("E-Mail-Adresse");
    await email.fill("frederik");
    await email.press("Enter");

    await expect(email).toHaveAccessibleDescription(EMAIL_INVALID);
    await expect(email).toBeFocused();
    await expect(page).toHaveURL(/\/register$/);
    expect(requests).toHaveLength(0);
  });

  test("Weiter moves the focus to the first field with a message", async ({ page }) => {
    await mockValidate(page, 204);
    await page.goto("/register");
    await fillSignUp(page);
    await page.getByLabel("E-Mail-Adresse").fill("frederik");
    await page.getByLabel("Passwort", { exact: true }).fill("kurz");

    await page.getByRole("button", { name: "Weiter" }).click();

    await expect(page.getByLabel("E-Mail-Adresse")).toBeFocused();
    await expect(page.getByLabel("Passwort", { exact: true })).toHaveAccessibleDescription(
      PASSWORD_TOO_SHORT,
    );
  });
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
  const password = page.getByLabel("Passwort", { exact: true });
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

  const button = (await page.getByRole("button", { name: "Weiter" }).boundingBox())!;
  const buttonRightEdge = button.x + button.width;
  expect(Math.round(buttonRightEdge - card.x)).toBe(553);
  expect(Math.round(button.y - card.y)).toBe(580);
  expect(button.height).toBe(49);
});

test("the card does not overflow on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/register");

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375);
});
