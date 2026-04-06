import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AussieVisa Tracker | Australian Immigration Statistics",
  description:
    "Real-time statistics and insights for Australian skilled migration visas. Track processing times, success rates, and occupation trends for subclasses 189, 190, 491, 482, 186 and more.",
  keywords: [
    "Australian visa",
    "skilled migration",
    "189 visa",
    "190 visa",
    "491 visa",
    "482 visa",
    "immigration statistics",
    "visa processing time",
  ],
  openGraph: {
    title: "AussieVisa Tracker",
    description: "Real-time Australian skilled visa statistics from the community",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
