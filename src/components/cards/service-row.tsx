import Image from "next/image";
import Link from "next/link";
import type { PointerEventHandler } from "react";
import { ArrowRight } from "lucide-react";
import type { ContentImage } from "@/lib/content";
import { cn } from "@/lib/cn";
import { ContentIcon } from "./content-icon";

/** Serializable service summary (safe to pass to client components). */
export type ServiceRowData = {
  slug: string;
  url: string;
  title: string;
  summary: string;
  icon: string;
  image?: ContentImage;
  /** Up to a few tech names, shown as mono tags. */
  tags: string[];
};

export type ServiceRowProps = {
  service: ServiceRowData;
  /** 1-based position, rendered as "01". */
  index: number;
  onPointerEnter?: PointerEventHandler<HTMLAnchorElement>;
  onFocus?: () => void;
  className?: string;
};

/**
 * Large full-width service row (index, title, summary, arrow). Below lg the service image shows
 * inline; at lg+ the parent list shows it as a cursor-following preview instead.
 */
export function ServiceRow({
  service,
  index,
  onPointerEnter,
  onFocus,
  className,
}: ServiceRowProps) {
  return (
    <Link
      href={service.url}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
      className={cn(
        "group/row relative grid grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-4 border-t border-line py-8 transition-opacity duration-500 ease-expo-out sm:gap-x-8 md:py-10 lg:grid-cols-[4rem_minmax(0,1.1fr)_minmax(0,1fr)_auto] lg:items-center lg:py-12",
        "group-hover/list:opacity-45 hover:opacity-100! focus-visible:opacity-100! motion-reduce:transition-none",
        className,
      )}
    >
      <span className="pt-2 font-mono text-xs tracking-[0.14em] text-muted-foreground tabular-nums lg:pt-0">
        {String(index).padStart(2, "0")}
      </span>

      <div className="flex min-w-0 flex-col gap-4">
        <h2 className="flex items-center gap-4 text-heading-lg text-foreground transition-transform duration-500 ease-expo-out group-hover/row:translate-x-2 motion-reduce:transition-none motion-reduce:group-hover/row:translate-x-0 lg:text-display-md">
          <ContentIcon
            name={service.icon}
            className="hidden size-7 shrink-0 text-highlight sm:block lg:size-8"
          />
          <span className="min-w-0">{service.title}</span>
        </h2>
      </div>

      <span
        aria-hidden="true"
        className="col-start-3 row-start-1 mt-1 flex size-10 items-center justify-center rounded-full border border-line-strong text-foreground transition-[background-color,border-color,color,transform] duration-500 ease-expo-out group-hover/row:border-primary group-hover/row:bg-primary group-hover/row:text-primary-foreground group-hover/row:-rotate-45 motion-reduce:group-hover/row:rotate-0 lg:col-start-4 lg:mt-0 lg:size-12"
      >
        <ArrowRight className="size-4" />
      </span>

      <div className="col-span-2 col-start-2 flex flex-col gap-4 lg:col-span-1 lg:col-start-3 lg:row-start-1">
        <p className="max-w-xl text-body text-muted-foreground">
          {service.summary}
        </p>
        {service.tags.length ? (
          <ul className="flex flex-wrap gap-2" aria-label="Typical stack">
            {service.tags.map((t) => (
              <li
                key={t}
                className="rounded-md border border-line px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.12em] text-muted-foreground uppercase"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}
        {service.image ? (
          <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-xl border border-line bg-surface lg:hidden">
            <Image
              src={service.image}
              alt=""
              fill
              sizes="(min-width: 640px) 70vw, 90vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </Link>
  );
}
