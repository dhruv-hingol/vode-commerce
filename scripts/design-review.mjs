import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

const browser = await chromium.launch({ channel: "msedge", headless: true });
await fs.mkdir("test-results/design", { recursive: true });
const failures = [];
const routes = [
  "/",
  "/shop",
  "/collections/shirts",
  "/collections/men",
  "/products/11-11-cotton-shirt",
  "/wishlist",
  "/checkout",
  "/about",
  "/contact",
  "/help",
  "/style-guide",
  "/policies/shipping",
  "/policies/returns",
  "/policies/privacy",
  "/policies/terms",
];
for (const [name, size] of [
  ["desktop", { width: 1440, height: 1000 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({
    viewport: size,
    reducedMotion: "reduce",
  });
  page.on("pageerror", (error) => failures.push(`${name}: ${error.message}`));
  for (const route of routes) {
    const response = await page.goto(`http://localhost:3000${route}`, {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    if (response.status() !== 200)
      failures.push(`${name} ${route}: HTTP ${response.status()}`);
    if ((await page.locator("h1").count()) !== 1)
      failures.push(`${name} ${route}: expected one h1`);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    if (overflow) failures.push(`${name} ${route}: horizontal overflow`);
    if (route === "/") {
      const imageFilter = await page.locator(".hero-image img").evaluate(img => getComputedStyle(img).filter);
      if (imageFilter !== "none") failures.push(`${name}: hero photo is not in natural colour`);
      const background = await page.locator("body").evaluate(body => getComputedStyle(body).backgroundColor);
      if (background !== "rgb(255, 255, 255)") failures.push(`${name}: expected a white page background`);
    }
    if (
      [
        "/",
        "/shop",
        "/products/11-11-cotton-shirt",
        "/about",
        "/contact",
        "/help",
      ].includes(route)
    ) {
      // Trigger lazy images and viewport reveals before a full-page capture.
      for (
        let y = 0;
        y < (await page.evaluate(() => document.body.scrollHeight));
        y += 650
      ) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(90);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await page.evaluate(() =>
        Promise.all(
          [...document.images].map((image) => image.decode().catch(() => {})),
        ),
      );
      const broken = await page.evaluate(() =>
        [...document.images]
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => img.src),
      );
      if (broken.length)
        failures.push(`${name} ${route}: ${broken.length} broken images`);
      await page.screenshot({
        path: `test-results/design/${name}-${route === "/" ? "home" : route.split("/").at(-1)}.png`,
        fullPage: true,
      });
    }
    console.log(
      `${name} ${route}: ${response.status()}${overflow ? " OVERFLOW" : ""}`,
    );
  }
  // Review checkout with an actual bag rather than only its empty state.
  await page.goto("http://localhost:3000/products/11-11-cotton-shirt");
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.locator(".product-add").click();
  await page.getByRole("link", { name: /PROCEED TO CHECKOUT/ }).click();
  await page.screenshot({
    path: `test-results/design/${name}-checkout-filled.png`,
    fullPage: true,
  });
  if (
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    )
  )
    failures.push(`${name} filled checkout: horizontal overflow`);
  await page.close();
}
await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
