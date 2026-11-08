import Image from "next/image";
import { type Locale, messages } from "@/lib/i18n";
import { isProductVideo, type ProductGalleryItem } from "@/domain/product";
import styles from "./media-renderer.module.css";

function getYouTubeEmbedUrl(src: string): string | null {
    try {
        const url = new URL(src);
        const hostname = url.hostname.replace(/^www\./, "");
        const videoId = hostname === "youtu.be"
            ? url.pathname.split("/")[1]
            : hostname === "youtube.com" && url.pathname === "/watch"
                ? url.searchParams.get("v")
                : null;

        return videoId
            ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?playsinline=1`
            : null;
    } catch {
        return null;
    }
}

export function ProductMediaRenderer({
    media,
    productName,
    locale,
    isLightbox = false,
    isZoomed = false,
    naturalImageSize,
    onImageLoad,
}: {
    media: ProductGalleryItem | undefined;
    productName: string;
    locale: Locale;
    isLightbox?: boolean;
    isZoomed?: boolean;
    naturalImageSize?: { width: number; height: number } | null;
    onImageLoad?: (width: number, height: number) => void;
}) {
    const t = messages[locale];
    if (!media) return null;

    if (!isProductVideo(media)) {
        return (
            <Image
                src={media.src}
                alt={media.alt}
                width={isLightbox
                    ? naturalImageSize?.width ?? 400
                    : 400}
                height={isLightbox
                    ? naturalImageSize?.height ?? 600
                    : 600}
                unoptimized={isLightbox}
                draggable={!isLightbox}
                onLoad={(event) => onImageLoad?.(
                    event.currentTarget.naturalWidth,
                    event.currentTarget.naturalHeight,
                )}
                className={isZoomed
                    ? styles.zoomedImage
                    : isLightbox
                    ? styles.lightboxImage
                        : styles.productImage}
            />
        );
    }

    if (isLightbox && media.source === "youtube") {
        const embedUrl = getYouTubeEmbedUrl(media.src);

        return embedUrl ? (
            <iframe
                src={embedUrl}
                title={`${t.productVideo} ${productName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className={styles.youtubeFrame}
            />
        ) : (
            <p>{t.incompatibleVideo}</p>
        );
    }

    if (isLightbox && media.source === "local") {
        return (
            <video
                controls
                playsInline
                preload="metadata"
                className={styles.localVideo}
            >
                <source src={media.src} />
                Seu navegador não conseguiu reproduzir o vídeo.
            </video>
        );
    }

    if (!media.poster) {
        return (
            <p className={styles.videoPlaceholder}>
                {t.videoCoverUnavailable}
            </p>
        );
    }

    return (
        <Image
            src={media.poster}
            alt={`${t.productVideo} ${productName}`}
            width={1280}
            height={720}
            className={
                isLightbox
                    ? styles.lightboxPoster
                    : styles.productPoster
            }
        />
    );
}
