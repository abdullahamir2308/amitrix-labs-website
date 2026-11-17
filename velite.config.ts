/**
 * Velite content config — turns /content (MDX + JSON) into typed data in /.velite.
 *
 * Import the output with `import { products, posts, ... } from "#site/content"`, but
 * prefer the helpers in src/lib/content.ts (sorting, lookups, relations).
 *
 * Images: every image field uses `s.image({ absoluteRoot: "public" })`. Write an absolute
 * path to a file inside /public (e.g. "/placeholders/work/cover-01.svg"); Velite reads it
 * and outputs `{ src, width, height, blurDataURL, blurWidth, blurHeight }`, which can be
 * spread straight into next/image. (A relative path like "./img.webp" also works: the file
 * is copied to public/content/ with a hashed name.)
 */
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, s } from "velite";

// ---------------------------------------------------------------------------
// Shared field helpers
// ---------------------------------------------------------------------------

const image = () => s.image({ absoluteRoot: "public" });

/** An image plus its alt text (screenshots, galleries). */
const figure = () => s.object({ image: image(), alt: s.string().max(200) });

const faq = () => s.object({ q: s.string(), a: s.string() });

/** kebab-case slug, unique within its collection. */
const slug = (group: string) => s.slug(group);

/** Lowercase kebab-case reference to an item in another collection. */
const ref = () => s.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use the lowercase-kebab-case slug/id");

/** "40%" → { value: 40, prefix: "", suffix: "%" } so pages can animate counters. */
function parseMetric(metric: string) {
  const match = metric.match(/^([^\d-]*)(-?\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return { value: null, prefix: "", suffix: "", decimals: 0 };
  const num = match[2].replace(",", ".");
  return {
    value: Number(num),
    prefix: match[1].trim(),
    suffix: match[3].trim(),
    decimals: num.includes(".") ? num.split(".")[1].length : 0,
  };
}

// ---------------------------------------------------------------------------
// MDX collections
// ---------------------------------------------------------------------------

const products = defineCollection({
  name: "Product",
  pattern: "products/**/*.mdx",
  schema: s
    .object({
      name: s.string().max(80),
      slug: slug("products"),
      tagline: s.string().max(160),
      status: s.enum(["live", "beta", "coming-soon"]),
      category: s.string(),
      logo: image(),
      heroImage: image(),
      screenshots: s.array(figure()).default([]),
      features: s
        .array(s.object({ title: s.string(), description: s.string(), icon: s.string() }))
        .default([]),
      pricingNote: s.string().optional(),
      ctaUrl: s.string(),
      ctaLabel: s.string().optional(),
      faqs: s.array(faq()).default([]),
      order: s.number().default(100),
      draft: s.boolean().default(false),
      body: s.mdx(),
    })
    .transform((data) => ({ ...data, url: `/products/${data.slug}` })),
});

const services = defineCollection({
  name: "Service",
  pattern: "services/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(80),
      /** Short label for nav/footer/bento (defaults to title). */
      shortTitle: s.string().optional(),
      slug: slug("services"),
      summary: s.string().max(300),
      icon: s.string(),
      image: image().optional(),
      problems: s.array(s.string()).default([]),
      deliverables: s.array(s.string()).default([]),
      process: s.array(s.object({ title: s.string(), description: s.string() })).default([]),
      techStack: s.array(s.string()).default([]),
      faqs: s.array(faq()).default([]),
      relatedWork: s.array(ref()).default([]),
      order: s.number().default(100),
      draft: s.boolean().default(false),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      shortTitle: data.shortTitle ?? data.title,
      url: `/services/${data.slug}`,
    })),
});

