import type { Metadata } from "next";
import type { Product } from "./products";

export const siteUrl = "https://vode-style.vercel.app";
export const siteName = "VODE";
export const siteDescription =
  "Explore VODE shirts, T-shirts and everyday clothing for men, women and unisex styling. Choose your size and color, then order with our team on WhatsApp.";
export const isPreview = process.env.VERCEL_ENV === "preview";
export const absoluteUrl = (path = "/") => new URL(path, siteUrl).toString();

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  noindex = false,
): Metadata {
  const index = !noindex && !isPreview;
  return {
    title: { absolute: title + " | " + siteName },
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName,
      locale: "en_IN",
      title,
      description,
      url: absoluteUrl(path),
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: "VODE — shirts, T-shirts and everyday clothing",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}

export const organization = {
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: siteName,
  url: absoluteUrl(),
  logo: { "@type": "ImageObject", url: absoluteUrl("/vode-logo.png") },
  description: siteDescription,
};

export const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    organization,
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: siteName,
      alternateName: "VODE Style",
      url: absoluteUrl(),
      inLanguage: "en-IN",
      publisher: { "@id": organization["@id"] },
    },
    {
      "@type": "WebPage",
      "@id": absoluteUrl("/#webpage"),
      url: absoluteUrl(),
      name: "VODE | Shirts, T-Shirts & Unisex Clothing",
      description: siteDescription,
      isPartOf: { "@id": absoluteUrl("/#website") },
      about: { "@id": organization["@id"] },
      inLanguage: "en-IN",
    },
  ],
};

export function breadcrumbs(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl() },
      { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) },
    ],
  };
}

export function productStructuredData(product: Product) {
  // Never advertise placeholder prices or inventory as a real merchant offer.
  if (product.isSample) return null;
  const url = absoluteUrl("/products/" + product.id);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url + "#product",
    name: product.name,
    description: product.description,
    image: absoluteUrl(product.image),
    sku: product.id,
    category: product.category,
    brand: { "@type": "Brand", name: siteName },
    url,
    size: [...product.sizes],
    color: product.colors.join(", "),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.discountedPrice.toFixed(2),
      seller: { "@type": "Organization", name: siteName, url: absoluteUrl() },
    },
  };
}
export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
