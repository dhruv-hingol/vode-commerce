import { test, expect } from "@playwright/test";

test("catalogue to WhatsApp: variants, persistence, validation, retained cart and manual clear", async ({
  page,
  context,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() => {
    const target = window as unknown as { openedUrls: string[] };
    target.openedUrls = [];
    window.open = (url) => {
      target.openedUrls.push(String(url));
      return null;
    };
  });
  await page.goto("/");
  await page.getByRole("link", { name: /The Everyday Tee/ }).click();
  await page.getByRole("button", { name: "ADD TO CART" }).click();
  await expect(page.getByRole("alert")).toContainText("Choose your size");
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "ADD TO CART" }).click();
  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await expect(drawer.locator(".cart-item")).toHaveCount(1);
  await expect(
    drawer.getByRole("button", { name: "Close cart" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole("button", { name: "ADD TO CART" })).toBeFocused();

  await page.getByRole("button", { name: "ADD TO CART" }).click();
  await expect(drawer.locator(".quantity-control span")).toHaveText("2");
  await drawer.getByRole("button", { name: /Increase quantity/ }).click();
  await expect(drawer.locator(".quantity-control span")).toHaveText("3");
  await drawer.getByRole("button", { name: /Decrease quantity/ }).click();
  await drawer.getByRole("combobox").selectOption("L");
  await drawer.getByRole("button", { name: "Close cart" }).click();
  await page.getByRole("button", { name: "ADD TO CART" }).click();
  await expect(drawer.locator(".cart-item")).toHaveCount(2);
  await drawer.getByRole("combobox").last().selectOption("L");
  await expect(drawer.locator(".cart-item")).toHaveCount(1);
  await expect(drawer.locator(".quantity-control span")).toHaveText("3");
  await expect(drawer.locator(".final-total")).toContainText("₹2,997.00");

  await drawer.getByRole("button", { name: "Close cart" }).click();
  await page.getByRole("button", { name: "Chalk", exact: true }).click();
  await page.getByRole("button", { name: "ADD TO CART" }).click();
  await expect(drawer.locator(".cart-item")).toHaveCount(2);
  await drawer
    .getByRole("button", { name: "Remove The Everyday Tee, M, Chalk" })
    .click();
  await expect(drawer.locator(".cart-item")).toHaveCount(1);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Open cart, 3 items" }),
  ).toBeVisible();
  const reopened = await context.newPage();
  await reopened.goto("/checkout");
  await expect(
    reopened.locator(".order-summary .quantity-control span"),
  ).toHaveText("3");
  await reopened.close();

  await page.getByRole("button", { name: "Open cart, 3 items" }).click();
  await expect(drawer.getByRole("combobox")).toHaveValue("L");
  await page.screenshot({
    path: testInfo.outputPath("cart.png"),
    fullPage: true,
  });
  await drawer.getByRole("link", { name: /PROCEED TO CHECKOUT/ }).click();
  await expect(page).toHaveURL(/checkout/);
  await page.getByRole("button", { name: /ORDER ON WHATSAPP/ }).click();
  await expect(page.locator("input[aria-invalid='true']")).toHaveCount(6);
  await expect(page.getByLabel("Full name")).toBeFocused();
  await page.getByLabel("Full name").fill("Asha Shah");
  await page.getByLabel("Phone number").fill("123");
  await page.getByLabel("Email address").fill("wrong-email");
  await page.getByLabel("Address *", { exact: true }).fill("12 River Road");
  await page.getByLabel("Address line 2").fill("Flat 4");
  await page.getByLabel("City").fill("Ahmedabad");
  await page.getByLabel("State").fill("Gujarat");
  await page.getByLabel("Pincode").fill("000000");
  await page.getByRole("button", { name: /ORDER ON WHATSAPP/ }).click();
  await expect(page.locator("input[aria-invalid='true']")).toHaveCount(3);
  await page.getByLabel("Phone number").fill("9876543210");
  await page.getByLabel("Email address").fill("asha@example.com");
  await page.getByLabel("Pincode").fill("380001");
  await page.getByLabel("Landmark").fill("Near the park");
  await page
    .getByLabel("Additional notes")
    .fill("Call first & ring once. नमस्ते");
  await page.getByRole("button", { name: /ORDER ON WHATSAPP/ }).click();
  await expect(page.getByText("Your message is ready.")).toBeVisible();
  const opened = await page.evaluate(
    () => (window as unknown as { openedUrls: string[] }).openedUrls,
  );
  expect(opened).toHaveLength(1);
  const url = new URL(opened[0]);
  expect(url.origin).toBe("https://wa.me");
  expect(url.pathname).toMatch(/^\/[1-9]\d{7,14}$/);
  const message = url.searchParams.get("text")!;
  for (const value of [
    "Hello VODE,",
    "Asha Shah",
    "12 River Road, Flat 4",
    "Size: L",
    "Color: Ink",
    "Quantity: 3",
    "Final Total: ₹2,997.00",
    "Call first & ring once. नमस्ते",
  ])
    expect(message).toContain(value);
  await expect(
    page.getByRole("link", { name: /WhatsApp didn’t open/ }),
  ).toHaveAttribute("href", opened[0]);
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("vode-cart")!).state.items[0].quantity,
    ),
  ).toBe(3);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("checkout.png"),
    fullPage: true,
  });
  await page
    .locator(".order-summary")
    .getByRole("button", { name: /Increase quantity/ })
    .click();
  await expect(page.getByText("Your message is ready.")).not.toBeVisible();
  await page.getByRole("button", { name: /ORDER ON WHATSAPP/ }).click();
  await page.getByRole("button", { name: /ORDER SENT — CLEAR CART/ }).click();
  await expect(
    page.getByRole("heading", { name: "Your bag is empty." }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your bag is empty." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("vode-cart")!).state.items,
    ),
  ).toEqual([]);
  expect(errors).toEqual([]);
});

test("corrupt persisted cart recovers and still allows shopping", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("vode-cart", "{bad-json"),
  );
  await page.goto("/products/studio-shirt");
  await expect(page.getByRole("status")).toContainText(
    "could not save or restore",
  );
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "ADD TO CART" }).click();
  await expect(page.getByRole("dialog").locator(".cart-item")).toHaveCount(1);
});

test("blocked persistence keeps cart usable for the current visit", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    });
  });
  await page.goto("/products/everyday-tee");
  await expect(page.getByRole("status")).toContainText(
    "could not save or restore",
  );
  await page.getByRole("button", { name: "S", exact: true }).click();
  await page.getByRole("button", { name: "ADD TO CART" }).click();
  await expect(page.getByRole("dialog").locator(".cart-item")).toHaveCount(1);
  await page
    .getByRole("dialog")
    .getByRole("link", { name: /PROCEED TO CHECKOUT/ })
    .click();
  await expect(page.locator(".order-summary .cart-item")).toHaveCount(1);
});
