/**
 * Serializable post data for Client Components (the full Post carries compiled MDX — never
 * ship that to the browser). Build summaries on the server with toPostSummary().
 */
import type { ContentImage, Post, TeamMember } from "@/lib/content";

export type PostSummary = {
  slug: string;
  url: string;
  title: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  tags: string[];
  readingTime: number;
  cover: ContentImage;
  author?: { name: string; role: string; avatar: ContentImage };
};

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** "2026-10-14" → "Oct 14, 2026" (UTC, so server and client always agree). */
export function formatPostDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

export function toPostSummary(post: Post, author?: TeamMember): PostSummary {
  return {
    slug: post.slug,
    url: post.url,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    dateLabel: formatPostDate(post.date),
    tags: post.tags,
    readingTime: post.readingTime,
    cover: post.cover,
    author: author ? { name: author.name, role: author.role, avatar: author.avatar } : undefined,
  };
}

/** URL-safe tag value: "AI agents" → "ai-agents". */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
