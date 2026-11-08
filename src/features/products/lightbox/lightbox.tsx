import type { RefObject } from "react";
import type { Locale } from "@/lib/i18n";
import type { ProductGalleryItem } from "@/domain/product";
import { ProductLightboxStage } from "@/features/products/lightbox/stage/stage";
import { ProductLightboxThumbnails } from "@/features/products/lightbox/thumbnails/thumbnails";
import styles from "./lightbox.module.css";

export type ProductLightboxProps = {
    productId: string;
    media: ProductGalleryItem[];
    productName: string;
    locale: Locale;
    activeMediaIndex: number;
    mediaDirection: "previous" | "next" | null;
    closeButtonRef: RefObject<HTMLButtonElement | null>;
    onPreviousMedia: () => void;
    onNextMedia: () => void;
    onSelectMedia: (index: number) => void;
    onClose: () => void;
};

export function ProductLightbox({
    productId,
    media,
    productName,
    locale,
    activeMediaIndex,
    mediaDirection,
    closeButtonRef,
    onPreviousMedia,
    onNextMedia,
    onSelectMedia,
    onClose,
}: ProductLightboxProps) {
    return (
        <section className={styles.lightbox}>
            <h2
                id={`product-lightbox-title-${productId}`}
                className={styles.visuallyHidden}
            >
                Visualização ampliada: {productName}
            </h2>

            <ProductLightboxStage
                media={media}
                productName={productName}
                locale={locale}
                activeMediaIndex={activeMediaIndex}
                mediaDirection={mediaDirection}
                closeButtonRef={closeButtonRef}
                onPreviousMedia={onPreviousMedia}
                onNextMedia={onNextMedia}
                onClose={onClose}
            />

            {media.length > 0 && (
                <ProductLightboxThumbnails
                    media={media}
                    locale={locale}
                    activeMediaIndex={activeMediaIndex}
                    onSelectMedia={onSelectMedia}
                />
            )}
        </section>
    );
}
