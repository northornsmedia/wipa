import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/query-provider";
import ImageProtection from "@/components/ImageProtection";
import TelemetryTracker from "@/components/TelemetryTracker";
import PWARegister from "@/components/PWARegister";
import { Suspense } from "react";
import Script from 'next/script';
import NativeBackHandler from '@/components/NativeBackHandler';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const viewport: Viewport = {
  themeColor: "#5a32fa",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content"
};

export const metadata: Metadata = {
  title: "WIPA | Women's IP Alliance",
  description: "Global community and professional platform empowering women leaders in intellectual property, patent prosecution, and legal innovation.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WIPA"
  },
  icons: {
    icon: [
      { url: "/wipaoffm.png", sizes: "192x192", type: "image/png" },
      { url: "/wipaoffm.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/wipaoffm.png", sizes: "180x180", type: "image/png" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = JSON.parse(localStorage.getItem('wipa-storage') || '{}');
                if (stored && stored.state && stored.state.isDarkMode === true) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (_) {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
              }
            `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/wipaoffm.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WIPA" />
        <meta name="application-name" content="WIPA" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ImageProtection />
        <Suspense fallback={null}>
          <TelemetryTracker />
        </Suspense>
        <Providers>
          {children}
        </Providers>
        <NativeBackHandler />
        <PWARegister />
        
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xsx8h9dbj1");
          `}
        </Script>
      </body>
    </html>
  );
}
