export type ProductAvailability = "available" | "reserved" | "sold";

export type ProductCategory = {
  id: string;
  label: string;
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductVideo =
  | {
      source: "youtube";
      src: string;
      poster?: string;
    }
  | {
      source: "local";
      src: `/${string}`;
      poster?: string;
    };

export type ProductGalleryItem = ProductImage | ProductVideo;

export function isProductVideo(item: ProductGalleryItem): item is ProductVideo {
  return "source" in item;
}

export type ComboItem = {
  name: string;
  description?: string;
  specifications?: string;
};

export type ShippingInfo = {
  weightGrams: number;
  widthCm: number;
  heightCm: number;
  lengthCm: number;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  specifications?: string;
  // Store whole cents; for example, R$ 22,45 is 2245.
  priceInCents: number;
  // Optional final price when the product is discounted; zero means no discount.
  discountedPriceInCents?: number;
  condition: string;
  conditionDetails?: string;
  availability: ProductAvailability;
  coverImage: ProductImage;
  images?: ProductImage[];
  videos?: ProductVideo[];
  comboItems?: ComboItem[];
  shipping?: ShippingInfo;
};
