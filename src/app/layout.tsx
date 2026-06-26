import type { Metadata } from "next";
import { Cormorant, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { LanguageProvider } from "@/i18n/language-provider";
import { Analytics } from "@vercel/analytics/react";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const SITE_DESCRIPTION =
  "Brands, websites, and automated systems for founders and small teams — designed with taste, built to run on their own.";

export const metadata: Metadata = {
  metadataBase: new URL("https://synarkia-v1.vercel.app"),
  title: "Syndao — Venture Lab & Studio",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Syndao — Venture Lab & Studio",
    description: SITE_DESCRIPTION,
    siteName: "Syndao",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syndao — Venture Lab & Studio",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={clsx(
          cormorant.variable,
          spaceGrotesk.variable,
          ibmPlexMono.variable,
          "antialiased bg-ink text-light min-h-screen"
        )}
      >
        <LanguageProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
