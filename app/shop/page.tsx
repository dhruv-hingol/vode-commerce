import { Suspense } from "react";
import Link from "next/link";
import Catalogue from "@/components/catalogue";
import { pageMetadata, breadcrumbs } from "@/lib/seo";
import StructuredData from "@/components/structured-data";
export const metadata = pageMetadata(
  "Shop Pure Cotton Embroidered Shirts",
  "Explore the VODE edit: pure cotton pinstripe shirts with expressive embroidery. Find your own expression of everyday style.",
  "/shop",
);
export default function Shop() {
  return (
    <main className="page-wrap shop-page" id="main-content">
      <StructuredData data={breadcrumbs("Shop", "/shop")} />
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span> The collection
      </div>
      <div className="collection-intro">
        <p className="eyebrow">THE NEW VODE PERSPECTIVE</p>
        <h1>
          A considered <em>collection.</em>
        </h1>
        <p>
          Contemporary silhouettes. Thoughtful details. Your everyday, elevated.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="loading-grid" aria-label="Loading collection" />
        }
      >
        <Catalogue />
      </Suspense>
    </main>
  );
}
