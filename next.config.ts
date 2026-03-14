import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable SWC compiler for styled-components (Sanity Studio)
  compiler: {
    styledComponents: true,
  },

  // Optimize images from external sources
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    minimumCacheTTL: 3600, // Cache images for 1 hour
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Compress responses
  compress: true,

  // Strict mode for better error detection in dev
  reactStrictMode: true,
};

export default nextConfig;
