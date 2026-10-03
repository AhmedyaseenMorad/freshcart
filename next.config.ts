import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/freshcart";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // No image optimizer exists on a static host, so emit plain <img> tags instead of
    // pointing at /_next/image (which would 404 on GitHub Pages).
    unoptimized: true,
  },
};

export default nextConfig;