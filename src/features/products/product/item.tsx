import type { ReactNode } from "react";
import type { Product } from "@/domain/product";
import { ProductCard } from "./card/card";
import { ProductDetails } from "./details/details";
import type { Locale } from "@/lib/i18n";

type ProductItemProps = {
    product: Product;
    whatsappPhoneNumber: string;
    thumbnail?: ReactNode;
    className: string;
    locale: Locale;
    currency: string;
};

export function ProductItem({
    product,
    whatsappPhoneNumber,
    thumbnail,
    className,
    locale,
    currency,
}: ProductItemProps) {
    return (
        <>
            <ProductCard
                product={product}
                thumbnail={thumbnail}
                className={className}
                locale={locale}
                currency={currency}
                whatsappPhoneNumber={whatsappPhoneNumber}
            />
            <ProductDetails
                product={product}
                whatsappPhoneNumber={whatsappPhoneNumber}
                locale={locale}
                currency={currency}
            />
        </>
    );
}
