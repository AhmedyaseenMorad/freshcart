import Link from "next/link";
import Logo from "./Logo";
import { Ico } from "./Icons";

const trustItems = [
  { icon: "truck" as const, title: "Free Shipping", sub: "On orders over 500 EGP" },
  { icon: "rotate-left" as const, title: "Easy Returns", sub: "14-day return policy" },
  { icon: "shield" as const, title: "Secure Payment", sub: "100% secure checkout" },
  { icon: "headset" as const, title: "24/7 Support", sub: "Contact us anytime" },
];

const footerCols: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Brands", href: "/brands" },
      { label: "Electronics", href: "/categories?name=Electronics" },
      { label: "Men's Fashion", href: "/categories?name=Men's Fashion" },
      { label: "Women's Fashion", href: "/categories?name=Women's Fashion" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Account", href: "/profile" },
      { label: "Order History", href: "/profile/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Shopping Cart", href: "/cart" },
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/register" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Help Center", href: "/contact" },
      { label: "Shipping Info", href: "/contact" },
      { label: "Returns & Refunds", href: "/contact" },
      { label: "Track Order", href: "/profile/orders" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy", href: "/" },
    ],
  },
];

const socials = [
  { icon: "facebook" as const, label: "Facebook" },
  { icon: "instagram" as const, label: "Instagram" },
  { icon: "twitter" as const, label: "Twitter" },
  { icon: "youtube" as const, label: "YouTube" },
];

export default function Footer() {
  return (
    <>
      {/* ------------ Trust strip ------------ */}
      <section className="border-y border-primary-100 bg-primary-50">
        <div className="container-x py-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((t) => (
              <div key={t.title} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-lg text-primary-600">
                  <Ico name={t.icon} />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-fg">{t.title}</h4>
                  <p className="text-xs text-fg-muted">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------ Feature strip ------------ */}
      <section className="bg-surface-2 py-10">
        <div className="container-x">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "truck" as const, title: "Fast Delivery", sub: "Same-day delivery across Cairo", bg: "bg-blue-50", fg: "text-blue-500" },
              { icon: "shield" as const, title: "Secure Payments", sub: "Visa, Mastercard or cash on delivery", bg: "bg-emerald-50", fg: "text-emerald-500" },
              { icon: "rotate-left" as const, title: "Hassle-Free Returns", sub: "14 days to change your mind", bg: "bg-orange-50", fg: "text-orange-500" },
              { icon: "headset" as const, title: "Dedicated Support", sub: "Real humans, always here to help", bg: "bg-purple-50", fg: "text-purple-500" },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg ${f.bg} ${f.fg}`}>
                  <Ico name={f.icon} />
                </span>
                <h4 className="mt-3 text-sm font-semibold text-fg">{f.title}</h4>
                <p className="mt-1 text-xs text-fg-muted">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------ Main footer ------------ */}
      <footer id="footer" className="bg-gray-900 text-white">
        <div className="container-x py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <div className="inline-block rounded-lg bg-card px-4 py-2">
                <Logo imgClassName="h-6 w-auto" />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-fg-subtle">
                FreshCart is your one-stop online shopping destination. We deliver fresh groceries, trendy fashion and
                the latest electronics right to your doorstep with free shipping on orders over 500 EGP.
              </p>
              <div className="mt-6 space-y-3 text-sm text-fg-subtle">
                <div className="flex items-center gap-3">
                  <Ico name="pin" className="text-primary-400" />
                  <span>24 Cairo St., Downtown, New Cairo, Egypt</span>
                </div>
                <div className="flex items-center gap-3">
                  <Ico name="phone" className="text-primary-400" />
                  <a href="tel:+18001234567" className="transition-colors hover:text-white">
                    +1 (800) 123-4567
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Ico name="mail" className="text-primary-400" />
                  <a href="mailto:support@freshcart.com" className="transition-colors hover:text-white">
                    support@freshcart.com
                  </a>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-primary-600 hover:text-white"
                  >
                    <Ico name={s.icon} className="text-sm" />
                  </a>
                ))}
              </div>
            </div>

            {footerCols.map((col) => (
              <div key={col.title} className="lg:col-span-2">
                <h4 className="mb-4 text-base font-semibold">{col.title}</h4>
                <ul className="space-y-3 text-sm text-fg-subtle">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="transition-all hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="container-x flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
            <p className="text-sm text-fg-muted">
              © {new Date().getFullYear()} FreshCart. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-12 items-center justify-center rounded bg-gray-800 text-[10px] font-bold text-gray-400">
                <Ico name="visa" className="text-lg text-blue-400" />
              </span>
              <span className="flex h-9 w-12 items-center justify-center rounded bg-gray-800 text-[10px] font-bold text-gray-400">
                <Ico name="mastercard" className="text-lg text-red-400" />
              </span>
              <span className="flex h-9 w-12 items-center justify-center rounded bg-gray-800 text-[10px] font-bold text-gray-400">
                <Ico name="paypal" className="text-lg text-sky-400" />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}