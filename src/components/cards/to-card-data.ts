// Server-only helpers: map content entries to the small, serializable shapes the cards need
// (so client components never receive compiled MDX bodies).
import { getServicesForWork, type WorkItem } from "@/lib/content";
import type { WorkCardData } from "./work-card";

export function toWorkCardData(item: WorkItem): WorkCardData {
  return {
    slug: item.slug,
    url: item.url,
    title: item.title,
    client: item.client,
    industry: item.industry,
    year: item.year,
    summary: item.summary,
    coverImage: item.coverImage,
    services: getServicesForWork(item).map((s) => ({
      slug: s.slug,
      title: s.shortTitle,
    })),
  };
}
