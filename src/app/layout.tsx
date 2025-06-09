import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

// Get the base path based on environment
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/michaeltugsjack/' : '';

export const metadata: Metadata = {
  title: "#MichaelTugsJack",
  description: "A collection of films from the #MichaelTugsJack Plex server",
  icons: {
    icon: [
      { url: `${basePath}favicon.ico` },
      { url: `${basePath}favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${basePath}favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: `${basePath}apple-touch-icon.png` },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
