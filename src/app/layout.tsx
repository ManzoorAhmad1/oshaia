import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/about/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import AdminPreviewBar from "@/components/admin/AdminPreviewBar";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/store/ReduxProvider";
import OAuthProviders from "@/components/OAuthProviders";

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
      <head>
        {/* Facebook SDK */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.fbAsyncInit = function() {
                FB.init({
                  appId: '${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '3270577403114188'}',
                  cookie: true,
                  xfbml: true,
                  version: 'v19.0'
                });
              };
              (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
            `,
          }}
        />
      </head>
      <body className={roboto.className}>
        <ReduxProvider>
          <OAuthProviders>
            <LanguageProvider>
              <AuthProvider>
                <AdminPreviewBar />
                {children}
                <WhatsAppButton />
                <ScrollToTop />
                <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
              </AuthProvider>
            </LanguageProvider>
          </OAuthProviders>
        </ReduxProvider>
      </body>
    </html>
  );
}