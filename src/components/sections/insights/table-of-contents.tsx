"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { scrollToTarget } from "@/lib/motion";

export type TocItem = { title: string; url: string; items: TocItem[] };

function flatten(items: TocItem[], depth = 0): { title: string; id: string; depth: number }[] {
  return items.flatMap((item) => [
    { title: item.title, id: item.url.replace(/^#/, ""), depth },
    ...flatten(item.items, depth + 1),
  ]);
}

/**
 * Sticky "On this page" list. The active entry is the last heading that has scrolled above
 * 30% of the viewport (scroll listener + rAF; cheaper and steadier than IntersectionObserver for
 * long sections). Clicking scrolls via Lenis when it's active and updates the hash.
 */
export function TableOfContents({ toc, className }: { toc: TocItem[]; className?: string }) {
  const entries = flatten(toc).filter((e) => e.depth < 2);
  const [active, setActive] = useState<string | null>(null);
  const ids = entries.map((e) => e.id).join("|");

  useEffect(() => {
    const headings = ids
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      // At the very bottom, the last heading may never cross the line — mark it active.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = headings[headings.length - 1].id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  const onClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    scrollToTarget(el, { offset: -96 });
    window.history.replaceState(null, "", `#${id}`);
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  if (!entries.length) return null;

  return (
    <nav aria-label="Table of contents" className={cn("flex flex-col gap-4", className)}>
      <p className="font-mono text-label text-muted-foreground">On this page</p>
      <ol className="relative flex flex-col border-l border-line">
        {entries.map((e) => {
          const isActive = active === e.id;
          return (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                onClick={(ev) => onClick(ev, e.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l py-1.5 text-body-sm leading-snug transition-colors duration-200",
                  e.depth ? "pl-7 text-[0.8125rem]" : "pl-4",
                  isActive
                    ? "border-indigo font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-line-strong hover:text-foreground",
                )}
              >
                {e.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
