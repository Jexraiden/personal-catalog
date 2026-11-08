import { formatPrice } from "@/lib/format-price";
import type { Product } from "@/domain/product";
import type { Locale } from "@/lib/i18n";
import { getEffectivePriceInCents } from "@/domain/product-pricing";

export function buildGeneralContactMessage(locale: Locale = "pt-BR"): string {
    return locale === "en"
        ? "Hello! I’d like to learn more about the *items in this catalog demo*."
        : "Oi! Tenho interesse em conhecer melhor os *itens desta demonstração de catálogo*.";
};

export function buildProductContactMessage(
    product: Product,
    locale: Locale = "pt-BR",
    currency = "BRL",
): string {
    const effectivePrice = getEffectivePriceInCents(product);
    const priceText = product.discountedPriceInCents && product.discountedPriceInCents > 0
        ? `${formatPrice(effectivePrice, locale, currency)} (${locale === "en" ? "originally" : "antes"} ${formatPrice(product.priceInCents, locale, currency)})`
        : formatPrice(effectivePrice, locale, currency);
    return locale === "en"
        ? `Hello! I’m interested in *${product.name}*, listed for *${priceText}*. Is it still available?`
        : `Oi! Tenho interesse em *${product.name}*, anunciado por *${priceText}*. Ele ainda está disponível?`;
};

export function buildReservedProductContactMessage(
    product: Product,
    locale: Locale = "pt-BR",
    currency = "BRL",
): string {
    const priceText = product.discountedPriceInCents && product.discountedPriceInCents > 0
        ? `${formatPrice(getEffectivePriceInCents(product), locale, currency)} (${locale === "en" ? "originally" : "antes"} ${formatPrice(product.priceInCents, locale, currency)})`
        : formatPrice(getEffectivePriceInCents(product), locale, currency);

    return locale === "en"
        ? `Hello! I’m interested in *${product.name}*, listed for *${priceText}*. I saw that it’s reserved. If the reservation doesn’t go through, I’d like to discuss it.`
        : `Oi! Tenho interesse em *${product.name}*, anunciado por *${priceText}*. Vi que está reservado. Se a negociação não se concretizar, gostaria de conversar.`;
}

type ContactProduct = Pick<Product, "name" | "priceInCents" | "discountedPriceInCents">;

export function buildSelectionContactMessage(
    products: ContactProduct[],
    totalPriceInCents: number,
    locale: Locale = "pt-BR",
    currency = "BRL",
): string {
    const productList = products.map((product) => {
        const originalPrice = product.discountedPriceInCents && product.discountedPriceInCents > 0
            ? ` (${locale === "en" ? "originally" : "antes"} ${formatPrice(product.priceInCents, locale, currency)})`
            : "";
        return `- *${product.name}:* ${formatPrice(getEffectivePriceInCents(product), locale, currency)}${originalPrice}`;
    }).join("\n");
    const totalDiscountInCents = products.reduce(
        (total, product) => total + product.priceInCents - getEffectivePriceInCents(product),
        0,
    );

    return locale === "en"
        ? `Hello! I’m interested in these catalog items:
${productList}

Total value: *${formatPrice(totalPriceInCents, locale, currency)}*${totalDiscountInCents > 0 ? ` (you save ${formatPrice(totalDiscountInCents, locale, currency)})` : ""}. Can we talk about their availability?`
        : `Oi! Tenho interesse nestes itens do catálogo:
${productList}

Valor total: *${formatPrice(totalPriceInCents, locale, currency)}*${totalDiscountInCents > 0 ? ` (desconto de ${formatPrice(totalDiscountInCents, locale, currency)})` : ""}. Podemos conversar sobre a disponibilidade?`;
}

export function buildWhatsAppUrl(
    phoneNumber: string,
    message: string
): string {
    const isValidPhoneNumber = /^\d{10,15}$/.test(phoneNumber);

    if (!isValidPhoneNumber) {
        throw new Error("WhatsApp phone number must contain 10 to 15 digits.");
    }

    const url = new URL("https://wa.me/");
    url.pathname = phoneNumber;
    url.searchParams.set("text", message);

    return url.toString();
}
