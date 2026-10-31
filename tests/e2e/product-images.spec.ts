import { expect, test } from "@playwright/test";

test("product arrows reveal on hover, browse photos and hide on mouse leave", async ({ page }, testInfo) => {
  await page.goto("/shop");
  const card = page.locator(".product-card").first();
  const photo = card.locator(".product-photo");
  const next = card.getByRole("button", { name: /Next photo of/ });
  const previous = card.getByRole("button", { name: /Previous photo of/ });
  await photo.scrollIntoViewIfNeeded();
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
