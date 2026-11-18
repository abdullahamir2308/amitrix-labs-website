import type { Metadata } from "next";
import { Suspense } from "react";
import { toWorkCardData } from "@/components/cards/to-card-data";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import {
  WorkGrid,
  WorkGridView,
  type WorkFilterOptions,
} from "@/components/sections/work/work-grid";
import { Section } from "@/components/ui/section";
import { getWork, getWorkIndustries, getWorkServices } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PAGE = site.pages.work;

export const metadata: Metadata = createMetadata({
  title: "Work",
  description: PAGE.description,
  path: "/work",
});

export default function WorkPage() {
  const items = getWork().map(toWorkCardData);
  const options: WorkFilterOptions = {
    industries: getWorkIndustries(),
    services: getWorkServices().map((s) => ({
      slug: s.slug,
      title: s.shortTitle,
    })),
  };

  return (
    <>
      <PageHeader
        eyebrow={PAGE.eyebrow}
        index="03"
        title={PAGE.title}
        intro={PAGE.intro}
      />
      <Section
        spacing="sm"
        className="pt-0 pb-section md:pt-0"
        aria-label="Case studies"
      >
        {/* The filter reads ?industry=&service= on the client; the static HTML holds the full grid. */}
        <Suspense fallback={<WorkGridView items={items} options={options} />}>
          <WorkGrid items={items} options={options} />
        </Suspense>
      </Section>
      <CtaPanel />
    </>
  );
}
