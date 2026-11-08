import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { brand } from "@/config/brand";
import { metadataBase } from "@/config/metadata-base";
import { publicPath } from "@/lib/public-path";
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
  description: brand.metadata.description,
  icons: {
    icon: publicPath("/brand/personal-catalog-mark.svg"),
    apple: publicPath("/brand/personal-catalog-app-icon.png"),
  },
};

export default function PortugueseRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${newsreader.variable} ${sourceSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
