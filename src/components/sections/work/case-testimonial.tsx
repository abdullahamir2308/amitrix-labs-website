import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Section } from "@/components/ui/section";
import type { Testimonial } from "@/lib/content";

/** One large client quote with avatar, name, role and company. */
export function CaseTestimonial({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Section aria-label="Client testimonial" className="border-t border-line">
      <Reveal>
        <figure className="mx-auto flex max-w-4xl flex-col gap-10">
          <Quote
            aria-hidden="true"
            className="size-10 text-highlight"
            strokeWidth={1.25}
          />
          <blockquote className="text-heading-lg font-medium text-foreground">
            <p>&ldquo;{testimonial.quote}&rdquo;</p>
          </blockquote>
          <figcaption className="flex items-center gap-4">
            {testimonial.avatar ? (
              <Image
                src={testimonial.avatar}
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-full ring-1 ring-line"
              />
            ) : null}
            <div className="flex flex-col">
              <span className="text-body font-medium text-foreground">
                {testimonial.name}
              </span>
              <span className="text-body-sm text-muted-foreground">
                {testimonial.role}, {testimonial.company}
              </span>
            </div>
          </figcaption>
        </figure>
      </Reveal>
    </Section>
  );
}
