import { FlaskConical, Handshake, Sparkles, Target, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { IconItem } from "@/lib/site";

/** Icons used by site.about.values (lucide names). Unknown names fall back to Sparkles. */
const ICONS: Record<string, LucideIcon> = { Target, Handshake, FlaskConical };

/** Mission statement + value cards (site.about). */
export function MissionValues({ mission, values }: { mission: string; values: readonly IconItem[] }) {
  return (
    <section aria-labelledby="mission-title" className="relative isolate border-t border-line py-section">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-5">
            <Eyebrow index="02">Mission</Eyebrow>
            <h2 id="mission-title" className="sr-only">
              Our mission
            </h2>
          </div>
          <Reveal>
            <p className="text-heading-lg text-foreground">{mission}</p>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-5 md:mt-24">
          <Eyebrow index="03">Values</Eyebrow>
          <h2 className="sr-only">Our values</h2>
          <Reveal as="ul" stagger={0.08} className="grid gap-4 md:grid-cols-3" itemClassName="flex">
            {values.map((value, i) => {
              const Icon = ICONS[value.icon] ?? Sparkles;
              return (
                <SpotlightCard key={value.title} className="flex w-full flex-col gap-10 p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-line bg-surface text-highlight">
                      <Icon className="size-5" aria-hidden="true" strokeWidth={1.6} />
                    </span>
                    <span className="font-mono text-label text-muted-foreground tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-heading-sm text-foreground">{value.title}</h3>
                    <p className="text-body-sm text-muted-foreground">{value.description}</p>
                  </div>
                </SpotlightCard>
              );
            })}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
