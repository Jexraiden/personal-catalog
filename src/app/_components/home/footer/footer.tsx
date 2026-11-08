import Image from "next/image";
import { ProjectIcon } from "@/components/icons/project-icon";
import { brand } from "@/config/brand";
import { publicPath } from "@/lib/public-path";
import type { site } from "@/config/site";
import type { Locale } from "@/lib/i18n";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import HomeIconLink from "../icon-link/icon-link";
import styles from "./footer.module.css";

type HomeMessages = (typeof import("@/lib/i18n").messages)[Locale];

type HomeFooterProps = {
  locale: Locale;
  site: typeof site;
  messages: HomeMessages;
};

export default function HomeFooter({ locale, site, messages }: HomeFooterProps) {
  const { whatsappPhoneNumber, emailAddress } = site.contact;
  const { instagramProfileUrl } = site.social;
  const whatsappUrl = buildWhatsAppUrl(whatsappPhoneNumber, buildGeneralContactMessage(locale));

  return (
    <footer className={styles.footer}>
      <section id="about" aria-labelledby="about-title" className={styles.about}>
        <div className={styles.aboutContent}>
          <Image src={publicPath(brand.mark)} alt="" aria-hidden="true" width={160} height={160} className={styles.brandMark} />
          <div className={styles.description}>
            <h2 id="about-title" className={styles.title}>{messages.brandName}</h2>
            <p>{messages.aboutDescription}</p>
          </div>
          <nav aria-label={messages.socialContact} className={styles.contact}>
            <h3 className={styles.contactTitle}>{messages.sayHello}</h3>
            <div className={styles.socialLinks}>
              <a href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" aria-label={messages.instagram} className={styles.socialLink}>
                <ProjectIcon name="instagram" className={styles.socialIcon} />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={messages.whatsapp} className={styles.socialLink}>
                <ProjectIcon name="whatsapp" className={styles.socialIcon} />
              </a>
              <HomeIconLink href={`mailto:${emailAddress}`} label={`${messages.sendEmailTo} ${emailAddress}`} tooltipText={emailAddress} tooltipTheme="current" accentHover size="large" social>
                <ProjectIcon name="email" className={styles.socialIcon} />
              </HomeIconLink>
            </div>
          </nav>
        </div>
      </section>
      <div className={styles.bottom}>
        <div className={styles.legal}>
          <p>© 2026 Personal Catalog. {messages.reservedContent}</p>
          <p>{messages.demoAttribution}</p>
        </div>
        <nav aria-label={messages.footerNavigation} className={styles.navigation}>
          <a href="#catalog" className={styles.catalogLink}>
            <ProjectIcon name="diamond" className={styles.catalogIcon} />
            <span>{messages.items}</span>
          </a>
          <a href="#top" aria-label={messages.backToTop} className={styles.backToTop}>
            <span aria-hidden="true">↑</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
