import type { Metadata } from "next";
import { ProductCard } from "@/components/cards/product-card";
import { Reveal } from "@/components/motion/reveal";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { getProducts } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PAGE = site.pages.products;

export const metadata: Metadata = createMetadata({
  title: "Products",
  description: PAGE.description,
  path: "/products",
});

export default function ProductsPage() {
  const products = getProducts();
  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow={PAGE.eyebrow}
        index="01"
        title={PAGE.title}
        intro={PAGE.intro}
      />
      <Section
        tone="dark"
        spacing="sm"
        className="pb-section"
        aria-label="All products"
      >
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {products.map((product, i) => {
            // With an odd count, the first product spans the full row.
            const wide = i === 0 && products.length % 2 === 1;
            return (
              <Reveal
                key={product.slug}
                delay={wide ? 0 : (i % 2) * 0.08}
                className={wide ? "md:col-span-2" : undefined}
              >
                <ProductCard
                  product={product}
                  layout={wide ? "wide" : "default"}
                  priority={i === 0}
                />
              </Reveal>
            );
          })}
        </div>
      </Section>
      <CtaPanel
        title={PAGE.cta.title}
        intro={PAGE.cta.intro}
      />
    </>
  );
}
