/**
 * SEO helpers: page metadata factory, JSON-LD builders (schema-dts types) and the data-driven
 * cross-link helpers (services <-> case studies <-> posts).
 *
 * Server-only (it reads /content through @/lib/content). Do not import it from a Client Component
 * or from src/proxy.ts.
 */
import type { Metadata } from "next";
import type {
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  Organization,
  Service as ServiceSchema,
  SoftwareApplication,
  WebSite,
  WithContext,
} from "schema-dts";
import {
  getPosts,
  getServices,
  getWork,
  type Faq,
  type Post,
  type Product,
  type Service,
  type TeamMember,
  type WorkItem,
} from "@/lib/content";
import { site } from "@/lib/site";

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

export const SITE_URL = site.url;

/**
 * Default share image (src/app/opengraph-image.tsx). A page-level `openGraph` replaces the layout's,
 * so pages without their own opengraph-image file would lose the image. Explicit `images` also beat a
 * route's file convention, so routes that have their own file pass `routeImage: true` instead.
 */
const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.positioning}`,
};
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/** "/work/x" (or "work/x") -> "https://amitrixlabs.com/work/x". Absolute URLs pass through. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Trim to a meta-description length at a word boundary (default 160 characters). */
export function clip(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–—]+$/, "")}…`;
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export type PageMetadataInput = {
  /** Page title without the site suffix ("Services"). Omit for the home page (uses the default title). */
  title?: string;
  description: string;
  /** Canonical path, e.g. "/services/custom-software". Resolved against metadataBase. */
  path: string;
  /** Use the title exactly as given (no " — Amitrix Labs" suffix). */
  absoluteTitle?: boolean;
  /** Article pages: openGraph type becomes "article". */
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  keywords?: string[];
  /**
   * The route has its own opengraph-image file (the [slug] routes): leave `images` unset so the
   * file convention supplies it. Otherwise the default image is set explicitly.
   */
  routeImage?: boolean;
};

/**
 * Full metadata for a public page: title, description, canonical, Open Graph and Twitter card.
 * The image comes from the opengraph-image file convention (root default, or the route's own).
 *
 * A page-level `openGraph` replaces the layout's wholesale, so every field is repeated here.
 */
export function createMetadata({
  title,
  description,
  path,
  absoluteTitle,
  article,
  keywords,
  routeImage = false,
}: PageMetadataInput): Metadata {
  const desc = clip(description);
  const ogTitle = title
    ? absoluteTitle
      ? title
      : `${title} — ${site.name}`
    : site.seo.defaultTitle;

  return {
    ...(title ? { title: absoluteTitle ? { absolute: title } : title } : {}),
    description: desc,
    keywords,
    alternates: { canonical: path },
    ...(article ? { authors: article.authors?.map((name) => ({ name })) } : {}),
    openGraph: {
      type: article ? "article" : "website",
      url: path,
      siteName: site.name,
      locale: "en_US",
      title: ogTitle,
      description: desc,
      ...(routeImage ? {} : { images: [DEFAULT_OG_IMAGE] }),
      ...(article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime ?? article.publishedTime,
            authors: article.authors,
            tags: article.tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc,
      ...(routeImage ? {} : { images: [DEFAULT_OG_IMAGE.url] }),
    },
  };
}

/** Metadata for the hidden review pages (/brand, /playground): never indexed, not in the sitemap. */
export function hiddenPageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: false, nocache: true },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

export type Crumb = { name: string; href: string };

/** Home > Section > Page trail. `last` is the current page (its href is its own URL). */
export function crumbs(section: "Products" | "Services" | "Work" | "Insights", sectionHref: string, last: Crumb): Crumb[] {
  return [
    { name: "Home", href: "/" },
    { name: section, href: sectionHref },
    last,
  ];
}

