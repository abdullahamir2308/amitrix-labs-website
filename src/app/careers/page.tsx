import type { Metadata } from "next";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import { Culture } from "@/components/sections/careers/culture";
import { OpenRoles } from "@/components/sections/careers/open-roles";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getJobs } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description: `Join ${site.name}: build software products and AI for clients in every industry with a small, senior team.`,
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  const jobs = getJobs();
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build things that actually ship."
        intro="We're a small team that builds our own products and custom software and AI for clients. If you like owning work end to end, you'll fit right in."
      />

      <Culture intro={site.about.careersIntro} principles={site.why} />

      <section aria-labelledby="roles-title" className="border-t border-line py-section">
        <Container>
          <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-5">
              <Eyebrow index="02">Open roles</Eyebrow>
              <h2 id="roles-title" className="text-display-md text-foreground">
                {jobs.length ? "Join the lab." : "No open roles right now."}
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
