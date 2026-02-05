/** @type {import('next').NextConfig} */
const nextConfig = {
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
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
};

module.exports = nextConfig;
