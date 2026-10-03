import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves the project from /<repo>, so every emitted asset URL needs the
  // prefix. Set GITHUB_PAGES=1 in the deploy workflow to turn it on; local dev and Vercel
  // leave it undefined and keep serving from the root.
  ...(process.env.GITHUB_PAGES === "1"
    ? {
        basePath: "/freshcart",
        assetPrefix: "/freshcart/",
      }
    : {}),
  output: "export",
  images: {
    // next/image rewrites to /_next/image, which a pure static export cannot produce.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "ecommerce.routemisr.com" },
      { protocol: "https", hostname: "ppics.routemisr.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
  // Emit /foo/index.html rather than /foo.html so Pages resolves extensionless routes.
  trailingSlash: true,
};

export default nextConfig;