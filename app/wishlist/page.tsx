import { Suspense } from "react";
import Catalogue from "@/components/catalogue";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Your Wishlist",
  "Your personal edit of VODE favourites.",
  "/wishlist",
  true,
);
export default function Wishlist() {
  return (
    <main className="page-wrap shop-page" id="main-content">
      <div className="collection-intro">
        <p className="eyebrow">KEEP WHAT SPEAKS TO YOU</p>
        <h1>
          Your personal <em>edit.</em>
        </h1>
        <p>A few favourites. A style entirely your own.</p>
      </div>
      <Suspense fallback={<p role="status">Loading your favourites…</p>}>
        <Catalogue wishlist />
      </Suspense>
    </main>
  );
}
