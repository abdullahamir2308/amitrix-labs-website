import { toWorkCardData } from "@/components/cards/to-card-data";
import { WorkCard } from "@/components/cards/work-card";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Section, type SectionProps } from "@/components/ui/section";
import type { WorkItem } from "@/lib/content";
import { cn } from "@/lib/cn";

/** A row of case-study cards with a "See all work" action. Renders nothing when empty. */
export function RelatedWork({
  items,
  title = "Related case studies",
  eyebrow = "Case studies",
  index,
  tone = "light",
  className,
}: {
  items: WorkItem[];
  title?: string;
  eyebrow?: string;
  index?: string | number;
  tone?: SectionProps["tone"];
  className?: string;
}) {
  if (!items.length) return null;
  const cols = items.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2";
  return (
    <Section
      tone={tone}
      eyebrow={eyebrow}
      index={index}
      title={title}
      className={className}
      actions={
        <Button variant="secondary" size="md" withArrow href="/work">
          See all work
        </Button>
      }
    >
      <Reveal
        stagger={0.1}
        className={cn("grid gap-x-6 gap-y-12 sm:grid-cols-2", cols)}
      >
        {items.map((item) => (
          <WorkCard key={item.slug} item={toWorkCardData(item)} />
        ))}
      </Reveal>
    </Section>
  );
}
