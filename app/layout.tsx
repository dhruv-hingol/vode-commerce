import type { Metadata } from "next";
import ShopShell from "@/components/shop-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "VODE | Everyday essentials",
  description:
    "Explore VODE, build your bag, and place your order with our team on WhatsApp.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ShopShell>{children}</ShopShell>
      </body>
    </html>
  );
}
