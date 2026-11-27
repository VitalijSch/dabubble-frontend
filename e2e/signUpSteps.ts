import { expect, type Page } from "@playwright/test";

/** Answers the backend's validate endpoint like Django would, CORS included. */
export async function mockValidate(
  page: Page,
  status: number,
  body?: unknown,
  wait?: Promise<void>,
) {
  const requests: unknown[] = [];
  await page.route("**/api/v1/auth/register/validate/", async (route) => {
    const origin = route.request().headers()["origin"] ?? "*";
    const headers = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "content-type, x-csrftoken",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    };
    if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers });
    requests.push(route.request().postDataJSON());
    await wait;
    return body === undefined
      ? route.fulfill({ status, headers })
      : route.fulfill({ status, headers, json: body });
  });
  return requests;
}

/** Fills the "Konto erstellen" card and ticks the privacy box. */
export async function fillSignUp(page: Page, name = "Frederik Beck") {
  await page.getByLabel("Name und Nachname").fill(name);
  await page.getByLabel("E-Mail-Adresse").fill("frederik@beispiel.de");
  await page.getByLabel("Passwort", { exact: true }).fill("geheim123");
  await page.getByTestId("privacy-box").click();
}

/**
 * Goes through the first sign-up step (backend mocked as "valid") to the avatar step.
 * The avatar step can't be opened directly: it needs the details from the first step.
 */
export async function reachAvatarStep(page: Page, name = "Frederik Beck") {
  await mockValidate(page, 204);
  await page.goto("/register");
  await fillSignUp(page, name);
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByRole("heading", { name: "Wähle deinen Avatar" })).toBeVisible();
}
