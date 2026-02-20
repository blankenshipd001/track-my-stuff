import { Roboto } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react"
import { CssBaseline } from "@mui/material";
import { Providers } from "@utils/providers/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { FontLoader } from "@/components/font-loader";
import { SkipLink } from "@/components/skip-link";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "ReelTime - Track Your Movies & TV Shows",
    template: "%s | ReelTime",
  },
  description:
    "ReelTime brings all your TV and movie watch lists together in one place. Discover trending content, track what you've watched, and find where your favorite shows are streaming.",
  keywords:
    "movie tracker, TV show tracker, watchlist, streaming, movies, TV shows, entertainment",
  creator: "ReelTime",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ReelTime",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://reeltime.app",
    siteName: "ReelTime",
    title: "ReelTime - Track Your Movies & TV Shows",
    description:
      "Bring all your TV and movie watch lists together in one place",
    images: [
      {
        url: "https://reeltime.app/icon-192x192.png",
        width: 192,
        height: 192,
        alt: "ReelTime Logo",
      },
      {
        url: "https://reeltime.app/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "ReelTime Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ReelTimeApp",
    title: "ReelTime - Track Your Movies & TV Shows",
    description:
      "Bring all your TV and movie watch lists together in one place",
    images: ["https://reeltime.app/icon-512x512.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <SkipLink />

        <FontLoader />
        <Suspense fallback={<div style={{ minHeight: "100vh", background: "#111827" }} />}>
          <Providers>
            <ScrollToTop />
            <CssBaseline />
            <Header />
            <main
              id="main-content"
              style={{ minHeight: "calc(100vh - 200px)" }}
              role="main"
            >
              {children}
            </main>
            <Footer />
            <PWAInstallPrompt />
            <SpeedInsights />
            <Analytics />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
