import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from "../lib/shared/theme";
import './globals.css';
import { Roboto } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap'
});

export const metadata = {
  title: 'ReelTime',
  description: 'ReelTime brings all your TV and movie watch lists together in one place.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <body className={roboto.className}>
          {children}
        </body>
      </ThemeProvider>
    </html>
  )
}
