import { validateCampaign } from "./campaign-validation";

/** Generic seasonal campaign example for the public demo. */
export const campaign = validateCampaign({
  /** Set an ISO 8601 date/time with an explicit offset to enable the countdown. */
  endsAt: null,
} as const);
