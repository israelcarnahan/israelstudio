import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix lockfile warning
  outputFileTracingRoot: __dirname,
  // Optimize for development performance
  experimental: {
    optimizePackageImports: ["framer-motion", "embla-carousel-react"],
    // Reduce bundle size
    optimizeCss: true,
    // Improve performance
    webVitalsAttribution: ["CLS", "LCP"],
  },
  // Performance optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Configure external image domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Disable turbopack for better stability
  // turbopack: {
  //   root: __dirname,
  // },
};

export default nextConfig;
