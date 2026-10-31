import { expect, test } from "@playwright/test";

test("sidebar collection links, close behavior and responsive layout", async ({ page }, testInfo) => {
  await page.goto("/");
  const open = page.getByRole("button", { name: "Open navigation", exact: true });
  const openPosition = await open.boundingBox();
  await open.click();
  const sidebar = page.getByRole("dialog", { name: "Navigation", exact: true });
  await expect(sidebar).toBeVisible();
  const close = sidebar.getByRole("button", { name: "Close Navigation", exact: true });
  if (page.viewportSize()!.width < 768) {
    await expect.poll(async () => {
      const position = await close.boundingBox();
      return Math.abs(position!.x - openPosition!.x) + Math.abs(position!.y - openPosition!.y);
    }).toBeLessThan(1);
    await expect(close).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(page.locator(".header-brand-pill")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  } else {
    await expect(page.locator(".desktop-brand")).toBeVisible();
    await expect(page.locator(".header-brand-pill")).toBeHidden();
    await expect.poll(async () => {
      const position = await sidebar.boundingBox();
      return Math.abs(position!.x + position!.width - page.viewportSize()!.width);
    }).toBeLessThan(1);
  }
  const navigation = sidebar.getByRole("navigation");
  await expect(navigation.getByRole("link", { name: "Shirts", exact: true })).toHaveAttribute("href", "/collections/shirts");
  await expect(navigation.getByRole("link", { name: /T-shirts/ })).toHaveAttribute("href", "/collections/t-shirts");
  await expect(navigation.getByText("Sold out")).toBeVisible();
  expect(await sidebar.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await sidebar.screenshot({ path: testInfo.outputPath("navigation.png") });
  await page.keyboard.press("Escape");
  await expect(sidebar).toHaveCount(0);
  await expect(open).toBeFocused();
  await open.click();
  await sidebar.getByRole("navigation").getByRole("link", { name: "Shirts", exact: true }).click();
  await expect(page).toHaveURL(/\/collections\/shirts$/);
  await expect(sidebar).toHaveCount(0);
  await open.click();
  await sidebar.getByRole("navigation").getByRole("link", { name: /T-shirts/ }).click();
  await expect(page).toHaveURL(/\/collections\/t-shirts$/);
  await expect(sidebar).toHaveCount(0);
});
