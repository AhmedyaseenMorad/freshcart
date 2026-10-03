"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    badge: "New Season Arrivals",
    title: "Fresh Groceries Delivered to Your Door",
    subtitle: "Shop 100% organic products from local farms at unbeatable prices.",
  },
  {
    badge: "Big Sale — Up to 30% Off",
    title: "Grab Your Favorites Before They're Gone",
    subtitle: "Limited-time deals on electronics, fashion and beauty essentials.",
  },
  {
    badge: "Free Delivery",
    title: "Free Shipping on Orders Over 500 EGP",
    subtitle: "Fast, trackable delivery to your doorstep — anywhere in Egypt.",
  },
];

export default function HeroSwiper() {
  return (
    <section id="hero" className="relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop
        speed={700}
        className="hero-swiper h-[400px]"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative flex h-[400px] items-center"
              style={{
                backgroundImage: "url(/home-slider-1.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-green-800/90 via-green-600/40 to-transparent" />
              <div className="container-x relative z-10 text-white">
                <span className="hero-copy hero-copy-1 inline-block rounded-full border border-white/40 bg-white/10 px-4 py-1 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
                  {s.badge}
                </span>
                <h1 className="hero-copy hero-copy-2 mt-4 max-w-xl text-3xl font-bold leading-tight md:text-5xl">
                  {s.title}
                </h1>
                <p className="hero-copy hero-copy-3 mt-3 max-w-md text-sm text-white/85 md:text-base">
                  {s.subtitle}
                </p>
                <div className="hero-copy hero-copy-3 mt-6 flex flex-wrap gap-2">
                  <Link href="/products" className="btn bg-card text-green-600">
                    Shop Now
                  </Link>
                  <Link href="/deals" className="btn btn-outline-white">
                    View Offers
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}