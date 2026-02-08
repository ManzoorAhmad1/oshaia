import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/about/WhatsAppButton";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
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
    <html lang="en" suppressHydrationWarning className={roboto.variable}>
      <body className={roboto.className}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}