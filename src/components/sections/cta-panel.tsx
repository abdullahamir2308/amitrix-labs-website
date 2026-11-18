import { useId, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { LatticeMotif } from "@/components/brand/lattice-motif";

export type CtaPanelProps = {
  /** Defaults to site.finalCta headline ("Have something to build?") */
  title?: string;
  intro?: ReactNode;
  /** Defaults to "Book a call" -> /contact */
  primaryLabel?: string;
  primaryHref?: string;
  className?: string;
};

/**
 * Shared closing CTA: a large ink panel (dark in both themes) with the lattice
 * motif glowing faintly behind a centred headline, a magnetic "Book a call"
 * button and the contact email. Used at the bottom of the homepage (FinalCta)
 * and inner pages. Server component; Magnetic is the only client island.
 */
export function CtaPanel({
  title = site.finalCta.heading,
  intro = site.finalCta.body,
  primaryLabel = site.finalCta.primaryCta.label,
  primaryHref = site.finalCta.primaryCta.href,
  className,
}: CtaPanelProps) {
  const headingId = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-cta`;
  const email = site.contact.email;
  const eyebrow = site.finalCta.eyebrow.replace(/^\s*\/\/\s*/, "");

  return (
    <section aria-labelledby={headingId} className={cn("py-section-sm", className)}>
      <Container>
        <div className="section-dark relative isolate overflow-hidden rounded-3xl border border-white/10 px-6 py-20 text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] sm:px-10 md:py-32 lg:py-40">
          <LatticeMotif density="normal" fade className="absolute inset-0 -z-10 opacity-70" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgb(91_76_245/0.24),transparent_70%)]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-radial opacity-60" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent"
          />

          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={headingId} className="text-display-lg text-foreground">
              {title}
            </h2>
            {intro ? <div className="max-w-xl text-body-lg text-muted-foreground">{intro}</div> : null}
            <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
              <Magnetic strength={0.4}>
                <Button href={primaryHref} size="xl" variant="primary" withArrow>
                  {primaryLabel}
                </Button>
              </Magnetic>
              <a
                href={`mailto:${email}`}
                className="group/mail inline-flex flex-col items-center gap-1 rounded-sm sm:items-start"
              >
                <span className="text-label text-muted-foreground">{site.finalCta.emailLabel}</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-body text-foreground underline decoration-white/25 underline-offset-4 transition-colors duration-300 group-hover/mail:text-signal group-hover/mail:decoration-cyan">
                  {email}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 ease-expo-out group-hover/mail:-translate-y-0.5 group-hover/mail:translate-x-0.5"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
