import { expect, test } from "@playwright/test";

test("two original shirts, simplified navigation and shareable filters", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await expect(page.locator(".desktop-nav a")).toHaveCount(1);
  await expect(page.locator(".desktop-nav a")).toHaveText(["New Arrival"]);
  await expect(page.locator(".desktop-nav a")).toHaveAttribute("href", "/collections/shirts");
  await page.locator(".product-grid").scrollIntoViewIfNeeded();
  expect(await page.locator(".product-grid").evaluate(grid => getComputedStyle(grid).gridTemplateColumns.split(" ").length)).toBe(2);
  await page.getByRole("button", { name: /FILTER & SORT/ }).click();
  await expect(page.getByRole("complementary", { name: "Filter products" })).toBeVisible();
  await page.getByRole("button", { name: "Chalk", exact: true }).click();
  await expect(page).toHaveURL(/color=Chalk/);
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-name")).toContainText("Que Sera");
  await page.getByLabel("Sort by").selectOption("price-asc");
  await page.reload();
  await expect(page.locator(".product-name")).toContainText("Que Sera");
  await page.getByRole("button", { name: /FILTER & SORT/ }).click();
  await page.getByRole("link", { name: /CLEAR ALL FILTERS/ }).click();
  await expect(page.locator(".product-card")).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("campaign video, editorial rail and product photos work", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const campaign = page.getByRole("region", { name: "VODE campaign video" });
  await expect(campaign.locator(".hero-video")).toBeVisible();
  await expect(campaign.getByRole("button")).toHaveCount(0);
  await expect(campaign.locator(".campaign-still, .campaign-navigation, .campaign-editorial-copy")).toHaveCount(0);

  const product = page.locator("#new-drop .product-card").first();
  await product.getByRole("button", { name: /Show photo 2/ }).click();
  await expect(product.getByRole("button", { name: /Show photo 2/ })).toHaveAttribute("aria-current", "true");
  const rail = page.locator("#campaign-edit-track");
  await page.getByRole("button", { name: "Next campaign detail" }).click();
  await expect.poll(() => rail.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: "Previous campaign detail" })).toBeEnabled();
  await page.getByRole("button", { name: "Previous campaign detail" }).click();
  await expect.poll(() => rail.evaluate(element => element.scrollLeft)).toBeLessThan(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/");
  await page.screenshot({ path: testInfo.outputPath("campaign-home.png"), fullPage: true });
});

test("original photo pairs, wishlist persistence and quick add", async ({ page }) => {
  await page.goto("/");
  const drop = page.locator("#new-drop");
  await expect(drop.locator(".product-card")).toHaveCount(2);
  await expect(drop.locator(".product-photo img").nth(0)).toHaveAttribute("src", /eleven-eleven-01/);
  await expect(drop.locator(".product-photo img").nth(1)).toHaveAttribute("src", /eleven-eleven-02/);
  await expect(drop.locator(".product-photo img").nth(2)).toHaveAttribute("src", /eleven-eleven-closeup-chest/);
  await expect(drop.locator(".product-photo img").nth(3)).toHaveAttribute("src", /eleven-eleven-closeup-collar/);
  await expect(drop.locator(".product-photo img").nth(4)).toHaveAttribute("src", /que-sera-01/);
  await expect(drop.locator(".product-photo img").nth(5)).toHaveAttribute("src", /que-sera-02/);
  await expect(drop.locator(".product-photo img").nth(6)).toHaveAttribute("src", /que-sera-closeup-collar/);
  await expect(drop.locator(".product-photo img").nth(7)).toHaveAttribute("src", /que-sera-closeup-chest/);
  const first = drop.locator(".product-card").first();
  await first.getByRole("button", { name: "Save to wishlist" }).click();
  await page.reload();
  await expect(page.locator(".header-wishlist")).toHaveAccessibleName("Wishlist, 1 items");
  await page.locator(".header-wishlist").click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.locator(".product-photo").hover();
  await page.getByRole("button", { name: "ADD TO CART", exact: true }).click();
  const quick = page.getByRole("dialog", { name: /Quick view/ });
  await quick.getByRole("button", { name: "M", exact: true }).click();
  await quick.getByRole("button", { name: "ADD TO BAG" }).click();
  const bag = page.getByRole("dialog", { name: /Your bag/ });
  await expect(bag.locator(".cart-item")).toHaveCount(1);
  await expect(bag.locator(".item-heading")).toContainText("11:11");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Remove from wishlist" }).click();
  await expect(page.locator(".product-card")).toHaveCount(0);
});
