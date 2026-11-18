import { renderOgImage } from "@/components/seo/og-image";
import { site } from "@/lib/site";

// Default share image for every page without its own (home, index pages, About, Contact, ...).
export const alt = `${site.name} — ${site.positioning}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Software and AI studio",
    title: site.positioning,
    description: "Our own products, plus custom software and AI for teams in every industry.",
  });
}
