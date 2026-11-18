import { site } from "@/lib/site";
import { Section } from "@/components/ui/section";
import { TechLogo } from "@/components/icons/tech-logos";
import { parseEyebrow } from "./showcase/section-utils";
import { Terminal } from "./stack/terminal";
import { TiltTile } from "./stack/tilt-tile";

/**
 * 07 — Tech stack (dark). A terminal that types `amitrix deploy --prod` and
 * prints the deploy log once it scrolls into view, beside a grid of tech
 * tiles that tilt toward the pointer.
 */
export function TechStack() {
  const copy = site.sections.stack;
  const eyebrow = parseEyebrow(copy.eyebrow);
  const { command, log, tools } = site.techStack;

  return (
    <Section id="stack" tone="dark" eyebrow={eyebrow.label} index={eyebrow.index} title={copy.heading} className="overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 -z-10 size-[44rem] -translate-1/2 bg-[radial-gradient(circle,rgb(91_76_245/0.16),transparent_65%)]"
      />
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        <Terminal command={command} lines={log} />

        <ul className="grid grid-cols-3 gap-3 [perspective:900px] sm:grid-cols-4 lg:grid-cols-3" aria-label="Technologies we use">
          {tools.map((tool) => (
            <li key={tool.logo}>
              <TiltTile className="flex aspect-[5/4] flex-col items-center justify-center gap-3 p-3 lg:aspect-[16/11]">
                <TechLogo
                  logo={tool.logo}
                  name={tool.name}
                  className="size-8 text-foreground/70 transition-colors duration-300 group-hover/tile:text-foreground"
                />
                <span className="text-center font-mono text-[0.6875rem] leading-tight tracking-[0.06em] text-muted-foreground">
                  {tool.name}
                </span>
              </TiltTile>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
