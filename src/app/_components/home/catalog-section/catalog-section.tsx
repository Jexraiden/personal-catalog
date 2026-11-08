import type { Product, ProductCategory } from "@/domain/product";
import type { Locale } from "@/lib/i18n";
import CatalogView from "@/features/catalog/view/view";
import styles from "./catalog-section.module.css";

type CatalogSectionProps = {
  products: Product[];
  categories: ProductCategory[];
  locale: Locale;
  currency: string;
  whatsappPhoneNumber: string;
};

export default function CatalogSection({
  products,
  categories,
  locale,
  currency,
  whatsappPhoneNumber,
}: CatalogSectionProps) {
  return (
    <section id="catalog" aria-labelledby="catalog-title" className={styles.section}>
      <CatalogView
        products={products}
        categories={categories}
        locale={locale}
        currency={currency}
        whatsappPhoneNumber={whatsappPhoneNumber}
      />
    </section>
  );
}
