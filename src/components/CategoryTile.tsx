import Link from "next/link";
import type { Category } from "@/lib/types";
import { img } from "@/lib/api";

export default function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category._id}`}
      className="group cursor-pointer rounded-lg bg-card p-4 text-center shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-100 transition-colors group-hover:bg-primary-200">
        {category.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img(category.image) ?? ""} alt={category.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <span className="text-xl font-bold text-primary-600">{category.name.charAt(0)}</span>
        )}
      </div>
      <h3 className="truncate text-center text-sm font-medium text-fg transition-colors group-hover:text-primary-600">
        {category.name}
      </h3>
    </Link>
  );
}