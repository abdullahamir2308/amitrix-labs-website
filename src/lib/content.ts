/**
 * Typed access to everything in /content (built by Velite into /.velite).
 *
 * Use from Server Components / generateStaticParams / generateMetadata only — importing this
 * into a Client Component would ship every collection (including compiled MDX) to the browser.
 * Pass the specific fields a client component needs as props instead.
 *
 * Images are `ContentImage` objects ({ src, width, height, blurDataURL, ... }) that can be
 * spread into next/image:  <Image {...work.coverImage} alt="" placeholder="blur" />
 * MDX bodies are compiled function-body strings: render with <MDXContent code={item.body} />
 * from "@/lib/mdx".
 */
import {
  clients,
  jobs,
  posts,
  products,
  services,
  team,
  testimonials,
  work,
  type Client,
  type Job,
  type Post,
  type Product,
  type Service,
  type TeamMember,
  type Testimonial,
  type WorkItem,
} from "../../.velite"; // same as the "#site/content" tsconfig alias; relative so any bundler resolves it

export type { Client, Job, Post, Product, Service, TeamMember, Testimonial, WorkItem };

/** Image metadata produced by Velite's s.image(). */
export type ContentImage = Product["logo"];
export type ProductStatus = Product["status"];
export type TocEntry = Post["toc"][number];
export type WorkResult = WorkItem["results"][number];
export type Faq = Service["faqs"][number];

/** Drafts (`draft: true` in frontmatter) are visible in `next dev` only. */
const showDrafts = process.env.NODE_ENV !== "production";
/** Always returns a new array, so callers can sort without mutating the imported data. */
const published = <T extends { draft: boolean }>(items: T[]) =>
  items.filter((item) => showDrafts || !item.draft);

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;
const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export function getProducts(): Product[] {
  return published(products).sort(byOrder);
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export function getServices(): Service[] {
  return published(services).sort(byOrder);
}

export function getService(slug: string): Service | undefined {
  return getServices().find((s) => s.slug === slug);
}

/** Case studies for a service: its `relatedWork` list first, then any work tagged with it. */
export function getServiceWork(slug: string, limit = 3): WorkItem[] {
  const service = getService(slug);
  if (!service) return [];
  const all = getWork();
  const listed = service.relatedWork
    .map((s) => all.find((w) => w.slug === s))
    .filter((w): w is WorkItem => Boolean(w));
  const tagged = all.filter((w) => w.services.includes(slug) && !listed.includes(w));
  return [...listed, ...tagged].slice(0, limit);
}

// ---------------------------------------------------------------------------
// Work (case studies)
// ---------------------------------------------------------------------------

export type WorkFilter = { industry?: string; service?: string };

/** All case studies (order asc, then newest year first), optionally filtered. */
export function getWork({ industry, service }: WorkFilter = {}): WorkItem[] {
  return published(work)
    .filter((w) => !industry || w.industry === industry)
    .filter((w) => !service || w.services.includes(service))
    .sort((a, b) => a.order - b.order || b.year - a.year);
}

export function getWorkItem(slug: string): WorkItem | undefined {
  return getWork().find((w) => w.slug === slug);
}

export function getFeaturedWork(limit?: number): WorkItem[] {
  const featured = getWork().filter((w) => w.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/** The case study after `slug` in the default order (wraps around to the first). */
export function getNextWork(slug: string): WorkItem | undefined {
  const all = getWork();
  if (all.length < 2) return undefined;
  const i = all.findIndex((w) => w.slug === slug);
  return all[(i + 1) % all.length];
}

/** Distinct industries used by case studies (for the /work filter). */
export function getWorkIndustries(): string[] {
  return [...new Set(getWork().map((w) => w.industry))].sort();
}

/** Services referenced by at least one case study (for the /work filter). */
export function getWorkServices(): Service[] {
  const used = new Set(getWork().flatMap((w) => w.services));
  return getServices().filter((s) => used.has(s.slug));
}

/** Resolve a case study's service slugs to Service entries. */
export function getServicesForWork(item: WorkItem): Service[] {
  return item.services.map((slug) => getService(slug)).filter((s): s is Service => Boolean(s));
}

// ---------------------------------------------------------------------------
// Posts (Insights)
// ---------------------------------------------------------------------------

/** Posts, newest first, optionally filtered by tag. */
export function getPosts({ tag }: { tag?: string } = {}): Post[] {
  return published(posts)
    .filter((p) => !tag || p.tags.includes(tag))
    .sort(byDateDesc);
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/** The featured post (newest `featured: true`), falling back to the newest post. */
export function getFeaturedPost(): Post | undefined {
  const all = getPosts();
  return all.find((p) => p.featured) ?? all[0];
}

/** Posts sharing the most tags with `slug`, then newest first. */
export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const post = getPost(slug);
  if (!post) return [];
  return getPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({ p, score: p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score || byDateDesc(a.p, b.p))
    .slice(0, limit)
    .map(({ p }) => p);
}

/** Distinct tags across all posts, with counts, most used first. */
export function getPostTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getPosts()) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** The team member who wrote a post. */
export function getPostAuthor(post: Post): TeamMember | undefined {
  return getTeamMember(post.author);
}

// ---------------------------------------------------------------------------
// Team, testimonials, clients, jobs
// ---------------------------------------------------------------------------

export function getTeam(): TeamMember[] {
  return [...team].sort(byOrder);
}

export function getTeamMember(id: string): TeamMember | undefined {
  return team.find((m) => m.id === id);
}

export function getTestimonials(): Testimonial[] {
  return [...testimonials].sort(byOrder);
}

export function getTestimonial(id: string): Testimonial | undefined {
  return testimonials.find((t) => t.id === id);
}

export function getClients(): Client[] {
  return [...clients].sort(byOrder);
}

/** Open roles only (an empty array means "Always looking for great people"). */
export function getJobs(): Job[] {
  return jobs.filter((j) => j.open).sort(byOrder);
}

export function getJob(slug: string): Job | undefined {
  return getJobs().find((j) => j.slug === slug);
}
