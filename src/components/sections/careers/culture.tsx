import { Layers, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { IconItem } from "@/lib/site";

const ICONS: Record<string, LucideIcon> = { Zap, Layers, Sparkles };

/** Culture block: intro paragraph + "how we work" principles in a hairline grid. */
export function Culture({ intro, principles }: { intro: string; principles: readonly IconItem[] }) {
  return (
    <section aria-labelledby="culture-title" className="py-section">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-5">
            <Eyebrow index="01">Culture</Eyebrow>
            <h2 id="culture-title" className="text-display-md text-foreground">
              Small senior teams. Real ownership.
            </h2>
          </div>
          <Reveal>
            <p className="text-body-lg text-muted-foreground lg:pt-12">{intro}</p>
          </Reveal>
        </div>
        <Reveal
          as="ul"
          stagger={0.08}
          className="mt-14 grid border-t border-l border-line md:mt-20 md:grid-cols-3"
          itemClassName="border-r border-b border-line"
        >
          {principles.map((p, i) => {
            const Icon = ICONS[p.icon] ?? Sparkles;
            return (
              <div key={p.title} className="flex h-full flex-col gap-8 p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <Icon aria-hidden="true" className="size-5 text-highlight" strokeWidth={1.6} />
                  <span className="font-mono text-label text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-heading-sm text-foreground">{p.title}</h3>
                  <p className="text-body-sm text-muted-foreground">{p.description}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
