import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  eslint: {
    // This will prevent the build from failing on ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
