"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { ProjectIcon } from "@/components/icons/project-icon";
import ProductCarousel from "../carousel/carousel";
import CategoryFilter from "../category-filter/category-filter";
import type { Locale } from "@/lib/i18n";
import { messages } from "@/lib/i18n";
import { publicPath } from "@/lib/public-path";
import type { Product, ProductCategory } from "@/domain/product";
import { ProductItem } from "@/features/products/product/item";
import { useSelection } from "@/features/selection/provider";
import styles from "./view.module.css";

type CatalogViewProps = {
    products: Product[];
    categories: ProductCategory[];
    locale: Locale;
    currency: string;
    whatsappPhoneNumber: string;
};

type ViewMode = "carousel" | "grid";
const CATALOG_VIEW_STORAGE_KEY = "personal-catalog-view";
const CATALOG_VIEW_CHANGE_EVENT = "personal-catalog-view-change";

function subscribeToCatalogView(onChange: () => void) {
    window.addEventListener("storage", onChange);
    window.addEventListener(CATALOG_VIEW_CHANGE_EVENT, onChange);
    return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(CATALOG_VIEW_CHANGE_EVENT, onChange);
    };
}

function getCatalogViewSnapshot(): ViewMode {
    return window.localStorage.getItem(CATALOG_VIEW_STORAGE_KEY) === "grid"
        ? "grid"
        : "carousel";
}

function getServerCatalogViewSnapshot(): ViewMode {
    return "carousel";
}

function ViewModeIcon({ mode }: { mode: ViewMode }) {
    return (
        <ProjectIcon name={mode} className={styles.viewModeIcon} />
    );
}

export default function CatalogView({
    products,
    categories,
    locale,
    currency,
    whatsappPhoneNumber,
}: CatalogViewProps) {
    const viewMode = useSyncExternalStore(
        subscribeToCatalogView,
        getCatalogViewSnapshot,
        getServerCatalogViewSnapshot,
    );
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const { activeProductDetailsId } = useSelection();
    const t = messages[locale];

    const filteredProducts = products.filter(
        (product) =>
            selectedCategoryIds.length === 0 ||
            selectedCategoryIds.includes(product.category.id),
    ).sort((first, second) => {
        if (first.availability === "reserved" && second.availability !== "reserved") return 1;
        if (first.availability !== "reserved" && second.availability === "reserved") return -1;
        return 0;
    });
    const productCards = filteredProducts.map((product) => {
        const coverImage = product.coverImage;

        return (
            <ProductItem
                key={product.id}
                product={product}
                locale={locale}
                currency={currency}
                whatsappPhoneNumber={whatsappPhoneNumber}
                className={styles.productCardLayout}
                thumbnail={
                    <Image
                        src={publicPath(coverImage.src)}
                        alt={coverImage.alt}
                        width={400}
                        height={600}
                        className={styles.productImage}
                    />
                }
            />
        );
    });

    function selectViewMode(nextViewMode: ViewMode) {
        window.localStorage.setItem(CATALOG_VIEW_STORAGE_KEY, nextViewMode);
        window.dispatchEvent(new Event(CATALOG_VIEW_CHANGE_EVENT));
    }

    function renderViewModeControls(placement: "mobile" | "desktop") {
        return (
            <div className={styles.controlsGroup}>
                <CategoryFilter
                    categories={categories}
                    selectedCategoryIds={selectedCategoryIds}
                    onSelectedCategoryIdsChange={setSelectedCategoryIds}
                    locale={locale}
                    placement={placement}
                />
                <div role="group" aria-label={t.catalogViewMode} className={styles.viewButtons}>
                    <button
                        type="button"
                        aria-pressed={viewMode === "carousel"}
                        onClick={() => selectViewMode("carousel")}
                        className={`${styles.viewButton} ${viewMode === "carousel" ? styles.viewButtonActive : styles.viewButtonInactive}`}
                    >
                        <span className={styles.viewButtonContent}>
                            <ViewModeIcon mode="carousel" />
                            {t.carousel}
                        </span>
                    </button>
                    <button
                        type="button"
                        aria-pressed={viewMode === "grid"}
                        onClick={() => selectViewMode("grid")}
                        className={`${styles.viewButton} ${viewMode === "grid" ? styles.viewButtonActive : styles.viewButtonInactive}`}
                    >
                        <span className={styles.viewButtonContent}>
                            <ViewModeIcon mode="grid" />
                            <span className={styles.compactLabel}>{t.showAllCompact}</span>
                            <span className={styles.fullLabel}>{t.showAll}</span>
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.titleRow}>
                <h2
                    id="catalog-title"
                    className={styles.title}
                >
                    {t.catalogTitle}
                </h2>
            </div>

            <p className={styles.instruction}>
                {t.catalogInstruction}
            </p>

            <p className={styles.shippingNote}>
                <ProjectIcon name="info" className={styles.shippingIcon} />
                {t.catalogShippingNote}
            </p>

            <div
                className={`${styles.controlsMobile} ${viewMode === "carousel" ? styles.controlsMobileCarousel : styles.controlsMobileGrid}`}
            >
                {renderViewModeControls("mobile")}
            </div>

            {filteredProducts.length === 0 ? null : viewMode === "carousel" ? (
                <ProductCarousel
                    key={selectedCategoryIds.join("|") || "all-categories"}
                    itemCount={filteredProducts.length}
                    locale={locale}
                    enabled={activeProductDetailsId === null}
                    controls={renderViewModeControls("desktop")}
                >
                    {productCards}
                </ProductCarousel>
            ) : (
                <div className={styles.productGrid}>
                    {productCards}
                </div>
            )}
            {filteredProducts.length === 0 && (
                <div className={styles.emptyState}>
                    <p>{t.noProductsForCategories}</p>
                    <button
                        type="button"
                        onClick={() => setSelectedCategoryIds([])}
                        className={styles.clearButton}
                    >
                        {t.clearCategoryFilters}
                    </button>
                </div>
            )}
        </>
    );
}
