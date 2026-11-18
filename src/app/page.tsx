import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/sections/home/hero";
import { TrustRow } from "@/components/sections/home/trust-row";
import { ServicesBento } from "@/components/sections/home/services-bento";
import { MetricsBand } from "@/components/sections/home/metrics-band";
import { WhyAmitrix } from "@/components/sections/home/why-amitrix";
import { ProductsShowcase } from "@/components/sections/home/products-showcase";
import { FeaturedWork } from "@/components/sections/home/featured-work";
import { HowWeWork } from "@/components/sections/home/how-we-work";
import { TechStack } from "@/components/sections/home/tech-stack";
import { Testimonials } from "@/components/sections/home/testimonials";
import { FinalCta } from "@/components/sections/home/final-cta";
import { createMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

// Title falls back to the root default ("Amitrix Labs — Software and AI that actually ships").
export const metadata: Metadata = createMetadata({
  description: site.seo.description,
  path: "/",
});

// Homepage composition (owned by the orchestrator). Order and themes follow
// the plan's homepage table. Each section lives in its own file and is built
// by its phase: 5 = Hero; 6 = TrustRow..WhyAmitrix; 7 = ProductsShowcase..FinalCta.
// The Footer (section 12) is part of the site shell (Phase 4).
export default function Home() {
  return (
    <>
      <Hero />
      <TrustRow />
      <ServicesBento />
      <MetricsBand />
      <WhyAmitrix />
      <ProductsShowcase />
      <FeaturedWork />
      <HowWeWork />
      <TechStack />
      <Testimonials />
      <FinalCta />
      {/* Last, so the hero stays the page's first element (the header reads its tone from it). */}
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
    </>
  );
}
