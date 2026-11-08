"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectIcon } from "@/components/icons/project-icon";
import type { ProductCategory } from "@/domain/product";
import type { Locale } from "@/lib/i18n";
import { messages } from "@/lib/i18n";
import styles from "./category-filter.module.css";

type CategoryFilterProps = {
    categories: ProductCategory[];
    selectedCategoryIds: string[];
    onSelectedCategoryIdsChange: (categoryIds: string[]) => void;
    locale: Locale;
    placement: "mobile" | "desktop";
};

function CategoryFilterIcon() {
    return <ProjectIcon name="filter" className={styles.filterIcon} />;
}

export default function CategoryFilter({
    categories,
    selectedCategoryIds,
    onSelectedCategoryIdsChange,
    locale,
    placement,
}: CategoryFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const t = messages[locale];

    useEffect(() => {
        if (!isOpen) return;

        function handlePointerDown(event: PointerEvent) {
            const target = event.target;
            if (target instanceof Element && !target.closest("[data-category-filter]")) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== "Escape") return;
            setIsOpen(false);
            triggerRef.current?.focus();
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    function clearFilters() {
        onSelectedCategoryIdsChange([]);
        setIsOpen(false);
    }

    return (
        <div className={styles.root} data-category-filter>
            <button
                ref={triggerRef}
                id={`catalog-category-trigger-${placement}`}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`catalog-category-options-${placement}`}
                onClick={() => setIsOpen((current) => !current)}
                className={`${styles.trigger} ${selectedCategoryIds.length > 0 ? styles.triggerActive : styles.triggerInactive}`}
            >
                <span className={styles.triggerContent}>
                    <CategoryFilterIcon />
                    {t.categories}
                    {selectedCategoryIds.length > 0 && (
                        <span className={styles.count}>
                            {selectedCategoryIds.length}
                        </span>
                    )}
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </span>
            </button>
            {isOpen && (
                <div
                    id={`catalog-category-options-${placement}`}
                    role="group"
                    aria-label={t.filterByCategory}
                    className={styles.options}
                >
                    <button
                        type="button"
                        onClick={clearFilters}
                        className={styles.clear}
                    >
                        {t.allCategories}
                    </button>
                    <ul className={styles.list}>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <label className={styles.option}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategoryIds.includes(category.id)}
                                        onChange={(event) => {
                                            const isChecked = event.target.checked;
                                            onSelectedCategoryIdsChange(
                                                isChecked
                                                    ? [...selectedCategoryIds, category.id]
                                                    : selectedCategoryIds.filter((id) => id !== category.id),
                                            );
                                        }}
                                        className={styles.checkbox}
                                    />
                                    {category.label}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
