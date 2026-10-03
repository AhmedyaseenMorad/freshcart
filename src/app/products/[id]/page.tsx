import { getStaticProductIds } from "@/lib/api";
import ProductDetailClient from "./ProductDetailClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  const ids = await getStaticProductIds();
  return ids.map((id) => ({ id }));
}

export default function Page() {
  return <ProductDetailClient />;
}