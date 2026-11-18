import type { Metadata } from "next";
import type { ServiceRowData } from "@/components/cards/service-row";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import { ServiceList } from "@/components/sections/services/service-list";
import { Section } from "@/components/ui/section";
import { getServices } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PAGE = site.pages.services;

export const metadata: Metadata = createMetadata({
  title: "Services",
  description: PAGE.description,
  path: "/services",
});

export default function ServicesPage() {
  const services: ServiceRowData[] = getServices().map((s) => ({
    slug: s.slug,
    url: s.url,
    title: s.title,
    summary: s.summary,
    icon: s.icon,
    image: s.image,
    tags: s.techStack.slice(0, 3),
  }));

  return (
    <>
      <PageHeader
        eyebrow={PAGE.eyebrow}
        index="02"
        title={PAGE.title}
        intro={PAGE.intro}
      />
      <Section spacing="sm" className="pb-section" aria-label="All services">
        <ServiceList services={services} />
      </Section>
      <CtaPanel />
    </>
  );
}
