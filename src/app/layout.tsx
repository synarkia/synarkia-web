import type { Metadata } from "next";
import { Cormorant, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";

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

export const metadata: Metadata = {
  title: "Syndao — Venture Lab & Studio",
  description:
    "A venture lab & studio building at the equilibrium of art, science, and metaphysics. Strategy, systems, and intelligent execution.",
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
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
