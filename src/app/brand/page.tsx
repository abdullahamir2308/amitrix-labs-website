import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LatticeLockup, LOGO_CONCEPTS, type LogoConcept } from "@/components/brand/logos";
import { PALETTES, paletteVars, type Palette } from "@/components/brand/tokens";

// Hidden review page: not linked from the main navigation and not indexed.
export const metadata: Metadata = {
  title: "Brand starter",
  description: "Internal review page: logo concepts, palettes and type for Amitrix Labs.",
  robots: { index: false, follow: false },
};

const CHOSEN = { concept: "01", palette: "lab" as Palette["id"] };

export default function BrandPage() {
  return (
    <div className="flex-1 bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            <LatticeLockup className="h-7 w-auto" />
          </Link>
          <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            Brand starter · internal
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-32">
        <Intro />
        <LogoSection />
        <PaletteSection />
        <TypeSection />
        <ComponentSection />
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`font-mono text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase ${className}`}
    >
      {children}
    </p>
  );
}

function SectionHeader({ index, label, title, intro }: { index: string; label: string; title: string; intro: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <Eyebrow>{`// ${index} — ${label}`}</Eyebrow>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base text-pretty text-muted-foreground">{intro}</p>
    </div>
  );
}

function SelectedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-indigo/30 bg-brand-indigo/10 px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.12em] text-brand-indigo uppercase dark:text-[#8C7CFF]">
      <span aria-hidden className="size-1.5 rounded-full bg-brand-cyan" />
      Selected
    </span>
  );
}

