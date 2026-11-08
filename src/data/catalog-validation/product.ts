import type {
  ComboItem,
  Product,
  ProductAvailability,
  ProductCategory,
  ProductImage,
  ProductVideo,
  ShippingInfo,
} from "../../domain/product";
import {
  allowedAvailability,
  checkKeys,
  isSecureUrl,
  readNumber,
  readRecord,
  readSpecifications,
  readString,
  type ValidationIssue,
} from "./shared";

function validateImage(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): ProductImage | undefined {
  const media = readRecord(value, path, issues);
  if (!media) return undefined;

  const src = readString(media.src, `${path}.src`, issues);
  checkKeys(media, ["src", "alt"], path, issues);
  const alt = readString(media.alt, `${path}.alt`, issues);
  if (src === undefined || alt === undefined) return undefined;
  return { src, alt };
}

function validateVideo(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): ProductVideo | undefined {
  const media = readRecord(value, path, issues);
  if (!media) return undefined;

  checkKeys(media, ["source", "src", "poster"], path, issues);
  const src = readString(media.src, `${path}.src`, issues);
  const poster = readString(media.poster, `${path}.poster`, issues, true);
  const source = media.source;
  if (source !== "youtube" && source !== "local") {
    issues.push({
      path: `${path}.source`,
      message: "must be youtube or local",
    });
    return undefined;
  }

  if (source === "youtube" && src !== undefined) {
    if (!isSecureUrl(src, ["youtube.com", "www.youtube.com", "youtu.be"])) {
      issues.push({
        path: `${path}.src`,
        message: "must be a valid HTTPS YouTube URL",
      });
    }
  }

  if (source === "local" && src !== undefined && (!src.startsWith("/") || src.startsWith("//"))) {
    issues.push({
      path: `${path}.src`,
      message: "must be a local path starting with a single slash",
    });
  }

  if (src === undefined) return undefined;

  if (source === "local") {
    const localSrc = src as `/${string}`;
    return poster === undefined
      ? { source, src: localSrc }
      : { source, src: localSrc, poster };
  }

  return poster === undefined
    ? { source, src }
    : { source, src, poster };
}

function validateComboItems(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): ComboItem[] | undefined {
  if (!Array.isArray(value)) {
    issues.push({ path, message: "must be a list" });
    return undefined;
  }

  return value.flatMap((entry, index) => {
    const entryPath = `${path}[${index}]`;
    const item = readRecord(entry, entryPath, issues);
    if (!item) return [];

    checkKeys(item, ["name", "description", "specifications"], entryPath, issues);
    const name = readString(item.name, `${entryPath}.name`, issues);
    const description = readString(
      item.description,
      `${entryPath}.description`,
      issues,
      true,
    );
    const specifications = readSpecifications(
      item.specifications,
      `${entryPath}.specifications`,
      issues,
    );
    if (name === undefined) return [];

    return [{
      name,
      ...(description === undefined ? {} : { description }),
      ...(specifications === undefined ? {} : { specifications }),
    }];
  });
}

function validateShipping(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): ShippingInfo | undefined {
  const shipping = readRecord(value, path, issues);
  if (!shipping) return undefined;

  const keys = ["weightGrams", "widthCm", "heightCm", "lengthCm"];
  checkKeys(shipping, keys, path, issues);
  const values = keys.map((key) =>
    readNumber(shipping[key], `${path}.${key}`, issues, false, true),
  );
  if (values.some((number) => number === undefined)) return undefined;

  return {
    weightGrams: values[0] as number,
    widthCm: values[1] as number,
    heightCm: values[2] as number,
    lengthCm: values[3] as number,
  };
}

