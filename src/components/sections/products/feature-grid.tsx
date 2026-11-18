import { ContentIcon } from "@/components/cards/content-icon";
import { Reveal, SpotlightCard } from "@/components/motion";
import { Section } from "@/components/ui/section";
import type { Product } from "@/lib/content";
import { cn } from "@/lib/cn";

/** Feature tiles (icon, title, description) from `features[]`. Forced dark. */
export function FeatureGrid({
  features,
  index,
  title = "What's inside",
}: {
  features: Product["features"];
  index?: string | number;
  title?: string;
}) {
  if (!features.length) return null;
  const cols =
    features.length % 4 === 0
      ? "lg:grid-cols-4"
      : features.length % 3 === 0
        ? "lg:grid-cols-3"
        : "lg:grid-cols-2";
  return (
    <Section
      tone="dark"
      id="features"
      eyebrow="Features"
      index={index}
      title={title}
    >
      <Reveal stagger={0.08} className={cn("grid gap-4 sm:grid-cols-2", cols)}>
        {features.map((f) => (
          <SpotlightCard
            key={f.title}
            className="flex h-full flex-col gap-6 bg-surface-raised p-7 shadow-none md:p-8"
          >
            <span className="flex size-11 items-center justify-center rounded-xl border border-line-strong bg-surface text-highlight shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]">
              <ContentIcon name={f.icon} className="size-5" />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-heading-sm text-foreground">{f.title}</h3>
              <p className="text-body-sm text-muted-foreground">
                {f.description}
              </p>
            </div>
          </SpotlightCard>
        ))}
      </Reveal>
    </Section>
  );
}