/** A light or dark panel. `dark` also switches the shadcn tokens via the .dark class. */
function Panel({
  dark = false,
  className = "",
  style,
  children,
}: {
  dark?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={`${dark ? "dark " : ""}rounded-2xl border bg-background text-foreground ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 00 — Intro
// ---------------------------------------------------------------------------

function Intro() {
  return (
    <section className="py-16 sm:py-24">
      <Eyebrow>{"// 00 — Brand starter"}</Eyebrow>
      <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-balance sm:text-7xl">
        Logo, colour and type for Amitrix Labs.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
        Four original logo concepts, three palettes and the type system, side by side on light and
        dark. This page is hidden from search and navigation.
      </p>
      <div className="mt-10 grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
        <div>
          <Eyebrow>Current choice</Eyebrow>
          <p className="mt-2 text-lg font-medium">
            Logo concept 01 — Lattice A · Palette Lab (default)
          </p>
        </div>
        <p className="text-sm text-muted-foreground sm:text-right">
          Applied as the default. To swap, say:{" "}
          <span className="font-mono text-foreground">
            &ldquo;I pick logo concept #n and palette X&rdquo;
          </span>
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 01 — Logo concepts
// ---------------------------------------------------------------------------

function LogoSection() {
  return (
    <section className="border-t py-20">
      <SectionHeader
        index="01"
        label="Logo concepts"
        title="Four marks, each with a wordmark and lockup."
        intro="Every mark sits on a 32-unit grid with a 2.25 stroke, uses currentColor for the main artwork and indigo / cyan as accents. Shown large, then at favicon size."
      />
      <div className="space-y-16">
        {LOGO_CONCEPTS.map((c) => (
          <LogoConceptBlock key={c.number} concept={c} />
        ))}
      </div>
    </section>
  );
}

function LogoConceptBlock({ concept }: { concept: LogoConcept }) {
  const { number, name, description, Mark, Wordmark, Lockup } = concept;
  return (
    <article aria-labelledby={`concept-${number}`}>
      <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="font-mono text-sm text-muted-foreground">{number}</span>
        <h3 id={`concept-${number}`} className="text-2xl font-semibold tracking-tight">
          {name}
        </h3>
        {number === CHOSEN.concept && <SelectedBadge />}
      </div>
      <p className="mb-6 max-w-2xl text-sm text-pretty text-muted-foreground">{description}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        {[false, true].map((dark) => (
          <Panel key={String(dark)} dark={dark} className="overflow-hidden">
            <div className="flex min-h-56 items-center justify-center bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[24px_24px] px-8 py-14">
              <Lockup className="h-12 w-auto max-w-full sm:h-16" />
            </div>
            <div className="grid grid-cols-[auto_1fr] items-center gap-8 border-t px-8 py-8">
              <Mark className="size-28" />
              <div className="space-y-6">
                <Wordmark className="h-6 w-auto max-w-full" preserveAspectRatio="xMinYMid meet" />
                <SmallSizes Mark={Mark} />
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </article>
  );
}

function SmallSizes({ Mark }: { Mark: LogoConcept["Mark"] }) {
  const sizes = [
    { label: "32px", el: <Mark aria-hidden className="size-8" /> },
    { label: "16px", el: <Mark aria-hidden className="size-4" /> },
    {
      label: "Tile 32",
      el: (
        <span className="flex size-8 items-center justify-center rounded-[7px] bg-ink text-paper ring-1 ring-white/10">
          <Mark aria-hidden className="size-6" />
        </span>
      ),
    },
  ];
  return (
    <ul className="flex flex-wrap items-end gap-6" aria-label="Small sizes">
      {sizes.map((s) => (
        <li key={s.label} className="flex flex-col items-center gap-2">
          <span className="flex h-8 items-center">{s.el}</span>
          <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            {s.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// 02 — Palettes
// ---------------------------------------------------------------------------

function PaletteSection() {
  return (
    <section className="border-t py-20">
      <SectionHeader
        index="02"
        label="Palettes"
        title="Lab, plus two alternatives to compare."
        intro="Each palette shown as swatches on its own light and dark base. Hex codes are the source values; contrast was checked against WCAG AA for text pairings."
      />
      <div className="space-y-14">
        {PALETTES.map((p) => (
          <div key={p.id}>
            <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">{p.name}</h3>
              {p.id === CHOSEN.palette && <SelectedBadge />}
            </div>
            <p className="mb-6 max-w-2xl text-sm text-muted-foreground">{p.note}</p>
            <div className="grid gap-4 lg:grid-cols-2">
              {(["light", "dark"] as const).map((mode) => (
                <Panel key={mode} dark={mode === "dark"} style={paletteVars(p[mode])} className="p-5">
                  <Eyebrow className="mb-4">{mode === "light" ? "On light" : "On dark"}</Eyebrow>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {p.swatches.map((s) => (
                      <li key={s.name} className="overflow-hidden rounded-xl border bg-card">
                        <div className="h-16 border-b" style={{ backgroundColor: s.hex }} />
                        <div className="px-3 py-2.5">
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">{s.hex}</p>
                          <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                            {s.role}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Panel>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 03 — Type
// ---------------------------------------------------------------------------

const DISPLAY = [
  { label: "Display XL · 72 / 1.0 · −4%", className: "text-5xl sm:text-7xl leading-none tracking-[-0.04em] font-semibold" },
  { label: "Display L · 56 / 1.05 · −3.5%", className: "text-4xl sm:text-[56px] leading-[1.05] tracking-[-0.035em] font-semibold" },
  { label: "Heading 1 · 40 / 1.1 · −3%", className: "text-3xl sm:text-[40px] leading-[1.1] tracking-[-0.03em] font-semibold" },
  { label: "Heading 2 · 28 / 1.2 · −2%", className: "text-[28px] leading-[1.2] tracking-[-0.02em] font-semibold" },
];

const BODY = [
  { label: "Body L · 18 / 1.6", className: "text-lg leading-[1.6]" },
  { label: "Body · 16 / 1.6", className: "text-base leading-[1.6]" },
  { label: "Small · 14 / 1.5", className: "text-sm leading-normal" },
];

const MONO = ["// 01 — Services", "// 02 — Products", "// 03 — Work", "v2.4.0 · 99.9% · 0.42s"];

function TypeSection() {
  return (
    <section className="border-t py-20">
      <SectionHeader
        index="03"
        label="Type"
        title="Geist Sans for words, Geist Mono for labels."
        intro="Display sizes are tight-tracked and semibold; body copy stays at default tracking. Mono is reserved for uppercase eyebrows, numbers and code."
      />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8 rounded-2xl border bg-card p-8">
          {DISPLAY.map((d) => (
            <div key={d.label}>
              <Eyebrow className="mb-2 text-[11px]">{d.label}</Eyebrow>
              <p className={d.className}>Software and AI that actually ships.</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="space-y-6 rounded-2xl border bg-card p-8">
            {BODY.map((b) => (
              <div key={b.label}>
                <Eyebrow className="mb-2 text-[11px]">{b.label}</Eyebrow>
                <p className={`${b.className} text-pretty`}>
                  We design, build and run custom software, AI agents and automation for teams in every industry.
                </p>
              </div>
            ))}
          </div>
          <Panel dark className="space-y-4 p-8">
            <Eyebrow className="text-[11px]">Mono · 12 · +16% · uppercase</Eyebrow>
            {MONO.map((m) => (
              <p key={m} className="font-mono text-xs font-medium tracking-[0.16em] uppercase">
                {m}
              </p>
            ))}
          </Panel>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 04 — Components per palette
// ---------------------------------------------------------------------------

function ComponentSection() {
  return (
    <section className="border-t py-20">
      <SectionHeader
        index="04"
        label="Components"
        title="Buttons, a card and a section heading in each palette."
        intro="Each block scopes the palette as CSS variables, so the stock shadcn/ui Button and Card pick it up without extra props."
      />
      <div className="space-y-14">
        {PALETTES.map((p) => (
          <div key={p.id}>
            <h3 className="mb-5 text-2xl font-semibold tracking-tight">{p.name}</h3>
            <div className="grid gap-4 lg:grid-cols-2">
              {(["light", "dark"] as const).map((mode) => (
                <Panel
                  key={mode}
                  dark={mode === "dark"}
                  style={paletteVars(p[mode])}
                  className="p-8"
                >
                  <SampleSection />
                </Panel>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SampleSection() {
  return (
    <div>
      <p className="flex items-center gap-2 font-mono text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
        <span aria-hidden className="size-1.5 rounded-[1px] bg-(--signal)" />
        {"// 01 — Services"}
      </p>
      <h4 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance">
        Software and AI that actually ships.
      </h4>
      <p className="mt-3 max-w-md text-sm text-pretty text-muted-foreground">
        [Placeholder] Custom platforms, AI agents and automation — designed, built and run by one
        senior team.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="lg" className="h-10 px-4">
          Book a call <span aria-hidden>→</span>
        </Button>
        <Button size="lg" variant="secondary" className="h-10 px-4">
          See our work
        </Button>
        <Button size="lg" variant="ghost" className="h-10 px-4">
          Learn more
        </Button>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            AI agents
          </p>
          <CardTitle className="text-lg font-semibold tracking-tight">
            [Placeholder] Support triage agent
          </CardTitle>
          <CardDescription>
            Routes, drafts and resolves tickets with a human in the loop.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span aria-hidden className="size-2 rounded-full bg-(--signal)" />
            Live in production
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <span className="font-mono text-xs text-muted-foreground">Case study</span>
          <span className="text-sm font-medium underline decoration-(--signal) decoration-2 underline-offset-4">Read more →</span>
        </CardFooter>
      </Card>
    </div>
  );
}
