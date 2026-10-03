"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useToast } from "@/lib/store";
import { errMsg } from "@/lib/api";
import { Ico } from "@/components/Icons";

export default function RegisterPage() {
  const { signup } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email || !phone.trim() || !password || !rePassword) {
      toast("Please fill in all fields", "error");
      return;
    }
    if (phone.trim().length < 10) {
      toast("Please enter a valid phone number", "error");
      return;
    }
    if (password.length < 6) {
      toast("Password must be at least 6 characters", "error");
      return;
    }
    if (password !== rePassword) {
      toast("Passwords do not match", "error");
      return;
    }
    setBusy(true);
    try {
      await signup({ name, email, password, rePassword, phone });
      toast("Account created successfully!");
      router.push("/");
    } catch (err) {
      toast(errMsg(err), "error");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-line-2 py-3 pl-11 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";

  return (
    <section className="bg-surface-2/50">
      <div className="container-x flex min-h-[80vh] items-center justify-center py-8">
        <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl lg:p-12">
          <Link href="/">
            <h1 className="text-3xl font-bold text-primary-600">
              Fresh<span className="text-fg">Cart</span>
            </h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-fg">Create your account</h2>
          <p className="mt-1 text-sm text-fg-muted">Join FreshCart and start shopping today</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className={inputClass}
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle">
                <Ico name="user" className="text-sm" />
              </span>
            </div>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className={inputClass}
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle">
                <Ico name="mail" className="text-sm" />
              </span>
            </div>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (e.g. 01012345678)"
                className={inputClass}
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle">
                <Ico name="phone" className="text-sm" />
              </span>
            </div>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className={`${inputClass} pr-11`}
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
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Confirm password"
                className={inputClass}
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle">
                <Ico name="lock" className="text-sm" />
              </span>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-primary-600 py-3.5 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {busy ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-fg-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}