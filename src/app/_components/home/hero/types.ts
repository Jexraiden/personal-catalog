import type { Locale } from "@/lib/i18n";

export type HomeMessages = (typeof import("@/lib/i18n").messages)[Locale];
export type HomeHeroProps = { messages: HomeMessages };

export type CountdownCopy = {
  title: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  ended: string;
};
