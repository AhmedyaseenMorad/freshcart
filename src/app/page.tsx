import Link from "next/link";
import { api } from "@/lib/api";
import HeroSwiper from "@/components/HeroSwiper";
import CategoryTile from "@/components/CategoryTile";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import NewsletterForm from "@/components/NewsletterForm";
import { Ico } from "@/components/Icons";

export const revalidate = 300;

const usp = [
  { icon: "truck" as const, bg: "bg-blue-50", fg: "text-blue-500", title: "Free Delivery", sub: "On orders above 500 EGP" },
  { icon: "shield" as const, bg: "bg-emerald-50", fg: "text-emerald-500", title: "Secure Payments", sub: "100% protected checkout" },
  { icon: "rotate-left" as const, bg: "bg-orange-50", fg: "text-orange-500", title: "Easy Returns", sub: "14 days money-back" },
  { icon: "headset" as const, bg: "bg-purple-50", fg: "text-purple-500", title: "24/7 Support", sub: "Always here to help" },
];

async function getData() {
  const [cats, prods] = await Promise.all([
    api.getCategories(1, 20),
    api.getProducts("limit=40"),
  ]);
  return { categories: cats.data.slice(0, 12), products: prods.data };
}

export default async function HomePage() {
  const { categories, products } = await getData();

  return (
    <div>
      <HeroSwiper />

      {/* USP strip */}
      <section className="bg-surface-2 py-8">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {usp.map((u) => (
            <div key={u.title} className="flex items-center gap-3">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg ${u.bg} ${u.fg}`}>
                <Ico name={u.icon} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-fg">{u.title}</h3>
                <p className="text-xs text-fg-muted">{u.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-10">
        <div className="container-x">
          <Reveal>
            <div className="my-8 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-8 w-1.5 rounded-full bg-linear-to-b from-emerald-500 to-emerald-700" />
                <h2 className="text-2xl font-bold text-fg md:text-3xl">Shop by Category</h2>
              </div>
              <Link
                href="/categories"
                className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
              >
                View All Categories →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <CategoryTile key={c._id} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="py-10">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal>
            <Link
              href="/deals"
              className="group flex h-full min-h-[220px] flex-col justify-center overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8 text-white transition-transform hover:scale-[1.02]"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <span className="text-sm">🔥</span> DEAL OF THE DAY
              </span>
              <h3 className="mt-4 text-2xl font-bold leading-snug md:text-3xl">Save Big on Organic Groceries</h3>
              <p className="mt-2 text-sm text-white/85">Use code ORGANIC40 to save 40% on thousands of items.</p>
              <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-card px-5 py-2 text-sm font-semibold text-emerald-600 transition-colors group-hover:bg-surface-3">
                Shop Now <Ico name="arrow-right" className="text-xs" />
              </span>
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="/deals"
              className="group flex h-full min-h-[220px] flex-col justify-center overflow-hidden rounded-2xl bg-linear-to-br from-orange-500 via-orange-500 to-rose-500 p-8 text-white transition-transform hover:scale-[1.02]"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <span className="text-sm">✨</span> NEW ARRIVALS
              </span>
              <h3 className="mt-4 text-2xl font-bold leading-snug md:text-3xl">Fresh Styles Just Landed</h3>
              <p className="mt-2 text-sm text-white/85">Get 25% off with code FRESH25 on all new season must-haves.</p>
              <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-card px-5 py-2 text-sm font-semibold text-orange-500 transition-colors group-hover:bg-surface-3">
                Shop Now <Ico name="arrow-right" className="text-xs" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-10">
        <div className="container-x">
          <Reveal>
            <div className="my-8 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-8 w-1.5 rounded-full bg-linear-to-b from-emerald-500 to-emerald-700" />
                <h2 className="text-2xl font-bold text-fg md:text-3xl">Featured Products</h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
              >
                View All Products →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / App */}
      <section className="bg-linear-to-b from-card to-surface-2 px-4 py-16">
        <div className="container-x max-w-6xl rounded-[2.5rem] border border-emerald-100/50 bg-card p-8 shadow-sm md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-fg md:text-3xl">Never Miss a Deal Again</h2>
              <p className="mt-3 text-sm text-fg-muted">
                Subscribe to our newsletter and get exclusive offers, early access to sales and fresh picks delivered
                straight to your inbox.
              </p>
              <NewsletterForm />
              <p className="mt-3 flex items-center gap-1.5 text-xs text-fg-subtle">
                <span className="text-xs">✨</span> Unsubscribe anytime
              </p>
            </div>
            <div className="rounded-2xl bg-gray-900 p-6 text-white md:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-1.5 text-xs font-semibold">
                <span className="text-sm">📱</span> MOBILE APP
              </span>
              <h3 className="mt-4 text-xl font-bold md:text-2xl">Shop Faster with the FreshCart App</h3>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="text-amber-400">★★★★★</span>
                <span className="text-fg-subtle">4.9 · 100K+ downloads</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl bg-card px-5 py-3 text-sm font-semibold text-fg transition-colors hover:bg-surface-3"
                >
                  <Ico name="apple" className="text-lg" />
                  App Store
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Ico name="google" className="text-lg" />
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}