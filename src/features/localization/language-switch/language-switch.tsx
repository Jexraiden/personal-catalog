"use client";

import type { Locale } from "@/lib/i18n";
import styles from "./language-switch.module.css";
import { publicPath } from "@/lib/public-path";

export default function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  function switchLanguage() {
    const nextLocale = locale === "en" ? "pt-BR" : "en";
    window.localStorage.setItem("personal-catalog-locale", nextLocale);
    window.location.assign(publicPath(nextLocale === "pt-BR" ? "/pt-BR" : "/"));
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={switchLanguage}
      className={styles.button}
    >
      {locale === "en" ? "PT-BR" : "EN"}
    </button>
  );
}
