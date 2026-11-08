import type { ProductAvailability } from "@/domain/product";

const availabilityLabels: Record<ProductAvailability, string> = {
    available: "Disponível",
    reserved: "Reservado",
    sold: "Vendido",
};

export function getAvailabilityLabel(availability: ProductAvailability): string {
    return availabilityLabels[availability];
}