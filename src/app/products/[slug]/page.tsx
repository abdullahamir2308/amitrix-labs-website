import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import { CtaPanel } from "@/components/sections/cta-panel";
import { FeatureGrid } from "@/components/sections/products/feature-grid";
import { ProductHero } from "@/components/sections/products/product-hero";
import { ScreenshotGallery } from "@/components/sections/products/screenshot-gallery";
import { FaqSection } from "@/components/sections/services/faq-section";
import { Prose } from "@/components/sections/work/prose";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { getProduct, getProducts } from "@/lib/content";

/**
 * Every slug is prerendered by generateStaticParams. `params` is awaited at the top (not inside
 * <Suspense>) on purpose: an unknown slug then hits notFound() before streaming starts, so it
 * returns a real 404 status instead of a 200 shell. `instant = false` acknowledges that trade-off.
 */
export const instant = false;

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: product.url },
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [product.heroImage.src],
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  let n = 0;
  const next = () => ++n;

  return (
    <>
      <ProductHero product={product} />

      <FeatureGrid
        features={product.features}
        index={product.features.length ? next() : undefined}
      />

      {product.screenshots.length ? (
        <Section
          tone="dark"
          eyebrow="Screenshots"
          index={next()}
          title="A closer look"
          aria-label="Screenshots"
          className="border-t border-line"
        >
          <ScreenshotGallery
            items={product.screenshots}
            label={product.category}
          />
        </Section>
      ) : null}

      <Section
        tone="dark"
        className="border-t border-line"
        aria-label="Overview"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow index={next()}>Overview</Eyebrow>
          </div>
          <Reveal>
            <Prose code={product.body} />
          </Reveal>
        </div>
      </Section>

      {product.faqs.length ? (
        <FaqSection
          tone="dark"
          faqs={product.faqs}
          index={next()}
          className="border-t border-line"
        />
      ) : null}

      <CtaPanel
        title={`Ready to try ${product.name}?`}
        intro={product.pricingNote}
        primaryLabel={product.ctaLabel ?? "Get started"}
        primaryHref={product.ctaUrl}
      />
    </>
  );
}
