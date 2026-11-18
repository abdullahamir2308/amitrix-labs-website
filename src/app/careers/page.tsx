import type { Metadata } from "next";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import { Culture } from "@/components/sections/careers/culture";
import { OpenRoles } from "@/components/sections/careers/open-roles";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getJobs } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PAGE = site.pages.careers;

export const metadata: Metadata = createMetadata({
  title: "Careers",
  description: PAGE.description,
  path: "/careers",
});

export default function CareersPage() {
  const jobs = getJobs();
  return (
    <>
      <PageHeader
        eyebrow={PAGE.eyebrow}
        title={PAGE.title}
        intro={PAGE.intro}
      />

      <Culture
        eyebrow={PAGE.cultureSection.eyebrow}
        heading={PAGE.cultureSection.heading}
        intro={site.about.careersIntro}
        principles={PAGE.culture}
      />

      <section aria-labelledby="roles-title" className="border-t border-line py-section">
        <Container>
          <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-5">
              <Eyebrow index="02">{PAGE.roles.eyebrow}</Eyebrow>
              <h2 id="roles-title" className="text-display-md text-foreground">
                {jobs.length ? PAGE.roles.heading : PAGE.roles.headingEmpty}
              </h2>
            </div>
            {jobs.length ? (
              <p className="font-mono text-label text-muted-foreground">
                {jobs.length} open {jobs.length === 1 ? "role" : "roles"}
              </p>
            ) : null}
          </div>
          <OpenRoles jobs={jobs} />
        </Container>
      </section>

      <CtaPanel />
    </>
  );
}
