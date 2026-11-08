import { activeHero } from "@/config/hero";
import CampaignHero from "./campaign-hero";
import ClassicHero from "./classic-hero";
import type { HomeHeroProps } from "./types";

export default function HomeHero({ messages }: HomeHeroProps) {
  if (activeHero === "campaign") {
    return <CampaignHero messages={messages} />;
  }

  return <ClassicHero messages={messages} />;
}
