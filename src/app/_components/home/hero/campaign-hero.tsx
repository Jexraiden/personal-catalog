import Image from "next/image";
import { brand } from "@/config/brand";
import { publicPath } from "@/lib/public-path";
import { campaign } from "@/config/campaign";
import CampaignCountdown from "./campaign-countdown";
import styles from "./hero.module.css";
import type { HomeHeroProps } from "./types";

export default function CampaignHero({ messages }: HomeHeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className={styles.hero}
      data-has-countdown={campaign.endsAt !== null}
    >
      <h1 id="hero-title" className={styles.campaignTitle}>
        {messages.campaignTitle}
      </h1>
      <p className={styles.description}>{messages.campaignDescription}</p>
      <Image
        src={publicPath(brand.heroIllustration)}
        alt={messages.heroIllustrationAlt}
        width={979}
        height={723}
        className={styles.campaignIllustration}
      />
      {campaign.endsAt !== null ? (
        <CampaignCountdown
          endsAt={campaign.endsAt}
          copy={{
            title: messages.campaignCountdownTitle,
            days: messages.campaignDays,
            hours: messages.campaignHours,
            minutes: messages.campaignMinutes,
            seconds: messages.campaignSeconds,
            ended: messages.campaignEnded,
          }}
        />
      ) : null}
      <a href="#catalog" className={styles.campaignCta}>
        {messages.campaignCta}
      </a>
    </section>
  );
}
