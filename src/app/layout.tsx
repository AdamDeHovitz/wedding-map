import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '600', '700'],
  variable: "--font-serif",
  subsets: ["latin"],
  display: 'swap',
});

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Wedding Map - Our Special Places",
  description: "Share memories at the places that matter to us",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#7B2D26",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wedding Map",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
