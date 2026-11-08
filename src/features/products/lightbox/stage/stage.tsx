import {
    useEffect,
    useRef,
    useState,
    type RefObject,
    type MouseEvent,
    type TouchEvent,
} from "react";
import { ProjectIcon } from "@/components/icons/project-icon";
import { type Locale, messages } from "@/lib/i18n";
import type { ProductGalleryItem } from "@/domain/product";
import { isProductVideo } from "@/domain/product";
import { ProductMediaRenderer } from "@/features/products/media-renderer/media-renderer";
import styles from "./stage.module.css";

type ProductLightboxStageProps = {
    media: ProductGalleryItem[];
    productName: string;
    locale: Locale;
    activeMediaIndex: number;
    mediaDirection: "previous" | "next" | null;
    closeButtonRef: RefObject<HTMLButtonElement | null>;
    onPreviousMedia: () => void;
    onNextMedia: () => void;
    onClose: () => void;
}

export function ProductLightboxStage({
    media,
    productName,
    locale,
    activeMediaIndex,
    mediaDirection,
    closeButtonRef,
    onPreviousMedia,
    onNextMedia,
    onClose,
}: ProductLightboxStageProps) {
    const t = messages[locale];
    const activeMedia = media[activeMediaIndex];
    const mediaCount = media.length;

    // Tracks which image is currently zoomed in.
    const [zoomedMediaIndex, setZoomedMediaIndex] = useState<number | null>(null);
    const isImageZoomed = zoomedMediaIndex === activeMediaIndex;
    const [previousActiveMediaIndex, setPreviousActiveMediaIndex] =
        useState(activeMediaIndex);

    if (previousActiveMediaIndex !== activeMediaIndex) {
        setPreviousActiveMediaIndex(activeMediaIndex);
        setZoomedMediaIndex(null);
    }

    // Stores the natural dimensions of the loaded image.
    const [loadedImageSize, setLoadedImageSize] = useState<{
        index: number;
        width: number;
        height: number;
    } | null>(null);

    const naturalImageSize = loadedImageSize?.index === activeMediaIndex
        ? loadedImageSize
        : null;

    // Tracks whether the stage is in fullscreen mode.
    const [isFullscreen, setIsFullscreen] = useState(false);

    // References to the stage elements and interactions.
    const lightboxStageRef = useRef<HTMLDivElement>(null);
    const mediaViewportRef = useRef<HTMLDivElement>(null);

    const imageDragRef = useRef<{
        startX: number;
        startY: number;
        startScrollLeft: number;
        startScrollTop: number;
    } | null>(null);

    const touchStartPointRef = useRef<{ x: number; y: number } | null>(null);

    const handleImageMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        if (
            !isImageZoomed ||
            event.button !== 0 ||
            !(event.target instanceof HTMLImageElement)
        ) {
            return;
        }

        imageDragRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            startScrollLeft: event.currentTarget.scrollLeft,
            startScrollTop: event.currentTarget.scrollTop,
        };

        event.preventDefault();
    };

    useEffect(() => {
        if (!isImageZoomed) return;

        const stopDragging = () => {
            imageDragRef.current = null;
        };

        const moveImage = (event: globalThis.MouseEvent) => {
            const drag = imageDragRef.current;
            if (!drag) return;

            if ((event.buttons & 1) === 0) {
                stopDragging();
                return;
            }

            const viewport = mediaViewportRef.current;
            if (!viewport) return;

            viewport.scrollLeft =
                drag.startScrollLeft - (event.clientX - drag.startX);
            viewport.scrollTop =
                drag.startScrollTop - (event.clientY - drag.startY);
        };

        window.addEventListener("mousemove", moveImage);
        window.addEventListener("mouseup", stopDragging);
        window.addEventListener("blur", stopDragging);

        return () => {
            window.removeEventListener("mousemove", moveImage);
            window.removeEventListener("mouseup", stopDragging);
            window.removeEventListener("blur", stopDragging);
            stopDragging();
        };
    }, [isImageZoomed]);

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        if (event.touches.length !== 1) {
            touchStartPointRef.current = null;
            return;
        }

        const touch = event.touches[0];

        touchStartPointRef.current = {
            x: touch.clientX,
            y: touch.clientY,
        };
    };

    const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
        const start = touchStartPointRef.current;
        const touch = event.changedTouches[0];

        touchStartPointRef.current = null;

        if (!start || !touch) return;

        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;

        if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) {
            return;
        }

        if (deltaX < 0) {
            onNextMedia();
        } else {
            onPreviousMedia();
        }
    };

    useEffect(() => {
        const updateFullscreen = () => {
            setIsFullscreen(
                document.fullscreenElement === lightboxStageRef.current,
            );
        };

        document.addEventListener("fullscreenchange", updateFullscreen);

        return () => {
            document.removeEventListener("fullscreenchange", updateFullscreen);
        };
    }, []);

    useEffect(() => {
        const stage = lightboxStageRef.current;
        if (!stage || document.fullscreenElement !== stage) return;

        void document.exitFullscreen().catch(() => {
            setIsFullscreen(false);
        });
    }, [activeMediaIndex]);

    const toggleFullscreen = async () => {
        const stage = lightboxStageRef.current;
        if (!stage) return;

        try {
            if (document.fullscreenElement === stage) {
                await document.exitFullscreen();
            } else {
                await stage.requestFullscreen();
            }
        } catch {
            setIsFullscreen(false);
        }
    };

    const handleClose = () => {
        const stage = lightboxStageRef.current;

        if (stage && document.fullscreenElement === stage) {
            void document.exitFullscreen().catch(() => {
                setIsFullscreen(false);
            });
        }

        setZoomedMediaIndex(null);
        onClose();
    };

    return (
        <div
            ref={lightboxStageRef}
            className={`${styles.stage} ${isFullscreen ? styles.fullscreen : ""}`}
        >
            <div
                ref={mediaViewportRef}
                key={activeMediaIndex}
                className={`${styles.viewport} ${isImageZoomed && activeMedia && !isProductVideo(activeMedia)
                    ? styles.zoomedViewport
                    : styles.centeredViewport} ${activeMedia && !isProductVideo(activeMedia) && !isImageZoomed
                    ? styles.touchPanY
                    : ""}`}
                onMouseDown={handleImageMouseDown}
                onTouchStart={
                    activeMedia && !isProductVideo(activeMedia) && !isImageZoomed
                        ? handleTouchStart
                        : undefined
                }
                onTouchEnd={
                    activeMedia && !isProductVideo(activeMedia) && !isImageZoomed
                        ? handleTouchEnd
                        : undefined
                }
                onTouchCancel={() => {
                    touchStartPointRef.current = null;
                }}
            >
                <div
                    className={`${styles.mediaAlignment} ${isImageZoomed && activeMedia && !isProductVideo(activeMedia)
                        ? styles.zoomedAlignment
                        : styles.fitAlignment}`}
                >
                    <div
                        className={`${styles.mediaFrame} ${isImageZoomed && activeMedia && !isProductVideo(activeMedia)
                            ? styles.zoomedFrame
                            : styles.fitFrame} ${mediaDirection === "next"
                            ? styles.slideNext
                            : mediaDirection === "previous"
                                ? styles.slidePrevious
                                : ""}`}
                    >
                        <ProductMediaRenderer
                            media={activeMedia}
                            productName={productName}
                            locale={locale}
                            isLightbox
                            isZoomed={
                                isImageZoomed && activeMedia && !isProductVideo(activeMedia)
                            }
                            naturalImageSize={naturalImageSize}
                            onImageLoad={(width, height) => {
                                setLoadedImageSize({
                                    index: activeMediaIndex,
                                    width,
                                    height,
                                });
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.topControls}>
                {activeMedia && !isProductVideo(activeMedia) && (
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                setZoomedMediaIndex((current) =>
                                    current === activeMediaIndex
                                        ? null
                                        : activeMediaIndex,
                                );
                                mediaViewportRef.current?.scrollTo({
                                    top: 0,
                                    left: 0,
                                });
                            }}
                            aria-label={isImageZoomed ? t.fitImage : t.showImage100}
                            title={isImageZoomed ? t.fitScreen : t.show100}
                            className={`${styles.controlButton} ${styles.squareControl}`}
                        >
                            <ProjectIcon name="expand" className={styles.controlIcon} />
                        </button>

                        <button
                            type="button"
                            onClick={() => void toggleFullscreen()}
                            aria-label={
                                isFullscreen ? t.exitFullscreen : t.enterFullscreen
                            }
                            title={isFullscreen ? t.exitFullscreen : t.fullscreen}
                            className={`${styles.controlButton} ${styles.squareControl}`}
                        >
                            <ProjectIcon name="fullscreen" className={styles.controlIcon} />
                        </button>
                    </>
                )}

                <button
                    type="button"
                    onClick={handleClose}
                    ref={closeButtonRef}
                    aria-label={t.closeLightbox}
                    title={t.close}
                    className={`${styles.controlButton} ${styles.squareControl}`}
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

            {mediaCount > 1 && (
                <>
                    <button
                        type="button"
                        onClick={onPreviousMedia}
                        disabled={activeMediaIndex <= 0}
                        aria-label={t.previousMedia}
                        title={t.previousMedia}
                        className={`${styles.controlButton} ${styles.navigationButton} ${styles.previousButton}`}
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className={`${styles.navigationIcon} ${styles.previousIcon}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={onNextMedia}
                        disabled={activeMediaIndex >= mediaCount - 1}
                        aria-label={t.nextMedia}
                        title={t.nextMedia}
                        className={`${styles.controlButton} ${styles.navigationButton} ${styles.nextButton}`}
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className={`${styles.navigationIcon} ${styles.nextIcon}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
}
