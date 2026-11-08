import Image from "next/image";
import { brand } from "@/config/brand";
import { publicPath } from "@/lib/public-path";
import styles from "./hero.module.css";
import type { HomeHeroProps } from "./types";

export default function ClassicHero({ messages }: HomeHeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className={styles.hero}
    >
      <h1
        id="hero-title"
        className={styles.classicTitle}
      >
        {messages.heroTitle}
      </h1>
      <p className={styles.description}>
        {messages.heroDescription}
      </p>
      <Image
        className={styles.heroIllustration}
        src={publicPath(brand.heroIllustration)}
        alt={messages.heroIllustrationAlt}
        width={979}
        height={723}
      />
      <a
        href="#catalog"
        className={styles.cta}
      >
        {messages.explore}
      </a>
    </section>
  );
}
