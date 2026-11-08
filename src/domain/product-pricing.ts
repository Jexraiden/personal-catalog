import type { Product } from "@/domain/product";

type PriceableProduct = Pick<Product, "priceInCents" | "discountedPriceInCents">;

export function getEffectivePriceInCents(product: PriceableProduct): number {
  return product.discountedPriceInCents && product.discountedPriceInCents > 0
    ? product.discountedPriceInCents
    : product.priceInCents;
}

export function getDiscountInCents(product: PriceableProduct): number {
  return product.priceInCents - getEffectivePriceInCents(product);
}

export function getDiscountPercentage(product: PriceableProduct): number {
  const discount = getDiscountInCents(product);
  return discount > 0 ? Math.round((discount / product.priceInCents) * 100) : 0;
}
