import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site, type Stat } from "@/lib/site";
import { Counter } from "@/components/motion/counter";
import { DecodeText } from "@/components/motion/decode-text";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { HeroLattice } from "@/components/sections/hero/hero-lattice";
import { HeroIntro } from "@/components/sections/hero/hero-intro";
import { ScrollCue } from "@/components/sections/hero/scroll-cue";
import { INTRO } from "@/components/sections/hero/intro";
import styles from "@/components/sections/hero/hero.module.css";

const STILL = "/hero/lattice-still.webp";
/** Lower-case scramble pool: glyph widths stay close to the final words, so nothing overlaps. */
const DECODE_POOL = "abcdeghknopqrsuvxyz0123456789/<>_";

/** Split the headline around the highlight word: words before it, the word, and what follows. */
function splitHeadline(headline: string, highlight: string) {
  const at = headline.lastIndexOf(highlight);
  if (at === -1) return { words: headline.split(" "), keyword: "", tail: "" };
  return {
    words: headline.slice(0, at).trim().split(" ").filter(Boolean),
    keyword: highlight,
    tail: headline.slice(at + highlight.length),
  };
}

/** Badge label "// NEW — Rest": the prefix is tinted, the rest is muted. */
function splitBadge(label: string) {
  const [prefix, ...rest] = label.split(" — ");
  return rest.length ? { prefix, rest: rest.join(" — ") } : { prefix: "", rest: label };
}

/**
 * Homepage hero (Phase 5). Server-rendered copy over an ink field; the glowing
 * lattice (WebGL ≥768px, 2D canvas below, WebP still for reduced motion) loads
 * after first paint. The H1 is the LCP element and is visible from the first
 * frame — its words decode in place, nothing hides its box.
 */
export function Hero() {
  const { hero } = site;
  const { words, keyword, tail } = splitHeadline(hero.headline, hero.highlight);
  const badge = splitBadge(hero.badge.label);
  const rise = cn(styles.rise);
  const stats: readonly Stat[] = hero.stats;

  return (
    <section aria-labelledby="hero-title" className={cn("section-dark", styles.hero)}>
      {/* SSR / no-JS state: glow + fine grid. Reduced motion adds the still. */}
      <div aria-hidden="true" className={styles.backdrop}>
        <div className={styles.glow} />
        <div className={cn("bg-grid", styles.grid)} />
        <div className={styles.still}>
          {/* Rendered only for reduced motion (display:none otherwise; lazy so it is not fetched). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={STILL} alt="" width={1280} height={800} loading="lazy" decoding="async" className={styles.stillImg} />
        </div>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={STILL} alt="" width={1280} height={800} className={cn(styles.still, styles.stillImg)} style={{ display: "block" }} />
        </noscript>
      </div>

      <HeroLattice />
      <div aria-hidden="true" className={styles.shade} />

      <HeroIntro className="relative z-10 flex min-h-svh flex-col">
        <Container size="wide" className="flex flex-1 flex-col justify-center pt-28 pb-12 md:pt-32 md:pb-14">
          <div className="max-w-[46rem]">
            <div data-hero-step="badge" data-reveal="" className={rise}>
              <Link
                href={hero.badge.href}
                className="group inline-flex h-7 max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] pr-2.5 pl-3 font-mono text-[0.6875rem] tracking-[0.06em] text-muted-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] transition-[border-color,color,background-color] duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:text-foreground"
              >
                <span aria-hidden="true" className={styles.liveDot} />
                {badge.prefix ? <span className="text-cyan">{badge.prefix}</span> : null}
                {badge.prefix ? (
                  <span aria-hidden="true" className="text-white/25">
                    —
                  </span>
                ) : null}
                <span className="truncate">{badge.rest}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-3.5 shrink-0 transition-transform duration-300 ease-expo-out group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <h1
              id="hero-title"
              className="mt-6 max-w-[12.5em] text-[clamp(2.75rem,1.55rem+4.4vw,5.5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-foreground md:mt-7"
            >
              {words.map((word, i) => (
                <span key={`${word}-${i}`}>
                  <DecodeText trigger="mount" chars={DECODE_POOL} delay={INTRO.headline + i * INTRO.wordStagger} duration={INTRO.wordDuration}>
                    {word}
                  </DecodeText>{" "}
                </span>
              ))}
              {keyword ? (
                <span data-hero-keyword="" className={styles.keyword}>
                  {keyword}
                </span>
              ) : null}
              {tail}
            </h1>

            <p
              data-hero-step="sub"
              data-reveal=""
              className={cn(rise, "mt-6 max-w-[44ch] text-body-lg text-muted-foreground md:mt-7")}
            >
              {hero.subline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-10">
              <div data-hero-step="cta" data-reveal="" className={rise}>
                <Magnetic className="w-full sm:w-auto">
                  <Button href={hero.primaryCta.href} variant="primary" size="lg" withArrow className="w-full sm:w-auto">
                    {hero.primaryCta.label}
                  </Button>
                </Magnetic>
              </div>
              <div data-hero-step="cta" data-reveal="" className={rise}>
                <Button
                  href={hero.secondaryCta.href}
                  variant="secondary"
                  size="lg"
                  className="w-full border-white/12 bg-white/[0.04] backdrop-blur-sm hover:border-white/25 hover:bg-white/[0.07] sm:w-auto"
                >
                  {hero.secondaryCta.label}
                </Button>
              </div>
            </div>
          </div>
        </Container>

        <Container size="wide" className="pb-6 md:pb-8">
          <dl className="grid grid-cols-2 border-t border-white/[0.08] md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                data-hero-step="stat"
                data-reveal=""
                className={cn(
                  rise,
                  "flex flex-col-reverse gap-1.5 py-4 pr-4 md:py-5",
                  i % 2 === 1 && "border-l border-white/[0.08] pl-4",
                  i > 1 && "border-t border-white/[0.08] md:border-t-0",
                  i === 2 && "md:border-l md:pl-4",
                  i > 0 && "md:pl-5",
                )}
              >
                <dt className="font-mono text-[0.6875rem] leading-snug tracking-[0.1em] text-muted-foreground uppercase">
                  {stat.label}
                </dt>
                <dd className="font-mono text-[1.375rem] leading-none tracking-[-0.02em] text-foreground md:text-[1.625rem]">
                  <Counter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    delay={INTRO.counter + i * 0.07}
                    trigger="mount"
                  />
                </dd>
              </div>
            ))}
          </dl>
          <div data-hero-step="cue" data-reveal="" className={cn(rise, "mt-4 hidden justify-center md:flex")}>
            <ScrollCue label={hero.scrollLabel} />
          </div>
        </Container>
      </HeroIntro>
    </section>
  );
}
