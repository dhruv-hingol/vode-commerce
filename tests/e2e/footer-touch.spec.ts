import { expect, test, type BrowserContext, type Page } from "@playwright/test";

test.use({ hasTouch: true });

async function swipeSignature(page: Page, context: BrowserContext) {
  const stage = page.locator(".signature-stage");
  const box = (await stage.boundingBox())!;
  const scroll = await page.evaluate(() => scrollY);
  const touch = await context.newCDPSession(page);
  const x = box.x + box.width * 0.25;
  const y = box.y + box.height / 2;
  await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await expect(stage).toHaveClass(/is-dragging/);
  for (let i = 1; i <= 8; i++) {
    await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + i * 10, y: y + i * 2 }] });
  }
  await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(stage).not.toHaveClass(/is-dragging/);
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  await touch.detach();
}

test("finger swipe rotates the footer without scrolling the page", async ({ page, context }) => {
  await page.goto("/");
  const stage = page.locator(".signature-stage");
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator(".footer-static-signature.is-hidden")).toHaveCSS("opacity", "0", { timeout: 30000 });
  const canvas = stage.locator("canvas");
  const before = await canvas.screenshot();
  await swipeSignature(page, context);
  await expect.poll(async () => Buffer.compare(before, await canvas.screenshot())).not.toBe(0);
});

test("finger swipe still rotates the visible fallback when the 3D font cannot load", async ({ page, context }) => {
  await page.route("**/fonts/optimer-bold.typeface.json", route => route.abort());
  await page.goto("/");
  const stage = page.locator(".signature-stage");
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator("canvas")).toHaveCount(0);
  const fallback = stage.locator(".footer-static-signature").first();
  await expect(fallback).toHaveCSS("opacity", "1");
  const original = await fallback.evaluate(element => getComputedStyle(element).transform);
  await swipeSignature(page, context);
  await expect.poll(() => fallback.evaluate(element => getComputedStyle(element).transform)).not.toBe(original);
});

test("phone graphics context loss restores a swipeable wordmark", async ({ page, context }) => {
  await page.goto("/");
  const stage = page.locator(".signature-stage");
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator(".footer-static-signature.is-hidden")).toHaveCSS("opacity", "0", { timeout: 30000 });
  await stage.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext("webgl2");
    if (!gl) throw new Error("WebGL did not initialize");
    const extension = gl.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("Context loss simulation unavailable");
    extension.loseContext();
  });
  await expect(stage.locator("canvas")).toHaveCount(0);
  const fallback = stage.locator(".footer-static-signature");
  await expect(fallback).toHaveCSS("opacity", "1");
  const original = await fallback.evaluate(element => getComputedStyle(element).transform);
  await swipeSignature(page, context);
  await expect.poll(() => fallback.evaluate(element => getComputedStyle(element).transform)).not.toBe(original);
});
