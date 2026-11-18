import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Client, Product, ProductStatus } from "@/lib/content";
import { site } from "@/lib/site";

const STATUS: Record<ProductStatus, { label: string; variant: "live" | "beta" | "soon" }> = {
  live: { label: "Live", variant: "live" },
  beta: { label: "Beta", variant: "beta" },
  "coming-soon": { label: "Soon", variant: "soon" },
};

/**
 * Split section: the two halves of the business side by side — our own products (dark half)
 * and client work (light half). Stacks on mobile.
 */
export function ProductsClients({ products, clients }: { products: Product[]; clients: Client[] }) {
  return (
    <section aria-label="Our products and our clients" className="py-section">
      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-3xl border border-line lg:grid-cols-2">
          {/* Our products */}
          <div className="section-dark relative isolate flex flex-col gap-8 p-6 sm:p-10 lg:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-70 mask-fade-radial" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 -left-40 -z-10 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(91_76_245/0.28),transparent_65%)]"
            />
            <div className="flex flex-col gap-4">
              <Eyebrow>Our products</Eyebrow>
              <h2 className="text-heading-lg text-foreground">Software we build, run and use ourselves.</h2>
              <p className="max-w-md text-body text-muted-foreground">{site.sections.products.subheading}</p>
            </div>
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={p.url}
                    className="group/row flex items-center gap-4 py-4 outline-offset-4 transition-colors"
                  >
                    <Image src={p.logo} alt="" width={36} height={36} className="size-9 shrink-0 rounded-lg ring-1 ring-line" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium text-foreground">{p.name}</span>
                      <span className="truncate text-body-sm text-muted-foreground">{p.tagline}</span>
                    </span>
                    <Badge variant={STATUS[p.status].variant} className="hidden sm:inline-flex">
                      {STATUS[p.status].label}
                    </Badge>
                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-expo-out group-hover/row:translate-x-1 group-hover/row:text-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <Button href="/products" variant="secondary" size="md" withArrow>
                {site.ctaLabels.allProducts}
              </Button>
            </div>
          </div>

          {/* Our clients */}
          <div className="relative flex flex-col gap-8 bg-surface-raised p-6 sm:p-10 lg:p-12">
            <div className="flex flex-col gap-4">
              <Eyebrow>Our clients</Eyebrow>
              <h2 className="text-heading-lg text-foreground">Custom software and AI for teams in every industry.</h2>
              <p className="max-w-md text-body text-muted-foreground">{site.sections.services.subheading}</p>
            </div>
            <ul className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-3">
              {clients.slice(0, 6).map((c) => (
                <li
                  key={c.id}
                  className="flex aspect-[3/2] flex-col items-center justify-center gap-2 border-r border-b border-line p-4"
                >
                  <Image
                    src={c.logo}
                    alt={c.name}
                    width={c.logo.width}
                    height={c.logo.height}
                    className="h-7 w-auto max-w-full opacity-60 grayscale dark:invert"
                  />
                  {c.industry ? (
                    <span className="text-center font-mono text-[0.625rem] tracking-[0.14em] text-muted-foreground uppercase">
                      {c.industry}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-3">
              <Button href="/work" variant="primary" size="md" withArrow>
                {site.ctaLabels.seeWork}
              </Button>
              <Button href="/services" variant="ghost" size="md">
                {site.ctaLabels.allServices}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
