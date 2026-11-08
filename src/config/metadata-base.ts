const developmentSiteUrl = "http://localhost:3000";

const siteUrl = process.env.SITE_URL ?? (
  process.env.NODE_ENV === "development" ? developmentSiteUrl : undefined
);

if (!siteUrl) {
  throw new Error("SITE_URL is required to build site metadata.");
}

const metadataBase = new URL(siteUrl);

if (metadataBase.protocol !== "http:" && metadataBase.protocol !== "https:") {
  throw new Error("SITE_URL must use the http or https protocol.");
}

export { metadataBase };
