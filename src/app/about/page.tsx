import type { Metadata } from "next";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import { MissionValues } from "@/components/sections/about/mission-values";
import { ProductsClients } from "@/components/sections/about/products-clients";
import { StoryTimeline } from "@/components/sections/about/story-timeline";
import { TeamGrid } from "@/components/sections/about/team-grid";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getClients, getProducts, getTeam } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PAGE = site.pages.about;

export const metadata: Metadata = createMetadata({
  title: "About",
  description: PAGE.description,
  path: "/about",
});

export default function AboutPage() {
  const team = getTeam();
  return (
    <>
      <PageHeader
        eyebrow={PAGE.eyebrow}
        title={PAGE.title}
        intro={site.description}
      />

      <section aria-labelledby="story-title" className="py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
            <div className="flex flex-col gap-5 lg:sticky lg:top-32 lg:self-start">
              <Eyebrow index="01">{PAGE.story.eyebrow}</Eyebrow>
              <h2 id="story-title" className="text-display-md text-foreground">
                {PAGE.story.heading}
              </h2>
            </div>
            <StoryTimeline items={site.about.timeline} />
          </div>
        </Container>
      </section>

      <MissionValues mission={site.about.mission} values={site.about.values} />

      <section aria-labelledby="team-title" className="border-t border-line py-section">
        <Container>
          <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-2xl flex-col gap-5">
              <Eyebrow index="04">{PAGE.team.eyebrow}</Eyebrow>
              <h2 id="team-title" className="text-display-md text-foreground">
                {PAGE.team.heading}
              </h2>
            </div>
            <p className="max-w-md text-body-lg text-muted-foreground">
              {PAGE.team.intro}
            </p>
          </div>
          <TeamGrid team={team} />
        </Container>
      </section>

      <ProductsClients products={getProducts()} clients={getClients()} />

      <CtaPanel />
    </>
  );
}