export function validateProduct(
  value: unknown,
  index: number,
  categories: ProductCategory[],
  issues: ValidationIssue[],
): Product | undefined {
  const path = `products[${index}]`;
  const product = readRecord(value, path, issues);
  if (!product) return undefined;

  checkKeys(
    product,
    [
      "id",
      "name",
      "category",
      "description",
      "specifications",
      "priceInCents",
      "discountedPriceInCents",
      "condition",
      "conditionDetails",
      "availability",
      "coverImage",
      "images",
      "videos",
      "comboItems",
      "shipping",
    ],
    path,
    issues,
  );

  const id = readString(product.id, `${path}.id`, issues);
  const name = readString(product.name, `${path}.name`, issues);
  const category = readString(product.category, `${path}.category`, issues);
  const normalizedCategory = category?.trim().toLowerCase();
  const matchingCategory = categories.find(
    (category) => category.id === normalizedCategory,
  );
  const description = readString(product.description, `${path}.description`, issues);
  const specifications = readSpecifications(
    product.specifications,
    `${path}.specifications`,
    issues,
  );
  const priceInCents = readNumber(
    product.priceInCents,
    `${path}.priceInCents`,
    issues,
    true,
    false,
  );
  const discountedPriceInCents =
    product.discountedPriceInCents === undefined ||
    product.discountedPriceInCents === null ||
    product.discountedPriceInCents === ""
      ? undefined
      : readNumber(
          product.discountedPriceInCents,
          `${path}.discountedPriceInCents`,
          issues,
          true,
          false,
        );
  const condition = readString(product.condition, `${path}.condition`, issues);
  const conditionDetails = readString(
    product.conditionDetails,
    `${path}.conditionDetails`,
    issues,
    true,
  );

  const availability = product.availability;
  if (!allowedAvailability.includes(availability as ProductAvailability)) {
    issues.push({
      path: `${path}.availability`,
      message: "must be available, reserved, or sold",
    });
  }

  const coverImage = validateImage(product.coverImage, `${path}.coverImage`, issues);
  let images: ProductImage[] = [];
  if (product.images !== undefined) {
    if (!Array.isArray(product.images)) {
      issues.push({ path: `${path}.images`, message: "must be a list" });
    } else {
      images = product.images.flatMap((entry, imageIndex) => {
        const validImage = validateImage(entry, `${path}.images[${imageIndex}]`, issues);
        return validImage ? [validImage] : [];
      });
    }
  }

  let videos: ProductVideo[] = [];
  if (product.videos !== undefined) {
    if (!Array.isArray(product.videos)) {
      issues.push({ path: `${path}.videos`, message: "must be a list" });
    } else {
      videos = product.videos.flatMap((entry, videoIndex) => {
        const validVideo = validateVideo(entry, `${path}.videos[${videoIndex}]`, issues);
        return validVideo ? [validVideo] : [];
      });
    }
  }

  const comboItems =
    product.comboItems === undefined
      ? undefined
      : validateComboItems(product.comboItems, `${path}.comboItems`, issues);
  const shipping =
    product.shipping === undefined
      ? undefined
      : validateShipping(product.shipping, `${path}.shipping`, issues);

  const expectedImageCount = Array.isArray(product.images) ? product.images.length : 0;
  const expectedVideoCount = Array.isArray(product.videos) ? product.videos.length : 0;

  if (
    id === undefined ||
    name === undefined ||
    normalizedCategory === undefined ||
    matchingCategory === undefined ||
    description === undefined ||
    priceInCents === undefined ||
    condition === undefined ||
    !allowedAvailability.includes(availability as ProductAvailability) ||
    coverImage === undefined ||
    (Array.isArray(product.images) && images.length !== expectedImageCount) ||
    (Array.isArray(product.videos) && videos.length !== expectedVideoCount)
  ) {
    return undefined;
  }

  const validProduct: Product = {
    id,
    name,
    category: matchingCategory,
    description,
    priceInCents,
    condition,
    availability: availability as ProductAvailability,
    coverImage,
  };

  if (images.length > 0) validProduct.images = images;
  if (videos.length > 0) validProduct.videos = videos;

  if (conditionDetails !== undefined) validProduct.conditionDetails = conditionDetails;
  if (specifications !== undefined) validProduct.specifications = specifications;
  if (discountedPriceInCents !== undefined && discountedPriceInCents !== 0) {
    if (discountedPriceInCents >= priceInCents) {
      issues.push({
        path: `${path}.discountedPriceInCents`,
        message: "must be lower than priceInCents",
      });
    } else {
      validProduct.discountedPriceInCents = discountedPriceInCents;
    }
  }
  if (comboItems !== undefined) validProduct.comboItems = comboItems;
  if (shipping !== undefined) validProduct.shipping = shipping;

  return validProduct;
}

