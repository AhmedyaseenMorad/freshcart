"use client";

import { useState } from "react";
import { useToast } from "@/lib/store";

export default function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    toast("Subscribed! Check your inbox for a welcome gift 🎁");
  };

  return (
    <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={submit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        disabled={done}
        className="flex-1 rounded-full border border-line-2 px-5 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-70"
      />
      <button
        disabled={done}
        className="rounded-full bg-primary-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-70"
      >
        {done ? "Subscribed ✓" : "Subscribe"}
      </button>
    </form>
  );
}