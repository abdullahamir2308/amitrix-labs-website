import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LatticeLockup } from "@/components/brand/logos";
import { SocialIcon } from "@/components/icons/social-icons";
import { getProducts, getServices } from "@/lib/content";
import { site, type NavLink } from "@/lib/site";
import { BackToTop } from "./back-to-top";
import { BookingStatus } from "./booking-status";
import { FooterNewsletter } from "./footer-newsletter";
import { FooterWordmark } from "./footer-wordmark";
import { FooterYear } from "./footer-year";

/** Site footer: always ink. Columns from site.footer (+ products/services from /content). */
export function Footer() {
  const extra = {
    products: getProducts().map((p) => ({ label: p.name, href: p.url })),
    services: getServices().map((s) => ({ label: s.shortTitle, href: s.url })),
  };
  const columns = site.footer.columns.map((col) => ({
    title: col.title,
    links: [...col.links, ...("from" in col && col.from ? extra[col.from] : [])] as NavLink[],
  }));

  return (
    <footer className="section-dark relative isolate overflow-hidden border-t border-line" data-site-footer="">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[28rem] w-[60rem] max-w-full -translate-x-1/2 translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(91 76 245 / 0.55), transparent)" }}
      />

      <div className="mx-auto w-full max-w-site px-gutter pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          {/* Brand block */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Link href="/" aria-label="Amitrix Labs — home" className="w-fit rounded-md">
                <LatticeLockup aria-hidden="true" className="h-8 w-auto" />
              </Link>
              <p className="max-w-xs text-body-sm text-muted-foreground">{site.footer.tagline}</p>
            </div>
            <FooterNewsletter copy={site.footer.newsletter} />
            <div className="flex flex-wrap items-center gap-3">
              <ul className="flex items-center gap-2" aria-label="Social">
                {site.social.map((s) => (
                  <li key={s.icon}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${site.name} on ${s.label}`}
                      className="grid size-9 place-items-center rounded-full border border-line bg-surface-raised/60 text-muted-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-[color,border-color] duration-200 hover:border-line-strong hover:text-foreground"
                    >
                      <SocialIcon name={s.icon} className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
              <BookingStatus />
            </div>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {columns.map((col) => (
              <div key={col.title} className="flex min-w-0 flex-col gap-4">
                <h2 className="text-label text-[0.6875rem] text-muted-foreground">{col.title}</h2>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="group/fl inline-flex max-w-full items-start gap-1 text-[0.875rem] leading-snug text-foreground/80 transition-colors duration-200 hover:text-foreground"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="mt-0.5 size-3 shrink-0 -translate-x-1 opacity-0 transition-[opacity,translate] duration-300 ease-expo-out group-hover/fl:translate-x-0 group-hover/fl:opacity-60"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-6 font-mono text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <FooterYear /> {site.footer.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href={`mailto:${site.contact.email}`} className="rounded-sm normal-case tracking-normal transition-colors hover:text-foreground">
              {site.contact.email}
            </a>
            <BackToTop />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-wide px-gutter md:mt-14">
        <FooterWordmark text={site.shortName.toUpperCase()} />
      </div>
    </footer>
  );
}
