import type { NextConfig } from "next";

/**
 * GitHub Pages notu:
 * - Site `kullaniciadi.github.io` olarak yayınlanacaksa basePath boş kalmalı.
 * - `kullaniciadi.github.io/portfolio` gibi alt klasördeyse BASE_PATH="/portfolio" ver.
 */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
