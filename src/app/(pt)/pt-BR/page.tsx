import type { Metadata } from "next";
import Home from "@/app/_components/home-page";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: `${brand.metadata.title} | Português (Brasil)`,
  description: brand.metadata.description,
  openGraph: {
    title: `${brand.metadata.title} | Português (Brasil)`,
    description: brand.metadata.description,
    locale: "pt_BR",
  },
  twitter: {
    title: `${brand.metadata.title} | Português (Brasil)`,
    description: brand.metadata.description,
  },
};

export default function PortugueseHome() {
  return <Home locale="pt-BR" />;
}
