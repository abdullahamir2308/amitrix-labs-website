import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import styles from "@/components/sections/insights/article.module.css";
import { articleMdxComponents } from "@/components/sections/insights/mdx-components";
import { PostCard } from "@/components/sections/insights/post-card";
import { RelatedWork } from "@/components/sections/work/related-work";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedServices } from "@/components/seo/related";
import { formatPostDate, tagSlug, toPostSummary } from "@/components/sections/insights/post-summary";
import { ReadingProgress } from "@/components/sections/insights/reading-progress";
import { ShareLinks } from "@/components/sections/insights/share-links";
import { TableOfContents } from "@/components/sections/insights/table-of-contents";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getPost, getPostAuthor, getPosts, getRelatedPosts } from "@/lib/content";
import { MDXContent } from "@/lib/mdx";
import { cn } from "@/lib/cn";
import {
  articleJsonLd,
  createMetadata,
  crumbs,
  getServicesForPost,
  getWorkForPost,
} from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * Params are awaited at the top level (not inside <Suspense>) on purpose: an unknown slug hits
 * notFound() before streaming starts, so it returns a real 404 status instead of a 200 shell.
 * Known slugs are fully prerendered via generateStaticParams. `instant = false` acknowledges
 * the trade-off for client navigations to slugs outside that list.
 */
export const instant = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const author = getPostAuthor(post);
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: post.url,
    keywords: post.tags,
    routeImage: true,
    article: {
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: author ? [author.name] : undefined,
      tags: post.tags,
    },
  });
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = getPostAuthor(post);
  const related = getRelatedPosts(post.slug, 3).map((p) => toPostSummary(p, getPostAuthor(p)));
  const shareUrl = `${site.url}${post.url}`;
  const services = getServicesForPost(post);
  const work = getWorkForPost(post);

  return (
    <>
      <Breadcrumbs items={crumbs("Insights", "/insights", { name: post.title, href: post.url })} />
      <JsonLd data={articleJsonLd(post, author)} />
      <ReadingProgress targetId="article-body" />

      <PageHeader
        eyebrow="Insights"
        title={post.title}
        intro={post.excerpt}
      >
        <div className="flex flex-col gap-6">
          <Link
            href="/insights"
            className="inline-flex w-fit items-center gap-2 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {site.ctaLabels.allPosts}
          </Link>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {author ? (
              <span className="flex items-center gap-3">
                <Image src={author.avatar} alt="" width={40} height={40} className="size-10 rounded-full ring-1 ring-line" />
                <span className="flex flex-col">
                  <span className="text-body-sm font-medium text-foreground">{author.name}</span>
                  <span className="text-caption text-muted-foreground">{author.role}</span>
                </span>
              </span>
            ) : null}
            <p className="flex flex-wrap items-center gap-x-2 font-mono text-label text-muted-foreground">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
              {post.updated ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated <time dateTime={post.updated}>{formatPostDate(post.updated)}</time>
                  </span>
                </>
              ) : null}
            </p>
          </div>
          {post.tags.length ? (
            <ul className="flex flex-wrap gap-2" aria-label="Topics">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/insights?tag=${tagSlug(tag)}`}
                    className="inline-flex h-7 items-center rounded-full border border-line-strong px-3 font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </PageHeader>

      <Container className="pt-10 pb-section md:pt-14">
        <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-surface md:mb-16 lg:aspect-[21/9]">
          <Image src={post.cover} alt="" fill loading="eager" fetchPriority="high" sizes="(min-width: 1280px) 76rem, 100vw" className="object-cover" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16 xl:grid-cols-[13rem_minmax(0,1fr)_13rem]">
          {/* Mobile / tablet: collapsible contents */}
          {post.toc.length ? (
            <details className="group/toc rounded-xl border border-line bg-surface-raised lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-mono text-label text-muted-foreground [&::-webkit-details-marker]:hidden">
                On this page
                <span aria-hidden="true" className="text-base transition-transform duration-300 group-open/toc:rotate-45">
                  +
                </span>
              </summary>
              <div className="border-t border-line px-5 py-4">
                <TableOfContents toc={post.toc} className="[&>p]:hidden" />
              </div>
            </details>
          ) : null}

          <div aria-hidden="true" className="hidden xl:block" />

          <article id="article-body" className="min-w-0">
            <div className={cn(styles.prose, "mx-auto lg:mx-0 xl:mx-auto")}>
              <MDXContent code={post.body} components={articleMdxComponents} />
            </div>

            {author ? (
              <aside aria-label="About the author" className="mx-auto mt-16 max-w-[68ch] lg:mx-0 xl:mx-auto">
                <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface-raised p-6 sm:flex-row sm:items-start sm:p-8">
                  <Image src={author.avatar} alt="" width={64} height={64} className="size-16 shrink-0 rounded-full ring-1 ring-line" />
                  <div className="flex flex-col gap-2">
                    <Eyebrow>Written by</Eyebrow>
                    <p className="text-heading-sm text-foreground">{author.name}</p>
                    <p className="text-body-sm text-muted-foreground">{author.role}</p>
                    {author.bio ? <p className="mt-1 text-body-sm text-muted-foreground">{author.bio}</p> : null}
                    {author.linkedin ? (
                      <a
                        href={author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 w-fit text-body-sm font-medium text-highlight underline-offset-4 hover:underline"
                      >
                        LinkedIn ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              </aside>
            ) : null}

            <ShareLinks url={shareUrl} title={post.title} className="mx-auto mt-10 max-w-[68ch] lg:hidden" />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-10">
              <TableOfContents toc={post.toc} />
              <ShareLinks url={shareUrl} title={post.title} />
            </div>
          </aside>
        </div>
      </Container>

      <RelatedServices services={services} className="border-t border-line" />

      <RelatedWork
        items={work}
        title="Related case studies"
        className="border-t border-line"
      />

      {related.length ? (
        <section aria-labelledby="related-title" className="border-t border-line py-section">
          <Container>
            <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-5">
                <Eyebrow>Keep reading</Eyebrow>
                <h2 id="related-title" className="text-display-md text-foreground">
                  Related insights
                </h2>
              </div>
              <Link href="/insights" className="text-body-sm font-medium text-highlight underline-offset-4 hover:underline">
                {site.ctaLabels.allPosts} →
              </Link>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <CtaPanel />
    </>
  );
}
