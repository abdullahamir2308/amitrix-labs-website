import Image from "next/image";
import { Marquee, TextReveal } from "@/components/motion";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getClients } from "@/lib/content";
import { site } from "@/lib/site";
import { parseEyebrow } from "./bento/section-copy";

/**
 * Home §2 — "Trusted by teams at" + an edge-faded marquee of client logos
 * (content/clients.json). Logos are greyscale and muted until hovered.
 * Reduced motion: the Marquee primitive shows a single wrapped, static row.
 */
export function TrustRow() {
  const clients = getClients();
  if (clients.length === 0) return null;

  const copy = site.sections.trust;
  const { index, label } = parseEyebrow(copy.eyebrow);

  return (
    <Section
      id="trust"
      aria-labelledby="trust-title"
      spacing="none"
      className="border-b border-line py-14 md:py-20"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex shrink-0 flex-col gap-3 lg:w-56">
          <Eyebrow index={index}>{label}</Eyebrow>
          <TextReveal
            as="h2"
            id="trust-title"
            className="text-heading-sm font-medium tracking-[-0.01em] text-muted-foreground"
          >
            {copy.heading}
          </TextReveal>
        </div>

        <Marquee
          label="Client logos"
          duration={45}
          hoverSpeed={0.25}
          gap="clamp(2.5rem, 1.5rem + 3vw, 4.5rem)"
          className="min-w-0 flex-1 py-2 motion-reduce:mask-none"
        >
          {clients.map((client) => (
            <Image
              key={client.id}
              src={client.logo.src}
              width={client.logo.width}
              height={client.logo.height}
              alt={client.name}
              unoptimized
              draggable={false}
              className="h-11 w-auto shrink-0 opacity-55 grayscale transition-[opacity,filter] duration-300 ease-[var(--ease-expo-out)] hover:opacity-100 hover:grayscale-0 md:h-14 dark:opacity-60 dark:brightness-[1.9] dark:hover:opacity-100 dark:hover:brightness-125"
            />
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
