import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/Pet-adoption-",
  assetPrefix: "/Pet-adoption-",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
