import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable SWC compiler for styled-components (used by Sanity Studio)
  compiler: {
    styledComponents: true,
  },

  // Disable Turbopack — use standard webpack for stable Sanity Studio support
  // (Turbopack can hang when compiling Sanity's large dependency tree)
};

export default nextConfig;
