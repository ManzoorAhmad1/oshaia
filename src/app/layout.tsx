import type { Metadata } from "next";
import "./globals.css";



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
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}