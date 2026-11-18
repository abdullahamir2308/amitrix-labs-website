import { getFeaturedWork, getWork, type WorkItem } from "@/lib/content";
import { site } from "@/lib/site";
import { parseEyebrow } from "./showcase/section-utils";
import { WorkScroller, type WorkCardData } from "./work-scroll/work-scroller";

const CARD_COUNT = 4;

/**
 * 05 — Selected work (light). Four case studies: featured first, topped up with
 * the next case studies in default order. Desktop + motion: pinned horizontal
 * scroll. Mobile / reduced motion: a swipeable scroll-snap carousel.
 */
export function FeaturedWork() {
  const featured = getFeaturedWork(CARD_COUNT);
  const rest = getWork().filter((w) => !featured.includes(w));
  const items: WorkItem[] = [...featured, ...rest].slice(0, CARD_COUNT);
  if (items.length === 0) return null;

  const copy = site.sections.work;
  const eyebrow = parseEyebrow(copy.eyebrow);
  const cards: WorkCardData[] = items.map((w) => ({
    slug: w.slug,
    href: `/work/${w.slug}`,
    title: w.title,
    client: w.client,
    industry: w.industry,
    year: w.year,
    image: w.coverImage,
    result: w.results[0] ?? null,
  }));

  return (
    <WorkScroller
      id="work"
      eyebrow={eyebrow}
      heading={copy.heading}
      cards={cards}
      allLabel={site.ctaLabels.allWork}
      viewLabel={site.ctaLabels.viewCaseStudy}
    />
  );
}
