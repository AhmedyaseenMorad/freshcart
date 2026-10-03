"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useCart, useToast } from "@/lib/store";
import { api, errMsg, img } from "@/lib/api";
import { Ico } from "@/components/Icons";

export default function CheckoutPage() {
  const { user, token } = useAuth();
  const { cart, clear } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const [origin, setOrigin] = useState("");
  const [fullName, setFullName] = useState("");
  const [details, setDetails] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"online" | "cash">("online");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const products = cart?.products ?? cart?.cartItems ?? [];
  const subtotal = cart?.totalCartPrice ?? 0;
  const discount = subtotal - (cart?.totalAfterDiscount ?? subtotal);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = (cart?.totalAfterDiscount ?? subtotal) + shipping;

  if (!user || !token) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-surface-3">
          <Ico name="lock" className="text-5xl text-fg-subtle" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-fg">Please sign in to checkout</h2>
        <Link
          href="/login?redirect=%2Fcheckout"
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
        <Link
          href="/products"
          className="rounded-full bg-primary-600 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    if (!cart?._id || !token) return;
    if (!fullName.trim() || !details.trim() || !city.trim() || phone.trim().length < 10) {
      toast("Please complete all shipping fields", "error");
      return;
    }
    const shippingAddress = { details, phone, city, fullName };
    setBusy(true);
    try {
      if (method === "online") {
        const res = await api.checkoutSession(
          token,
          cart._id,
          shippingAddress,
          `${origin}/profile/orders`
        );
        if (res.session?.url) {
          window.location.href = res.session.url;
          return;
        }
      } else {
        await api.createCashOrder(token, cart._id, shippingAddress);
        await clear();
        toast("Order placed successfully!");
        router.push("/profile/orders");
        return;
      }
    } catch (e) {
      toast(errMsg(e), "error");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-line-2 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";

  return (
    <div className="container-x py-8">
      <h1 className="mb-2 text-2xl font-bold text-fg md:text-3xl">Checkout</h1>
      <p className="mb-8 text-sm text-fg-muted">Complete your order in under a minute.</p>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Shipping form */}
        <div className="rounded-xl border border-line-2 bg-card p-6 lg:col-span-2">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-fg">
            <Ico name="pin" className="text-primary-600" />
            Shipping Details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01012345678" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-fg">Address</label>
              <input value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Apartment, street, building..." className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cairo" className={inputClass} />
            </div>
          </div>

          <h2 className="mb-4 mt-8 flex items-center gap-2 text-lg font-bold text-fg">
            <Ico name="card" className="text-primary-600" />
            Payment Method
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                method === "online" ? "border-primary-500 bg-primary-50" : "border-line-2 hover:border-line-3"
              }`}
            >
              <input
                type="radio"
                checked={method === "online"}
                onChange={() => setMethod("online")}
                className="accent-primary-600"
              />
              <div>
                <p className="text-sm font-semibold text-fg">Pay Online</p>
                <p className="text-xs text-fg-muted">Visa / Mastercard</p>
              </div>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                method === "cash" ? "border-primary-500 bg-primary-50" : "border-line-2 hover:border-line-3"
              }`}
            >
              <input
                type="radio"
                checked={method === "cash"}
                onChange={() => setMethod("cash")}
                className="accent-primary-600"
              />
              <div>
                <p className="text-sm font-semibold text-fg">Cash on Delivery</p>
                <p className="text-xs text-fg-muted">Pay when you receive</p>
              </div>
            </label>
          </div>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl border border-line-2 bg-card p-6">
          <h2 className="mb-5 text-lg font-bold text-fg">Order Summary</h2>
          <ul className="mb-4 max-h-56 space-y-3 overflow-y-auto pr-1">
            {products.map((item) => {
              const p = item.product;
              const pid = p._id ?? p.id ?? item._id;
              return (
                <li key={pid} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(p.imageCover) ?? ""} alt={p.title} className="h-full w-full object-contain" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-semibold text-white">
                      {item.count}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{p.title}</p>
                    <p className="text-xs text-fg-muted">{(item.price ?? p.price)} EGP each</p>
                  </div>
                </li>
              );
            })}
          </ul>
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
            onClick={placeOrder}
            disabled={busy}
            className="mt-6 w-full rounded-xl bg-primary-600 py-3.5 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            {busy ? "Placing order..." : method === "online" ? "Proceed to Payment" : "Place Order (Cash on Delivery)"}
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-fg-muted">
            <Ico name="shield" className="text-primary-600" />
            Your information is safe with us
          </p>
        </div>
      </div>
    </div>
  );
}