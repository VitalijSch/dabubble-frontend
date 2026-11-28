import { expect, type Page, type Request } from "@playwright/test";

async function answerLikeDjango<T>(
  page: Page,
  path: string,
  record: (request: Request) => T,
  status: number,
  body?: unknown,
  wait?: Promise<void>,
) {
  const requests: T[] = [];
  await page.route(`**${path}`, async (route) => {
    const origin = route.request().headers()["origin"] ?? "*";
    const headers = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "content-type, x-csrftoken",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    };
    if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers });
    requests.push(record(route.request()));
    await wait;
    return body === undefined
      ? route.fulfill({ status, headers })
      : route.fulfill({ status, headers, json: body });
  });
  return requests;
}

export function mockValidate(page: Page, status: number, body?: unknown, wait?: Promise<void>) {
  return answerLikeDjango(
    page,
    "/api/v1/auth/register/validate/",
    (request): unknown => request.postDataJSON(),
    status,
    body,
    wait,
  );
}

export function mockRegister(page: Page, status: number, body?: unknown, wait?: Promise<void>) {
  return answerLikeDjango(
    page,
    "/api/v1/auth/register/",
    (request) => request.postData() ?? "",
    status,
    body,
    wait,
  );
}

export async function fillSignUp(page: Page, name = "Frederik Beck") {
  await page.getByLabel("Name und Nachname").fill(name);
  await page.getByLabel("E-Mail-Adresse").fill("frederik@beispiel.de");
  await page.getByLabel("Passwort", { exact: true }).fill("geheim123");
  await page.getByTestId("privacy-box").click();
}

export async function reachAvatarStep(page: Page, name = "Frederik Beck") {
  await mockValidate(page, 204);
  await page.goto("/register");
  await fillSignUp(page, name);
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByRole("heading", { name: "Wähle deinen Avatar" })).toBeVisible();
}
