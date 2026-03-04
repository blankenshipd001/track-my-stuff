import { Roboto } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react"
import { Providers } from "@utils/providers/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
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
  links: [
    {
      rel: "preload",
      href: "https://fonts.googleapis.com/icon?family=Material+Icons",
      as: "style",
    },
  ],
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

        <Providers>
          <Suspense fallback={<div style={{ height: "60px", background: "rgba(17, 24, 39, 0.8)", borderBottom: "1px solid rgba(75, 85, 99, 0.3)" }} />}>
            <Header />
          </Suspense>
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          <main
              id="main-content"
              style={{ minHeight: "calc(100vh - 200px)" }}
              role="main"
            >
              <Suspense fallback={<div style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
                {children}
              </Suspense>
            </main>
            <Footer />
            <PWAInstallPrompt />
            <SpeedInsights />
            <Analytics />
        </Providers>
      </body>
    </html>
  );
}
