import { getTestimonials } from "@/lib/content";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/section";
import { parseEyebrow } from "./showcase/section-utils";
import { TestimonialCarousel, type TestimonialSlide } from "./testimonials/testimonial-carousel";

/**
 * 08 — Testimonials (light). Auto-sliding quotes from content/testimonials.json.
 * Entries keep their "[Placeholder]" markers until real, approved quotes exist.
 */
export function Testimonials() {
  const slides: TestimonialSlide[] = getTestimonials().map((t) => ({
    id: t.id,
    quote: t.quote,
    name: t.name,
    role: t.role,
    company: t.company,
    avatar: t.avatar,
  }));
  if (slides.length === 0) return null;

  const copy = site.sections.testimonials;
  const eyebrow = parseEyebrow(copy.eyebrow);

  return (
    <Section id="testimonials" eyebrow={eyebrow.label} index={eyebrow.index} title={copy.heading}>
      <TestimonialCarousel slides={slides} label={copy.heading.replace(/\.$/, "")} />
    </Section>
  );
}
