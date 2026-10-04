import { notFound } from "next/navigation";
import { findProduct, products } from "@/lib/products";
import ProductDetail from "@/components/product-detail";

export function generateStaticParams() {
  return products.map(({ id }) => ({ id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: (findProduct(id)?.name ?? "Product not found") + " | VODE" };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) notFound();
  return <ProductDetail key={product.id} product={product} />;
}
