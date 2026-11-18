import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { getServices } from "@/lib/content";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { sectionHeader } from "./bento/section-copy";
import { ServiceTile, tileSpan } from "./bento/service-tile";

/**
 * Home §3 — services bento: six spotlight tiles of mixed sizes (6-col grid on
 * desktop, 2 on tablet, 1 on mobile), each with a looping UI micro-animation
 * and linking to /services/[slug].
 */
export function ServicesBento() {
  const services = getServices();
  if (services.length === 0) return null;

  return (
    <Section
      id="services"
      {...sectionHeader(site.sections.services)}
      actions={
        <Button href="/services" variant="secondary" withArrow>
          {site.ctaLabels.allServices}
        </Button>
      }
    >
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-6">
        {services.map((service, i) => (
          <li key={service.slug} className={cn("flex", tileSpan(service.slug))}>
            <Reveal className="flex w-full" delay={(i % 3) * 0.06} y={20}>
              <ServiceTile service={service} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
