"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api, errMsg } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import CategoryTile from "@/components/CategoryTile";
import ProductCard from "@/components/ProductCard";
import Spinner from "@/components/Spinner";
import { Ico } from "@/components/Icons";

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="container-x flex min-h-[40vh] items-center justify-center"><Spinner /></div>}>
      <CategoriesInner />
    </Suspense>
  );
}

function CategoriesInner() {
  const params = useSearchParams();
  const name = params.get("name") ?? "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(false);
  const [error] = useState("");

  useEffect(() => {
    let active = true;
    api
      .getCategories(1, 40)
      .then((r) => active && setCategories(r.data))
      .catch(() => {})
      .finally(() => active && setLoadingCats(false));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!name) {
      setProducts([]);
      return;
    }
    let active = true;
    setLoadingProds(true);
    api
      .getProducts("limit=200")
      .then((r) => {
        if (!active) return;
        setProducts(
          r.data.filter(
            (p) => p.category?.name && p.category.name.toLowerCase() === name.toLowerCase()
          )
        );
      })
      .catch((e) => active && errMsg(e))
      .finally(() => active && setLoadingProds(false));
    return () => {
      active = false;
    };
  }, [name]);

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
            <span className="font-medium text-white">Categories</span>
          </nav>
          <div className="mt-5 flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
              <Ico name="box-open" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {name ? `Category: ${name}` : "Browse Categories"}
              </h1>
              <p className="mt-2 text-sm text-white/85">
                {name
                  ? `${products.length} product${products.length === 1 ? "" : "s"} found`
                  : "Explore our curated categories to find exactly what you need."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x py-8">
        {loadingCats ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <CategoryTile key={c._id} category={c} />
            ))}
          </div>
        )}

        {error && <p className="py-8 text-center text-fg-muted">{error}</p>}

        {name && (
          <div className="mt-10">
            {loadingProds ? (
              <div className="flex min-h-[20vh] items-center justify-center">
                <Spinner />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-16 text-center">
                <Ico name="box-open" className="mb-4 text-6xl text-fg-subtle" />
                <h2 className="text-lg font-semibold text-fg">No products in this category yet</h2>
                <Link href="/products" className="btn btn-primary mt-6">
                  Browse All Products
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}