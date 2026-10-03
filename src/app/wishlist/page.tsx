"use client";

import Link from "next/link";
import { useAuth, useWishlist } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import { Ico } from "@/components/Icons";

export default function WishlistPage() {
  const { user } = useAuth();
  const { items } = useWishlist();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-2/50 px-4 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-3">
          <Ico name="heart-far" className="text-2xl text-fg-subtle" />
        </div>
        <h2 className="text-2xl font-bold text-fg">Please sign in</h2>
        <p className="mt-2 text-fg-muted">Sign in to see the products you&apos;ve saved.</p>
        <Link href="/login?redirect=%2Fwishlist" className="btn btn-primary mt-6">
          Sign In
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-2/50 px-4 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-3">
          <Ico name="heart-far" className="text-2xl text-fg-subtle" />
        </div>
        <h2 className="text-2xl font-bold text-fg">Your wishlist is empty</h2>
        <p className="mt-2 text-fg-muted">Save your favourite products and check back anytime.</p>
        <Link href="/products" className="btn btn-primary mt-6">
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-2/50">
      <div className="container-x py-8">
        <h1 className="mb-2 text-2xl font-bold text-fg md:text-3xl">My Wishlist</h1>
        <p className="mb-8 text-sm text-fg-muted">
          {items.length} saved product{items.length === 1 ? "" : "s"}
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 xl:grid-cols-5">
          {items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}