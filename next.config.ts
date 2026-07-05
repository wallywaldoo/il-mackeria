import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/contact",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/booking",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/booking",
        destination: "/en",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/apple-touch-icon.png",
        destination: "/apple-icon",
      },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/apple-icon",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pqqepbqdnggtrkcmkezb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
