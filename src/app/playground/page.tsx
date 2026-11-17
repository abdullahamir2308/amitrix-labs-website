import type { Metadata } from "next";
import Link from "next/link";
import { LatticeLockup, LatticeMark } from "@/components/brand/logos";
import {
  Counter,
  CustomCursor,
  DecodeText,
  Magnetic,
  Marquee,
  Reveal,
  SpotlightCard,
  TextReveal,
} from "@/components/motion";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import { ComponentPanel, Group } from "./_components/showcase";

// Internal review page for the Phase 3 design system. Not linked, not indexed.
export const metadata: Metadata = {
  title: "Playground",
  description: "Internal review page: design tokens, base UI and motion primitives.",
  robots: { index: false, follow: false },
};

const BRAND = [
  { name: "Paper", token: "paper", hex: "#FAFAF9", className: "bg-paper" },
  { name: "Ink", token: "ink", hex: "#0A0A12", className: "bg-ink" },
  { name: "Indigo", token: "indigo", hex: "#5B4CF5", className: "bg-indigo" },
  { name: "Cyan", token: "cyan", hex: "#22D3EE", className: "bg-cyan" },
  { name: "Slate", token: "slate", hex: "#64748B", className: "bg-slate" },
];

const SEMANTIC = [
  { token: "background", className: "bg-background" },
  { token: "surface", className: "bg-surface" },
  { token: "card", className: "bg-card" },
  { token: "muted", className: "bg-muted" },
  { token: "line", className: "bg-line" },
  { token: "line-strong", className: "bg-line-strong" },
  { token: "foreground", className: "bg-foreground" },
  { token: "muted-fg", className: "bg-muted-foreground" },
  { token: "primary", className: "bg-primary" },
  { token: "highlight", className: "bg-highlight" },
  { token: "signal", className: "bg-signal" },
  { token: "ring", className: "bg-ring" },
];

const TYPE_SCALE = [
  { token: "display-2xl", cls: "text-display-2xl", sample: "Ships." },
  { token: "display-xl", cls: "text-display-xl", sample: "Software that ships" },
  { token: "display-lg", cls: "text-display-lg", sample: "Software and AI that ships" },
  { token: "display-md", cls: "text-display-md", sample: "We build software and AI that actually ships." },
  { token: "heading-lg", cls: "text-heading-lg", sample: "Custom software, AI agents and automation" },
  { token: "heading-md", cls: "text-heading-md", sample: "Web platforms, SaaS and mobile apps" },
  { token: "heading-sm", cls: "text-heading-sm", sample: "From first call to production" },
  { token: "body-lg", cls: "text-body-lg", sample: "Lead paragraph. We design, build and run products for teams in every industry." },
  { token: "body", cls: "text-body", sample: "Body copy. Clear, short sentences with room to breathe and a comfortable measure." },
  { token: "body-sm", cls: "text-body-sm", sample: "Small body for dense UI, card descriptions and secondary detail." },
  { token: "caption", cls: "text-caption", sample: "Caption — image credits, footnotes, timestamps." },
  { token: "label", cls: "text-label", sample: "Mono label · 01 / 06" },
] as const;

const SHADOWS = ["shadow-soft", "shadow-card", "shadow-elevated", "shadow-glow-indigo", "shadow-glow-cyan", "shadow-glow-indigo-lg"];

const MARQUEE_ITEMS = ["AI agents", "Automation", "Web platforms", "SaaS", "Mobile apps", "Data pipelines", "LLM integration", "Design systems"];

