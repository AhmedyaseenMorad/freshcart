"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useCart, useToast } from "@/lib/store";
import { errMsg, img } from "@/lib/api";
import { Ico } from "@/components/Icons";

export default function CartPage() {
  const { user } = useAuth();
  const { cart, update, remove, clear, coupon } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const products = cart?.products ?? cart?.cartItems ?? [];
  const subtotal = cart?.totalCartPrice ?? 0;
  const discount = subtotal - (cart?.totalAfterDiscount ?? subtotal);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = (cart?.totalAfterDiscount ?? subtotal) + shipping;

  if (!user) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-surface-3">
          <Ico name="cart" className="text-5xl text-fg-subtle" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-fg">Please sign in</h2>
        <p className="mb-8 text-fg-muted">Sign in to view and manage your shopping cart.</p>
        <Link
          href="/login?redirect=%2Fcart"
          className="rounded-full bg-primary-600 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (!cart || products.length === 0) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-surface-3">
          <Ico name="box-open" className="text-5xl text-fg-subtle" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-fg">Your cart is empty</h2>
        <p className="mb-8 text-fg-muted">Browse our products and add items to your cart</p>
        <Link
          href="/products"
          className="rounded-full bg-primary-600 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const updateQty = async (pid: string, count: number) => {
    if (count < 1) return;
    try {
      await update(pid, count);
    } catch (e) {
      toast(errMsg(e), "error");
    }
  };

  const removeItem = async (pid: string) => {
    try {
      await remove(pid);
      toast("Item removed from cart");
    } catch (e) {
      toast(errMsg(e), "error");
    }
  };

  const clearAll = async () => {
    try {
      await clear();
      toast("Cart cleared");
    } catch (e) {
      toast(errMsg(e), "error");
    }
  };

  const applyCoupon = async () => {
    if (!code.trim()) return;
    setBusy(true);
    try {
      const ok = await coupon(code.trim());
      toast(ok ? "Coupon applied!" : "Invalid coupon code", ok ? "success" : "error");
    } catch (e) {
      toast(errMsg(e), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-x py-8">
      <h1 className="mb-2 text-2xl font-bold text-fg md:text-3xl">Shopping Cart</h1>
      <p className="mb-8 text-sm text-fg-muted">
        {products.length} item{products.length === 1 ? "" : "s"} in your cart
      </p>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {products.map((item) => {
            const p = item.product;
            const unit = item.price ?? p.price;
            const pid = p._id ?? p.id ?? item._id;
            return (
              <div key={pid} className="flex flex-col gap-4 rounded-xl border border-line-2 bg-card p-4 sm:flex-row">
                <Link
                  href={`/products/${pid}`}
                  className="block h-28 w-full shrink-0 overflow-hidden rounded-lg bg-card sm:w-28"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img(p.imageCover) ?? ""}
                    alt={p.title}
                    className="h-full w-full object-contain"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs text-fg-muted">{p.category?.name ?? ""}</p>
                      <Link
                        href={`/products/${pid}`}
                        className="mt-0.5 line-clamp-2 text-sm font-semibold text-fg transition-colors hover:text-primary-600"
                      >
                        {p.title}
                      </Link>
                      <p className="mt-1 text-sm font-semibold text-fg">{unit} EGP</p>
                    </div>
                    <button
                      onClick={() => removeItem(pid)}
                      aria-label="Remove item"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fg-subtle transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Ico name="trash" className="text-sm" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center overflow-hidden rounded-lg border-2 border-line-2">
                      <button
                        onClick={() => updateQty(pid, item.count - 1)}
                        disabled={item.count <= 1}
                        aria-label="Decrease"
                        className="px-3 py-2 text-fg-muted transition-colors hover:bg-surface-3 disabled:opacity-50"
                      >
                        <Ico name="minus" className="text-[10px]" />
                      </button>
                      <span className="w-10 border-x border-line-2 py-2 text-center text-sm font-medium">
                        {item.count}
                      </span>
                      <button
                        onClick={() => updateQty(pid, item.count + 1)}
                        disabled={item.count >= p.quantity}
                        aria-label="Increase"
                        className="px-3 py-2 text-fg-muted transition-colors hover:bg-surface-3 disabled:opacity-50"
                      >
                        <Ico name="plus" className="text-[10px]" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-primary-600">{(unit * item.count).toFixed(2)} EGP</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={clearAll}
              className="flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-red-500"
            >
              <Ico name="trash" className="text-xs" />
              Clear Cart
            </button>
            <Link href="/products" className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700">
              Continue Shopping →
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl border border-line-2 bg-card p-6">
          <h2 className="mb-5 text-lg font-bold text-fg">Order Summary</h2>

          {/* Coupon */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-fg">Coupon Code</label>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SAVE10"
                className="flex-1 rounded-lg border border-line-2 px-3 py-2.5 text-sm uppercase focus:border-primary-500 focus:outline-none"
              />
              <button
                onClick={applyCoupon}
                disabled={busy || !code.trim()}
                className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-40"
              >
                Apply
              </button>
            </div>
          </div>

          <dl className="space-y-3 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-fg-muted">Subtotal</dt>
              <dd className="font-medium text-fg">{subtotal.toFixed(2)} EGP</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <dt>Discount</dt>
                <dd className="font-medium">-{discount.toFixed(2)} EGP</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-fg-muted">Shipping</dt>
              <dd className="font-medium text-fg">{shipping === 0 ? "Free" : `${shipping.toFixed(2)} EGP`}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
              <dt className="text-fg">Total</dt>
              <dd className="text-primary-600">{total.toFixed(2)} EGP</dd>
            </div>
          </dl>

          <button
            onClick={() => router.push("/checkout")}
            className="mt-6 w-full rounded-xl bg-primary-600 py-3.5 font-medium text-white transition-colors hover:bg-primary-700"
          >
            Proceed to Checkout
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-fg-muted">
            <Ico name="shield" className="text-primary-600" />
            Secure checkout · Visa / Mastercard / COD
          </p>
        </div>
      </div>
    </div>
  );
}