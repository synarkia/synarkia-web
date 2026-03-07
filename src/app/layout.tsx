import type { Metadata } from "next";
import { Instrument_Serif, IBM_Plex_Sans, IBM_Plex_Mono, Wix_Madefor_Display } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const wixMadeforDisplay = Wix_Madefor_Display({
  variable: "--font-wix-madefor-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Synarkia — Venture Execution Alliance",
  description: "Complex vision. Operational reality.",
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
          ibmPlexSans.variable,
          instrumentSerif.variable,
          ibmPlexMono.variable,
          wixMadeforDisplay.variable,
          "antialiased bg-void text-cream font-sans min-h-screen selection:bg-lavender selection:text-void"
        )}
      >
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
