import "server-only";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load, YAMLException } from "js-yaml";
import { validateCatalog, type Catalog } from "./catalog-validation";

const catalogPath = resolve(process.cwd(), "data/catalog.yaml");
const catalogExamplePath = resolve(process.cwd(), "data/catalog-example.yaml");

export type { Catalog } from "./catalog-validation";

export function parseCatalogYaml(
  source: string,
  sourcePath = "data/catalog.yaml",
): Catalog {
  let parsed: unknown;

  try {
    parsed = load(source, { filename: sourcePath });
  } catch (error) {
    if (error instanceof YAMLException) {
      const line = error.mark ? error.mark.line + 1 : undefined;
      const location = line === undefined ? "" : ` at line ${line}`;
      throw new Error(
        `Could not parse ${sourcePath}${location}: invalid YAML syntax.`,
      );
    }
    throw error;
  }

  return validateCatalog(parsed);
}

export function readCatalog(path = catalogPath): Catalog {
  let source: string;
  let sourceLabel = path === catalogPath ? "data/catalog.yaml" : path;

  try {
    source = readFileSync(path, "utf8");
  } catch (error) {
    if (isMissingFileError(error)) {
      if (path !== catalogPath) throw error;

      try {
        source = readFileSync(catalogExamplePath, "utf8");
        sourceLabel = "data/catalog-example.yaml";
      } catch (exampleError) {
        if (isMissingFileError(exampleError)) {
          throw new Error(
            "Neither data/catalog.yaml nor data/catalog-example.yaml was found.",
          );
        }
        throw exampleError;
      }
    } else {
      throw error;
    }
  }

  return parseCatalogYaml(source, sourceLabel);
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

export const catalog = readCatalog();
