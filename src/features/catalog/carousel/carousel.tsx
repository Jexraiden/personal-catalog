"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { messages } from "@/lib/i18n";
import { useProductCarousel } from "./use-product-carousel";
import styles from "./carousel.module.css";

type ProductCarouselProps = {
    children: ReactNode;
    itemCount: number;
    controls?: ReactNode;
    locale: Locale;
    enabled: boolean;
};

export default function ProductCarousel({
    children,
    itemCount,
    controls,
    locale,
    enabled,
}: ProductCarouselProps) {
    const t = messages[locale];
    const {
        viewportRef,
        indicatorRef,
        activePage,
        pageCount,
        isDragging,
        isDesktop,
        scrollToPage,
        updateActivePage,
        handlePointerDown,
        handlePointerMove,
        finishPointerDrag,
        handleClickCapture,
    } = useProductCarousel(itemCount, enabled);
    return (
        <>
            {(pageCount > 1 || controls) && (
                <div className={styles.controls}>
                    {pageCount > 1 ? (
                        <button
                            type="button"
                            onClick={() => scrollToPage(activePage - 1)}
                            disabled={activePage === 0}
                            aria-label={t.previousItems}
                            className={`${styles.arrow} ${styles.arrowStart}`}
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                className={styles.arrowIcon}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                    ) : (
                        <span aria-hidden="true" />
                    )}
                    {controls && <div className={styles.controlsContent}>{controls}</div>}
                    {pageCount > 1 ? (
                        <button
                            type="button"
                            onClick={() => scrollToPage(activePage + 1)}
                            disabled={activePage === pageCount - 1}
                            aria-label={t.nextItems}
                            className={`${styles.arrow} ${styles.arrowEnd}`}
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                className={styles.arrowIcon}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    ) : (
                        <span aria-hidden="true" />
                    )}
                </div>
            )}
            <div
                ref={viewportRef}
                role="region"
                aria-label={t.itemsCarousel}
                aria-roledescription={t.carouselDescription}
                tabIndex={0}
                onScroll={updateActivePage}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishPointerDrag}
                onPointerCancel={finishPointerDrag}
                onClickCapture={handleClickCapture}
                onDragStart={(event) => event.preventDefault()}
                className={`${styles.track} ${isDragging ? styles.trackDragging : ""} ${isDesktop ? styles.desktopTrack : ""} ${!enabled ? styles.trackDisabled : ""}`}
            >
                {children}
            </div>
            {pageCount > 1 && (
                <div
                    role="group"
                    aria-label={t.carouselPages}
                    ref={indicatorRef}
                    className={styles.indicators}
                >
                    {Array.from({ length: pageCount }, (_, pageIndex) => (
                        <button
                            key={pageIndex}
                            type="button"
                            onClick={() => scrollToPage(pageIndex)}
                            aria-label={`${t.goToPage} ${pageIndex + 1}`}
                            data-page={pageIndex}
                            aria-current={
                                activePage === pageIndex ? "page" : undefined
                            }
                            className={styles.pageButton}
                        >
                            <span
                                aria-hidden="true"
                                className={`${styles.dot} ${activePage === pageIndex ? styles.dotActive : styles.dotInactive}`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
