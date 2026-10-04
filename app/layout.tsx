import type { Metadata } from "next";
import ShopShell from "@/components/shop-shell";
import { isPreview, siteDescription, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VODE | Shirts, T-Shirts & Unisex Clothing",
    template: "%s | VODE",
  },
  description: siteDescription,
  applicationName: "VODE",
  robots: { index: !isPreview, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body>
        <ShopShell>{children}</ShopShell>
      </body>
    </html>
  );
}
