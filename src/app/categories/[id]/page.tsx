import { getStaticCategoryIds } from "@/lib/api";
import CategoryDetailClient from "./CategoryDetailClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  const ids = await getStaticCategoryIds();
  return ids.map((id) => ({ id }));
}

export default function Page() {
  return <CategoryDetailClient />;
}