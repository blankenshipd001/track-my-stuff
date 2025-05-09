import { Roboto } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react"
import { Container, CssBaseline } from "@mui/material";
import { Providers } from "@utils/providers/providers";
import { Header } from "@/components/header";

// export const dynamic = 'force-dynamic';

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "ReelTime",
  description: "ReelTime brings all your TV and movie watch lists together in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body className={roboto.className}>
          <CssBaseline />
          <Container>
            <Header />
            {children}
            <SpeedInsights />
            <Analytics />
          </Container>
        </body>
      </Providers>
    </html>
  );
}
