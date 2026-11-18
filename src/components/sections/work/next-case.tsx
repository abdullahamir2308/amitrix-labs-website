import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { WorkItem } from "@/lib/content";

/** Full-width "Next case study" link: mono label, big title, cover thumbnail that grows on hover. */
export function NextCase({ item }: { item: WorkItem }) {
  return (
    <nav aria-label="Next case study" className="border-t border-line">
      <Container>
        <Link
          href={item.url}
          className="group/next grid items-center gap-8 py-section-sm md:grid-cols-[minmax(0,1fr)_auto] md:gap-12"
        >
          <div className="flex flex-col gap-5">
            <p className="eyebrow">
              <span aria-hidden="true" className="text-highlight">
                {"//"}
              </span>
              <span>Next case study</span>
            </p>
            <p className="text-display-md text-foreground transition-colors duration-500 ease-expo-out group-hover/next:text-highlight">
              {item.title}
            </p>
            <p className="inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
              {item.industry} <span aria-hidden="true">/</span> {item.year}
              <ArrowRight
                aria-hidden="true"
                className="ml-1 size-3.5 transition-transform duration-500 ease-expo-out group-hover/next:translate-x-1"
              />
            </p>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-surface md:w-[22rem] lg:w-[26rem]">
            <Image
              src={item.coverImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 26rem, (min-width: 768px) 22rem, 100vw"
              className="object-cover transition-transform duration-700 ease-expo-out group-hover/next:scale-105 motion-reduce:transition-none motion-reduce:group-hover/next:scale-100"
            />
          </div>
        </Link>
      </Container>
    </nav>
  );
}
