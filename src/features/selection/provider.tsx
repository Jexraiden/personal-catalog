"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import type { Product } from "@/domain/product";
import { getDiscountInCents, getEffectivePriceInCents } from "@/domain/product-pricing";

type SelectionContextValue = {
    selectedProductIds: string[];
    selectedProducts: Product[];
    totalPriceInCents: number;
    originalTotalPriceInCents: number;
    totalDiscountInCents: number;
    toggleProduct: (product: Product) => void;
    activeProductDetailsId: string | null;
    openProductDetails: (productId: string) => void;
    closeProductDetails: () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ products, children }: {
    products: Product[],
    children: ReactNode
}) {
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

    const selectedProducts = products.filter((product) =>
        selectedProductIds.includes(product.id)
    );

    const totalPriceInCents = selectedProducts.reduce(
        (total, product) => total + getEffectivePriceInCents(product),
        0,
    );
    const originalTotalPriceInCents = selectedProducts.reduce(
        (total, product) => total + product.priceInCents,
        0,
    );
    const totalDiscountInCents = selectedProducts.reduce(
        (total, product) => total + getDiscountInCents(product),
        0,
    );

    const [activeProductDetailsId, setActiveProductDetailsId] =
        useState<string | null>(null);

    function openProductDetails(productId: string) {
        setActiveProductDetailsId(productId);
    }

    function closeProductDetails() {
        setActiveProductDetailsId(null);
    }

    function toggleProduct(product: Product) {
        if (product.availability !== "available") return;

        setSelectedProductIds((current) => {
            if (current.includes(product.id)) {
                return current.filter((id) => id !== product.id);
            }

            return [...current, product.id];
        });
    }

    return (
        <SelectionContext.Provider
            value={{
                selectedProductIds,
                selectedProducts,
                totalPriceInCents,
                originalTotalPriceInCents,
                totalDiscountInCents,
                toggleProduct,
                activeProductDetailsId,
                openProductDetails,
                closeProductDetails,
            }}
        >
            {children}
        </SelectionContext.Provider>
    );
}

export function useSelection() {
    const context = useContext(SelectionContext);

    if (!context) {
        throw new Error("useSelection must be used within a SelectionProvider");
    }

    return context;
}
