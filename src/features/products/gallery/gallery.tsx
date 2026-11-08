import Image from "next/image";
import { ProjectIcon } from "@/components/icons/project-icon";
import type { ProductImage, ProductVideo } from "@/domain/product";
import { type Locale, messages } from "@/lib/i18n";
import { ProductMediaRenderer } from "@/features/products/media-renderer/media-renderer";
import styles from "./gallery.module.css";

type LightboxMediaType = "image" | "video";

type ProductDetailsGalleryProps = {
    productId: string;
    coverImage: ProductImage;
    images: ProductImage[];
    videos: ProductVideo[];
    productName: string;
    locale: Locale;
    onOpenLightbox: (
        mediaType: LightboxMediaType,
        index: number,
        trigger: HTMLButtonElement,
    ) => void;
};

const desktopThumbnailLimit = 5;
const mobileThumbnailLimit = 3;

export function ProductDetailsGallery({
    productId,
    coverImage,
    images,
    videos,
    productName,
    locale,
    onOpenLightbox,
}: ProductDetailsGalleryProps) {
    const t = messages[locale];
    const hasBothMediaTypes = images.length > 0 && videos.length > 0;

    const renderImageThumbnail = (image: ProductImage, index: number) => (
        <button
            key={`${image.src}-${index}`}
            type="button"
            aria-label={`${t.showImage} ${index + 1}`}
            title={`${t.openMedia} ${index + 1}`}
            onClick={(event) => onOpenLightbox("image", index, event.currentTarget)}
            data-product-thumbnail={`${productId}-image-${index}`}
            data-lightbox-trigger={`${productId}-image-${index}`}
            className={styles.thumbnail}
        >
            <Image src={image.src} alt="" width={64} height={64} className={styles.thumbnailImage} />
        </button>
    );

    const renderVideoThumbnail = (video: ProductVideo, index: number) => (
        <button
            key={`${video.src}-${index}`}
            type="button"
            aria-label={`${t.showVideo} ${index + 1}`}
            title={`${t.openMedia} ${index + 1}`}
            onClick={(event) => onOpenLightbox("video", index, event.currentTarget)}
            data-product-thumbnail={`${productId}-video-${index}`}
            data-lightbox-trigger={`${productId}-video-${index}`}
            className={styles.thumbnail}
        >
            {video.poster ? (
                <span className={styles.videoThumbnailFrame}>
                    <Image src={video.poster} alt="" width={64} height={64} className={styles.thumbnailImage} />
                    <span aria-hidden="true" className={`${styles.playBadge} ${styles.thumbnailPlayBadge}`}>
                        <ProjectIcon name="play-arrow" className={styles.playIcon} />
                    </span>
                </span>
            ) : (
                <span aria-hidden="true" className={styles.videoLabel}>{t.video}</span>
            )}
        </button>
    );

    const renderOverflow = (mediaType: LightboxMediaType, total: number, limit: number) => (
        <button
            type="button"
            aria-label={`${mediaType === "image" ? t.morePhotos : t.moreVideos} ${total - limit}`}
            title={`${mediaType === "image" ? t.morePhotos : t.moreVideos} ${total - limit}`}
            onClick={(event) => onOpenLightbox(mediaType, limit, event.currentTarget)}
            data-lightbox-trigger={`${productId}-${mediaType}-overflow`}
            className={styles.thumbnailOverflow}
        >
            +{total - limit}
        </button>
    );

    const renderThumbnailLayout = (limit: number) => {
        const useSeparateThumbnailGroups = images.length + videos.length > limit;

        if (!useSeparateThumbnailGroups || !hasBothMediaTypes) {
            return (
                <div role="group" aria-label={t.productGallery} className={styles.thumbnails}>
                    {images.slice(0, limit).map(renderImageThumbnail)}
                    {videos.slice(0, limit).map(renderVideoThumbnail)}
                    {images.length > limit && renderOverflow("image", images.length, limit)}
                    {videos.length > limit && renderOverflow("video", videos.length, limit)}
                </div>
            );
        }

        return (
            <>
                <section className={styles.thumbnailGroup} aria-label={t.photos}>
                    <h3 className={styles.thumbnailGroupHeading}>
                        <span aria-hidden="true" className={styles.iconSlot}>
                            <svg viewBox="0 0 594 483" fillRule="evenodd" className={styles.iconArtwork}>
                            <path d="M593.573,257.894c0,160.954 0.345,161.06 -2.565,171.657c-7.07,25.746 -30.754,52.099 -69.847,52.52c-3.832,0.041 -409.563,0.008 -445.177,0.006c-54.111,-0.004 -75.582,-39.827 -75.891,-72.307c-0.061,-6.431 0.106,-245.725 -0.083,-256.211c-0.576,-31.971 21.93,-72.6 73.655,-73.314c27.579,-0.381 82.085,1.028 83.277,-0.989c0.648,-1.097 -5.209,-51.037 43.02,-73.078c15.302,-6.993 15.922,-6.085 154.255,-6.085c9.943,0 48.459,-3.673 72.505,35.537c12.529,20.431 8.086,43.112 11.09,44.482c5.033,2.296 84.604,-4.438 108.648,4.464c23.482,8.694 38.872,27.582 44.513,48.044c2.965,10.753 2.601,10.845 2.601,125.275Zm-162.218,10.457c3.07,110.552 -121.109,183.18 -217.79,110.61c-77.286,-58.012 -69.317,-195.112 40.912,-233.623c73.187,-25.57 171.738,21.9 176.878,123.013Z" />
                            <path d="M290.42,344.217c-85.3,-11.7 -83.669,-122.2 -10.28,-140.318c64.163,-15.84 112.475,59.111 74.845,110.512c-25.821,35.27 -63.695,29.811 -64.566,29.806Z" />
                            </svg>
                        </span>
                        <span>{t.photos}</span>
                    </h3>
                    <div role="group" aria-label={t.photos} className={styles.thumbnails}>
                        {images.slice(0, limit).map(renderImageThumbnail)}
                        {images.length > limit && renderOverflow("image", images.length, limit)}
                    </div>
                </section>
                <section className={styles.thumbnailGroup} aria-label={t.videos}>
                    <h3 className={styles.thumbnailGroupHeading}>
                        <span aria-hidden="true" className={styles.iconSlot}>
                            <svg viewBox="0 0 594 390" className={styles.iconArtwork}>
                            <path d="M0.108,129.094c0,-45.321 -3.131,-67.311 24.295,-99.183c25.653,-29.812 66.198,-29.814 72.467,-29.815c243.29,-0.013 243.182,-0.22 264.327,0.017c46.81,0.524 73.5,31.775 82.319,50.142c20.61,42.926 1.735,63.901 14.749,56.277c9.411,-5.513 95.787,-55.428 99.018,-57.061c13.766,-6.956 29.328,-1.192 34.836,13.452c1.672,4.446 1.473,4.601 1.473,142.685c0,118.965 0.627,119.832 -4.315,126.142c-2.582,3.297 -10.314,13.064 -25.159,10.353c-9.948,-1.817 -106.739,-60.881 -109.026,-61.124c-5.47,-0.58 10.667,54.133 -40.217,90.886c-24.933,18.009 -49.754,17.227 -61.799,17.227c-270.329,0.009 -270.449,0.28 -281.749,-2.493c-5.539,-1.359 -55.243,-12.416 -69.061,-69.807c-2.456,-10.199 -2.159,-10.286 -2.159,-187.7Z" />
                            </svg>
                        </span>
                        <span>{t.videos}</span>
                    </h3>
                    <div role="group" aria-label={t.videos} className={styles.thumbnails}>
                        {videos.slice(0, limit).map(renderVideoThumbnail)}
                        {videos.length > limit && renderOverflow("video", videos.length, limit)}
                    </div>
                </section>
            </>
        );
    };

    return (
        <section aria-label={t.productGallery} className={styles.gallery}>
            <div className={styles.galleryLayout}>
                <div className={styles.mediaColumn}>
                    <div className={styles.activeMedia}>
                        <ProductMediaRenderer
                            media={coverImage}
                            productName={productName}
                            locale={locale}
                        />
                    </div>
                </div>

                {(images.length > 0 || videos.length > 0) && (
                    <div className={`${styles.thumbnailGroups} ${styles.desktopThumbnailLayout}`}>
                        {renderThumbnailLayout(desktopThumbnailLimit)}
                    </div>
                )}
                {(images.length > 0 || videos.length > 0) && (
                    <div className={`${styles.thumbnailGroups} ${styles.mobileThumbnailLayout}`}>
                        {renderThumbnailLayout(mobileThumbnailLimit)}
                    </div>
                )}
            </div>
        </section>
    );
}
