import { ProjectIcon } from "@/components/icons/project-icon";
import LanguageSwitch from "@/features/localization/language-switch/language-switch";
import ThemeToggle from "@/features/theme/toggle";
import type { Locale } from "@/lib/i18n";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import HomeIconLink from "../icon-link/icon-link";
import styles from "./header.module.css";

type HomeMessages = (typeof import("@/lib/i18n").messages)[Locale];

type HomeHeaderProps = {
  locale: Locale;
  whatsappPhoneNumber: string;
  messages: HomeMessages;
};

export default function HomeHeader({
  locale,
  whatsappPhoneNumber,
  messages,
}: HomeHeaderProps) {
  return (
    <header id="top" className={styles.header}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <span className={styles.logo}>{messages.brandName}</span>
        </div>
        <div className={styles.controls}>
          <nav aria-label={messages.navigation} className={styles.navigation}>
            <HomeIconLink href="#catalog" label={messages.items}>
              <ProjectIcon name="diamond" className={styles.icon} />
            </HomeIconLink>
            <HomeIconLink href="#about" label={messages.about}>
              <ProjectIcon name="info" className={styles.icon} />
            </HomeIconLink>
          </nav>
          <HomeIconLink href={buildWhatsAppUrl(whatsappPhoneNumber, buildGeneralContactMessage(locale))} label={messages.contact} external>
            <ProjectIcon name="whatsapp" className={`${styles.icon} ${styles.contactIcon}`} />
          </HomeIconLink>
          <LanguageSwitch locale={locale} label={messages.switchLanguage} />
          <div className={styles.themeToggle}><ThemeToggle locale={locale} /></div>
        </div>
      </div>
    </header>
  );
}
