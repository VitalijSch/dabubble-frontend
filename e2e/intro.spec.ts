import { expect, type Page, test } from "@playwright/test";

test("the login page starts with the intro, which then fades out", async ({ page }) => {
  await page.goto("/login");
  const intro = page.getByTestId("intro");

  await expect(intro).toBeVisible();
  // The whole animation takes 2.75s; afterwards the intro no longer covers the page.
  await expect(intro).toBeHidden({ timeout: 5_000 });
});

test("the name is never visible over or left of the logo while it slides out", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/login");

  for (let time = 0; time <= 1600; time += 50) {
    const frame = await page.evaluate((t) => {
      for (const animation of document.getAnimations()) {
        animation.pause();
        animation.currentTime = t;
      }
      const intro = document.querySelector('[data-testid="intro"]')!;
      const [name, logo] = intro.querySelectorAll("svg");
      const strip = name!.parentElement!;
      const stripBox = strip.getBoundingClientRect();
      // Left edge of the strip's visible area, including a clip-path inset if there is one.
      const inset = /inset\(\S+ \S+ \S+ ([\d.]+)(%|px)\)/.exec(getComputedStyle(strip).clipPath);
      const insetPx = inset
        ? inset[2] === "%"
          ? (Number(inset[1]) / 100) * stripBox.width
          : Number(inset[1])
        : 0;
      return {
        visibleLeft: stripBox.left + insetPx,
        nameRight: name!.getBoundingClientRect().right,
        logoRight: logo!.getBoundingClientRect().right,
      };
    }, time);

    const nameIsShowing = frame.nameRight > frame.visibleLeft;
    if (nameIsShowing) {
      expect(
        frame.visibleLeft,
        `at ${time}ms the name shows left of the logo's right edge`,
      ).toBeGreaterThanOrEqual(frame.logoRight - 0.5);
    }
  }
});

for (const viewport of [
  { width: 1920, height: 1080 },
  { width: 375, height: 812 },
]) {
  test(`at ${viewport.width}px the logo lands exactly on the header logo`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/login");
    // The flight is set up once the page is interactive.
    await expect(page.locator('[data-intro][data-flight="ready"]')).toBeAttached();

    const frameAt = (time: number) =>
      page.evaluate((t) => {
        for (const animation of document.getAnimations()) {
          animation.pause();
          animation.currentTime = t;
        }
        const box = (el: Element) => {
          const { x, y, width, height } = el.getBoundingClientRect();
          return { x, y, width, height, centerY: y + height / 2 };
        };
        const intro = document.querySelector("[data-intro]")!;
        const [introName, introLogo] = intro.querySelectorAll("svg");
        const header = document.querySelector("[data-intro-target]")!;
        return {
          introLogo: box(introLogo!),
          introName: box(introName!),
          nameColor: getComputedStyle(introName!).color,
          headerLogo: box(header.querySelector('[data-brand="logo"]')!),
          headerName: box(header.querySelector('[data-brand="name"]')!),
          headerVisible: getComputedStyle(header).visibility === "visible",
          introVisible: getComputedStyle(intro).visibility === "visible",
        };
      }, time);

    const flying = await frameAt(2650);
    expect(flying.headerVisible, "header logo is hidden during the flight").toBe(false);
    expect(flying.introLogo.width).toBeGreaterThan(flying.headerLogo.width);

    const landed = await frameAt(3049);
    for (const part of ["Logo", "Name"] as const) {
      const intro = landed[`intro${part}`];
      const header = landed[`header${part}`];
      expect(intro.x, `${part} x`).toBeCloseTo(header.x, 0);
      expect(intro.width, `${part} width`).toBeCloseTo(header.width, 0);
      expect(intro.centerY, `${part} centre`).toBeCloseTo(header.centerY, 0);
    }
    expect(landed.nameColor).toBe("rgb(0, 0, 0)");

    const after = await frameAt(3100);
    expect(after.introVisible).toBe(false);
    expect(after.headerVisible).toBe(true);
  });
}

test.describe("plays once per tab", () => {
  const finishIntro = async (page: Page) => {
    await expect(page.getByTestId("intro")).toBeHidden({ timeout: 5_000 });
    await expect(page.locator("html")).toHaveAttribute("data-intro-played", "");
  };

  test("not again after a reload", async ({ page }) => {
    await page.goto("/login");
    await finishIntro(page);

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-intro-played", "");
    await expect(page.getByTestId("intro")).toBeHidden({ timeout: 100 });
    await expect(page.getByRole("img", { name: "DABubble" })).toBeVisible({ timeout: 100 });
  });

  test("not again when coming back to the login page", async ({ page }) => {
    await page.goto("/login");
    await finishIntro(page);

    await page.getByRole("link", { name: "Konto erstellen" }).click();
    await expect(page).toHaveURL(/\/register$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId("intro")).toBeHidden({ timeout: 100 });
  });

  test("again in a new tab", async ({ page, context }) => {
    await page.goto("/login");
    await finishIntro(page);

    const newTab = await context.newPage();
    await newTab.goto("/login");
    await expect(newTab.getByTestId("intro")).toBeVisible();
  });
});
