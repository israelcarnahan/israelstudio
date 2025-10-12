import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { DoodlesBG } from "@/components/doodles-bg";
import PageSplashTransition from "@/components/PageSplashTransition";
import SplashListener from "./_splash-listener.client";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Israel's Studio",
  description: "paintings, rugs, and commissions.",
  metadataBase: new URL("https://israelstudio.com"),
  openGraph: {
    title: "Israel's Studio",
    description: "Paintings, rugs, and commissions by Israel.",
    url: "https://israelstudio.com",
    siteName: "Israel's Studio",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${playfair.variable} bg-white text-neutral-900 antialiased`}
      >
        <Providers>
          <DoodlesBG />
          <Header />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          {/* Global page transition overlay */}
          <PageSplashTransition />
          <SplashListener />
        </Providers>
      </body>
    </html>
  );
}
