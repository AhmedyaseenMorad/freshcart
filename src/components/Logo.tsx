"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Renders a single <img> and swaps `src` with the active theme.
 *
 * Two stacked <img> elements (one light, one dark) is the usual trick, but it puts two
 * copies in the DOM and makes the wordmark appear doubled whenever the visibility rules
 * fail to apply. Deciding in JS keeps exactly one node mounted at all times.
 */
export default function Logo({
  className = "",
  imgClassName = "h-6 lg:h-8 w-auto",
  href = "/",
}: {
  className?: string;
  imgClassName?: string;
  href?: string;
}) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Link href={href} className={className} aria-label="FreshCart home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark ? "/freshcart-logo-dark.svg" : "/freshcart-logo.svg"}
        alt="FreshCart"
        width={160}
        height={31}
        className={imgClassName}
      />
    </Link>
  );
}