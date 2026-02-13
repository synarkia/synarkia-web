import type { Metadata } from "next";
import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
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
          instrumentSans.variable,
          instrumentSerif.variable,
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
