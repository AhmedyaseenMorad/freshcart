"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCart, useToast } from "@/lib/store";
import { useWishlist } from "@/lib/store";
import { img } from "@/lib/api";
import Stars from "./Stars";
import { Ico } from "./Icons";

export default function ProductCard({ product, className = "" }: { product: Product; className?: string }) {
  const router = useRouter();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const [comparison, setComparison] = useState(false);

  const wished = has(product._id);
  const price = product.priceAfterDiscount ?? product.price;
  const old = product.priceAfterDiscount ? product.price : undefined;
  const out = product.quantity <= 0;

  const onAdd = async () => {
    try {
      const ok = await add(product._id);
      if (ok) toast("Added to cart");
      else {
        toast("Please sign in first", "error");
        router.push("/login");
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not add to cart", "error");
    }
  };

  const onHeart = async () => {
    try {
      await toggle(product);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Please sign in first", "error");
      router.push("/login");
    }
  };

  return (
    <div
      id="product-card"
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-line-2 bg-card transition-shadow hover:shadow-md ${
        out ? "opacity-70" : ""
      } ${className}`}
    >
      <div className="relative overflow-hidden bg-card">
        <Link href={`/products/${product._id}`} aria-label={product.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img(product.imageCover) ?? ""}
            alt={product.title}
            className="h-48 w-full object-contain transition-transform duration-300 group-hover:scale-105 lg:h-60"
            loading="lazy"
          />
        </Link>
        {out && (
          <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-[10px] font-semibold uppercase text-white">
            Sold Out
          </span>
        )}
        <div className="absolute right-3 top-3 flex flex-col space-y-2">
          <button
            onClick={onHeart}
            aria-label="Add to wishlist"
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-md transition-colors ${
              wished ? "text-red-500 hover:bg-red-50" : "text-fg-muted hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Ico name={wished ? "heart" : "heart-far"} className="text-sm" />
          </button>
          <button
            onClick={() => {
              const next = !comparison;
              setComparison(next);
              toast(next ? "Added to comparison" : "Removed from comparison");
            }}
            aria-label="Compare product"
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-md transition-colors ${
              comparison ? "text-primary-600" : "text-fg-muted"
            } hover:bg-primary-50 hover:text-primary-600`}
          >
            <Ico name="rotate" className="text-sm" />
          </button>
          <Link
            href={`/products/${product._id}`}
            aria-label="View product"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-fg-muted shadow-md transition-colors hover:text-primary-600"
          >
            <Ico name="eye-far" className="text-sm" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 truncate text-xs text-fg-muted">{product.category?.name ?? product.brand?.name ?? ""}</p>
        <h3 className="mb-1 line-clamp-2 cursor-pointer text-sm font-medium text-fg transition-colors group-hover:text-primary-600 md:text-base">
          <Link href={`/products/${product._id}`}>{product.title}</Link>
        </h3>
        <div className="mb-3 flex items-center">
          <Stars value={product.ratingsAverage ?? 0} />
          <span className="ml-2 text-xs text-fg-muted">
            {product.ratingsQuantity ?? 0} ({product.ratingsQuantity ?? 0})
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-fg">{price} EGP</span>
            {old !== undefined && <span className="text-sm text-fg-subtle line-through">{old} EGP</span>}
          </div>
          <button
            onClick={onAdd}
            disabled={out}
            aria-label="Add to cart"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Ico name="plus" className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}