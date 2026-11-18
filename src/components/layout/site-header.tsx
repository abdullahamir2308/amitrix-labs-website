import { getFeaturedWork, getProducts, getServices, type ContentImage } from "@/lib/content";
import { site } from "@/lib/site";
import { Header } from "./header";
import type { HeaderData, MegaMenu, MenuImage } from "./nav-types";

const toImage = (img: ContentImage | undefined): MenuImage | undefined =>
  img ? { src: img.src, width: img.width, height: img.height, blurDataURL: img.blurDataURL } : undefined;

const STATUS_LABEL = { live: "Live", beta: "Beta", "coming-soon": "Coming soon" } as const;

/** Server part of the header: reads /content once and hands plain data to the client header. */
export function SiteHeader() {
  const products = getProducts();
  const services = getServices();
  const featuredProduct = products.find((p) => p.status === "live") ?? products[0];
  const featuredWork = getFeaturedWork(1)[0];

  const menus: Record<MegaMenu["id"], MegaMenu> = {
    products: {
      id: "products",
      label: "Products",
      href: "/products",
      allLabel: site.ctaLabels.allProducts,
      items: products.map((p) => ({
        title: p.name,
        description: p.tagline,
        href: p.url,
        image: toImage(p.logo),
        status: p.status,
      })),
      featured: featuredProduct
        ? {
            label: `Featured · ${STATUS_LABEL[featuredProduct.status]}`,
            title: featuredProduct.name,
            description: featuredProduct.tagline,
            href: featuredProduct.url,
            cta: site.ctaLabels.explore,
            image: toImage(featuredProduct.heroImage),
          }
        : undefined,
    },
    services: {
      id: "services",
      label: "Services",
      href: "/services",
      allLabel: site.ctaLabels.allServices,
      items: services.map((s) => ({
        title: s.shortTitle,
        description: s.summary,
        href: s.url,
        icon: s.icon,
      })),
      featured: featuredWork
        ? {
            label: "Case study",
            title: featuredWork.title,
            description: featuredWork.client,
            href: featuredWork.url,
            cta: site.ctaLabels.viewCaseStudy,
            image: toImage(featuredWork.coverImage),
          }
        : undefined,
    },
  };

  const data: HeaderData = {
    links: site.nav.main.map((link) => {
      const key = link.href.replace(/^\//, "");
      const menu = key === "products" || key === "services" ? menus[key] : undefined;
      return { label: link.label, href: link.href, menu };
    }),
    cta: { label: site.nav.cta.label, href: site.nav.cta.href },
  };

  return <Header data={data} />;
}
