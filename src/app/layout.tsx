import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const quicksans = localFont({
  src: "../../public/images/Font/Quicksans Accurate ICG Fill.ttf",
  variable: "--font-quicksans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DMCA Master - Professional Copyright Protection Service",
  description: "Protect your digital content from copyright infringement, piracy, and unauthorized use with expert DMCA takedown services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={quicksans.variable}>
      <body className={quicksans.className} style={{ fontFamily: 'var(--font-quicksans), Quicksans, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}