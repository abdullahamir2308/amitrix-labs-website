import type { MetadataRoute } from "next";
import { getJobs, getPosts, getProducts, getServices, getWork } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

type Entry = MetadataRoute.Sitemap[number];

const latest = (dates: (string | undefined)[]): Date | undefined => {
  const times = dates.filter((d): d is string => Boolean(d)).map((d) => new Date(d).getTime());
  return times.length ? new Date(Math.max(...times)) : undefined;
};

/**
 * Every public page. Hidden pages (/brand, /playground) are left out on purpose, and every content
 * slug comes from /content so new products, services, case studies and posts appear automatically.
 *
 * `lastModified` only uses real content dates (a post's `updated`/`date`, a job's `posted`): no
 * `new Date()`, which Cache Components does not allow while prerendering.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const latestPost = latest(posts.map((p) => p.updated ?? p.date));

  const entry = (path: string, priority: number, lastModified?: Date, changeFrequency?: Entry["changeFrequency"]): Entry => ({
    url: absoluteUrl(path),
    ...(lastModified ? { lastModified } : {}),
    ...(changeFrequency ? { changeFrequency } : {}),
    priority,
  });

  return [
    entry("/", 1, latestPost, "weekly"),
    entry("/products", 0.9, undefined, "monthly"),
    ...getProducts().map((p) => entry(p.url, 0.8, undefined, "monthly")),
    entry("/services", 0.9, undefined, "monthly"),
    ...getServices().map((s) => entry(s.url, 0.8, undefined, "monthly")),
    entry("/work", 0.9, undefined, "monthly"),
    ...getWork().map((w) => entry(w.url, 0.7, undefined, "yearly")),
    entry("/about", 0.6, undefined, "yearly"),
    entry("/insights", 0.8, latestPost, "weekly"),
    ...posts.map((p) => entry(p.url, 0.7, new Date(p.updated ?? p.date), "monthly")),
    entry("/careers", 0.5, latest(getJobs().map((j) => j.posted)), "monthly"),
    entry("/contact", 0.7, undefined, "yearly"),
    entry("/privacy", 0.2, undefined, "yearly"),
    entry("/terms", 0.2, undefined, "yearly"),
  ];
}
