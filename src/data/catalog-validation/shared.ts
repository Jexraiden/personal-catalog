import type { ProductAvailability } from "../../domain/product";

export const allowedAvailability: ProductAvailability[] = [
  "available",
  "reserved",
  "sold",
];
const maxIssues = 50;

export type ValidationIssue = {
  path: string;
  message: string;
};

export type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readRecord(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): UnknownRecord | undefined {
  if (!isRecord(value)) {
    issues.push({ path, message: "must be an object" });
    return undefined;
  }

  return value;
}

export function checkKeys(
  value: UnknownRecord,
  allowed: string[],
  path: string,
  issues: ValidationIssue[],
): void {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      issues.push({ path: `${path}.${key}`, message: "unknown field" });
    }
  }
}

export function readString(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
  optional = false,
): string | undefined {
  if (value === undefined && optional) return undefined;

  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push({ path, message: "must be a non-empty string" });
    return undefined;
  }

  return value;
}

export function readSpecifications(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    issues.push({ path, message: "must be a string" });
    return undefined;
  }
  const paragraph = value.trim();
  return paragraph.length > 0 ? paragraph : undefined;
}

export function readNumber(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
  integer: boolean,
  positive: boolean,
): number | undefined {
  const valid =
    typeof value === "number" &&
    Number.isFinite(value) &&
    (!integer || Number.isInteger(value)) &&
    (positive ? value > 0 : value >= 0);

  if (!valid) {
    issues.push({
      path,
      message: positive
        ? "must be a number greater than zero"
        : integer
          ? "must be an integer greater than or equal to zero"
          : "must be a number greater than or equal to zero",
    });
    return undefined;
  }

  return value as number;
}

export function readBoolean(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): boolean | undefined {
  if (typeof value !== "boolean") {
    issues.push({ path, message: "must be true or false" });
    return undefined;
  }

  return value;
}

export function isSecureUrl(value: string, hosts?: string[]): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (hosts === undefined || hosts.includes(url.hostname.toLowerCase()))
    );
  } catch {
    return false;
  }
}


export function throwValidationError(issues: ValidationIssue[]): never {
  const visibleIssues = issues.slice(0, maxIssues);
  const remainingCount = issues.length - visibleIssues.length;
  const details = visibleIssues
    .map(({ path, message }) => `- ${path}: ${message}`)
    .join("\n");
  const suffix = remainingCount > 0 ? `\n- ... and ${remainingCount} more error(s)` : "";

  throw new Error(
    `The data/catalog.yaml file contains invalid data:\n${details}${suffix}`,
  );
}

