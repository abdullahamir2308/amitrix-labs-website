import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import { FeaturedPost } from "@/components/sections/insights/featured-post";
import { InsightsBrowser, InsightsBrowserFallback } from "@/components/sections/insights/insights-browser";
import { toPostSummary } from "@/components/sections/insights/post-summary";
import { Container } from "@/components/ui/container";
import { getFeaturedPost, getPostAuthor, getPosts, getPostTags } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes from the lab: how we build AI agents, software products and client platforms — engineering, design and process.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const posts = getPosts().map((p) => toPostSummary(p, getPostAuthor(p)));
  const featured = getFeaturedPost();
  const featuredSummary = featured ? posts.find((p) => p.slug === featured.slug) : undefined;
  const browserProps = { posts, tags: getPostTags(), featuredSlug: featuredSummary?.slug };

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title={site.sections.insights.heading}
        intro="How we build AI agents, products and platforms — the engineering, design and process behind work that ships."
      />

      <section aria-label="Articles" className="pt-10 pb-section md:pt-14">
        <Container className="flex flex-col gap-16 md:gap-20">
          {featuredSummary ? <FeaturedPost post={featuredSummary} /> : null}
          {/* useSearchParams needs a Suspense boundary on a prerendered route; the fallback is the
              unfiltered list, so the static HTML always contains every article. */}
          <Suspense fallback={<InsightsBrowserFallback {...browserProps} />}>
            <InsightsBrowser {...browserProps} />
          </Suspense>
        </Container>
      </section>

      <CtaPanel />
    </>
  );
}
