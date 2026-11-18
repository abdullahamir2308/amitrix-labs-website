import { Reveal } from "@/components/motion";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { sectionHeader } from "./bento/section-copy";
import { WhyIcon, whyItemClass, whyTileClass } from "./why/why-icons";

/**
 * Home §5 — "Why Amitrix": three hairline-separated columns from `site.why`,
 * each with a custom line icon that animates while the column is hovered.
 */
export function WhyAmitrix() {
  const items = site.why;
  if (items.length === 0) return null;

  return (
    <Section id="why" {...sectionHeader(site.sections.why)}>
      <Reveal
        as="ul"
        stagger={0.08}
        y={16}
        className="grid grid-cols-1 border-t border-line md:grid-cols-3"
        itemClassName={cn(
          whyItemClass,
          "flex flex-col gap-6 border-line py-10 md:py-12 md:pr-8 lg:pr-12",
          "not-first:border-t md:not-first:border-t-0 md:not-first:border-l md:not-first:pl-8 lg:not-first:pl-12",
        )}
      >
        {items.map((item, i) => (
          <div key={item.title} className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  whyTileClass,
                  "grid size-12 place-items-center rounded-xl border border-line bg-surface-raised text-foreground shadow-soft",
                )}
              >
                <WhyIcon name={item.icon} />
              </span>
              <span aria-hidden="true" className="font-mono text-xs tracking-[0.12em] text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-heading-md font-medium text-foreground">{item.title}</h3>
              <p className="max-w-[40ch] text-body text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
