import type { Locale } from "@/lib/i18n";

export function formatPrice(
    priceInCents: number,
    locale: Locale = "pt-BR",
    currency = "BRL",
): string {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "pt-BR", {
        style: "currency",
        currency,
    }).format(priceInCents / 100);
}
