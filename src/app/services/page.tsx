import type { Metadata } from "next";
import type { ServiceRowData } from "@/components/cards/service-row";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import { ServiceList } from "@/components/sections/services/service-list";
import { Section } from "@/components/ui/section";
import { getServices } from "@/lib/content";

// Draft page copy. TODO(site config): move into src/lib/site.ts with the other page headers.
const PAGE = {
  eyebrow: "Services",
  title: "Custom software and AI, from first idea to production.",
  intro:
    "Six disciplines, one senior team. Pick the one you need today — strategy, design and engineering stay together, so nothing gets lost in handover.",
  description:
    "Custom software development, AI agents and automation, web and SaaS platforms, mobile apps, product design and cloud & DevOps — delivered by one senior team.",
};

export const metadata: Metadata = {
  title: "Services",
  description: PAGE.description,
  alternates: { canonical: "/services" },
};

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
