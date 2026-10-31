import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { collections } from "@/lib/config";
import { absoluteUrl, isPreview } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreview) return [];
  return [
    "/",
    "/style-guide",
    "/help",
    "/shop",
    "/about",
    "/contact",
    ...collections.map((collection) => "/collections/" + collection.slug),
    ...products
      .filter((product) => !product.isSample)
      .map((product) => "/products/" + product.id),
  ].map((path) => ({ url: absoluteUrl(path) }));
}
