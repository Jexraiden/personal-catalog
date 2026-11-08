import Image from "next/image";
import { ProjectIcon } from "@/components/icons/project-icon";
import type { Product } from "@/domain/product";
import {
    buildWhatsAppUrl,
    buildProductContactMessage,
    buildReservedProductContactMessage,
} from "@/lib/whatsapp";
import type { Locale } from "@/lib/i18n";
import { messages } from "@/lib/i18n";
import { DiscountBadge, ProductPrice } from "../price/price";
import productStyles from "../product-availability.module.css";
import styles from "./content.module.css";

type ProductDetailsContentProps = {
    product: Product;
    whatsappPhoneNumber: string;
    locale: Locale;
    currency: string;
    theme: "light" | "dark";
    isSelected: boolean;
    onToggleProduct: () => void;
    onClose: () => void;
};

export function ProductDetailsContent({
    product,
    whatsappPhoneNumber,
    locale,
    currency,
    theme,
    isSelected,
    onToggleProduct,
    onClose,
}: ProductDetailsContentProps) {
    const t = messages[locale];

    return (
        <section className={styles.content}>
            <div className={styles.topRow}>
                <div className={styles.metadata}>
                    <div className={styles.categoryRow}>
                        <p className={styles.category}>
                            {product.category.label}
                        </p>
                        {product.availability === "reserved" && (
                            <span className={productStyles.reservedBadge}>
                                {t.reserved}
                            </span>
                        )}
                    </div>
                    {product.comboItems && product.comboItems.length > 1 && (
                        <p className={styles.itemCount}>
                            {product.comboItems.length} {t.itemCount}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={t.closeProductDetails}
                    className={styles.closeButton}
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className={styles.closeIcon}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <path d="m18 6-12 12M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className={styles.titleBlock}>
                <h2
                    id={`product-details-title-${product.id}`}
                    className={styles.title}
                >
                    {product.name}
                </h2>
                <div className={styles.priceRow}>
                    <DiscountBadge product={product} className={styles.discountBadge} />
                    <ProductPrice product={product} locale={locale} currency={currency} variant="details" />
                </div>
                <p className={styles.shippingNote}>
                    <ProjectIcon name="info" className={styles.shippingIcon} />
                    {t.productShippingNote}
                </p>
            </div>
            <section className={styles.condition}>
                <h3 className={styles.sectionHeading}>{t.condition}</h3>
                <p className={styles.emphasized}>{product.condition}</p>
                {product.conditionDetails && <p>{product.conditionDetails}</p>}
            </section>
            <div className={styles.actions}>
                {product.availability === "available" && (
                    <button
                        type="button"
                        onClick={onToggleProduct}
                        aria-pressed={isSelected}
                        className={styles.selectButton}
                    >
                        <Image
                            src={isSelected ? "/icons/box-closed.svg" : "/icons/box-open.svg"}
                            alt=""
                            aria-hidden="true"
                            width={24}
                            height={21}
                            className={styles.actionIcon}
                        />
                        {isSelected ? t.removeFromBox : t.addToBox}
                    </button>
                )}
                {product.availability !== "sold" && (
                    <a
                        href={buildWhatsAppUrl(
                            whatsappPhoneNumber,
                            product.availability === "reserved"
                                ? buildReservedProductContactMessage(product, locale, currency)
                                : buildProductContactMessage(product, locale, currency),
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactButton}
                    >
                        <ProjectIcon name="whatsapp" className={styles.whatsappIcon} />
                        {t.interested}
                    </a>
                )}
            </div>
            <section className={styles.description}>
                <h3 className={styles.sectionHeading}>{t.description}</h3>
                <p className={styles.preLine}>{product.description}</p>
                {product.specifications && <p className={`${styles.preLine} ${styles.specifications}`}>{product.specifications}</p>}
            </section>
            {product.comboItems && product.comboItems.length > 0 && (
                <section className={styles.comboSection}>
                    <h3 className={styles.sectionHeading}>{t.comboItems}</h3>
                    <ol className={styles.comboList}>
                        {product.comboItems.map((item, index) => (
                            <li key={item.name} className={styles.comboItem}>
                                <span
                                    aria-hidden="true"
                                    style={theme === "light"
                                        ? { backgroundColor: "#28231B", color: "#E5D7BF" }
                                        : { backgroundColor: "#E5D7BF", color: "#28231B" }}
                                    className={styles.comboNumber}
                                >
                                    {index + 1}
                                </span>
                                <div>
                                    <p className={styles.emphasized}>{item.name}</p>
                                    {item.description && <p className={styles.preLine}>{item.description}</p>}
                                    {item.specifications && (
                                        <p className={`${styles.preLine} ${item.description ? styles.specifications : ""}`}>
                                            {item.specifications}
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>
            )}
        </section>
    );
}
