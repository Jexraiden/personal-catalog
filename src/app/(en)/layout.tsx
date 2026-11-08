import type { Metadata, Viewport } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { brand } from "@/config/brand";
import { metadataBase } from "@/config/metadata-base";
import "../globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase,
  title: brand.metadata.title,
  description: brand.metadata.englishDescription,
  icons: {
    icon: "/brand/personal-catalog-mark.svg",
    apple: "/brand/personal-catalog-app-icon.png",
  },
  openGraph: {
    type: "website",
    title: brand.metadata.title,
    description: brand.metadata.englishDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: brand.metadata.title,
    description: brand.metadata.englishDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${sourceSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
