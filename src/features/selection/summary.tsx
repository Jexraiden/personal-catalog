"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ProjectIcon } from "@/components/icons/project-icon";
import { formatPrice } from "@/lib/format-price";
import {
    buildWhatsAppUrl,
    buildSelectionContactMessage,
} from "@/lib/whatsapp";
import { useSelection } from "./provider";
import type { Locale } from "@/lib/i18n";
import { messages } from "@/lib/i18n";
import { DiscountBadge, ProductPrice } from "@/features/products/product/price/price";
import styles from "./summary.module.css";

export default function SelectionSummary({
    whatsappPhoneNumber,
    locale,
    currency,
}: {
    whatsappPhoneNumber: string;
    locale: Locale;
    currency: string;
}) {
    const t = messages[locale];
    const {
        selectedProducts,
        totalPriceInCents,
        originalTotalPriceInCents,
        totalDiscountInCents,
        toggleProduct,
        openProductDetails,
        activeProductDetailsId,
    } = useSelection();
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const root = document.documentElement;
        const previousOverflow = root.style.overflow;
        root.style.overflow = "hidden";

        return () => {
            root.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const count = selectedProducts.length;
    const countLabel = count === 1 ? t.selectedSingular : t.selectedPlural;
    const countLabelInBox = count === 1 ? t.inBoxSingular : t.inBoxPlural;

    return (
        <>
            {count > 0 && !isOpen && activeProductDetailsId === null && (
                <aside
                    aria-label={t.selectionSummary}
                    className={styles.summaryBar}
                >
                    <span aria-hidden="true" className={styles.summaryBoxIcon} />
                    <div className={styles.summaryDetails}>
                        <p className={styles.summaryCount}>
                            <strong className={styles.bold}>{count}</strong> {countLabel}
                        </p>
                        <p className={styles.mobilePrice}>
                            {formatPrice(totalPriceInCents, locale, currency)}
                        </p>
                    </div>
                    <p className={styles.desktopPrice}>
                        {formatPrice(totalPriceInCents, locale, currency)}
                    </p>
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        aria-label={t.viewSelection}
                        className={styles.viewButton}
                    >
                        <ProjectIcon name="view" className={styles.viewIcon} />
                    </button>
                </aside>
            )}

            <dialog
                ref={dialogRef}
                aria-labelledby="selection-title"
                onCancel={() => setIsOpen(false)}
                onClick={(event) => {
                    const dialog = event.currentTarget;
                    const bounds = dialog.getBoundingClientRect();
                    const clickedOutside =
                        event.clientX < bounds.left ||
                        event.clientX > bounds.right ||
                        event.clientY < bounds.top ||
                        event.clientY > bounds.bottom;

                    if (clickedOutside) {
                        setIsOpen(false);
                    }
                }}
                className={styles.reviewDialog}
            >
                <div className={styles.dialogHeader}>
                    <h2 id="selection-title" className={styles.dialogTitle}>
                        {count} {countLabelInBox}
                    </h2>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label={t.closeSelection}
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
                {selectedProducts.length === 0 ? (
                    <p className={styles.emptyMessage}>{t.emptySelection}</p>
                ): (
                    <ul className={styles.productList}>
                        {selectedProducts.map((product) => {
                            const thumbnail = product.coverImage;

                            return (
                                <li
                                    key={product.id}
                                    className={styles.productRow}
                                >
                                    {thumbnail && (
                                        <button
                                            type="button"
                                            onClick={() => openProductDetails(product.id)}
                                            aria-label={`${t.viewProductDetails} ${product.name}`}
                                            className={styles.productThumbnailButton}
                                        >
                                            <Image
                                                src={thumbnail.src}
                                                alt=""
                                                aria-hidden="true"
                                                width={72}
                                                height={72}
                                                className={styles.productThumbnail}
                                            />
                                        </button>
                                    )}
                                    <div className={styles.productInfo}>
                                        <h3 className={styles.productName}>{product.name}</h3>
                                        <p>{product.comboItems && product.comboItems.length > 0 && (
                                            <>{product.comboItems.length} {t.itemCount} ·</>
                                        )} {product.condition}</p>
                                        <ProductPrice product={product} locale={locale} currency={currency} variant="selection" />
                                    </div>
                                    <div className={styles.productActions}>
                                        <DiscountBadge product={product} className={styles.discountBadge} />
                                        <button
                                            type="button"
                                            onClick={() => toggleProduct(product)}
                                            aria-label={`${t.removeProductFromSelection} ${product.name} ${t.fromSelection}`}
                                            className={styles.removeButton}
                                        >
                                            <span aria-hidden="true" className={styles.removeIcon}>×</span>
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <div className={styles.totals}>
                    <div className={styles.totalRowSmall}>
                        <p>{t.originalValue} ({count} {t.itemCount})</p>
                        <p>{formatPrice(originalTotalPriceInCents, locale, currency)}</p>
                    </div>
                    <div className={styles.totalRowSmall}>
                        <p>{t.discount}</p>
                        <p className={totalDiscountInCents > 0 ? styles.discountTotal : ""}>
                            {totalDiscountInCents > 0 ? "- " : ""}{formatPrice(totalDiscountInCents, locale, currency)}
                        </p>
                    </div>
                    <div className={styles.totalRow}>
                        <p className={styles.semiBold}>{t.totalValue}</p>
                        <p className={styles.grandTotal}>{formatPrice(totalPriceInCents, locale, currency)}</p>
                    </div>
                    <p className={styles.shippingNote}>
                        <ProjectIcon name="info" className={styles.shippingIcon} />
                        {t.selectionShippingNote}
                    </p>
                    {selectedProducts.length > 0 ? (
                        <a
                            href={buildWhatsAppUrl(
                                whatsappPhoneNumber,
                                buildSelectionContactMessage(
                                    selectedProducts,
                                    totalPriceInCents,
                                    locale,
                                    currency,
                                ),
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactButton}
                        >
                            <ProjectIcon name="whatsapp" className={styles.contactIcon} />
                            {t.talkAboutItems}
                        </a>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className={`${styles.contactButton} ${styles.contactButtonDisabled}`}
                        >
                            <ProjectIcon name="whatsapp" className={styles.contactIcon} />
                            {t.talkAboutItems}
                        </button>
                    )}
                </div>
            </dialog>
        </>
    );
}
