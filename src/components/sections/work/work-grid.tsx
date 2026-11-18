"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { MouseEvent } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { WorkCard, type WorkCardData } from "@/components/cards/work-card";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type WorkFilterOptions = {
  industries: string[];
  services: { slug: string; title: string }[];
};

type Filter = { industry: string | null; service: string | null };

function filterItems(items: WorkCardData[], { industry, service }: Filter) {
  return items.filter(
    (w) =>
      (!industry || w.industry === industry) &&
      (!service || w.services.some((s) => s.slug === service)),
  );
}

function hrefFor(filter: Filter) {
  const params = new URLSearchParams();
  if (filter.industry) params.set("industry", filter.industry);
  if (filter.service) params.set("service", filter.service);
  const qs = params.toString();
  return qs ? `/work?${qs}` : "/work";
}

/**
 * Reads ?industry= and ?service= from the URL. Must be rendered inside <Suspense>
 * (the fallback is <WorkGridView> with no filter, so the full grid is in the static HTML).
 */
export function WorkGrid({
  items,
  options,
}: {
  items: WorkCardData[];
  options: WorkFilterOptions;
}) {
  const params = useSearchParams();
  const industry = params.get("industry");
  const service = params.get("service");
  // Ignore unknown values (typos, stale links) rather than showing an empty grid.
  const filter: Filter = {
    industry:
      industry && options.industries.includes(industry) ? industry : null,
    service:
      service && options.services.some((s) => s.slug === service)
        ? service
        : null,
  };

  const navigate = (event: MouseEvent<HTMLAnchorElement>, next: Filter) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;
    event.preventDefault();
    // Native history API: Next.js syncs useSearchParams without a server round trip.
    window.history.replaceState(null, "", hrefFor(next));
  };

  return (
    <WorkGridView
      items={items}
      options={options}
      filter={filter}
      onNavigate={navigate}
    />
  );
}

export function WorkGridView({
  items,
  options,
  filter = { industry: null, service: null },
  onNavigate,
}: {
  items: WorkCardData[];
  options: WorkFilterOptions;
  filter?: Filter;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, next: Filter) => void;
}) {
  const visible = filterItems(items, filter);
  const active = Boolean(filter.industry || filter.service);

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <div className="flex flex-col gap-5 border-y border-line py-6">
        <FilterRow label="Industry">
          <Chip
            href={hrefFor({ ...filter, industry: null })}
            selected={!filter.industry}
            onNavigate={onNavigate}
            next={{ ...filter, industry: null }}
          >
            All
          </Chip>
          {options.industries.map((ind) => (
            <Chip
              key={ind}
              href={hrefFor({ ...filter, industry: ind })}
              selected={filter.industry === ind}
              onNavigate={onNavigate}
              next={{ ...filter, industry: ind }}
              count={filterItems(items, { ...filter, industry: ind }).length}
            >
              {ind}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Service">
          <Chip
            href={hrefFor({ ...filter, service: null })}
            selected={!filter.service}
            onNavigate={onNavigate}
            next={{ ...filter, service: null }}
          >
            All
          </Chip>
          {options.services.map((s) => (
            <Chip
              key={s.slug}
              href={hrefFor({ ...filter, service: s.slug })}
              selected={filter.service === s.slug}
              onNavigate={onNavigate}
              next={{ ...filter, service: s.slug }}
              count={filterItems(items, { ...filter, service: s.slug }).length}
            >
              {s.title}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <p
        aria-live="polite"
        className="-mt-6 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase md:-mt-10"
      >
        {String(visible.length).padStart(2, "0")}{" "}
        {visible.length === 1 ? "case study" : "case studies"}
        {active ? (
          <>
            {" — "}
            <Link
              href="/work"
              scroll={false}
              onClick={(e) =>
                onNavigate?.(e, { industry: null, service: null })
              }
              className="text-highlight underline-offset-4 hover:underline"
            >
              Clear filters
            </Link>
          </>
        ) : null}
      </p>

      <LayoutGroup>
        <motion.ul
          layout
          className="grid gap-x-6 gap-y-14 md:grid-cols-2 md:gap-y-20"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item, i) => (
              <motion.li
                key={item.slug}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: EASE.expoOut }}
                // Mosaic rhythm: every other card in the right column drops down on desktop.
                className={cn(i % 2 === 1 && "md:mt-24")}
              >
                <WorkCard
                  item={item}
                  headingAs="h2"
                  aspect={i % 4 === 0 || i % 4 === 3 ? "4/3" : "16/10"}
                  priority={i < 2}
                  sizes="(min-width: 768px) 46vw, 100vw"
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong p-10 text-center">
          <p className="text-body text-muted-foreground">
            No case studies match these filters yet.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
      <p id={`filter-${label.toLowerCase()}`} className="eyebrow w-24 shrink-0">
        {label}
      </p>
      <ul
        aria-labelledby={`filter-${label.toLowerCase()}`}
        className="flex flex-wrap gap-2"
      >
        {Array.isArray(children) ? (
          children.flat().map((c, i) => <li key={i}>{c}</li>)
        ) : (
          <li>{children}</li>
        )}
      </ul>
    </div>
  );
}

function Chip({
  href,
  selected,
  next,
  onNavigate,
  count,
  children,
}: {
  href: string;
  selected: boolean;
  next: Filter;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, next: Filter) => void;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={selected ? "true" : undefined}
      onClick={(e) => onNavigate?.(e, next)}
      className={cn(
        "relative inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300 ease-expo-out",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-line-strong text-muted-foreground hover:border-foreground/40 hover:text-foreground",
        !selected && count === 0 && "opacity-50",
      )}
    >
      {children}
      {count !== undefined ? (
        <span
          className={cn(
            "font-mono text-[0.625rem] tabular-nums",
            selected ? "opacity-70" : "opacity-60",
          )}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
