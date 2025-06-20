import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "#MichaelTugsJack",
  description: "A collection of films from the #MichaelTugsJack Plex server",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProd = process.env.NODE_ENV === 'production';
  const basePath = isProd ? '/michaeltugsjack' : '';

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={`${basePath}/favicon.ico`} />
        <link rel="icon" href={`${basePath}/favicon-16x16.png`} sizes="16x16" type="image/png" />
        <link rel="icon" href={`${basePath}/favicon-32x32.png`} sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href={`${basePath}/apple-touch-icon.png`} />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
