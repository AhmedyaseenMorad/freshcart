"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api, errMsg } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Spinner from "@/components/Spinner";
import { Ico } from "@/components/Icons";

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      api.getCategory(id),
      api.getProducts(`limit=40&category=${encodeURIComponent(id)}`),
    ])
      .then(([c, p]) => {
        if (!active) return;
        setCategory(c.data);
        setProducts(p.data);
      })
      .catch((e) => active && setError(errMsg(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div>
      <section className="bg-linear-to-br from-primary-600 via-primary-500 to-primary-400 py-10 text-white">
        <div className="container-x">
          <nav className="flex items-center gap-2 text-sm text-white/80" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Ico name="home" className="text-xs" />
              Home
            </Link>
            <Ico name="chevron-right" className="text-[10px]" />
            <Link href="/categories" className="transition-colors hover:text-white">
              Categories
            </Link>
            <Ico name="chevron-right" className="text-[10px]" />
            <span className="font-medium text-white">{category?.name ?? "..."}</span>
          </nav>
          <div className="mt-5 flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/20 backdrop-blur-sm">
              {category?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={category.image.startsWith("http") ? category.image : `https://ecommerce.routemisr.com/${category.image.replace(/^\/+/, "")}`}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Ico name="box-open" className="text-3xl" />
              )}
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category?.name ?? "Loading..."}</h1>
              <p className="mt-2 text-sm text-white/85">
                {products.length > 0 ? `${products.length} products in this category` : "Browse this collection"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x py-8">
        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-fg-muted">{error}</p>
            <Link href="/categories" className="btn btn-primary mt-6">
              Back to Categories
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Ico name="box-open" className="mb-4 text-6xl text-fg-subtle" />
            <h2 className="text-lg font-semibold text-fg">No products found</h2>
            <Link href="/products" className="btn btn-primary mt-6">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}