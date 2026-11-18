import { Reveal } from "@/components/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import type { Faq } from "@/lib/content";

export type FaqSectionProps = {
  faqs: Faq[];
  title?: string;
  eyebrow?: string;
  index?: string | number;
  tone?: "light" | "dark";
  id?: string;
  className?: string;
};

/**
 * Two-column FAQ: heading on the left (sticky on desktop), accordion on the right.
 * Answers are in the server HTML (collapsed panels are still rendered), so they're indexable.
 */
export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  eyebrow = "FAQ",
  index,
  tone = "light",
  id = "faq",
  className,
}: FaqSectionProps) {
  if (!faqs.length) return null;
  return (
    <Section tone={tone} id={id} aria-label={title} className={className}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
          <h2 className="text-display-md text-foreground">{title}</h2>
        </div>
        <Reveal>
          <Accordion multiple className="border-t border-line">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-b border-line"
              >
                <AccordionTrigger className="gap-6 rounded-none py-6 text-heading-sm font-medium text-foreground hover:no-underline hover:text-highlight **:data-[slot=accordion-trigger-icon]:mt-1 **:data-[slot=accordion-trigger-icon]:size-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent
                  keepMounted
                  className="max-w-2xl pb-6 text-body text-muted-foreground"
                >
                  <p>{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}
