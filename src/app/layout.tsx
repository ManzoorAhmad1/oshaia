import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/about/WhatsAppButton";
import { LanguageProvider } from "@/context/LanguageContext";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "oshaia",
  description: "oshaia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={roboto.variable}>
      <body className={roboto.className}>
        <LanguageProvider>
          {children}
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}