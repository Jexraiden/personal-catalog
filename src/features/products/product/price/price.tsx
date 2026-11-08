import type { Product } from "@/domain/product";
import { getDiscountPercentage, getEffectivePriceInCents } from "@/domain/product-pricing";
import { formatPrice } from "@/lib/format-price";
import type { Locale } from "@/lib/i18n";
import styles from "./price.module.css";

type ProductPriceProps = {
  product: Product;
  locale: Locale;
  currency: string;
  variant: "card" | "details" | "selection";
};

export function ProductPrice({ product, locale, currency, variant }: ProductPriceProps) {
  const hasDiscount = getDiscountPercentage(product) > 0;
  const variantClass = {
    card: styles.cardPrice,
    details: styles.detailsPrice,
    selection: styles.selectionPrice,
  }[variant];

  return (
    <span className={`${styles.price} ${variantClass}`}>
      <span className={hasDiscount ? styles.discountedPrice : ""}>
        {formatPrice(getEffectivePriceInCents(product), locale, currency)}
      </span>
      {hasDiscount && (
        <del className={styles.originalPrice}>
          {formatPrice(product.priceInCents, locale, currency)}
        </del>
      )}
    </span>
  );
}

export function DiscountBadge({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const discountPercentage = getDiscountPercentage(product);

  if (discountPercentage === 0) return null;

  return (
    <span className={`${styles.discountBadge} ${className}`}>
      -{discountPercentage}%
    </span>
  );
}
