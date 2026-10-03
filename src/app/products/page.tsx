"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api, errMsg } from "@/lib/api";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Spinner from "@/components/Spinner";
import { Ico } from "@/components/Icons";

const PAGE_SIZE = 40;

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductsInner />
    </Suspense>
  );
}

function PageLoader() {
  return (
    <div className="container-x flex min-h-[40vh] items-center justify-center">
      <Spinner />
    </div>
  );
}

function ProductsInner() {
  const params = useSearchParams();
  const search = (params.get("search") ?? "").trim();
  const category = params.get("category") ?? "";
  const brand = params.get("brand") ?? "";
  const sort = params.get("sort") ?? "";

  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const matches = (p: Product, term: string) => {
    const t = term.toLowerCase();
    return (
      p.title?.toLowerCase().includes(t) ||
      p.brand?.name?.toLowerCase().includes(t) ||
      p.category?.name?.toLowerCase().includes(t) ||
      p.subcategory?.some((s) => s.name?.toLowerCase().includes(t))
    );
  };

  // The public API's `search` query param currently returns zero results, so search is
  // performed client-side against a single large page while category/brand stay server-side.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setPage(1);

    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (brand) qs.set("brand", brand);
    if (sort) qs.set("sort", sort);

    const run = () => {
      if (search) {
        qs.set("limit", "200");
        return api.getProducts(qs.toString()).then((r) => {
          if (!active) return;
          const found = r.data.filter((p) => matches(p, search));
          setItems(found.slice(0, PAGE_SIZE));
          setTotal(found.length);
          setHasMore(found.length > PAGE_SIZE);
        });
      }

      qs.set("limit", String(PAGE_SIZE));
      qs.set("page", "1");
      return api.getProducts(qs.toString()).then((r) => {
        if (!active) return;
        setItems(r.data);
        setTotal(r.totalDocs);
        setHasMore(r.totalDocs > r.data.length);
      });
    };

    run()
      .catch((e) => active && setError(errMsg(e)))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [search, category, brand, sort]);

  const loadMore = async () => {
    if (search) {
      const next = page + 1;
      const qs = new URLSearchParams({ limit: "200" });
      if (category) qs.set("category", category);
      if (brand) qs.set("brand", brand);
      if (sort) qs.set("sort", sort);
      try {
        const r = await api.getProducts(qs.toString());
        const found = r.data.filter((p) => matches(p, search));
        const merged = [...items, ...found];
        setItems(merged.slice(0, next * PAGE_SIZE));
        setPage(next);
        setHasMore(found.length > next * PAGE_SIZE);
      } catch (e) {
        setError(errMsg(e));
      }
      return;
    }

    const next = page + 1;
    const qs = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(next) });
    if (category) qs.set("category", category);
    if (brand) qs.set("brand", brand);
    if (sort) qs.set("sort", sort);
    try {
      const r = await api.getProducts(qs.toString());
      const newLen = items.length + r.data.length;
      setItems((prev) => [...prev, ...r.data]);
      setPage(next);
      setHasMore(r.totalDocs > newLen);
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div>
      {/* Page hero */}
      <section className="bg-linear-to-br from-primary-600 via-primary-500 to-primary-400 py-10 text-white">
        <div className="container-x">
          <nav className="flex items-center gap-2 text-sm text-white/80" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Ico name="home" className="text-xs" />
              Home
            </Link>
            <Ico name="chevron-right" className="text-[10px]" />
            <span className="font-medium text-white">All Products</span>
          </nav>
          <div className="mt-5 flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
              <Ico name="box-open" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {search ? `Results for "${search}"` : category ? "Category Products" : brand ? "Brand Products" : "All Products"}
              </h1>
              <p className="mt-2 text-sm text-white/85">
                {search || category || brand
                  ? `${total} product${total === 1 ? "" : "s"} found`
                  : "Explore our complete product collection with the best prices and fast delivery."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x py-8">
        <p className="mb-6 text-sm text-fg-muted">
          Showing <span className="font-semibold text-fg">{items.length}</span> of{" "}
          <span className="font-semibold text-fg">{total}</span> products
        </p>

        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Ico name="box-open" className="mb-4 text-5xl text-fg-subtle" />
            <p className="text-fg-muted">{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary mt-6">
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Ico name="box-open" className="mb-4 text-6xl text-fg-subtle" />
            <h2 className="text-lg font-semibold text-fg">No products found</h2>
            <p className="mt-1 text-sm text-fg-muted">Try adjusting your search or filters.</p>
            <Link href="/products" className="btn btn-primary mt-6">
              Back to All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
              {items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  className="btn btn-primary px-8"
                >
                  Load More Products
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}