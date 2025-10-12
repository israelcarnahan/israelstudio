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
  async headers() {
    return [
      {
        // Next's build assets
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Public assets (let the browser cache, but don't force types)
        source: "/(images|fonts|videos|audio|favicons|icons)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000" }],
      },
    ];
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
