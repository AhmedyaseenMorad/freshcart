"use client";

import Link from "next/link";
import { useAuth, useCart, useWishlist } from "@/lib/store";
import { Ico } from "@/components/Icons";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { items } = useWishlist();

  if (!user) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-surface-3">
          <Ico name="user-far" className="text-5xl text-fg-subtle" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-fg">Please sign in</h2>
        <Link
          href="/login?redirect=%2Fprofile"
          className="rounded-full bg-primary-600 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const cards = [
    {
      icon: "orders" as const,
      title: "My Orders",
      sub: "Track and view your order history",
      href: "/profile/orders",
    },
    {
      icon: "heart-far" as const,
      title: "Wishlist",
      sub: `${items.length} saved product${items.length === 1 ? "" : "s"}`,
      href: "/wishlist",
    },
    {
      icon: "cart" as const,
      title: "Shopping Cart",
      sub: `${count} item${count === 1 ? "" : "s"} in your cart`,
      href: "/cart",
    },
    {
      icon: "tag" as const,
      title: "Deals",
      sub: "Check out today's best offers",
      href: "/deals",
    },
  ];

  return (
    <div className="bg-surface-2/50">
      <div className="container-x py-10">
        <h1 className="mb-8 text-2xl font-bold text-fg md:text-3xl">My Account</h1>

        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-line-2 bg-card p-6 md:flex-row md:items-center">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-600 text-3xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-fg">{user.name}</h2>
            <p className="mt-0.5 text-sm text-fg-muted">{user.email}</p>
            <p className="mt-0.5 text-sm text-fg-muted">{user.phone}</p>
          </div>
          <button
            onClick={() => {
              logout();
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-line-2 px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Ico name="signout" className="text-xs" />
            Sign Out
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group rounded-2xl border border-line-2 bg-card p-6 transition-shadow hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                <Ico name={c.icon} className="text-lg" />
              </span>
              <h3 className="mt-4 font-semibold text-fg">{c.title}</h3>
              <p className="mt-1 text-sm text-fg-muted">{c.sub}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                Go
                <Ico name="arrow-right" className="text-xs" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}