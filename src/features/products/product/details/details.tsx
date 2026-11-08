"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";
import type { Product, ProductGalleryItem } from "@/domain/product";
import { ProductLightbox } from "@/features/products/lightbox/lightbox";
import { ProductDetailsGallery } from "@/features/products/gallery/gallery";
import { ProductDetailsContent } from "../content/content";
import { useSelection } from "@/features/selection/provider";
import type { Locale } from "@/lib/i18n";
import styles from "./details.module.css";

type ProductDetailsProps = {
    product: Product;
    whatsappPhoneNumber: string;
    locale: Locale;
    currency: string;
}

type Theme = "light" | "dark";
type MediaDirection = "previous" | "next";
type LightboxMediaType = "image" | "video";

export function ProductDetails({
    product,
    whatsappPhoneNumber,
    locale,
    currency,
}: ProductDetailsProps) {
    const {
        selectedProductIds,
        toggleProduct,
        activeProductDetailsId,
        closeProductDetails,
    } = useSelection();

    const openedProduct = activeProductDetailsId === product.id;
    const isProductSelected = selectedProductIds.includes(product.id);
    const [activeTheme, setActiveTheme] = useState<Theme>("light");
    useEffect(() => {
        const root = document.documentElement;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

        function updateTheme() {
            const explicitTheme = root.dataset.theme;
            setActiveTheme(
                explicitTheme === "light" || explicitTheme === "dark"
                    ? explicitTheme
                    : systemTheme.matches
                        ? "dark"
                        : "light",
            );
        }

        const observer = new MutationObserver(updateTheme);
        observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
        systemTheme.addEventListener("change", updateTheme);
        updateTheme();

        return () => {
            observer.disconnect();
            systemTheme.removeEventListener("change", updateTheme);
        };
    }, []);

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (openedProduct && !dialog.open) {
            dialog.showModal();
        } else if (!openedProduct && dialog.open) {
            dialog.close();
        }
    }, [openedProduct]);

    useEffect(() => {
        if (!openedProduct) return;

        const root = document.documentElement;
        const previousOverflow = root.style.overflow;
        root.style.overflow = "hidden";

        return () => {
            root.style.overflow = previousOverflow;
        };
    }, [openedProduct]);

    const imageMedia: ProductGalleryItem[] = product.images ?? [];
    const videoMedia: ProductGalleryItem[] = product.videos ?? [];
    const [lightboxMediaType, setLightboxMediaType] = useState<LightboxMediaType>("image");
    const media = lightboxMediaType === "image" ? imageMedia : videoMedia;
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const mediaCount = media.length;
    const [mediaDirection, setMediaDirection] = useState<MediaDirection | null>(null);

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const lightboxOriginRef = useRef<string | null>(null);
    const lightboxBackButtonRef = useRef<HTMLButtonElement>(null);
    const wasLightboxOpenRef = useRef(false);

    const openLightbox = (
        mediaType: LightboxMediaType,
        index: number,
        trigger: HTMLButtonElement,
    ) => {
        lightboxOriginRef.current = trigger.dataset.lightboxTrigger ?? null;
        setLightboxMediaType(mediaType);
        setActiveMediaIndex(index);
        setMediaDirection(null);
        setIsLightboxOpen(true);
    };

    const showPreviousMedia = () => {
        if (activeMediaIndex <= 0) return;

        setMediaDirection("previous");
        setActiveMediaIndex((currentIndex) => Math.max(0, currentIndex - 1));
    };

    const showNextMedia = () => {
        if (activeMediaIndex >= mediaCount - 1) return;

        setMediaDirection("next");
        setActiveMediaIndex((currentIndex) =>
            Math.min(mediaCount - 1, currentIndex + 1),
        );
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    useEffect(() => {
        if (isLightboxOpen) {
            lightboxBackButtonRef.current?.focus();
        } else if (wasLightboxOpenRef.current) {
            const origin = Array.from(
                document.querySelectorAll<HTMLButtonElement>("[data-lightbox-trigger]"),
            ).find((button) =>
                button.dataset.lightboxTrigger === lightboxOriginRef.current &&
                button.getClientRects().length > 0,
            );
            origin?.focus();
        }

        wasLightboxOpenRef.current = isLightboxOpen;
    }, [isLightboxOpen]);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={
                isLightboxOpen
                    ? `product-lightbox-title-${product.id}`
                    : `product-details-title-${product.id}`
            }
            onCancel={(event) => {
                if (isLightboxOpen) {
                    event.preventDefault();
                    closeLightbox();
                } else {
                    closeProductDetails();
                }
            }}
            onKeyDown={(event) => {
                if (!isLightboxOpen || event.target instanceof HTMLVideoElement) return;

                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    showPreviousMedia();
                } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    showNextMedia();
                }
            }}
            className={styles.dialog}
        >
            {isLightboxOpen ? (
                <ProductLightbox
                    productId={product.id}
                    media={media}
                    productName={product.name}
                    locale={locale}
                    activeMediaIndex={activeMediaIndex}
                    mediaDirection={mediaDirection}
                    closeButtonRef={lightboxBackButtonRef}
                    onPreviousMedia={showPreviousMedia}
                    onNextMedia={showNextMedia}
                    onSelectMedia={(index) => {
                        setMediaDirection(null);
                        setActiveMediaIndex(index);
                    }}
                    onClose={closeLightbox}
                />
            ) : (
                <div className={styles.scrollArea}>
                    <div className={styles.layout}>
                        <ProductDetailsGallery
                            productId={product.id}
                            coverImage={product.coverImage}
                            images={product.images ?? []}
                            videos={product.videos ?? []}
                            productName={product.name}
                            locale={locale}
                            onOpenLightbox={openLightbox}
                        />
                        <ProductDetailsContent
                            product={product}
                            whatsappPhoneNumber={whatsappPhoneNumber}
                            locale={locale}
                            currency={currency}
                            theme={activeTheme}
                            isSelected={isProductSelected}
                            onToggleProduct={() => toggleProduct(product)}
                            onClose={closeProductDetails}
                        />
                    </div>
                </div>
            )}
        </dialog>
    );
}
