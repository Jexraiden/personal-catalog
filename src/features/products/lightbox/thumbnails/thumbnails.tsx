import { useEffect, useRef, type PointerEvent } from "react";
import Image from "next/image";
import { type Locale, messages } from "@/lib/i18n";
import { publicPath } from "@/lib/public-path";
import type { ProductGalleryItem } from "@/domain/product";
import { isProductVideo } from "@/domain/product";
import styles from "./thumbnails.module.css";

type ProductLightboxThumbnailsProps = {
    media: ProductGalleryItem[];
    locale: Locale;
    activeMediaIndex: number;
    onSelectMedia: (index: number) => void;
}

type ThumbnailDrag = {
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    dragged: boolean;
    captureElement: HTMLElement;
};

export function ProductLightboxThumbnails({
    media,
    locale,
    activeMediaIndex,
    onSelectMedia,
}: ProductLightboxThumbnailsProps) {
    const t = messages[locale];
    const thumbnailsRef = useRef<HTMLDivElement>(null);
    const thumbnailDragRef = useRef<ThumbnailDrag | null>(null);
    const ignoreThumbnailClickRef = useRef(false);

    useEffect(() => {
        const thumbnails = thumbnailsRef.current;
        const activeThumbnail = thumbnails?.children[activeMediaIndex];

        if (!(activeThumbnail instanceof HTMLElement) || !thumbnails) return;

        const itemLeft = activeThumbnail.offsetLeft;
        const itemRight = itemLeft + activeThumbnail.offsetWidth;
        const visibleLeft = thumbnails.scrollLeft;
        const visibleRight = visibleLeft + thumbnails.clientWidth;

        if (itemLeft < visibleLeft) {
            thumbnails.scrollTo({ left: itemLeft, behavior: "smooth" });
        } else if (itemRight > visibleRight) {
            thumbnails.scrollTo({
                left: itemRight - thumbnails.clientWidth,
                behavior: "smooth",
            });
        }
    }, [activeMediaIndex]);

    function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
        if (event.pointerType !== "mouse" || event.button !== 0) return;

        const captureElement = event.target instanceof HTMLElement
            ? event.target
            : event.currentTarget;

        thumbnailDragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScrollLeft: event.currentTarget.scrollLeft,
            dragged: false,
            captureElement,
        };

        captureElement.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
        const drag = thumbnailDragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - drag.startX;
        if (Math.abs(deltaX) > 4) drag.dragged = true;

        event.currentTarget.scrollLeft = drag.startScrollLeft - deltaX;
    }

    function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
        const drag = thumbnailDragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        if (drag.captureElement.hasPointerCapture(event.pointerId)) {
            drag.captureElement.releasePointerCapture(event.pointerId);
        }

        ignoreThumbnailClickRef.current = drag.dragged;
        thumbnailDragRef.current = null;
    }

    function handleThumbnailClick(index: number) {
        if (ignoreThumbnailClickRef.current) {
            ignoreThumbnailClickRef.current = false;
            return;
        }

        onSelectMedia(index);
    }

    return (
        <div
            ref={thumbnailsRef}
            role="group"
            aria-label={t.allProductMedia}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={styles.thumbnails}
        >
            {media.map((item, index) => (
                <button
                    key={`${item.src}-${index}`}
                    type="button"
                    aria-label={
                        isProductVideo(item)
                            ? `${t.showVideo} ${index + 1}`
                            : `${t.showImage} ${index + 1}`
                    }
                    aria-pressed={activeMediaIndex === index}
                    onClick={() => handleThumbnailClick(index)}
                    className={styles.thumbnail}
                >
                    {!isProductVideo(item) || item.poster ? (
                        <Image
                            src={publicPath(!isProductVideo(item) ? item.src : item.poster ?? "")}
                            alt=""
                            width={64}
                            height={64}
                            draggable={false}
                            className={styles.thumbnailImage}
                        />
                    ) : (
                        <span className={styles.videoLabel}>
                            {t.video}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
