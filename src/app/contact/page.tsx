import type { Metadata } from "next";
import { Globe, MapPin } from "lucide-react";
import { CtaPanel } from "@/components/sections/cta-panel";
import { PageHeader } from "@/components/sections/page-header";
import { BookingPanel } from "@/components/sections/contact/booking-panel";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getServices } from "@/lib/content";
import { getCalLink, isPlaceholderCalLink } from "@/lib/env";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PAGE = site.pages.contact;

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: PAGE.description,
  path: "/contact",
});

export default function ContactPage() {
  const services = getServices().map((s) => ({ value: s.slug, label: s.title }));
  const calLink = getCalLink();
  const { email, location, locationNote, responseTime } = site.contact;

  return (
    <>
      <PageHeader
        eyebrow={PAGE.eyebrow}
        title={PAGE.title}
        intro={`${PAGE.introLead} ${responseTime}`}
      />

      <section aria-label="Contact options" className="pt-10 pb-section md:pt-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
            <div className="flex flex-col gap-8 rounded-3xl border border-line bg-card p-5 shadow-card sm:p-8 lg:p-10">
              <div className="flex flex-col gap-3">
                <Eyebrow>{PAGE.form.eyebrow}</Eyebrow>
                <h2 className="text-heading-md text-foreground">{PAGE.form.heading}</h2>
              </div>
              <ContactForm services={services} email={email} />
            </div>

            <div className="flex flex-col gap-6">
              <BookingPanel calLink={calLink} placeholder={isPlaceholderCalLink(calLink)} email={email} />

              <div className="section-dark relative isolate flex flex-col gap-6 overflow-hidden rounded-3xl border border-line p-6 sm:p-8">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60 mask-fade-radial" />
                <div className="flex flex-col gap-2">
                  <Eyebrow>{PAGE.details.emailLabel}</Eyebrow>
                  <a
                    href={`mailto:${email}`}
                    className="w-fit text-[clamp(1.375rem,1.1rem+1.2vw,2rem)] font-semibold tracking-[-0.03em] break-all text-foreground decoration-highlight decoration-1 underline-offset-[0.2em] transition-colors hover:text-highlight hover:underline"
                  >
                    {email}
                  </a>
                </div>
                <dl className="grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
                  {/* dt/dd must be direct children of the <dl> or of a <div> inside it: the icon sits in the dt. */}
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-label text-muted-foreground">
                      <MapPin aria-hidden="true" className="size-4 shrink-0 text-signal" />
                      {PAGE.details.basedInLabel}
                    </dt>
                    <dd className="mt-1 pl-6 text-body-sm text-foreground">{location}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-label text-muted-foreground">
                      <Globe aria-hidden="true" className="size-4 shrink-0 text-signal" />
                      {PAGE.details.workingWithLabel}
                    </dt>
                    <dd className="mt-1 pl-6 text-body-sm text-foreground">{locationNote}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CtaPanel
        title={PAGE.closingCta.title}
        intro={PAGE.closingCta.intro}
        primaryLabel={site.ctaLabels.seeWork}
        primaryHref="/work"
      />
    </>
  );
}
