import { expect, test } from "@playwright/test";

test("product photos support phone swiping and animated arrows on larger screens", async ({ page, context }, testInfo) => {
  await page.goto("/shop");
  const card = page.locator(".product-card").first();
  const photo = card.locator(".product-photo");
  const next = card.getByRole("button", { name: /Next photo of/ });
  const previous = card.getByRole("button", { name: /Previous photo of/ });
  await photo.scrollIntoViewIfNeeded();
  if (page.viewportSize()!.width < 628) {
    await expect(next).toBeHidden();
    await expect(previous).toBeHidden();
    const box = (await photo.boundingBox())!;
    const session = await context.newCDPSession(page);
    const x = box.x + box.width * 0.85;
    const y = box.y + box.height / 2;
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    for (let i = 1; i <= 10; i++) {
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - i * box.width * 0.07, y }] });
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(card.getByRole("button", { name: /Show photo 2/ })).toHaveAttribute("aria-current", "true");
    await session.detach();
    return;
  }
  if (testInfo.project.name === "desktop") {
    await page.mouse.move(0, 0);
    await expect(next).toHaveCSS("opacity", "0");
    await photo.hover();
  }
  await expect(next).toHaveCSS("opacity", "1");
  await next.click();
  await expect(card.getByRole("button", { name: /Show photo 2/ })).toHaveAttribute("aria-current", "true");
  await previous.click();
  await expect(card.getByRole("button", { name: /Show photo 1/ })).toHaveAttribute("aria-current", "true");
  await previous.click();
  await expect(card.getByRole("button", { name: /Show photo 4/ })).toHaveAttribute("aria-current", "true");
  await next.click();
  await expect(card.getByRole("button", { name: /Show photo 1/ })).toHaveAttribute("aria-current", "true");
  if (testInfo.project.name === "desktop") {
    await page.mouse.move(0, 0);
    await expect(next).toHaveCSS("opacity", "0");
    await expect(previous).toHaveCSS("opacity", "0");
    await page.keyboard.press("Tab");
    await next.focus();
    await expect(next).toHaveCSS("opacity", "1");
  }
});
