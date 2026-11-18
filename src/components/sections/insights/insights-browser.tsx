"use client";

import { useMemo, useState, type MouseEvent } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { PostCard } from "./post-card";
import { tagSlug, type PostSummary } from "./post-summary";

type BrowserProps = {
  posts: PostSummary[];
  tags: { tag: string; count: number }[];
  /** Slug of the featured post: hidden from the grid while no filter is active (it's shown above). */
  featuredSlug?: string;
};

type ViewProps = BrowserProps & {
  activeTag: string | null;
  query: string;
  onTag?: (tag: string | null, event: MouseEvent<HTMLAnchorElement>) => void;
  onQuery?: (value: string) => void;
  onClear?: (event: MouseEvent<HTMLAnchorElement>) => void;
  interactive: boolean;
};

function normalize(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").trim();
}

function filterPosts(posts: PostSummary[], tag: string | null, query: string, featuredSlug?: string) {
  const q = normalize(query);
  const filtering = Boolean(tag || q);
  return posts.filter((p) => {
    if (!filtering && p.slug === featuredSlug) return false;
    if (tag && !p.tags.some((t) => tagSlug(t) === tag)) return false;
    if (!q) return true;
    const haystack = normalize([p.title, p.excerpt, p.tags.join(" "), p.author?.name ?? ""].join(" "));
    return q.split(/\s+/).every((word) => haystack.includes(word));
  });
}

function tagHref(pathname: string, tag: string | null, query: string) {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (query.trim()) params.set("q", query.trim());
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function InsightsView({ posts, tags, featuredSlug, activeTag, query, onTag, onQuery, onClear, interactive }: ViewProps) {
  const pathname = "/insights";
  const results = useMemo(() => filterPosts(posts, activeTag, query, featuredSlug), [posts, activeTag, query, featuredSlug]);
  const filtering = Boolean(activeTag || query.trim());
  const activeLabel = tags.find((t) => tagSlug(t.tag) === activeTag)?.tag;

  const chip = (label: string, value: string | null, count?: number) => {
    const active = activeTag === value;
    return (
      <li key={label}>
        <a
          href={tagHref(pathname, value, query)}
          onClick={onTag ? (e) => onTag(value, e) : undefined}
          aria-current={active ? "true" : undefined}
          className={cn(
            "inline-flex h-8 items-center gap-2 rounded-full border px-3.5 text-body-sm whitespace-nowrap transition-colors duration-200",
            active
              ? "border-foreground bg-foreground text-background"
              : "border-line-strong bg-surface-raised text-muted-foreground hover:border-foreground/30 hover:text-foreground",
          )}
        >
          {label}
          {count !== undefined ? (
            <span className={cn("font-mono text-[0.6875rem] tabular-nums", active ? "opacity-70" : "opacity-60")}>{count}</span>
          ) : null}
        </a>
      </li>
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter by topic" className="-mx-gutter overflow-x-auto px-gutter [scrollbar-width:none] lg:mx-0 lg:px-0">
          <ul className="flex gap-2">
            {chip("All", null)}
            {tags.map((t) => chip(t.tag, tagSlug(t.tag), t.count))}
          </ul>
        </nav>
        <div role="search" className="relative w-full lg:w-80">
          <label htmlFor="insights-search" className="sr-only">
            Search articles
          </label>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="insights-search"
            type="search"
            value={query}
            disabled={!interactive}
            onChange={(e) => onQuery?.(e.target.value)}
            placeholder="Search articles"
            autoComplete="off"
            className="h-10 w-full rounded-lg border border-input bg-surface-raised pr-9 pl-9 text-body-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-60 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQuery?.("")}
              className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X aria-hidden="true" className="size-3.5" />
              <span className="sr-only">Clear search</span>
            </button>
          ) : null}
        </div>
      </div>

      <p aria-live="polite" className="font-mono text-label text-muted-foreground">
        {filtering
          ? `${results.length} ${results.length === 1 ? "article" : "articles"}${activeLabel ? ` in “${activeLabel}”` : ""}${query.trim() ? ` matching “${query.trim()}”` : ""}`
          : "Latest articles"}
      </p>

      {results.length ? (
        <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {results.map((post) => (
              <motion.li
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE.expoOut }}
              >
                <PostCard post={post} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-line-strong p-8 sm:p-12">
          <p className="text-heading-sm text-foreground">No articles match that yet.</p>
          <p className="text-body text-muted-foreground">Try a different word or topic — or clear the filters to see everything.</p>
          <a
            href={pathname}
            onClick={onClear}
            className="text-body-sm font-medium text-highlight underline-offset-4 hover:underline"
          >
            Clear filters
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Tag filter + search for /insights. State lives in the URL (?tag=ai-agents&q=agents) and is
 * updated with history.replaceState (Next syncs useSearchParams with it — no server round trip).
 * Must be rendered inside <Suspense> (useSearchParams on a prerendered route).
 */
export function InsightsBrowser(props: BrowserProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeTag = searchParams.get("tag");
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  const write = (tag: string | null, q: string) => {
    window.history.replaceState(null, "", tagHref(pathname, tag, q));
  };

  const plainClick = (event: MouseEvent<HTMLAnchorElement>) =>
    !(event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0);

  return (
    <InsightsView
      {...props}
      interactive
      activeTag={activeTag}
      query={query}
      onTag={(tag, event) => {
        if (!plainClick(event)) return;
        event.preventDefault();
        write(tag, query);
      }}
      onClear={(event) => {
        if (!plainClick(event)) return;
        event.preventDefault();
        setQuery("");
        write(null, "");
      }}
      onQuery={(value) => {
        setQuery(value);
        write(activeTag, value);
      }}
    />
  );
}

/** Suspense fallback / prerendered HTML: the unfiltered list (links still work without JS). */
export function InsightsBrowserFallback(props: BrowserProps) {
  return <InsightsView {...props} interactive={false} activeTag={null} query="" />;
}
