import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { Check } from "lucide-react";
import type { FAQPage, WithContext } from "schema-dts";
import { ContentIcon } from "@/components/cards/content-icon";
import { Magnetic, Reveal } from "@/components/motion";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import { FaqSection } from "@/components/sections/services/faq-section";
import { ProcessSteps } from "@/components/sections/services/process-steps";
import { Prose } from "@/components/sections/work/prose";
import { RelatedWork } from "@/components/sections/work/related-work";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import {
  getService,
  getServices,
  getServiceWork,
  type Service,
} from "@/lib/content";

/**
 * Every slug is prerendered by generateStaticParams. `params` is awaited at the top (not inside
 * <Suspense>) on purpose: an unknown slug then hits notFound() before streaming starts, so it
 * returns a real 404 status instead of a 200 shell. `instant = false` acknowledges that trade-off.
 */
export const instant = false;

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.title} Services`,
    description: service.summary,
    alternates: { canonical: service.url },
    openGraph: {
      title: `${service.title} — Amitrix Labs`,
      description: service.summary,
      images: service.image ? [service.image.src] : undefined,
    },
  };
}

function faqJsonLd(service: Service): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default async function ServicePage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const work = getServiceWork(slug);
  let n = 0;
  const next = () => ++n;

  return (
    <>
      {service.faqs.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd(service)).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}

      <PageHeader
        eyebrow="Services"
        title={service.title}
        intro={service.summary}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Magnetic>
            <Button size="lg" variant="primary" withArrow href="/contact">
              Book a call
            </Button>
          </Magnetic>
          {work.length ? (
            <Button size="lg" variant="secondary" href="#work">
              See related work
            </Button>
          ) : null}
        </div>
      </PageHeader>

      {/* Problem */}
      {service.problems.length ? (
        <Section
          eyebrow="The problem"
          index={next()}
          title="Sound familiar?"
          className="border-t border-line"
        >
          <Reveal stagger={0.08} className="grid gap-4 md:grid-cols-2">
            {service.problems.map((problem, i) => (
              <div
                key={problem}
                className="flex h-full gap-5 rounded-2xl border border-line bg-surface-raised p-6 md:p-8"
              >
                <span className="font-mono text-xs tracking-[0.14em] text-highlight tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-body-lg text-foreground">{problem}</p>
              </div>
            ))}
          </Reveal>
        </Section>
      ) : null}

      {/* What we deliver */}
      <Section
        eyebrow="What we deliver"
        index={next()}
        title="What you get"
        className="border-t border-line bg-surface"
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
          <Reveal>
            <Prose code={service.body} />
          </Reveal>
          <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            {service.image ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-raised">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 flex size-11 items-center justify-center rounded-xl bg-ink/70 text-paper backdrop-blur-md">
                  <ContentIcon name={service.icon} className="size-5" />
                </span>
              </div>
            ) : null}
            {service.deliverables.length ? (
              <Reveal
                as="ul"
                stagger={0.06}
                className="flex flex-col rounded-2xl border border-line bg-surface-raised p-2"
                itemClassName="flex gap-4 rounded-xl px-4 py-4 not-last:border-b not-last:border-line"
              >
                {service.deliverables.map((d) => (
                  <Fragment key={d}>
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo/10 text-highlight">
                      <Check
                        aria-hidden="true"
                        className="size-3"
                        strokeWidth={2.5}
                      />
                    </span>
                    <span className="text-body-sm text-foreground">{d}</span>
                  </Fragment>
                ))}
              </Reveal>
            ) : null}
          </div>
        </div>
      </Section>

      {/* Process */}
      {service.process.length ? (
        <Section
          tone="dark"
          eyebrow="Process"
          index={next()}
          title="How we work"
          grid
        >
          <ProcessSteps steps={service.process} />
        </Section>
      ) : null}

      {/* Tech stack */}
      {service.techStack.length ? (
        <Section
          eyebrow="Tech stack"
          index={next()}
          title="Tools we reach for"
          intro="Chosen per project — proven, well supported and easy for your team to own."
        >
          <Reveal
            as="ul"
            stagger={0.04}
            className="flex flex-wrap gap-3"
            itemAs="li"
          >
            {service.techStack.map((t) => (
              <span
                key={t}
                className="inline-flex h-11 items-center rounded-xl border border-line bg-surface-raised px-4 font-mono text-xs tracking-[0.08em] text-foreground uppercase"
              >
                {t}
              </span>
            ))}
          </Reveal>
        </Section>
      ) : null}

      {/* Related case studies */}
      <div id="work" className="scroll-mt-20">
        <RelatedWork
          items={work}
          index={work.length ? next() : undefined}
          className="border-t border-line"
        />
      </div>

      <FaqSection
        faqs={service.faqs}
        index={service.faqs.length ? next() : undefined}
        title={`${service.shortTitle} FAQ`}
        className="border-t border-line"
      />

      <CtaPanel
        title={`Let's talk about your ${service.shortTitle} project`}
        intro="Tell us what you're working on. We'll reply within one business day with honest next steps."
      />
    </>
  );
}
