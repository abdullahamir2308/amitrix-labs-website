/**
 * Serializable menu data. Built from /content by the server <SiteHeader> and passed to the
 * client header, so the content collections never ship to the browser.
 */

export type MenuImage = { src: string; width: number; height: number; blurDataURL?: string };

export type MenuItem = {
  title: string;
  description: string;
  href: string;
  /** Product logo image (products menu). */
  image?: MenuImage;
  /** lucide icon name (services menu), resolved by <ServiceIcon>. */
  icon?: string;
  /** Product status (products menu). */
  status?: "live" | "beta" | "coming-soon";
};

export type MenuFeature = {
  label: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  image?: MenuImage;
};

export type MegaMenu = {
  id: "products" | "services";
  label: string;
  href: string;
  /** "All products" style link at the bottom of the list. */
  allLabel: string;
  items: MenuItem[];
  featured?: MenuFeature;
};

export type HeaderNavLink = { label: string; href: string; menu?: MegaMenu };

export type HeaderData = {
  links: HeaderNavLink[];
  cta: { label: string; href: string };
};
