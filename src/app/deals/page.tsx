"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, errMsg } from "@/lib/api";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Spinner from "@/components/Spinner";
import { Ico } from "@/components/Icons";

export default function DealsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api
      .getProducts("limit=150")
      .then((r) => active && setItems(r.data.filter((p) => p.priceAfterDiscount)))
      .catch((e) => active && setError(errMsg(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <section className="bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 py-10 text-white">
        <div className="container-x">
          <nav className="flex items-center gap-2 text-sm text-white/80" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Ico name="home" className="text-xs" />
              Home
            </Link>
            <Ico name="chevron-right" className="text-[10px]" />
            <span className="font-medium text-white">Deals</span>
          </nav>
          <div className="mt-5 flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
              <Ico name="fire" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Hot Deals</h1>
              <p className="mt-2 text-sm text-white/85">
                {loading ? "Loading the latest discounts..." : `We found ${items.length} products on sale — grab them before they're gone!`}
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
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Ico name="tag" className="mb-4 text-6xl text-fg-subtle" />
            <h2 className="text-lg font-semibold text-fg">No active deals right now</h2>
            <p className="mt-1 text-sm text-fg-muted">Check back soon for new offers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
            {items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}