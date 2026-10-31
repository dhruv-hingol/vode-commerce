import { expect, test } from "@playwright/test";

test("campaign loops without controls and footer rotates only while dragging", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const video = page.locator(".hero-video");
  await expect(video).toBeVisible();
  await expect
    .poll(() =>
      video.evaluate((element) => (element as HTMLVideoElement).currentTime),
    )
    .toBeGreaterThan(0);
  expect(
    await video.evaluate((element) => {
      const media = element as HTMLVideoElement;
      return {
        loop: media.loop,
        muted: media.muted,
        controls: media.controls,
        paused: media.paused,
      };
    }),
  ).toEqual({ loop: true, muted: true, controls: false, paused: false });
  await expect(page.getByRole("button", { name: /pause|play/i })).toHaveCount(
    0,
  );
  const signature = page.getByRole("region", {
    name: "Interactive VODE signature",
  });
  await signature.scrollIntoViewIfNeeded();
  await expect(signature.getByRole("button")).toHaveCount(0);
  await expect(signature.locator("canvas")).toBeVisible();
  const stage = signature.locator(".signature-stage");
  await expect(stage).toHaveAttribute("tabindex", "0", { timeout: 30000 });
  await expect(signature.locator(".footer-static-signature.is-hidden")).toHaveCSS("opacity", "0");
  const size = await stage.boundingBox();
  expect(size!.width).toBeLessThanOrEqual(260);
  expect(size!.height).toBeLessThanOrEqual(105);
  const scene = signature.locator("canvas");
  const before = await scene.screenshot();
  await page.waitForTimeout(300);
  expect(Buffer.compare(before, await scene.screenshot())).toBe(0);
  await page.mouse.move(
    size!.x + size!.width * 0.85,
    size!.y + size!.height * 0.2,
  );
  expect(Buffer.compare(before, await scene.screenshot())).toBe(0);
  await page.mouse.down();
  expect(Buffer.compare(before, await scene.screenshot())).toBe(0);
  await page.mouse.move(size!.x + size!.width * 0.25, size!.y + size!.height * 0.65, { steps: 6 });
  await expect
    .poll(async () => Buffer.compare(before, await scene.screenshot()), {
      timeout: 10000,
    })
    .not.toBe(0);
  await page.mouse.up();
  const released = await scene.screenshot();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(300);
  await expect
    .poll(async () => Buffer.compare(released, await scene.screenshot()), {
      timeout: 10000,
    })
    .toBe(0);
  await stage.focus();
  await page.keyboard.press("ArrowRight");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await signature.screenshot({
    path: testInfo.outputPath("vode-threejs-footer.png"),
  });
  expect(errors).toEqual([]);
});

test("footer has no background and completes full rotations on both axes", async ({ page }) => {
  await page.goto("/");
  const signature = page.getByRole("region", { name: "Interactive VODE signature" });
  await signature.scrollIntoViewIfNeeded();
  const stage = signature.locator(".signature-stage");
  await expect(stage).toHaveAttribute("tabindex", "0", { timeout: 30000 });
  await expect(signature).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(signature.locator(".footer-static-signature").first()).toHaveCSS("color", "rgb(0, 0, 0)");
  await expect(signature.locator(".footer-static-signature.is-hidden")).toHaveCSS("opacity", "0");
  await stage.focus();
  const canvas = signature.locator("canvas");
  const original = await canvas.screenshot();
  for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowRight");
  await expect.poll(async () => Buffer.compare(original, await canvas.screenshot())).not.toBe(0);
  for (let i = 0; i < 18; i++) await page.keyboard.press("ArrowRight");
  await expect.poll(async () => Buffer.compare(original, await canvas.screenshot())).toBe(0);
  for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowDown");
  await expect.poll(async () => Buffer.compare(original, await canvas.screenshot())).not.toBe(0);
  for (let i = 0; i < 18; i++) await page.keyboard.press("ArrowDown");
  await expect.poll(async () => Buffer.compare(original, await canvas.screenshot())).toBe(0);
});

test("reduced motion keeps the hero poster still without controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const video = page.locator(".hero-video");
  await expect(video).toBeVisible();
  await expect
    .poll(() =>
      video.evaluate((element) => (element as HTMLVideoElement).paused),
    )
    .toBe(true);
  await expect(page.getByRole("button", { name: /pause|play/i })).toHaveCount(
    0,
  );
});
