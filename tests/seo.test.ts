import assert from "node:assert/strict";
import { test } from "node:test";
import { products } from "../lib/products";
import {
  absoluteUrl,
  pageMetadata,
  productStructuredData,
  serializeJsonLd,
} from "../lib/seo";
import sitemap from "../app/sitemap";
import robots from "../app/robots";

test("each page gets its own production canonical and share URL", () => {
  const metadata = pageMetadata("Sizing", "Fit guidance", "/style-guide");
  assert.equal(
    metadata.alternates?.canonical,
    "https://vode-style.vercel.app/style-guide",
  );
  assert.equal(metadata.openGraph?.url, absoluteUrl("/style-guide"));
  assert.equal((metadata.twitter && "card" in metadata.twitter && metadata.twitter.card), "summary_large_image");
});
test("checkout and sample product metadata explicitly prohibit indexing", () => {
  const metadata = pageMetadata("Checkout", "Review", "/checkout", true);
  assert.equal(
    typeof metadata.robots === "object" && metadata.robots?.index,
    false,
  );
  assert.equal(
    typeof metadata.robots === "object" &&
      typeof metadata.robots?.googleBot === "object" &&
      metadata.robots?.googleBot.index,
    false,
  );
});
test("sitemap excludes checkout and samples and automatically includes approved products", () => {
  const initialUrls = sitemap().map((entry) => entry.url);
  assert.deepEqual(initialUrls, [
    absoluteUrl("/"),
    absoluteUrl("/style-guide"),
    absoluteUrl("/help"),
  ]);
  const product = products[0];
  const sample = product.isSample;
  try {
    product.isSample = false;
    assert.ok(
      sitemap().some(
        (entry) => entry.url === absoluteUrl("/products/" + product.id),
      ),
    );
  } finally {
    product.isSample = sample;
  }
  assert.equal(robots().sitemap, absoluteUrl("/sitemap.xml"));
});
test("sample merchandise never produces an Offer and approved data uses actual prices", () => {
  assert.equal(productStructuredData(products[0]), null);
  const data = productStructuredData({
    ...products[0],
    isSample: false,
    discountedPrice: 1234.5,
  });
  assert.equal(data?.offers.price, "1234.50");
  assert.equal(data?.offers.priceCurrency, "INR");
  assert.ok(!("aggregateRating" in data!));
  assert.ok(!("availability" in data!.offers));
});
test("JSON-LD serializes untrusted text without allowing script breakout", () => {
  const malicious = { name: "</script><script>alert(1)</script>" };
  const serialized = serializeJsonLd(malicious);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), malicious);
});
