import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      {
        protocol: "https",

        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
    ],
  },
  /* config options here */
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;
