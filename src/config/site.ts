import { validateSite } from "./site-validation";

/**
 * Public site configuration for the Personal Catalog demo.
 * Replace every example destination with your own before publishing a copy.
 */
export const site = validateSite({
  contact: {
    // North American fictional 555-0100 number; this does not contact a person.
    whatsappPhoneNumber: "12025550100",
    emailAddress: "demo@example.invalid",
  },
  social: {
    instagramProfileUrl: "https://example.invalid/personal-catalog",
  },
} as const);
