import { test, expect } from "@playwright/test";

test("SEO content and metadata are readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: "http://localhost:3000",
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page).toHaveTitle(/Shirts, T-Shirts & Unisex Clothing.*VODE/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /^https:\/\/vode-style\.vercel\.app\/?$/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /^https:\/\/vode-style\.vercel\.app\/opengraph-image/,
    );
    const homeData = JSON.parse(
      (await page
        .locator('script[type="application/ld+json"]')
        .first()
        .textContent()) || "{}",
    );
    expect(
      homeData["@graph"].map((entry: { "@type": string }) => entry["@type"]),
    ).toContain("Organization");

    await page.goto("/help");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://vode-style.vercel.app/help",
    );
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const faq = scripts
      .map((text) => JSON.parse(text))
      .find((data) => data["@type"] === "FAQPage");
    expect(faq.mainEntity.length).toBeGreaterThan(5);
    for (const entry of faq.mainEntity) {
      await expect(
        page.getByRole("heading", { name: entry.name, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText(entry.acceptedAnswer.text, { exact: true }),
      ).toBeVisible();
    }
    await page.goto("/style-guide");
    await expect(
      page.getByRole("heading", { name: "What does unisex fit mean for you?" }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /index, follow/,
    );
    for (const path of ["/checkout", "/products/everyday-tee"]) {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://vode-style.vercel.app" + path,
      );
    }
  } finally {
    await context.close();
  }
});

test("robots, sitemap, social preview and brand icon are served", async ({
  request,
}) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain(
    "Sitemap: https://vode-style.vercel.app/sitemap.xml",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("https://vode-style.vercel.app/help");
  expect(await sitemap.text()).not.toContain("/checkout");
  expect(await sitemap.text()).not.toContain("/products/everyday-tee");
  const preview = await request.get("/opengraph-image");
  expect(preview.ok()).toBeTruthy();
  expect(preview.headers()["content-type"]).toContain("image/png");
  const icon = await request.get("/icon.svg");
  expect(icon.ok()).toBeTruthy();
});
