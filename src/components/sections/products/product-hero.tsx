import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/cards/status-badge";
import { WindowFrame } from "@/components/cards/window-frame";
import { DecodeText, Magnetic, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Product } from "@/lib/content";
import { TiltFrame } from "./tilt-frame";

/** Launch-page hero: logo, status, name, tagline, CTAs, then the screenshot in a 3D frame. */
export function ProductHero({ product }: { product: Product }) {
  const ctaLabel = product.ctaLabel ?? "Get started";
  const external = /^https?:\/\//.test(product.ctaUrl);
  return (
    <section className="section-dark relative isolate overflow-hidden pt-32 pb-section-sm md:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-radial"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[38%] left-1/2 -z-10 h-[46rem] w-[min(70rem,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(91_76_245/0.28),transparent)]"
      />
      <Container>
        <Link
          href="/products"
          className="group/back inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-3.5 transition-transform duration-300 ease-expo-out group-hover/back:-translate-x-0.5"
          />
          All products
        </Link>

        <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center text-center md:mt-14">
          <Reveal className="flex flex-col items-center gap-5" y={12}>
            <Image
              src={product.logo}
              alt=""
              width={64}
              height={64}
              priority
              className="size-14 rounded-2xl ring-1 ring-white/10 shadow-glow-indigo md:size-16"
            />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <StatusBadge status={product.status} />
              <span className="eyebrow">{product.category}</span>
            </div>
          </Reveal>
          <DecodeText
            as="h1"
            trigger="mount"
            className="mt-7 text-display-xl text-foreground"
          >
            {product.name}
          </DecodeText>
          <Reveal delay={0.15} className="mt-6 max-w-2xl">
            <p className="text-body-lg text-muted-foreground">
              {product.tagline}
            </p>
          </Reveal>
          <Reveal
            delay={0.25}
            className="mt-9 flex flex-col items-center gap-4"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                {external ? (
                  <Button
                    size="lg"
                    variant="primary"
                    withArrow
                    nativeButton={false}
                    render={
                      <a
                        href={product.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    {ctaLabel}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="primary"
                    withArrow
                    href={product.ctaUrl}
                  >
                    {ctaLabel}
                  </Button>
                )}
              </Magnetic>
              {product.features.length ? (
                <Button size="lg" variant="secondary" href="#features">
                  See features
                </Button>
              ) : null}
            </div>
            {product.pricingNote ? (
              <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
                {product.pricingNote}
              </p>
            ) : null}
          </Reveal>
        </div>

        <TiltFrame className="mx-auto mt-14 max-w-6xl md:mt-20">
          <WindowFrame label={product.category}>
            <Image
              src={product.heroImage}
              alt={`${product.name} — product screenshot`}
              priority
              placeholder={product.heroImage.blurDataURL ? "blur" : "empty"}
              sizes="(min-width: 1280px) 72rem, 100vw"
              className="h-auto w-full"
            />
          </WindowFrame>
        </TiltFrame>
      </Container>
    </section>
  );
}
