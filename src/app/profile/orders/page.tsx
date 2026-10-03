"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import { api, errMsg, img } from "@/lib/api";
import type { Order } from "@/lib/types";
import Spinner from "@/components/Spinner";
import { Ico } from "@/components/Icons";

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id || !token) {
      setLoading(false);
      return;
    }
    let active = true;
    api
      .getUserOrders(token, user._id)
      .then((r) => active && setOrders(Array.isArray(r) ? r : []))
      .catch((e) => active && setError(errMsg(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user, token]);

  if (!user) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-surface-3">
          <Ico name="orders" className="text-5xl text-fg-subtle" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-fg">Please sign in</h2>
        <Link
          href="/login?redirect=%2Fprofile%2Forders"
          className="rounded-full bg-primary-600 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-2/50">
      <div className="container-x py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-fg md:text-3xl">My Orders</h1>
            <p className="mt-1 text-sm text-fg-muted">Track and review your order history</p>
          </div>
          <Link href="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Continue Shopping →
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-fg-muted">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-surface-3">
              <Ico name="orders" className="text-5xl text-fg-subtle" />
            </div>
            <h2 className="text-2xl font-bold text-fg">No orders yet</h2>
            <p className="mt-2 text-fg-muted">Your order history will appear here once you place your first order.</p>
            <Link href="/products" className="btn btn-primary mt-6">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {[...orders].reverse().map((o) => {
              const count = o.cartItems?.reduce((s, i) => s + i.count, 0) ?? 0;
              return (
                <div key={o._id} className="overflow-hidden rounded-2xl border border-line-2 bg-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-semibold text-fg">
                        Order #{o.id ?? o._id}
                      </span>
                      <span className="rounded-full bg-surface-3 px-3 py-1 text-xs font-medium text-fg-muted">
                        {new Date(o.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
                        <Ico name="check-circle" className="text-[10px]" />
                        {o.paymentMethodType === "card" ? "Paid Online" : "Cash on Delivery"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-fg-muted">{count} item{count === 1 ? "" : "s"}</span>
                      <span className="text-sm font-bold text-fg">{o.totalOrderPrice.toFixed(2)} EGP</span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          o.isDelivered ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {o.isDelivered ? "Delivered" : o.isPaid ? "Processing" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                      {o.cartItems?.slice(0, 4).map((i) => (
                        <Link
                          key={i.product?._id}
                          href={`/products/${i.product?._id}`}
                          className="block h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-card"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img(i.product?.imageCover) ?? ""}
                            alt={i.product?.title ?? ""}
                            className="h-full w-full object-contain"
                          />
                        </Link>
                      ))}
                      {count > 4 && (
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-xs font-semibold text-fg-muted">
                          +{count - 4}
                        </span>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-fg-muted">Deliver to</p>
                      <p className="text-sm font-medium text-fg">
                        {o.shippingAddress?.city ?? "—"}, {o.shippingAddress?.details ?? ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}