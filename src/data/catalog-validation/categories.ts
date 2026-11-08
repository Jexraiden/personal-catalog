import type { ProductCategory } from "../../domain/product";
import { checkKeys, readRecord, readString, type ValidationIssue } from "./shared";

export function readCategories(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): ProductCategory[] | undefined {
  if (!Array.isArray(value) || value.length === 0) {
    issues.push({ path, message: "must be a non-empty list" });
    return undefined;
  }

  const categories = value.flatMap((entry, index) => {
    const categoryPath = `${path}[${index}]`;
    const category = readRecord(entry, categoryPath, issues);

    if (!category) return [];

    checkKeys(category, ["id", "label"], categoryPath, issues);

    const id = readString(category.id, `${categoryPath}.id`, issues);
    const label = readString(category.label, `${categoryPath}.label`, issues);

    if (id === undefined || label === undefined) return [];

    return [{ id: id.trim().toLowerCase(), label: label.trim() }];
  });

  if (new Set(categories.map((category) => category.id)).size !== categories.length) {
    issues.push({ path, message: "must not contain duplicate category IDs" });
  }

  return categories;
}

