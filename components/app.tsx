import type { ReactNode } from "react";
import ShopShell from "./shop-shell";
import SiteFooter from "./site-footer";

/** Shared application chrome. Interactive navigation and cart state live in ShopShell. */
export default function App({ children }: { children: ReactNode }) {
  return (
    <ShopShell>
      {children}
      <SiteFooter />
    </ShopShell>
  );
}
