import type { Metadata } from "next";
import Link from "next/link";
import { LatticeMotif } from "@/components/brand/lattice-motif";
import { DecodeText } from "@/components/motion/decode-text";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or has moved.",
};

/** Global 404 (also used by notFound()). Server component: only DecodeText ships client JS. */
export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="section-dark relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden py-section"
    >
      <LatticeMotif density="normal" fade className="pointer-events-none absolute inset-0 -z-10 opacity-80" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-60 mask-fade-radial" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[48rem] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(91_76_245/0.22),transparent_62%)]"
      />
      <Container className="flex flex-col items-center gap-8 text-center">
        <p className="font-mono text-label text-muted-foreground">
          <span className="text-highlight">{"//"}</span> Error 404
        </p>
        <p
          aria-hidden="true"
          className="bg-gradient-to-b from-foreground to-foreground/20 bg-clip-text font-mono text-[clamp(6rem,4rem+12vw,13rem)] leading-none font-medium tracking-[-0.06em] text-transparent tabular-nums"
        >
          404
        </p>
        <DecodeText as="h1" id="not-found-title" trigger="mount" className="text-display-md text-foreground">
          Page not found
        </DecodeText>
        <p className="max-w-md text-body-lg text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/" variant="primary" size="lg" withArrow>
            Back to home
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Contact us
          </Button>
        </div>
        <nav aria-label="Popular pages" className="mt-4">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-body-sm text-muted-foreground">
            {[
              { href: "/services", label: "Services" },
              { href: "/products", label: "Products" },
              { href: "/work", label: "Work" },
              { href: "/insights", label: "Insights" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
