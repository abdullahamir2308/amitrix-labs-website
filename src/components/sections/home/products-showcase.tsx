import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProducts } from "@/lib/content";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseEyebrow, STATUS_BADGE } from "./showcase/section-utils";
import { ProductsStage, type ShowcaseProduct } from "./showcase/products-stage";

/**
 * 04 — Products (dark). Desktop with motion: a pinned stage (names left, a
 * browser frame right that scales in and cross-fades between products).
 * Under 768px or with reduced motion: stacked static cards. Both variants are
 * in the server HTML; CSS picks one, so there's no hydration flash.
 */
export function ProductsShowcase() {
  const copy = site.sections.products;
  const eyebrow = parseEyebrow(copy.eyebrow);
  const products: ShowcaseProduct[] = getProducts().map((p) => {
    const shot = p.screenshots[0];
    return {
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      status: p.status,
      category: p.category,
      href: `/products/${p.slug}`,
      image: shot?.image ?? p.heroImage,
      alt: shot?.alt ?? `${p.name} screenshot`,
    };
  });
  if (products.length === 0) return null;

  return (
    <Section
      id="products"
      tone="dark"
      eyebrow={eyebrow.label}
      index={eyebrow.index}
      title={copy.heading}
      intro={copy.subheading}
      actions={
        <Button href="/products" variant="secondary" size="md" withArrow>
          {site.ctaLabels.allProducts}
        </Button>
      }
      className="overflow-x-clip"
    >
      {/* soft cyan field behind the whole section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 mx-auto h-[60%] max-w-5xl bg-[radial-gradient(ellipse_at_center,rgb(34_211_238/0.10),transparent_65%)]"
      />

      <div className="hidden md:motion-safe:block">
        <ProductsStage products={products} exploreLabel={site.ctaLabels.explore} />
      </div>

      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:motion-safe:hidden">
        {products.map((p) => {
          const badge = STATUS_BADGE[p.status];
          return (
            <li
              key={p.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface">
                <Image
                  src={p.image}
                  alt={p.alt}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-center gap-2">
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                  <span className="text-label text-muted-foreground">{p.category}</span>
                </div>
                <h3 className="text-heading-md text-foreground">{p.name}</h3>
                <p className="text-body-sm text-muted-foreground">{p.tagline}</p>
                <Link
                  href={p.href}
                  className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-signal after:absolute after:inset-0 hover:underline"
                >
                  {site.ctaLabels.explore}
                  <span className="sr-only"> {p.name}</span>
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
