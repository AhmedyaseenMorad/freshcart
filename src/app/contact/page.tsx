"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Ico } from "@/components/Icons";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  const inputClass =
    "w-full rounded-xl border border-line-2 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";

  return (
    <div>
      <section className="bg-linear-to-br from-primary-600 via-primary-500 to-primary-400 py-10 text-white">
        <div className="container-x">
          <nav className="flex items-center gap-2 text-sm text-white/80" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Ico name="home" className="text-xs" />
              Home
            </Link>
            <Ico name="chevron-right" className="text-[10px]" />
            <span className="font-medium text-white">Contact Us</span>
          </nav>
          <div className="mt-5 flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
              <Ico name="mail" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Get in Touch</h1>
              <p className="mt-2 text-sm text-white/85">
                Have a question? Our team is here to help 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            {[
              {
                icon: "pin" as const,
                title: "Visit Us",
                lines: ["24 Cairo St., Downtown", "New Cairo, Egypt"],
              },
              {
                icon: "phone" as const,
                title: "Call Us",
                lines: ["+1 (800) 123-4567", "Sun–Sat, 9am–9pm"],
              },
              {
                icon: "mail" as const,
                title: "Email Us",
                lines: ["support@freshcart.com", "We reply within 24 hours"],
              },
              {
                icon: "headset" as const,
                title: "Live Chat",
                lines: ["Available 24/7", "Average reply: 2 minutes"],
              },
            ].map((c) => (
              <div key={c.title} className="flex items-start gap-4 rounded-xl border border-line-2 bg-card p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Ico name={c.icon} className="text-base" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-fg">{c.title}</h3>
                  {c.lines.map((l, i) => (
                    <p key={i} className="text-sm text-fg-muted">
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-line-2 bg-card p-6 lg:col-span-2 md:p-8">
            <h2 className="text-lg font-bold text-fg">Send us a message</h2>
            <p className="mt-1 text-sm text-fg-muted">
              Fill out the form below and one of our specialists will get back to you soon.
            </p>
            <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fg">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fg">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-fg">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="How can we help?" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-fg">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Write your message here..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-primary-600 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3500} />
    </div>
  );
}