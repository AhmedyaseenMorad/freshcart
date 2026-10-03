"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useCart, useWishlist } from "@/lib/store";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { Ico } from "./Icons";

const fallbackCategories = [
  "Electronics",
  "Men's Fashion",
  "Women's Fashion",
  "Sportswear",
  "Home & Kitchen",
  "Beauty",
];

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { items: wish } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [cats, setCats] = useState<Category[]>([]);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .getCategories(1, 8)
      .then((r) => {
        if (active) setCats(r.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const categoryNames = useMemo(
    () => (cats.length > 0 ? cats.map((c) => c.name) : fallbackCategories),
    [cats]
  );

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = (e.currentTarget as HTMLFormElement).querySelector<HTMLInputElement>("input")?.value ?? q;
    const term = v.trim();
    if (!term) return;
    setQ("");
    setDrawer(false);
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  const handleSignout = () => {
    logout();
    setDrawer(false);
    router.push("/");
  };

  return (
    <>
      {/* ------------ Top bar ------------ */}
      <div className="hidden border-b border-line text-sm lg:block">
        <div className="container-x flex h-10 items-center justify-between text-fg-muted">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Ico name="truck" className="text-xs text-primary-600" />
              Free Shipping on Orders 500 EGP
            </span>
            <span className="hidden items-center gap-2 md:flex">
              <Ico name="gift" className="text-xs text-primary-600" />
              New Arrivals Daily
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:+18001234567" className="flex items-center gap-2 transition-colors hover:text-primary-600">
              <Ico name="phone" className="text-xs" />
              +1 (800) 123-4567
            </a>
            <span className="h-4 w-px bg-surface-3" />
            <a
              href="mailto:support@freshcart.com"
              className="flex items-center gap-2 transition-colors hover:text-primary-600"
            >
              <Ico name="mail" className="text-xs" />
              support@freshcart.com
            </a>
            <span className="h-4 w-px bg-surface-3" />
            {user ? (
              <Link href="/profile" className="max-w-[160px] truncate transition-colors hover:text-primary-600">
                {user.name}
              </Link>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href="/login" className="transition-colors hover:text-primary-600">
                  Sign In
                </Link>
                <span className="text-fg-subtle">|</span>
                <Link href="/register" className="transition-colors hover:text-primary-600">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------ Header ------------ */}
      <header className="sticky top-0 z-40 bg-card shadow-sm">
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[72px] lg:gap-8">
          <Logo />

          {/* Search (desktop) */}
          <form onSubmit={submitSearch} className="relative hidden flex-1 max-w-2xl lg:block">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-full border border-line-2 bg-surface-2/50 py-3 pl-5 pr-12 text-sm transition-all focus:border-primary-500 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700"
            >
              <Ico name="search" className="text-sm" />
            </button>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            <a
              href="tel:+18001234567"
              className="hidden items-center gap-2 rounded-full p-2.5 transition-colors hover:bg-surface-3 lg:flex"
            >
              <Ico name="headset" className="text-xl text-fg" />
            </a>
            <ThemeToggle />
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative rounded-full p-2.5 transition-colors hover:bg-surface-3"
            >
              <Ico name="heart-far" className="text-xl text-fg" />
              {wish.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  {wish.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative rounded-full p-2.5 transition-colors hover:bg-surface-3"
            >
              <Ico name="cart" className="text-xl text-fg" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                href="/profile"
                className="hidden items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 lg:flex"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[90px] truncate">{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 lg:flex"
              >
                <Ico name="user" className="text-sm" />
                Sign In
              </Link>
            )}

            <button
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white lg:hidden"
            >
              <Ico name="menu" className="text-lg" />
            </button>
          </div>
        </div>

        {/* Nav (desktop) */}
        <nav className="hidden border-t border-line xl:block">
          <div className="container-x flex items-center gap-7">
            <Link
              href="/"
              className="relative py-3 text-sm font-medium text-fg-muted transition-colors hover:text-primary-600"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="relative py-3 text-sm font-medium text-fg-muted transition-colors hover:text-primary-600"
            >
              Shop
            </Link>
            <div
              className="group relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link
                href="/categories"
                className="flex items-center gap-1.5 py-3 text-sm font-medium text-fg-muted transition-colors hover:text-primary-600"
              >
                Categories
                <Ico
                  name="chevron-down"
                  className={`text-[10px] transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
                />
              </Link>
              <div
                className={`absolute left-0 top-full z-50 w-56 rounded-xl border border-line bg-card py-2 shadow-lg transition-all duration-200 ${
                  shopOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                }`}
              >
                {categoryNames.slice(0, 6).map((c, i) => (
                  <Link
                    key={i}
                    href={`/categories?name=${encodeURIComponent(c)}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-fg-muted transition-colors hover:bg-primary-50 hover:text-primary-600"
                  >
                    {c}
                    <Ico name="chevron-right" className="text-[10px] opacity-40" />
                  </Link>
                ))}
                <Link
                  href="/categories"
                  className="mt-1 block border-t border-line px-4 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50"
                >
                  View All Categories
                </Link>
              </div>
            </div>
            <Link
              href="/brands"
              className="relative py-3 text-sm font-medium text-fg-muted transition-colors hover:text-primary-600"
            >
              Brands
            </Link>
            <Link
              href="/deals"
              className="relative py-3 text-sm font-medium text-fg-muted transition-colors hover:text-primary-600"
            >
              <span className="flex items-center gap-1.5">
                <Ico name="fire" className="text-xs text-red-500" />
                Deals
              </span>
            </Link>
            <Link
              href="/contact"
              className="relative py-3 text-sm font-medium text-fg-muted transition-colors hover:text-primary-600"
            >
              Contact
            </Link>
          </div>
        </nav>
      </header>

      {/* ------------ Mobile drawer ------------ */}
      <div
        onClick={() => setDrawer(false)}
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 lg:hidden ${
          drawer ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-[60] h-full w-80 max-w-[85vw] overflow-y-auto bg-card shadow-2xl transition-transform duration-300 lg:hidden ${
          drawer ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!drawer}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <Logo imgClassName="h-7 w-auto" />
          <div className="flex items-center gap-2">
            <ThemeToggle className="h-9 w-9" />
            <button
              onClick={() => setDrawer(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-3 text-fg-muted transition-colors hover:bg-line-3"
            >
              <Ico name="close" className="text-sm" />
            </button>
          </div>
        </div>

        <form onSubmit={submitSearch} className="border-b border-line p-4">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-full border border-line-2 bg-surface-2/50 py-2.5 pl-4 pr-10 text-sm focus:border-primary-500 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 text-white"
            >
              <Ico name="search" className="text-xs" />
            </button>
          </div>
        </form>

        <nav className="px-2 py-2">
          {[
            { label: "Home", href: "/" },
            { label: "Shop All Products", href: "/products" },
            { label: "Categories", href: "/categories" },
            { label: "Brands", href: "/brands" },
            { label: "Deals", href: "/deals" },
            { label: "Contact Us", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-fg transition-colors hover:bg-primary-50 hover:text-primary-600"
            >
              {item.label}
              <Ico name="chevron-right" className="text-xs opacity-40" />
            </Link>
          ))}
        </nav>

        <div className="border-t border-line px-4 py-3">
          <Link
            href="/wishlist"
            className="flex items-center justify-between rounded-lg px-2 py-3 text-sm font-medium text-fg transition-colors hover:text-primary-600"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">
                <Ico name="heart-far" className="text-sm" />
              </span>
              Wishlist
            </span>
            {wish.length > 0 && <span className="text-xs text-fg-subtle">{wish.length} items</span>}
          </Link>
          <Link
            href="/cart"
            className="flex items-center justify-between rounded-lg px-2 py-3 text-sm font-medium text-fg transition-colors hover:text-primary-600"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Ico name="cart" className="text-sm" />
              </span>
              Shopping Cart
            </span>
            {count > 0 && <span className="text-xs text-fg-subtle">{count} items</span>}
          </Link>
        </div>

        <div className="border-t border-line px-4 py-4">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-surface-2 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-fg">{user.name}</p>
                  <p className="truncate text-xs text-fg-muted">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/profile"
                  className="rounded-xl bg-primary-600 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  My Account
                </Link>
                <button
                  onClick={handleSignout}
                  className="rounded-xl border-2 border-primary-600 py-2.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                className="rounded-xl bg-primary-600 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-xl border-2 border-primary-600 py-2.5 text-center text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <div className="mx-4 mb-4 mt-2 rounded-xl border border-line bg-surface-2 p-4">
          <p className="text-sm font-semibold text-fg">Need Help?</p>
          <p className="mt-1 text-xs text-fg-muted">Our support team is available 24/7.</p>
          <a href="tel:+18001234567" className="mt-3 flex items-center gap-2 text-sm font-medium text-primary-600">
            <Ico name="headset" className="text-sm" />
            Contact Support
          </a>
        </div>
      </aside>
    </>
  );
}