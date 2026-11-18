import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ScreenshotGallery } from "@/components/sections/products/screenshot-gallery";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import { CaseResults } from "@/components/sections/work/case-results";
import { CaseTestimonial } from "@/components/sections/work/case-testimonial";
import { NextCase } from "@/components/sections/work/next-case";
import { Prose } from "@/components/sections/work/prose";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RelatedPosts } from "@/components/seo/related";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import {
  getNextWork,
  getServicesForWork,
  getTestimonial,
  getWork,
  getWorkItem,
} from "@/lib/content";
import { createMetadata, crumbs, getPostsForWork } from "@/lib/seo";

/**
 * Every slug is prerendered by generateStaticParams. `params` is awaited at the top (not inside
 * <Suspense>) on purpose: an unknown slug then hits notFound() before streaming starts, so it
 * returns a real 404 status instead of a 200 shell. `instant = false` acknowledges that trade-off.
 */
export const instant = false;

export function generateStaticParams() {
  return getWork().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) return {};
  return createMetadata({
    title: item.title,
    description: item.summary,
    path: item.url,
    routeImage: true,
  });
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-line py-4 first:pt-0 last:border-b-0">
      <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-body-sm text-foreground">{children}</dd>
    </div>
  );
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) notFound();

  const services = getServicesForWork(item);
  const testimonial = item.testimonialId
    ? getTestimonial(item.testimonialId)
    : undefined;
  const next = getNextWork(slug);
  const posts = getPostsForWork(item);

  return (
    <>
      <Breadcrumbs
        items={crumbs("Work", "/work", { name: item.title, href: item.url })}
      />

      <PageHeader
        eyebrow={`Case study — ${item.industry}`}
        title={item.title}
        intro={item.summary}
      />

      {/* Cover: the LCP image on phones, so it is not wrapped in <Reveal> (opacity 0 until hydration). */}
      <Container size="wide">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface shadow-elevated md:aspect-[2/1] md:rounded-3xl">
          <Image
            src={item.coverImage}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            placeholder={item.coverImage.blurDataURL ? "blur" : "empty"}
            sizes="(min-width: 1472px) 92rem, 100vw"
            className="object-cover"
          />
        </div>
      </Container>

      {/* Sidebar + story */}
      <Section aria-label="Case study">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <dl className="rounded-2xl border border-line bg-surface-raised p-6">
              <MetaRow label="Client">{item.client}</MetaRow>
              <MetaRow label="Industry">{item.industry}</MetaRow>
              {services.length ? (
                <MetaRow label="Services">
                  <ul className="flex flex-col gap-1">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={s.url}
                          className="underline-offset-4 hover:text-highlight hover:underline"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </MetaRow>
              ) : null}
              <MetaRow label="Year">
                <span className="tabular-nums">{item.year}</span>
              </MetaRow>
              {item.stack.length ? (
                <MetaRow label="Stack">
                  <ul className="flex flex-wrap gap-1.5">
                    {item.stack.map((t) => (
                      <li
                        key={t}
                        className="rounded-md border border-line px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.12em] text-muted-foreground uppercase"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </MetaRow>
              ) : null}
            </dl>
          </aside>

          <div className="flex min-w-0 flex-col gap-16 md:gap-20">
            <Reveal className="flex flex-col gap-5">
              <Eyebrow index="01">The challenge</Eyebrow>
              <p className="max-w-3xl text-heading-md font-normal text-foreground">
                {item.challenge}
              </p>
            </Reveal>
            <Reveal className="flex flex-col gap-5">
              <Eyebrow index="02">Our approach</Eyebrow>
              <p className="max-w-3xl text-body-lg text-muted-foreground">
                {item.approach}
              </p>
            </Reveal>
            <Reveal>
              <Prose code={item.body} />
            </Reveal>
          </div>
        </div>
      </Section>

      <CaseResults results={item.results} index={3} />

      {item.gallery.length ? (
        <Section
          eyebrow="Gallery"
          index={4}
          title="Inside the project"
          aria-label="Gallery"
        >
          <ScreenshotGallery items={item.gallery} framed={false} />
        </Section>
      ) : null}

      {testimonial ? <CaseTestimonial testimonial={testimonial} /> : null}

      <RelatedPosts
        posts={posts}
        title="Related reading"
        className="border-t border-line"
      />

      {next ? <NextCase item={next} /> : null}

      <CtaPanel title="Have a project like this?" />
    </>
  );
}
