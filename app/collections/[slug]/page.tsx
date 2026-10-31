import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections } from "@/lib/config";
import { pageMetadata, breadcrumbs } from "@/lib/seo";
import Catalogue from "@/components/catalogue";
import StructuredData from "@/components/structured-data";
export function generateStaticParams() {
  return collections.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();
  return pageMetadata(
    collection.name + " India",
    collection.description,
    `/collections/${slug}`,
  );
}
export default async function Collection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();
  return (
    <main className="page-wrap shop-page" id="main-content">
      <StructuredData
        data={breadcrumbs(collection.name, `/collections/${slug}`)}
      />
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        {collection.name}
      </div>
      <div className="collection-intro">
        <p className="eyebrow">{collection.name.toUpperCase()}</p>
        <h1>{collection.title}</h1>
        <p>{collection.description}</p>
      </div>
      <Suspense
        fallback={
          <div className="loading-grid" aria-label="Loading collection" />
        }
      >
        <Catalogue
          category={
            slug === "shirts"
              ? "Shirts"
              : slug === "t-shirts"
                ? "T-shirts"
                : undefined
          }
          productIds={collection.productIds}
          audience={
            slug === "men" ? "men" : slug === "women" ? "women" : undefined
          }
        />
      </Suspense>
    </main>
  );
}
