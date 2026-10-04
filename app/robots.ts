import type { MetadataRoute } from "next";
import { absoluteUrl, isPreview } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Keep noindex pages crawlable so engines can actually read their meta directive.
  return {
    rules: isPreview
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
