import type { Metadata } from "next";
import App from "@/components/app";
import { isPreview, siteDescription, siteUrl } from "@/lib/seo";
import "./globals.css";
import "./header.css";
import "./storefront.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VODE | Pure Cotton Embroidered Shirts",
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
      <body id="top">
        <App>{children}</App>
      </body>
    </html>
  );
}
