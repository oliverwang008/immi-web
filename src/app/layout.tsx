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
  title: "AussieVisa Tracker | Australian Skilled Visa Processing Times & EOI Statistics 2025",
  description:
    "Track real Australian skilled visa processing times in 2025. Community-sourced data on EOI invitations, visa grants, and waiting times for subclass 189, 190, 491, 482, 186 and more. Know when to expect your invite.",
  keywords: [
    "Australian skilled visa processing time 2025",
    "189 visa processing time",
    "190 visa EOI invitation 2025",
    "491 visa wait time",
    "skilled nominated visa 190",
    "skilled regional visa 491",
    "Australia points test calculator",
    "skilled independent visa 189",
    "employer sponsored visa 482",
    "186 visa processing time",
    "Australian immigration 2025",
    "skilled migration Australia",
    "EOI invitation round",
    "Australia PR processing time",
    "skilled occupation list Australia",
    "SkillSelect invitation",
    "immi.homeaffairs.gov.au processing times",
    "Australian permanent residency timeline",
    "visa grant date Australia",
  ],
  openGraph: {
    title: "AussieVisa Tracker | Skilled Visa Processing Times 2025",
    description:
      "Real community data on Australian skilled visa processing times. Track 189, 190, 491 EOI invitations and visa grant timelines. 100% anonymous.",
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "AussieVisa Tracker | Skilled Visa Processing Times 2025",
    description:
      "Real community data on Australian skilled visa processing times. Track 189, 190, 491 EOI invitations and visa grant timelines.",
  },
  alternates: {
    canonical: "https://aussiavisa.com.au",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
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
