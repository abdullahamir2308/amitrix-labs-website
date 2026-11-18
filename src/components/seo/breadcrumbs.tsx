import Link from "next/link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { JsonLd } from "./json-ld";

type BreadcrumbsProps = {
  /** Trail from Home to the current page. The last item is the current page (rendered as text). */
  items: Crumb[];
  /** "dark" for pages that open on an ink hero (forces the ink palette behind the trail). */
  tone?: "auto" | "dark";
  className?: string;
};

/**
 * Small mono breadcrumb trail + the matching BreadcrumbList JSON-LD (one source of truth).
 *
 * It overlays the top padding of the page header (absolute, under the fixed site header), so it
 * never changes the page layout. Render it as the first child of the page fragment, above the
 * header section. Pages that open on a dark hero pass tone="dark": the trail then carries the
 * forced-dark marker, which keeps the site header's tone detection working when it is the
 * first element of the page.
 */
export function Breadcrumbs({ items, tone = "auto", className }: BreadcrumbsProps) {
  const dark = tone === "dark";
  return (
    <>
      <nav
        aria-label="Breadcrumb"
        {...(dark ? { "data-theme-section": "dark" } : {})}
        // A forced-dark marker paints the ink background; the trail must stay see-through.
        style={dark ? { backgroundColor: "transparent" } : undefined}
        className={cn(
          "pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+0.875rem)] z-10 md:top-[calc(var(--header-h)+1.25rem)]",
          className,
        )}
      >
        <Container>
          <ol className="pointer-events-auto flex w-fit max-w-full min-w-0 items-center gap-2 font-mono text-[0.6875rem] leading-5 tracking-[0.12em] text-muted-foreground uppercase">
            {items.map((item, i) => {
              const last = i === items.length - 1;
              return last ? (
                <li key={item.href} aria-current="page" className="min-w-0 truncate text-foreground">
                  {item.name}
                </li>
              ) : (
                <li key={item.href} className="flex shrink-0 items-center gap-2">
                  <Link
                    href={item.href}
                    className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="opacity-50">
                    /
                  </span>
                </li>
              );
            })}
          </ol>
        </Container>
      </nav>
      {/* After the <nav>: a leading <script> would stop the nav being the page's first element. */}
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}
