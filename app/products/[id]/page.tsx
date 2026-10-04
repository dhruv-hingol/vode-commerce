import { notFound } from "next/navigation";
import { findProduct, products } from "@/lib/products";
import { breadcrumbs, pageMetadata, productStructuredData } from "@/lib/seo";
import ProductDetail from "@/components/product-detail";
import StructuredData from "@/components/structured-data";

export function generateStaticParams() {
  return products.map(({ id }) => ({ id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) notFound();
  return pageMetadata(
    product.name + " — " + product.category,
    product.description +
      (product.isSample
        ? " Preview product; details and prices are illustrative."
        : " Select your size and color and order from VODE on WhatsApp."),
    "/products/" + product.id,
    product.isSample,
  );
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) notFound();
  return (
    <>
      <StructuredData
        data={breadcrumbs(product.name, "/products/" + product.id)}
      />
      <StructuredData data={productStructuredData(product)} />
      <ProductDetail key={product.id} product={product} />
    </>
  );
}
