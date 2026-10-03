"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useToast } from "@/lib/store";
import { errMsg } from "@/lib/api";
import { Ico } from "@/components/Icons";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container-x flex min-h-[50vh] items-center justify-center">
          <span className="text-fg-subtle">Loading...</span>
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}

const perks = [
  { icon: "truck" as const, label: "Free Delivery", sub: "On orders over 500 EGP" },
  { icon: "shield" as const, label: "Secure Payment", sub: "100% protected checkout" },
  { icon: "headset" as const, label: "24/7 Support", sub: "We're always here" },
];

function LoginInner() {
  const { login, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Please fill in both fields", "error");
      return;
    }
    setBusy(true);
    try {
      await login(email, password);
      toast("Welcome back!");
      router.push(redirect);
    } catch (err) {
      toast(errMsg(err), "error");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (user) router.replace(redirect);
  }, [user, redirect, router]);

  return (
    <section className="bg-surface-2/50">
      <div className="container-x grid min-h-[80vh] items-center gap-8 py-8 lg:grid-cols-2">
        {/* Illustration */}
        <div className="hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2e5810ff3e-e750761ebcd4ae5907db.png"
            alt="FreshCart login illustration"
            className="mx-auto w-full max-w-lg"
          />
          <div className="mx-auto mt-6 max-w-lg space-y-4">
            {perks.map((p) => (
              <div key={p.label} className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <Ico name={p.icon} className="text-base" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">{p.label}</p>
                  <p className="text-xs text-fg-muted">{p.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-8 shadow-xl lg:p-12">
          <Link href="/">
            <h1 className="text-3xl font-bold text-primary-600">
              Fresh<span className="text-fg">Cart</span>
            </h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-fg">Welcome back!</h2>
          <p className="mt-1 text-sm text-fg-muted">Enter your credentials to access your account</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-line-2 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface-2">
              <Ico name="google" className="text-base" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-line-2 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface-2">
              <Ico name="facebook" className="text-base text-blue-600" />
              Facebook
            </button>
          </div>

          <div className="relative my-6 flex items-center justify-center">
            <span className="absolute inset-x-0 border-t border-line-2" />
            <span className="relative bg-card px-4 text-[11px] font-semibold tracking-wider text-fg-subtle">
              OR CONTINUE WITH EMAIL
            </span>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-line-2 py-3 pl-11 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle">
                  <Ico name="mail" className="text-sm" />
                </span>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-fg">Password</label>
                <Link href="/forget-password" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-line-2 py-3 pl-11 pr-11 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle">
                  <Ico name="lock" className="text-sm" />
                </span>
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-subtle transition-colors hover:text-fg-muted"
                >
                  <Ico name={show ? "eye-slash" : "eye"} className="text-sm" />
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-line-3 accent-primary-600"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-primary-600 py-3.5 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {busy ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-fg-muted">
            New to FreshCart?{" "}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}