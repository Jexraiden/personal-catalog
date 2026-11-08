/** Public demo identity for the Personal Catalog application. */
export const brand = {
  heroIllustration: "/brand/personal-catalog-hero-illustration.svg",
  mark: "/brand/personal-catalog-mark.svg",
  socialPreview: {
    background: "#20242C",
    foreground: "#F7F6F1",
    accent: "#59C3B1",
    supporting: "#B7C2C5",
    eyebrow: "DEMONSTRAÇÃO DE CATÁLOGO PESSOAL",
    title: "Personal Catalog",
    description: "Uma demonstração reutilizável de catálogo para apresentar itens e reunir manifestações de interesse.",
    alt: "Personal Catalog — uma demonstração reutilizável de catálogo para apresentar itens e reunir manifestações de interesse",
    english: {
      eyebrow: "PERSONAL CATALOG DEMO",
      description: "A simple, reusable catalog for sharing items and collecting expressions of interest.",
      alt: "Personal Catalog — a reusable catalog demo for sharing items and collecting expressions of interest",
    },
  },
  metadata: {
    title: "Personal Catalog",
    description: "Demonstração reutilizável de catálogo para apresentar itens e reunir manifestações de interesse.",
    englishDescription: "A reusable catalog demo for sharing items and collecting expressions of interest.",
  },
} as const;
