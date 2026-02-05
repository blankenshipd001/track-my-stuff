const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    //these are optimized by default in the latest next versions
    // https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
    //optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "static.tvmaze.com",
      },
      {
        protocol: "https",
        hostname: "artworks.thetvdb.com",
      },
    ],
    // Allow our internal image proxy route to be used with next/image.
    // The pathname uses a wildcard to permit query strings like
    // `/api/image?path=...`.
    localPatterns: [
      {
        pathname: "/api/image*",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
