import { catalog } from "@/data/catalog";
import { site } from "@/config/site";
import DocumentLanguage from "@/features/localization/document-language";
import LanguagePreference from "@/features/localization/language-preference";
import { SelectionProvider } from "@/features/selection/provider";
import SelectionSummary from "@/features/selection/summary";
import type { Locale } from "@/lib/i18n";
import { messages } from "@/lib/i18n";
import CatalogSection from "./home/catalog-section/catalog-section";
import styles from "./home/page-layout.module.css";
import HomeFooter from "./home/footer/footer";
import HomeHeader from "./home/header/header";
import HomeHero from "./home/hero";

export default function Home({ locale = "en" }: { locale?: Locale }) {
  const t = messages[locale];
  const { whatsappPhoneNumber } = site.contact;
  const publicProducts = catalog.products.filter(
    (item) => item.availability !== "sold",
  );
  const selectableProducts = publicProducts.filter(
    (item) => item.availability === "available",
  );
  const catalogProducts = publicProducts;

  return (
    <>
      <DocumentLanguage lang={locale} />
      <LanguagePreference locale={locale} />
      <div className={styles.shell}>
        <HomeHeader
          locale={locale}
          whatsappPhoneNumber={whatsappPhoneNumber}
          messages={t}
        />
        <main className={styles.main}>
          <HomeHero messages={t} />
          <SelectionProvider products={selectableProducts}>
            <CatalogSection
              products={catalogProducts}
              categories={catalog.categories}
              locale={locale}
              currency={catalog.currency}
              whatsappPhoneNumber={whatsappPhoneNumber}
            />
            <SelectionSummary
              whatsappPhoneNumber={whatsappPhoneNumber}
              locale={locale}
              currency={catalog.currency}
            />
          </SelectionProvider>
        </main>
        <HomeFooter locale={locale} site={site} messages={t} />
      </div>
    </>
  );
}
