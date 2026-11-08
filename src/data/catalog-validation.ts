import type { Product, ProductCategory } from "../domain/product";
import { readCategories } from "./catalog-validation/categories";
import { validateProduct } from "./catalog-validation/product";
import {
  checkKeys,
  readRecord,
  readString,
  throwValidationError,
  type ValidationIssue,
} from "./catalog-validation/shared";

export type Catalog = {
  currency: string;
  categories: ProductCategory[];
  products: Product[];
};

export function validateCatalog(value: unknown): Catalog {
  const issues: ValidationIssue[] = [];
  const root = readRecord(value, "catalog", issues);
  if (!root) throwValidationError(issues);

  checkKeys(root, ["currency", "categories", "products"], "catalog", issues);
  const currency = readString(root.currency, "currency", issues);
  if (
    currency !== undefined &&
    (!/^[A-Z]{3}$/.test(currency) || !Intl.supportedValuesOf("currency").includes(currency))
  ) {
    issues.push({
      path: "currency",
      message: "must be a valid uppercase ISO 4217 currency code, such as BRL",
    });
  }
  const categories = readCategories(
    root.categories,
    "catalog.categories",
    issues,
  );

  if (categories === undefined) {
    throwValidationError(issues);
  }

  let products: Product[] = [];
  if (!Array.isArray(root.products) || root.products.length === 0) {
    issues.push({ path: "products", message: "must contain at least one product" });
  } else {
    products = root.products.flatMap((entry, index) => {
      const product = validateProduct(entry, index, categories, issues);
      return product ? [product] : [];
    });

    const ids = new Set<string>();
    products.forEach((product, index) => {
      if (ids.has(product.id)) {
        issues.push({
          path: `products[${index}].id`,
          message: "must be unique",
        });
      }
      ids.add(product.id);
    });
  }

  if (issues.length > 0 || currency === undefined) throwValidationError(issues);
  return { currency, categories, products };
}

