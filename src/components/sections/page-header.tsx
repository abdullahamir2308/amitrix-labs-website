// Shared inner-page header (Phase 4). Server component.
import type { ReactNode } from "react";
import { DecodeText } from "@/components/motion";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/cn";

export type PageHeaderProps = {
  /** Eyebrow label, rendered as "// 01 — LABEL" */
  eyebrow?: string;
  index?: string;
  /** Page H1 (decodes in with <DecodeText>) */
  title: string;
  intro?: ReactNode;
  tone?: "light" | "dark";
  /** Optional right-side or below-title slot (buttons, filters, media) */
  children?: ReactNode;
  className?: string;
  /** Text alignment. Default "start". */
  align?: "start" | "center";
  /** Where `children` go: below the intro (default) or beside the title block on wide screens. */
  childrenPlacement?: "below" | "aside";
  /** id for the H1 (e.g. for aria-labelledby). */
  titleId?: string;
};

/**
 * Inner-page header: eyebrow + decoding H1 + intro + optional slot. Pads past the fixed
 * site header. tone="dark" = ink with a fine grid and a soft indigo glow; "light" follows
 * the site theme with a faint grid.
 */
export function PageHeader({
  eyebrow,
  index,
  title,
  intro,
  tone = "light",
  children,
  className,
  align = "start",
  childrenPlacement = "below",
  titleId,
}: PageHeaderProps) {
  const dark = tone === "dark";
  const centered = align === "center";
  const aside = childrenPlacement === "aside" && children && !centered;

  return (
    <header
      data-slot="page-header"
      data-tone={tone}
      className={cn(
        "relative isolate overflow-hidden border-b border-line",
        "pt-[calc(var(--header-h)+clamp(3.5rem,2rem+6vw,7.5rem))] pb-[clamp(3.5rem,2.5rem+4vw,6.5rem)]",
        dark ? "section-dark" : "bg-background text-foreground",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-grid",
          dark ? "opacity-100" : "opacity-80",
        )}
        style={{
          maskImage: "radial-gradient(ellipse 80% 75% at 50% 0%, #000 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 50% 0%, #000 25%, transparent 75%)",
        }}
      />
      {dark ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/3 left-1/2 -z-10 aspect-square w-[min(60rem,140vw)] -translate-x-1/2 rounded-full opacity-[0.18] blur-3xl"
          style={{ background: "radial-gradient(closest-side, #5b4cf5, rgb(34 211 238 / 0.35) 55%, transparent)" }}
        />
      ) : null}

      <Container
        className={cn(
          aside && "lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16",
        )}
      >
        <div className={cn("flex max-w-4xl flex-col gap-6", centered && "mx-auto items-center text-center")}>
          {eyebrow ? <Eyebrow index={index}>{eyebrow}</Eyebrow> : null}
          <DecodeText as="h1" id={titleId} trigger="mount" className="text-display-lg text-foreground">
            {title}
          </DecodeText>
          {intro ? (
            <div className={cn("max-w-2xl text-body-lg text-muted-foreground", centered && "mx-auto")}>{intro}</div>
          ) : null}
        </div>
        {children ? (
          <div className={cn(aside ? "mt-10 lg:mt-0" : "mt-10 md:mt-12", centered && "flex justify-center")}>
            {children}
          </div>
        ) : null}
      </Container>
    </header>
  );
}
