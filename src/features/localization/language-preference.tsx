"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

export default function LanguagePreference({ locale }: { locale: Locale }) {
  useEffect(() => {
    const savedLocale = window.localStorage.getItem("personal-catalog-locale");
    if (locale === "en" && savedLocale === "pt-BR") {
      window.location.replace("/pt-BR");
    }

    if (locale === "pt-BR" && savedLocale === "en") {
      window.location.replace("/");
    }
  }, [locale]);

  return null;
}
