"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { ProjectIcon } from "@/components/icons/project-icon";
import type { Product } from "@/domain/product";
import { buildReservedProductContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Locale } from "@/lib/i18n";
import { messages } from "@/lib/i18n";
import { publicPath } from "@/lib/public-path";
import { useSelection } from "@/features/selection/provider";
import { DiscountBadge, ProductPrice } from "../price/price";
import styles from "./card.module.css";
import productStyles from "../product-availability.module.css";

type ProductCardProps = {
    product: Product;
    thumbnail?: ReactNode;
    className: string;
    locale: Locale;
    currency: string;
    whatsappPhoneNumber: string;
};

export function ProductCard({
    product,
    thumbnail,
    className,
    locale,
    currency,
    whatsappPhoneNumber,
}: ProductCardProps) {
    const t = messages[locale];
    const { selectedProductIds, toggleProduct, openProductDetails } = useSelection();
    const isProductSelected = selectedProductIds.includes(product.id);
    const detailsActionLabel = product.availability === "reserved"
        ? `${t.moreDetails} ${product.name}. ${t.reserved}`
        : `${t.moreDetails} ${product.name}`;
    const [isDetailsHintVisible, setIsDetailsHintVisible] = useState(false);
    const detailsActivationRef = useRef(false);
    const detailsHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const activationPointerTypeRef = useRef<string | null>(null);
    const suppressRestoredFocusHintRef = useRef(false);

    const handleDetailsTriggerFocus = (event: FocusEvent<HTMLButtonElement>) => {
        if (suppressRestoredFocusHintRef.current) {
            suppressRestoredFocusHintRef.current = false;
            setIsDetailsHintVisible(false);
            return;
        }

        if (event.currentTarget.matches(":focus-visible")) {
            setIsDetailsHintVisible(true);
        }
    };

    const recordDetailsPointerType = (pointerType: string) => {
        activationPointerTypeRef.current = pointerType;
    };

    const handleProductDetailsActivation = () => {
        const isTouchActivation = activationPointerTypeRef.current === "touch";
        activationPointerTypeRef.current = null;

        if (isTouchActivation && !detailsActivationRef.current) {
            detailsActivationRef.current = true;
            setIsDetailsHintVisible(true);
            detailsHintTimeoutRef.current = setTimeout(() => {
                detailsActivationRef.current = false;
                setIsDetailsHintVisible(false);
                detailsHintTimeoutRef.current = null;
            }, 3000);
            return;
        }

        if (detailsHintTimeoutRef.current) {
            clearTimeout(detailsHintTimeoutRef.current);
            detailsHintTimeoutRef.current = null;
        }

        detailsActivationRef.current = false;
        setIsDetailsHintVisible(false);
        suppressRestoredFocusHintRef.current = true;
        openProductDetails(product.id);
    };

    useEffect(() => () => {
        if (detailsHintTimeoutRef.current) {
            clearTimeout(detailsHintTimeoutRef.current);
        }
    }, []);

    return (
        <article
            className={`${styles.card} ${className} ${isProductSelected ? styles.selected : ""}`}
        >
            {thumbnail && (
                <button
                    type="button"
                    onPointerDown={(event) => recordDetailsPointerType(event.pointerType)}
                    onPointerCancel={() => recordDetailsPointerType("")}
                    onFocus={handleDetailsTriggerFocus}
                    onClick={handleProductDetailsActivation}
                    aria-label={detailsActionLabel}
                    aria-describedby={`product-details-hint-${product.id}`}
                    className={styles.detailsTrigger}
                >
                    {thumbnail}
                    {product.availability === "reserved" && (
                        <span aria-hidden="true" className={styles.reservedOverlay} />
                    )}
                    <span className={styles.badgeGroup}>
                        <DiscountBadge
                            product={product}
                            className={styles.discountBadgeOnImage}
                        />
                        {product.availability === "reserved" && (
                            <span className={productStyles.reservedBadge}>
                                {t.reserved}
                            </span>
                        )}
                    </span>
                    <span
                        aria-hidden="true"
                        className={`${styles.detailsHint} ${isDetailsHintVisible ? styles.detailsHintVisible : ""}`}
                    >
                        {t.more}
                    </span>
                </button>
            )}
            <span id={`product-details-hint-${product.id}`} className={styles.visuallyHidden}>
                {t.detailsHint}
            </span>
            <div className={styles.content}>
                <h3 className={styles.title}>
                    <button
                        type="button"
                        onPointerDown={(event) => recordDetailsPointerType(event.pointerType)}
                        onPointerCancel={() => recordDetailsPointerType("")}
                        onFocus={handleDetailsTriggerFocus}
                        onClick={handleProductDetailsActivation}
                        aria-label={detailsActionLabel}
                        aria-describedby={`product-details-hint-${product.id}`}
                        className={styles.nameButton}
                    >
                        <span className={styles.nameText}>{product.name}</span>
                    </button>
                </h3>
                <p className={styles.condition}>{product.condition}</p>
                <ProductPrice product={product} locale={locale} currency={currency} variant="card" />
                <div className={styles.metadata}>
                    <p className={styles.category}>
                        {product.category.label}
                    </p>
                    {product.comboItems && product.comboItems.length > 1 && (
                        <p className={styles.comboCount}>
                            {product.comboItems.length} {t.itemCount}
                        </p>
                    )}
                </div>
            </div>
            <div className={styles.actions}>
                {product.availability === "available" ? (
                    <button
                        type="button"
                        onClick={() => toggleProduct(product)}
                        aria-pressed={isProductSelected}
                        className={styles.action}
                    >
                        <Image
                            src={publicPath(isProductSelected ? "/icons/box-closed.svg" : "/icons/box-open.svg")}
                            alt=""
                            aria-hidden="true"
                            width={24}
                            height={21}
                            className={styles.actionIcon}
                        />
                        {isProductSelected
                            ? t.removeFromBox
                            : t.addToBox}
                    </button>
                ) : (
                    <a
                        href={buildWhatsAppUrl(
                            whatsappPhoneNumber,
                            buildReservedProductContactMessage(product, locale, currency),
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.reservedContact}
                    >
                        <ProjectIcon name="whatsapp" className={styles.reservedContactIcon} />
                        {t.interested}
                    </a>
                )}
            </div>
        </article>
    );
}
