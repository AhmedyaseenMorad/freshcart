import Link from "next/link";
import { api, img } from "@/lib/api";
import { Ico } from "@/components/Icons";

export default async function BrandsPage() {
  const res = await api.getBrands(1, 40);

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
            <span className="font-medium text-white">Brands</span>
          </nav>
          <div className="mt-5 flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
              <Ico name="tag" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shop by Brand</h1>
              <p className="mt-2 text-sm text-white/85">
                Browse products from {res.totalDocs} trusted brands.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {res.data.map((b) => (
            <Link
              key={b._id}
              href={`/products?brand=${b._id}`}
              className="group rounded-xl border border-line-2 bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-surface-2 transition-colors group-hover:bg-primary-50">
                {b.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img(b.image) ?? ""} alt={b.name} className="h-full w-full object-contain" loading="lazy" />
                ) : (
                  <span className="text-2xl font-bold text-primary-600">{b.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="mt-4 text-sm font-medium text-fg transition-colors group-hover:text-primary-600">
                {b.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}