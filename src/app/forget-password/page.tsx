"use client";

import { useState } from "react";
import Link from "next/link";
import { Ico } from "@/components/Icons";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 600);
  };

  return (
    <section className="bg-surface-2/50">
      <div className="container-x flex min-h-[70vh] items-center justify-center py-8">
        <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl lg:p-12">
          <h1 className="text-3xl font-bold text-primary-600">
            Fresh<span className="text-fg">Cart</span>
          </h1>
          {sent ? (
            <div className="mt-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <Ico name="check-circle" className="text-2xl text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-fg">Check your inbox</h2>
              <p className="mt-2 text-sm text-fg-muted">
                We sent a password reset link to <span className="font-medium text-fg">{email}</span>
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block rounded-xl bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 className="mt-6 text-2xl font-bold text-fg">Forgot your password?</h2>
              <p className="mt-1 text-sm text-fg-muted">
                Enter your email and we&apos;ll send you a link to reset it.
              </p>
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-line-2 py-3 pl-11 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle">
                    <Ico name="mail" className="text-sm" />
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={busy || !email}
                  className="w-full rounded-xl bg-primary-600 py-3.5 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                >
                  {busy ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-fg-muted">
                Remembered it?{" "}
                <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}