import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ContentImage } from "@/lib/content";
import { cn } from "@/lib/cn";

/** Serializable case-study summary (safe to pass to client components). */
export type WorkCardData = {
  slug: string;
  url: string;
  title: string;
  client: string;
  industry: string;
  year: number;
  summary: string;
  coverImage: ContentImage;
  services: { slug: string; title: string }[];
};

export type WorkCardProps = {
  item: WorkCardData;
  /** Heading level for the title. Default h3. */
  headingAs?: "h2" | "h3";
  /** Image aspect. Default "4/3". */
  aspect?: "4/3" | "16/10" | "1/1";
  sizes?: string;
  priority?: boolean;
  className?: string;
};

const ASPECT = {
  "4/3": "aspect-[4/3]",
  "16/10": "aspect-[16/10]",
  "1/1": "aspect-square",
} as const;

/** Editorial case-study card: big cover, mono meta, title, summary and service tags. */
export function WorkCard({
  item,
  headingAs: Heading = "h3",
  aspect = "4/3",
  sizes = "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw",
  priority,
  className,
}: WorkCardProps) {
  return (
    <article
      className={cn("group/work relative flex flex-col gap-5", className)}
    >
      <div
        data-cursor="view"
        data-cursor-label="Read"
        className={cn(
          "relative overflow-hidden rounded-2xl border border-line bg-surface shadow-card",
          ASPECT[aspect],
        )}
      >
        <Image
          src={item.coverImage}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          placeholder={item.coverImage.blurDataURL ? "blur" : "empty"}
          className="object-cover transition-transform duration-700 ease-expo-out group-hover/work:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/work:scale-100"
        />
        <span
          aria-hidden="true"
          className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-ink/70 text-paper opacity-0 backdrop-blur-md transition-[opacity,transform] duration-500 ease-expo-out group-hover/work:opacity-100 group-focus-within/work:opacity-100 motion-safe:translate-y-1 motion-safe:group-hover/work:translate-y-0"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
          <span>{item.industry}</span>
          <span aria-hidden="true" className="text-line-strong">
            /
          </span>
          <span className="tabular-nums">{item.year}</span>
        </p>
        <Heading className="text-heading-sm text-foreground sm:text-heading-md">
          <Link
            href={item.url}
            className="decoration-highlight/40 underline-offset-4 after:absolute after:inset-0 after:rounded-2xl after:content-[''] group-hover/work:underline"
          >
            {item.title}
          </Link>
        </Heading>
        <p className="line-clamp-2 max-w-prose text-body-sm text-muted-foreground">
          {item.summary}
        </p>
        {item.services.length ? (
          <ul className="flex flex-wrap gap-2 pt-1" aria-label="Services">
            {item.services.map((s) => (
              <li
                key={s.slug}
                className="rounded-md border border-line px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.12em] text-muted-foreground uppercase"
              >
                {s.title}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