const work = defineCollection({
  name: "WorkItem",
  pattern: "work/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: slug("work"),
      client: s.string(),
      industry: s.string(),
      services: s.array(ref()).default([]),
      year: s.number().int().min(2000).max(2100),
      coverImage: image(),
      summary: s.string().max(300),
      challenge: s.string(),
      approach: s.string(),
      results: s
        .array(s.object({ metric: s.string(), label: s.string() }))
        .default([])
        .transform((results) => results.map((r) => ({ ...r, ...parseMetric(r.metric) }))),
      stack: s.array(s.string()).default([]),
      gallery: s.array(figure()).default([]),
      testimonialId: ref().optional(),
      featured: s.boolean().default(false),
      order: s.number().default(100),
      draft: s.boolean().default(false),
      body: s.mdx(),
    })
    .transform((data) => ({ ...data, url: `/work/${data.slug}` })),
});

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(140),
      slug: slug("posts"),
      date: s.isodate(),
      updated: s.isodate().optional(),
      /** id of a person in content/team.json */
      author: ref(),
      tags: s.array(s.string()).default([]),
      cover: image(),
      excerpt: s.string().max(320),
      featured: s.boolean().default(false),
      draft: s.boolean().default(false),
      metadata: s.metadata(),
      toc: s.toc(),
      body: s.mdx(),
    })
    .transform(({ metadata, ...data }) => ({
      ...data,
      readingTime: Math.max(1, Math.round(metadata.readingTime)),
      wordCount: metadata.wordCount,
      url: `/insights/${data.slug}`,
    })),
});

// ---------------------------------------------------------------------------
// JSON data collections (each file holds an array; every item becomes an entry)
// ---------------------------------------------------------------------------

const team = defineCollection({
  name: "TeamMember",
  pattern: "team.json",
  schema: s.object({
    id: s.unique("team"),
    name: s.string(),
    role: s.string(),
    bio: s.string().optional(),
    avatar: image(),
    linkedin: s.string().url().optional(),
    x: s.string().url().optional(),
    github: s.string().url().optional(),
    order: s.number().default(100),
  }),
});

const testimonials = defineCollection({
  name: "Testimonial",
  pattern: "testimonials.json",
  schema: s.object({
    id: s.unique("testimonials"),
    quote: s.string(),
    name: s.string(),
    role: s.string(),
    company: s.string(),
    avatar: image().optional(),
    /** slug of a case study in content/work (optional) */
    workSlug: ref().optional(),
    order: s.number().default(100),
  }),
});

const clients = defineCollection({
  name: "Client",
  pattern: "clients.json",
  schema: s.object({
    id: s.unique("clients"),
    name: s.string(),
    logo: image(),
    url: s.string().url().optional(),
    industry: s.string().optional(),
    order: s.number().default(100),
  }),
});

const jobs = defineCollection({
  name: "Job",
  pattern: "jobs.json",
  schema: s
    .object({
      slug: s.unique("jobs"),
      title: s.string(),
      department: s.string(),
      location: s.string(),
      type: s.enum(["full-time", "part-time", "contract", "internship"]),
      summary: s.string(),
      responsibilities: s.array(s.string()).default([]),
      requirements: s.array(s.string()).default([]),
      niceToHave: s.array(s.string()).default([]),
      applyUrl: s.string(),
      posted: s.isodate(),
      open: s.boolean().default(true),
      order: s.number().default(100),
    }),
});

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const prettyCode: PrettyCodeOptions = {
  theme: "github-dark-default",
  keepBackground: false,
};

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/content",
    base: "/content/",
    name: "[name]-[hash:6].[ext]",
    clean: false, // `npm run content:build` (and next build) pass --clean explicitly
  },
  collections: { products, services, work, posts, team, testimonials, clients, jobs },
  mdx: {
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCode]],
  },
  /** Cross-collection reference checks: warn (don't fail) so a typo never blocks the dev server. */
  prepare: ({ services, work, posts, team, testimonials }) => {
    const has = (list: { slug?: string; id?: string }[], key: string) =>
      list.some((item) => item.slug === key || item.id === key);
    const problems: string[] = [];
    for (const svc of services)
      for (const w of svc.relatedWork)
        if (!has(work, w)) problems.push(`services/${svc.slug}: relatedWork "${w}" not found in content/work`);
    for (const w of work) {
      for (const svcSlug of w.services)
        if (!has(services, svcSlug)) problems.push(`work/${w.slug}: service "${svcSlug}" not found in content/services`);
      if (w.testimonialId && !has(testimonials, w.testimonialId))
        problems.push(`work/${w.slug}: testimonialId "${w.testimonialId}" not found in content/testimonials.json`);
    }
    for (const p of posts)
      if (!has(team, p.author)) problems.push(`posts/${p.slug}: author "${p.author}" not found in content/team.json`);
    for (const t of testimonials)
      if (t.workSlug && !has(work, t.workSlug))
        problems.push(`testimonials.json/${t.id}: workSlug "${t.workSlug}" not found in content/work`);
    if (problems.length) console.warn(`[velite] broken content references:\n  - ${problems.join("\n  - ")}`);
  },
});
