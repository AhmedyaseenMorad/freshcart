"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { api, errMsg, img } from "@/lib/api";
import type { Product, Review } from "@/lib/types";
import { useCart, useToast } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import Spinner from "@/components/Spinner";
import Stars from "@/components/Stars";
import { Ico } from "@/components/Icons";

const tabs = ["Product Details", "Reviews", "Shipping & Returns"];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { add } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([api.getProduct(id), api.getProductReviews(id)])
      .then(([p, r]) => {
        if (!active) return;
        setProduct(p.data);
        setReviews(r.data);
        api
          .getProducts(`limit=12&category=${encodeURIComponent(p.data.category._id)}`)
          .then((s) => active && setSimilar(s.data.filter((x) => x._id !== p.data._id)))
          .catch(() => {});
      })
      .catch((e) => active && setError(errMsg(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const galleryItems = useMemo(() => {
    if (!product) return [];
    const urls = [img(product.imageCover), ...(product.images ?? []).map((x) => img(x))].filter(
      (x): x is string => typeof x === "string"
    );
    const uniq = [...new Set(urls)];
    return uniq.map((u) => ({ original: u, thumbnail: u }));
  }, [product]);

  const price = product ? (product.priceAfterDiscount ?? product.price) : 0;
  const old = product?.priceAfterDiscount ? product.price : undefined;
  const total = price * qty;

  const addToCart = async (goToCart: boolean) => {
    if (!product || busy) return;
    setBusy(true);
    try {
      const ok = await add(product._id);
      if (!ok) {
        toast("Please sign in first", "error");
        router.push("/login?redirect=" + encodeURIComponent(`/products/${product._id}`));
        return;
      }
      toast("Added to cart");
      if (goToCart) router.push("/cart");
    } catch (e) {
      toast(errMsg(e), "error");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="container-x flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-x flex flex-col items-center py-24 text-center">
        <Ico name="box-open" className="mb-4 text-6xl text-fg-subtle" />
        <h1 className="text-lg font-semibold text-fg">Product not found</h1>
        <p className="mt-1 text-sm text-fg-muted">{error || "This product may have been removed."}</p>
        <Link href="/products" className="btn btn-primary mt-6">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x">
      {/* Breadcrumb */}
      <nav className="py-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm">
          <li>
            <Link href="/" className="flex items-center gap-1 text-fg-muted transition-colors hover:text-primary-600">
              <Ico name="home" className="text-xs" />
              Home
            </Link>
          </li>
          <li className="text-fg-subtle">
            <Ico name="chevron-right" className="text-[10px]" />
          </li>
          <li>
            <Link
              href={`/categories/${product.category._id}`}
              className="text-fg-muted transition-colors hover:text-primary-600"
            >
              {product.category.name}
            </Link>
          </li>
          <li className="text-fg-subtle">
            <Ico name="chevron-right" className="text-[10px]" />
          </li>
          <li className="max-w-xs truncate font-medium text-fg">{product.title}</li>
        </ol>
      </nav>

      {/* Detail */}
      <div id="product-detail" className="flex flex-col gap-8 py-6 lg:flex-row">
        {/* Gallery */}
        <div id="product-images" className="lg:w-1/4">
          <div className="sticky top-4 rounded-xl bg-card p-4 shadow-sm">
            <ImageGallery
              items={galleryItems}
              showPlayButton={false}
              showFullscreenButton={false}
              thumbnailPosition="bottom"
              lazyLoad
              slideDuration={350}
              additionalClass="product-gallery"
            />
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 rounded-xl bg-card p-6 shadow-sm lg:w-3/4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Link
              href={`/categories/${product.category._id}`}
              className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600"
            >
              {product.category.name}
            </Link>
            {product.brand?.name && (
              <Link
                href={`/products?brand=${encodeURIComponent(product.brand._id)}`}
                className="rounded-full bg-surface-3 px-3 py-1 text-xs font-medium text-fg-muted"
              >
                {product.brand.name}
              </Link>
            )}
          </div>

          <h1 className="text-xl font-bold text-fg md:text-2xl">{product.title}</h1>

          <div className="mb-4 mt-2 flex items-center gap-3">
            <Stars value={product.ratingsAverage ?? 0} />
            <span className="text-sm text-fg-muted">
              {product.ratingsAverage?.toFixed(1) ?? "0"} ({product.ratingsQuantity ?? 0} reviews)
            </span>
          </div>

          <div className="mb-6 flex items-center flex-wrap gap-3">
            <span className="text-3xl font-bold text-fg">
              {product.priceAfterDiscount ?? product.price} EGP
            </span>
            {old !== undefined && (
              <span className="text-lg text-fg-subtle line-through">{old} EGP</span>
            )}
            {product.priceAfterDiscount && (
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500">
                SAVE {Math.round((1 - product.priceAfterDiscount / product.price) * 100)}%
              </span>
            )}
          </div>

          <div className="mb-6 flex items-center gap-2">
            {product.quantity > 0 ? (
              <>
                <span className="flex h-2 w-2 rounded-full bg-green-500" />
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  In Stock
                </span>
              </>
            ) : (
              <>
                <span className="flex h-2 w-2 rounded-full bg-red-500" />
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                  Out of Stock
                </span>
              </>
            )}
          </div>

          <div className="mb-6 border-t border-line pt-5">
            <p className="whitespace-pre-line text-sm leading-relaxed text-fg-muted">{product.description}</p>
          </div>

          {/* Quantity */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center overflow-hidden rounded-lg border-2 border-line-2">
              <button
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                disabled={qty <= 1 || busy}
                aria-label="Decrease quantity"
                className="px-4 py-3 text-fg-muted transition-colors hover:bg-surface-3 hover:text-primary-600 disabled:opacity-50"
              >
                <Ico name="minus" className="text-xs" />
              </button>
              <input
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 border-x border-line-2 py-3 text-center text-sm font-medium focus:outline-none"
                aria-label="Quantity"
              />
              <button
                onClick={() => setQty((v) => Math.min(product.quantity, v + 1))}
                disabled={qty >= product.quantity || busy}
                aria-label="Increase quantity"
                className="px-4 py-3 text-fg-muted transition-colors hover:bg-surface-3 hover:text-primary-600 disabled:opacity-50"
              >
                <Ico name="plus" className="text-xs" />
              </button>
            </div>
            <span className="text-sm text-fg-muted">
              {product.quantity} available
            </span>
          </div>

          {/* Total */}
          <div className="mb-6 flex items-center justify-between rounded-lg bg-surface-2 p-4">
            <span className="text-sm font-medium text-fg-muted">Total</span>
            <span className="text-2xl font-bold text-primary-600">{total.toFixed(2)} EGP</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => addToCart(false)}
              disabled={product.quantity <= 0 || busy}
              className="flex-1 rounded-xl bg-primary-600 py-3.5 px-6 font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={() => addToCart(true)}
              disabled={product.quantity <= 0 || busy}
              className="flex-1 rounded-xl bg-gray-900 py-3.5 px-6 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <section id="product-details-tabs" className="py-8">
        <div className="overflow-hidden rounded-lg bg-card shadow-sm">
          <div className="flex overflow-x-auto border-b border-line-2 scrollbar-hide">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setActiveTab(i)}
                className={`whitespace-nowrap px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === i
                    ? "border-b-2 border-primary-600 bg-primary-50/50 text-primary-600"
                    : "text-fg-muted hover:text-primary-600"
                }`}
              >
                {t === "Reviews" ? `Reviews (${reviews.length})` : t}
              </button>
            ))}
          </div>
          <div className="p-6 md:p-8">
            {activeTab === 0 && (
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-base font-semibold text-fg">Description</h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-fg-muted">{product.description}</p>
                </div>
                <div>
                  <h3 className="mb-4 text-base font-semibold text-fg">Quick Facts</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-line pb-3">
                      <dt className="text-fg-muted">Category</dt>
                      <dd className="font-medium text-fg">{product.category.name}</dd>
                    </div>
                    <div className="flex justify-between border-b border-line pb-3">
                      <dt className="text-fg-muted">Brand</dt>
                      <dd className="font-medium text-fg">{product.brand?.name ?? "—"}</dd>
                    </div>
                    <div className="flex justify-between border-b border-line pb-3">
                      <dt className="text-fg-muted">Availability</dt>
                      <dd className="font-medium text-fg">
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-fg-muted">Units Sold</dt>
                      <dd className="font-medium text-fg">{product.sold ?? 0}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
            {activeTab === 1 && (
              <div>
                <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface-2 p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-fg">{product.ratingsAverage?.toFixed(1) ?? "0"}</p>
                    <Stars value={product.ratingsAverage ?? 0} className="mt-1" />
                  </div>
                  <div className="text-sm text-fg-muted">
                    Based on {product.ratingsQuantity ?? 0} reviews
                  </div>
                </div>
                {reviews.length === 0 ? (
                  <p className="text-sm text-fg-muted">No reviews yet. Be the first to review this product!</p>
                ) : (
                  <ul className="space-y-5">
                    {reviews.map((r) => (
                      <li key={r._id} className="rounded-xl border border-line p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-fg">{r.user.name}</span>
                          <span className="text-xs text-fg-subtle">
                            {new Date(r.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <Stars value={r.rating} className="mt-2" iconClassName="text-[10px]" />
                        <p className="mt-2 text-sm text-fg-muted">{r.review}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === 2 && (
              <div className="grid gap-8 text-sm leading-relaxed text-fg-muted md:grid-cols-3">
                <div>
                  <h3 className="mb-2 font-semibold text-fg">Shipping</h3>
                  <p>
                    Free shipping on all orders over 500 EGP. Standard delivery takes 2–4 business days nationwide.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-fg">Returns</h3>
                  <p>
                    Not happy? You have 14 days from delivery to request a free return. Items must be unused and in
                    original packaging.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-fg">Refunds</h3>
                  <p>
                    Refunds are issued to your original payment method within 5–7 business days of receiving the
                    returned item.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Similar products */}
      {similar.length > 0 && (
        <section id="similar-products" className="py-10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-8 w-1.5 rounded-full bg-linear-to-b from-emerald-500 to-emerald-700" />
              <h2 className="text-2xl font-bold text-fg">You May Also Like</h2>
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="Previous" className="similar-prev flex h-10 w-10 items-center justify-center rounded-full bg-surface-3 text-fg-muted transition-colors hover:bg-primary-100 hover:text-primary-600">
                <Ico name="chevron-left" className="text-sm" />
              </button>
              <button aria-label="Next" className="similar-next flex h-10 w-10 items-center justify-center rounded-full bg-surface-3 text-fg-muted transition-colors hover:bg-primary-100 hover:text-primary-600">
                <Ico name="chevron-right" className="text-sm" />
              </button>
            </div>
          </div>
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: ".similar-prev", nextEl: ".similar-next" }}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {similar.map((p) => (
              <SwiperSlide key={p._id} style={{ height: "auto" }} className="py-2">
                <ProductCard product={p} className="h-full" />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
    </div>
  );
}