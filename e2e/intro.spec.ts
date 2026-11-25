import { expect, test } from "@playwright/test";

test("app starts with the intro, which then fades out", async ({ page }) => {
  await page.goto("/");
  const intro = page.getByTestId("intro");

  await expect(intro).toBeVisible();
  // The whole animation takes 2.75s; afterwards the intro no longer covers the page.
  await expect(intro).toBeHidden({ timeout: 5_000 });
});

test("the name is never visible over or left of the logo while it slides out", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");

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
