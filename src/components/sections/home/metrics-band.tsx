import { Counter } from "@/components/motion/counter";
import { Section } from "@/components/ui/section";
import { site, type Stat } from "@/lib/site";
import { sectionHeader } from "./bento/section-copy";

/**
 * Home §4 — metrics band: four large mono counters with mono labels from
 * `site.metrics`, split by hairlines (4 across on desktop, 2×2 on mobile).
 * Counters keep their final width (tabular figures), so nothing shifts.
 */
export function MetricsBand() {
  const metrics: readonly Stat[] = site.metrics;
  if (metrics.length === 0) return null;

  return (
    <Section id="metrics" {...sectionHeader(site.sections.metrics)}>
      <div className="relative border-y border-line">
        {/* Single indigo accent on the top hairline. */}
        <span
          aria-hidden="true"
          className="absolute -top-px left-0 h-px w-1/3 bg-linear-to-r from-indigo via-indigo/40 to-transparent"
        />
        <dl className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
          {metrics.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse justify-end gap-4 bg-background px-4 py-8 sm:px-6 md:py-12 lg:px-8"
            >
              <dt className="text-label max-w-[22ch] leading-relaxed text-muted-foreground">{stat.label}</dt>
              <dd className="font-mono text-[clamp(2.5rem,1.6rem+3.4vw,4.25rem)] leading-none font-light tracking-[-0.05em] text-foreground">
                <Counter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  delay={i * 0.08}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