export function organizationJsonLd(): WithContext<Organization> {
  const sameAs = site.social.filter((s) => !("placeholder" in s && s.placeholder)).map((s) => s.href);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.footer.legalName,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/apple-icon.png"),
      width: "180",
      height: "180",
    },
    description: site.description,
    slogan: site.positioning,
    email: site.contact.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.contact.email,
      url: absoluteUrl("/contact"),
      availableLanguage: "English",
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: site.name,
    description: site.seo.description,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbJsonLd(items: Crumb[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqJsonLd(faqs: readonly Faq[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceJsonLd(service: Service): WithContext<ServiceSchema> {
  const url = absoluteUrl(service.url);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url,
    ...(service.image ? { image: absoluteUrl(service.image.src) } : {}),
    areaServed: "Worldwide",
    provider: { "@type": "Organization", "@id": ORG_ID, name: site.name, url: SITE_URL },
    ...(service.deliverables.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${service.title} deliverables`,
            itemListElement: service.deliverables.map((d) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: d },
            })),
          },
        }
      : {}),
  };
}

export function productJsonLd(product: Product): WithContext<SoftwareApplication> {
  const url = absoluteUrl(product.url);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    name: product.name,
    description: product.tagline,
    url,
    image: absoluteUrl(product.heroImage.src),
    applicationCategory: "BusinessApplication",
    applicationSubCategory: product.category,
    operatingSystem: "Web",
    ...(product.features.length ? { featureList: product.features.map((f) => f.title) } : {}),
    author: { "@type": "Organization", "@id": ORG_ID, name: site.name, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": ORG_ID, name: site.name, url: SITE_URL },
  };
}

export function articleJsonLd(post: Post, author?: TeamMember): WithContext<BlogPosting> {
  const url = absoluteUrl(post.url);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: absoluteUrl(post.cover.src),
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "en",
    wordCount: post.wordCount,
    ...(post.tags.length ? { keywords: post.tags.join(", "), articleSection: post.tags[0] } : {}),
    ...(author
      ? { author: { "@type": "Person", name: author.name, jobTitle: author.role } }
      : { author: { "@type": "Organization", "@id": ORG_ID, name: site.name } }),
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: site.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/apple-icon.png") },
    },
  };
}

// ---------------------------------------------------------------------------
// Cross-links: services <-> case studies <-> posts (all derived from content)
// ---------------------------------------------------------------------------

const norm = (text: string) => ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;

/** Does a post tag name this service? "AI agents" matches "AI Agents & Automation"; "Product design" matches "Product Design (UI/UX)". */
function tagMatchesService(tag: string, service: Service): boolean {
  const t = norm(tag);
  if (t.trim().length < 4) return false;
  return [service.slug, service.title, service.shortTitle].some((name) => norm(name).includes(t));
}

/** Does the post body link to this path (compiled MDX keeps the href text, e.g. "/work/logistics-dispatch-agent")? */
const linksTo = (post: Post, path: string) => post.body.includes(`"${path}"`) || post.body.includes(`'${path}'`);

type Scored<T> = { item: T; score: number };
const top = <T>(scored: Scored<T>[], limit: number): T[] =>
  scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);

/** Posts that mention a service (tag name match, or a link to the service or to one of its case studies). */
export function getPostsForService(service: Service, limit = 3): Post[] {
  return top(
    getPosts().map((post) => {
      let score = post.tags.some((t) => tagMatchesService(t, service)) ? 2 : 0;
      if (linksTo(post, service.url)) score += 3;
      if (service.relatedWork.some((w) => linksTo(post, `/work/${w}`))) score += 2;
      return { item: post, score };
    }),
    limit,
  );
}

/** Posts about the services a case study used, or linking to the case study itself. */
export function getPostsForWork(item: WorkItem, limit = 2): Post[] {
  const services = getServices().filter((s) => item.services.includes(s.slug));
  return top(
    getPosts().map((post) => {
      let score = linksTo(post, item.url) ? 4 : 0;
      if (services.some((s) => post.tags.some((t) => tagMatchesService(t, s)))) score += 1;
      return { item: post, score };
    }),
    limit,
  );
}

/** Services a post is about: matching tags, or links to the service / its case studies. */
export function getServicesForPost(post: Post, limit = 3): Service[] {
  const work = getWork();
  return top(
    getServices().map((service) => {
      let score = post.tags.some((t) => tagMatchesService(t, service)) ? 2 : 0;
      if (linksTo(post, service.url)) score += 3;
      for (const w of work) {
        if (w.services.includes(service.slug) && linksTo(post, w.url)) score += 1;
      }
      return { item: service, score };
    }),
    limit,
  );
}

/** Case studies a post links to or whose services it covers (direct links first). */
export function getWorkForPost(post: Post, limit = 2): WorkItem[] {
  const services = getServicesForPost(post, 6).map((s) => s.slug);
  return top(
    getWork().map((item) => {
      let score = linksTo(post, item.url) ? 4 : 0;
      if (item.services.some((s) => services.includes(s))) score += 1;
      return { item, score };
    }),
    limit,
  );
}