export default function PlaygroundPage() {
  return (
    <div className="flex-1">
      <CustomCursor />

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur-md">
        <Container size="wide" className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Amitrix Labs home" className="rounded-sm">
              <LatticeLockup className="h-6 w-auto" />
            </Link>
            <span className="hidden text-label text-muted-foreground sm:inline">Playground · internal</span>
          </div>
          <nav aria-label="Playground sections" className="hidden items-center gap-1 lg:flex">
            {[
              ["#tokens", "Tokens"],
              ["#type", "Type"],
              ["#backgrounds", "Backgrounds"],
              ["#components", "Components"],
              ["#motion", "Motion"],
              ["#sections", "Sections"],
            ].map(([href, label]) => (
              <Button key={href} href={href} variant="ghost" size="sm">
                {label}
              </Button>
            ))}
          </nav>
          <ThemeToggle />
        </Container>
      </header>

      {/* Hero (forced dark) */}
      <section className="section-dark relative isolate overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid mask-fade-radial" />
        <div
          aria-hidden="true"
          className="absolute top-[-20%] left-1/2 -z-10 size-[44rem] -translate-x-1/2 rounded-full bg-indigo/25 blur-[120px]"
        />
        <div aria-hidden="true" className="grain-local -z-10" />
        <Container className="flex flex-col items-start gap-8 py-section-lg">
          <Eyebrow index="00">
            <DecodeText trigger="mount">Design system + motion</DecodeText>
          </Eyebrow>
          <TextReveal as="h1" trigger="mount" className="max-w-4xl text-display-xl">
            The foundation every Amitrix page is built on.
          </TextReveal>
          <Reveal delay={0.3}>
            <p className="max-w-2xl text-body-lg text-muted-foreground">
              Tokens, base UI and motion primitives in one place. Toggle the theme at the top: light
              blocks follow it, dark blocks stay ink — the hybrid look.
            </p>
          </Reveal>
          <Reveal delay={0.45} className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button href="#components" variant="primary" size="lg" withArrow>
                See components
              </Button>
            </Magnetic>
            <Button href="#motion" variant="secondary" size="lg">
              Motion primitives
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* 01 Tokens */}
      <Section id="tokens" index="01" eyebrow="Tokens" title="Colour" intro="Brand primitives never change. Semantic tokens swap between paper and ink.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {BRAND.map((c) => (
            <div key={c.token} className="overflow-hidden rounded-xl border border-line bg-card">
              <div className={cn("h-24 border-b border-line", c.className)} />
              <div className="flex flex-col gap-0.5 p-3">
                <span className="text-heading-sm">{c.name}</span>
                <span className="font-mono text-caption text-muted-foreground">
                  {c.hex} · {c.token}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <SemanticSwatches tone="light" />
          <SemanticSwatches tone="dark" />
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <Group title="Radius">
            <div className="flex flex-wrap items-end gap-4">
              {["rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-full"].map((r) => (
                <div key={r} className="flex flex-col items-center gap-2">
                  <div className={cn("size-16 border border-line-strong bg-surface", r)} />
                  <span className="font-mono text-caption text-muted-foreground">{r.replace("rounded-", "")}</span>
                </div>
              ))}
            </div>
          </Group>
          <Group title="Shadows">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {SHADOWS.map((s) => (
                <div
                  key={s}
                  className={cn("flex h-20 items-end rounded-xl bg-card p-3 font-mono text-caption text-muted-foreground", s)}
                >
                  {s.replace("shadow-", "")}
                </div>
              ))}
            </div>
          </Group>
        </div>
      </Section>

      {/* 02 Type */}
      <Section id="type" index="02" eyebrow="Type" title="Fluid type scale" intro="Geist Sans and Geist Mono. Every step is a clamp() between 360px and 1440px viewports — resize to see it flex." className="border-t border-line">
        <div className="flex flex-col divide-y divide-line border-y border-line">
          {TYPE_SCALE.map(({ token, cls, sample }) => (
            <div key={token} className="grid gap-2 py-5 md:grid-cols-[11rem_1fr] md:items-baseline md:gap-8">
              <span className="font-mono text-caption text-muted-foreground">text-{token}</span>
              <span className={cn(cls, "min-w-0 break-words")}>{sample}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 03 Backgrounds */}
      <Section id="backgrounds" index="03" eyebrow="Backgrounds" title="Grid, grain, eyebrow" className="border-t border-line">
        <div className="grid gap-4 md:grid-cols-2">
          {(["light", "dark"] as const).map((tone) => (
            <div
              key={tone}
              data-theme-section={tone === "dark" ? "dark" : undefined}
              className="grid grid-cols-2 gap-3 rounded-3xl border border-line bg-background p-3"
            >
              {[
                ["bg-grid", "bg-grid"],
                ["bg-grid-fine", "bg-grid-fine"],
                ["bg-dots", "bg-dots"],
                ["bg-grid mask-fade-radial", "bg-grid + mask"],
              ].map(([cls, label]) => (
                <div key={label} className="relative h-36 overflow-hidden rounded-2xl border border-line bg-surface">
                  <div aria-hidden="true" className={cn("absolute inset-0", cls)} />
                  <span className="absolute bottom-3 left-3 text-label text-muted-foreground">{label}</span>
                </div>
              ))}
              <div className="relative col-span-2 flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface">
                <div aria-hidden="true" className="grain-local opacity-[0.35]!" />
                <span className="relative text-label text-muted-foreground">grain (exaggerated ×6)</span>
              </div>
              <div className="col-span-2 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
                <Eyebrow index="01">Services</Eyebrow>
                <Eyebrow index={4}>Case studies</Eyebrow>
                <Eyebrow>No index</Eyebrow>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 04 Components: light and dark side by side */}
      <Section id="components" index="04" eyebrow="Base UI" title="Components" intro="The same components in a theme-following block and a forced-dark block." className="border-t border-line" container="wide">
        <div className="grid gap-6 xl:grid-cols-2">
          <ComponentPanel tone="light" />
          <ComponentPanel tone="dark" />
        </div>
      </Section>

      {/* 05 Motion */}
      <Section id="motion" index="05" eyebrow="Motion" title="Motion primitives" intro="Every primitive renders its final content on the server and has a static fallback under prefers-reduced-motion." className="border-t border-line">
        <div className="flex flex-col gap-20">
          <Demo name="<Reveal>" props="delay, stagger, y, duration, once, amount, as, itemAs">
            <Reveal stagger={0.08} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {["Discover", "Design", "Build", "Run"].map((step, i) => (
                <div key={step} className="flex h-full flex-col gap-6 rounded-2xl border border-line bg-card p-5 shadow-card">
                  <span className="font-mono text-caption text-highlight">0{i + 1}</span>
                  <span className="text-heading-sm">{step}</span>
                </div>
              ))}
            </Reveal>
          </Demo>

          <Demo name="<TextReveal>" props="as, delay, stagger, duration, trigger">
            <TextReveal as="h3" className="max-w-4xl text-display-lg">
              Lines rise out of a mask, one after another, and re-split when the viewport changes.
            </TextReveal>
          </Demo>

          <Demo name="<DecodeText>" props="as, trigger (inView | mount | hover), duration, delay, chars">
            <div className="flex flex-col gap-4">
              <DecodeText as="p" className="text-display-md">
                Software and AI that actually ships.
              </DecodeText>
              <DecodeText as="p" trigger="hover" className="w-fit cursor-default font-mono text-body-lg text-highlight">
                {"> hover me to decode again_"}
              </DecodeText>
            </div>
          </Demo>

          <Demo name="<Magnetic>" props="strength, max, disabled">
            <div className="flex flex-wrap items-center gap-6">
              <Magnetic>
                <Button variant="primary" size="xl" withArrow>
                  Book a call
                </Button>
              </Magnetic>
              <Magnetic strength={0.5}>
                <Button variant="secondary" size="icon-lg" aria-label="Lattice">
                  <LatticeMark className="size-5" />
                </Button>
              </Magnetic>
            </div>
          </Demo>

          <Demo name="<Counter>" props="value, from, decimals, prefix, suffix, duration, delay, locale">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
              {[
                { value: 48, suffix: "+", label: "[Placeholder] projects" },
                { value: 99.9, decimals: 1, suffix: "%", label: "[Placeholder] uptime" },
                { value: 12000, prefix: "$", label: "[Placeholder] saved / mo" },
                { value: 6, suffix: " wks", label: "[Placeholder] to launch" },
              ].map(({ label, ...props }) => (
                <div key={label} className="flex flex-col gap-2 bg-card p-6">
                  <Counter {...props} className="text-display-md" />
                  <span className="text-label text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </Demo>

          <Demo name="<Marquee>" props="duration, direction, hoverSpeed, gap, copies, fade, label">
            <div className="flex flex-col gap-4">
              <Marquee label="Capabilities" duration={35}>
                {MARQUEE_ITEMS.map((item) => (
                  <span key={item} className="flex items-center gap-3 text-heading-lg whitespace-nowrap text-muted-foreground">
                    <LatticeMark className="size-5 text-highlight" />
                    {item}
                  </span>
                ))}
              </Marquee>
              <Marquee direction="right" duration={45} gap="0.75rem">
                {MARQUEE_ITEMS.map((item) => (
                  <Badge key={item} variant="mono">
                    {item}
                  </Badge>
                ))}
              </Marquee>
            </div>
          </Demo>

          <Demo name="<SpotlightCard>" props="color (indigo | cyan | css), size, …div props">
            <div className="grid gap-4 md:grid-cols-3">
              {(["indigo", "cyan", "indigo"] as const).map((color, i) => (
                <SpotlightCard key={i} color={color} className="flex min-h-48 flex-col justify-between gap-8 p-6">
                  <Badge variant={i === 1 ? "cyan" : "indigo"}>{color}</Badge>
                  <div className="flex flex-col gap-2">
                    <span className="text-heading-sm">Move the cursor over me</span>
                    <span className="text-body-sm text-muted-foreground">The border glow tracks the pointer.</span>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </Demo>

          <Demo name="<CustomCursor>" props="hideNative · targets: a, button, [data-cursor], [data-cursor=view], img">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-line-strong text-body-sm text-muted-foreground">
                Default: dot + ring
              </div>
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-line-strong">
                <Button variant="secondary" size="md">
                  Hover: ring grows
                </Button>
              </div>
              <div
                data-cursor="view"
                className="section-dark relative flex h-48 items-end overflow-hidden rounded-2xl p-5"
              >
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(91_76_245/0.55),transparent_60%),radial-gradient(circle_at_80%_90%,rgb(34_211_238/0.35),transparent_55%)]" />
                <div aria-hidden="true" className="absolute inset-0 bg-grid-fine" />
                <span className="relative text-label text-muted-foreground">data-cursor=&quot;view&quot;</span>
              </div>
            </div>
          </Demo>
        </div>
      </Section>

      {/* 06 Section component */}
      <div id="sections" className="border-t border-line">
        <Section
          index="06"
          eyebrow="Section · tone=light"
          title="Consistent rhythm, any tone."
          intro="Section takes tone, eyebrow, index, title, intro, id, align, spacing, container and grid. Light follows the site theme."
          actions={
            <Button variant="secondary" size="md" withArrow>
              Action slot
            </Button>
          }
          grid
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 rounded-2xl border border-dashed border-line-strong bg-card/60" />
            ))}
          </div>
        </Section>
        <Section
          tone="dark"
          index="07"
          eyebrow="Section · tone=dark"
          title="Products and AI work live in ink."
          intro="tone=dark forces the ink palette whatever the site theme is, so the hybrid look holds in light mode."
          align="center"
          grid
        >
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="lg" withArrow>
              Book a call
            </Button>
            <Button variant="secondary" size="lg">
              See our work
            </Button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function SemanticSwatches({ tone }: { tone: "light" | "dark" }) {
  return (
    <div
      data-theme-section={tone === "dark" ? "dark" : undefined}
      className="rounded-2xl border border-line bg-background p-5"
    >
      <p className="mb-4 text-label text-muted-foreground">
        {tone === "dark" ? "Semantic · forced dark" : "Semantic · follows theme"}
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {SEMANTIC.map((s) => (
          <div key={s.token} className="flex flex-col gap-1.5">
            <div className={cn("h-10 rounded-lg border border-line", s.className)} />
            <span className="truncate font-mono text-[0.6875rem] text-muted-foreground">{s.token}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Demo({ name, props, children }: { name: string; props: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-line pb-3 sm:flex-row sm:items-baseline sm:justify-between">
        <code className="font-mono text-body-sm text-foreground">{name}</code>
        <span className="font-mono text-caption text-muted-foreground">{props}</span>
      </div>
      {children}
    </div>
  );
}
