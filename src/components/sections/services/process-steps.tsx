import { Reveal } from "@/components/motion";
import type { Service } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Numbered process steps on a hairline: horizontal on lg+, vertical below. Each node fades in
 * in turn (Reveal stagger); reduced motion shows everything at once.
 */
export function ProcessSteps({ steps }: { steps: Service["process"] }) {
  const cols =
    steps.length >= 4
      ? "lg:grid-cols-4"
      : steps.length === 3
        ? "lg:grid-cols-3"
        : "lg:grid-cols-2";
  return (
    <div className="relative">
      {/* Horizontal rail (lg+) */}
      <div
        aria-hidden="true"
        className="absolute top-[0.6875rem] right-0 left-0 hidden h-px bg-line lg:block"
      >
        <div className="h-full w-full origin-left bg-gradient-to-r from-indigo via-indigo/60 to-cyan/40" />
      </div>
      <Reveal
        as="ol"
        stagger={0.12}
        className={cn("relative grid gap-10 lg:gap-8", cols)}
      >
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="relative flex gap-5 lg:flex-col lg:gap-6"
          >
            {/* Vertical rail (< lg) */}
            {i < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-7 bottom-[-2.5rem] left-[0.6875rem] w-px bg-line lg:hidden"
              />
            ) : null}
            <span
              aria-hidden="true"
              className="relative z-10 mt-0.5 flex size-[1.375rem] shrink-0 items-center justify-center rounded-full border border-indigo bg-background shadow-glow-indigo lg:mt-0"
            >
              <span className="size-1.5 rounded-full bg-indigo" />
            </span>
            <div className="flex flex-col gap-3">
              <p className="font-mono text-xs tracking-[0.14em] text-highlight tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-heading-sm text-foreground">{step.title}</h3>
              <p className="text-body-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
