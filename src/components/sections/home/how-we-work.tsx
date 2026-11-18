import { CodeXml, PenTool, Rocket, Search, Sparkles, type LucideIcon } from "lucide-react";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/section";
import { parseEyebrow } from "./showcase/section-utils";
import { ProcessLine } from "./process/process-line";

const ICONS: Record<string, LucideIcon> = { Search, PenTool, CodeXml, Rocket };

/**
 * 06 — How we work (light). Four steps on a hairline (Linear-changelog style).
 * The line draws itself with scroll (DrawSVG, scrubbed) and each node lights up
 * when the line reaches it. Horizontal from md, vertical on mobile. Markup is
 * server-rendered in its final "all lit" state; the client wrapper animates it.
 */
export function HowWeWork() {
  const copy = site.sections.process;
  const eyebrow = parseEyebrow(copy.eyebrow);

  return (
    <Section id="process" eyebrow={eyebrow.label} index={eyebrow.index} title={copy.heading} grid>
      <ProcessLine>
        <ol className="relative grid gap-12 md:grid-cols-4 md:gap-8">
          {site.process.map((step, i) => {
            const Icon = ICONS[step.icon] ?? Sparkles;
            return (
              <li key={step.title} data-step="" data-active="" className="group/step relative pl-10 md:pt-12 md:pl-0">
                <span
                  data-dot=""
                  aria-hidden="true"
                  className="absolute top-0.5 left-0 flex size-[15px] items-center justify-center rounded-full border border-line-strong bg-background transition-[border-color,box-shadow] duration-500 ease-expo-out group-data-active/step:border-indigo group-data-active/step:shadow-[0_0_0_5px_rgb(91_76_245/0.14)] md:top-0"
                >
                  <span className="size-[7px] scale-0 rounded-full bg-indigo transition-transform duration-500 ease-expo-out group-data-active/step:scale-100" />
                </span>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg border border-line bg-surface-raised text-muted-foreground shadow-soft transition-colors duration-500 group-data-active/step:border-indigo/30 group-data-active/step:text-highlight">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="text-label text-muted-foreground tabular-nums">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-heading-sm text-muted-foreground transition-colors duration-500 group-data-active/step:text-foreground">
                    {step.title}
                  </h3>
                  <p className="max-w-xs text-body-sm text-muted-foreground">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </ProcessLine>
    </Section>
  );
}
