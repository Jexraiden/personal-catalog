export type SiteConfiguration = {
  contact: {
    whatsappPhoneNumber: string;
    emailAddress: string;
  };
  social: {
    instagramProfileUrl: string;
  };
};

function isSecureUrl(value: string, hosts?: string[]): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (hosts === undefined || hosts.includes(url.hostname.toLowerCase()))
    );
  } catch {
    return false;
  }
}

export function validateSite<T extends SiteConfiguration>(site: T): T {
  if (!/^\d{10,15}$/.test(site.contact.whatsappPhoneNumber)) {
    throw new Error(
      "site.contact.whatsappPhoneNumber must contain 10 to 15 international digits only.",
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.contact.emailAddress)) {
    throw new Error("site.contact.emailAddress must be a valid email address.");
  }

  const socialUrl = new URL(site.social.instagramProfileUrl);
  const isExampleDestination = socialUrl.protocol === "https:" && socialUrl.hostname === "example.invalid";
  const isInstagramProfile = isSecureUrl(site.social.instagramProfileUrl, ["instagram.com", "www.instagram.com"])
    && socialUrl.pathname.replaceAll("/", "") !== "";

  if (!isExampleDestination && !isInstagramProfile) {
    throw new Error(
      "site.social.instagramProfileUrl must be an HTTPS Instagram profile URL or an example.invalid destination.",
    );
  }

  return site;
}
