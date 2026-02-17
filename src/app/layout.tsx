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
  title: "ReelTime",
  description: "ReelTime brings all your TV and movie watch lists together in one place.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ReelTime",
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
