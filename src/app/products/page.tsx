import type { Metadata } from "next";
import { ProductCard } from "@/components/cards/product-card";
import { Reveal } from "@/components/motion";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { getProducts } from "@/lib/content";

// Draft page copy. TODO(site config): move into src/lib/site.ts with the other page headers.
const PAGE = {
  eyebrow: "Products",
  title: "Software we build for ourselves — and for you.",
  intro:
    "Our own products, built with the same team, tools and standards we bring to client work. Some are live, some are in beta, some are on the way.",
  description:
    "Products built by Amitrix Labs: AI agents, automation and analytics software, built with the same team and standards we bring to client work.",
};

export const metadata: Metadata = {
  title: "Products",
  description: PAGE.description,
  alternates: { canonical: "/products" },
};

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
        title="Want a product like this — built for your team?"
        intro="We design and build custom software and AI for teams in every industry."
      />
    </>
  );
}
