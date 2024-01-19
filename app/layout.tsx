import { Roboto } from "next/font/google";
import { CssBaseline } from "@mui/material";
import { Providers } from "@/app/context/providers";

import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: 'ReelTime',
  description: 'ReelTime brings all your TV and movie watch lists together in one place.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <CssBaseline />
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
