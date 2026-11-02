import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DealSafe AI — Understand the Risk Before You Sign',
  description:
    'AI-powered contract intelligence. Upload contracts, highlight risks, and get suggested changes without a legal team.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#E8EDF5] text-[#0B1B3B] min-h-screen antialiased selection:bg-[#1D4ED8] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
