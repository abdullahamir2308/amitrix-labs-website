"use client";

import { useRef, type FocusEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/motion";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ContentImage, WorkResult } from "@/lib/content";
import { useScrollRefresh } from "../showcase/use-scroll-refresh";

export type WorkCardData = {
  slug: string;
  href: string;
  title: string;
  client: string;
  industry: string;
  year: number;
  image: ContentImage;
  result: WorkResult | null;
};

type WorkScrollerProps = {
  id: string;
  eyebrow: { index?: string; label: string };
  heading: string;
  cards: WorkCardData[];
  allLabel: string;
  viewLabel: string;
};

const DESKTOP_MOTION = "(min-width: 48rem) and (prefers-reduced-motion: no-preference)";
/** Left/right inset that lines the track up with the page container (max-w-site + gutter). */
const EDGE = "max(var(--spacing-gutter), calc((100% - 80rem) / 2 + var(--spacing-gutter)))";

/**
 * Horizontal case-study rail. Default (SSR, mobile, reduced motion): a native
 * scroll-snap carousel with prev/next buttons. Desktop + motion: the block pins
 * and vertical scroll drives the rail sideways (transform only).
 */
export function WorkScroller({ id, eyebrow, heading, cards, allLabel, viewLabel }: WorkScrollerProps) {
  const root = useRef<HTMLDivElement>(null);
  const pinRef = useRef<ScrollTrigger | null>(null);
  const reduced = useReducedMotion();
  const headingId = `${id}-title`;
  const total = cards.length;
  useScrollRefresh();

  const setProgress = (progress: number) => {
    const el = root.current;
    if (!el) return;
    const fill = el.querySelector<HTMLElement>("[data-fill]");
    const counter = el.querySelector<HTMLElement>("[data-counter]");
    if (fill) fill.style.transform = `scaleX(${Math.max(0.02, Math.min(1, progress))})`;
    if (counter) counter.textContent = String(Math.min(total, Math.round(progress * (total - 1)) + 1)).padStart(2, "0");
  };

  useGSAP(
    () => {
      const el = root.current!;
      const viewport = el.querySelector<HTMLElement>("[data-viewport]")!;
      const track = el.querySelector<HTMLElement>("[data-track]")!;
      const fill = el.querySelector<HTMLElement>("[data-fill]");

      // Carousel mode: progress follows native horizontal scroll.
      const onScroll = () => {
        const max = viewport.scrollWidth - viewport.clientWidth;
        setProgress(max > 0 ? viewport.scrollLeft / max : 0);
      };
      viewport.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        el.dataset.mode = "pin";
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            pin: true,
            anticipatePin: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        });
        tl.to(track, { x: () => -distance(), duration: 1 }, 0);
        if (fill) tl.fromTo(fill, { scaleX: 0.02 }, { scaleX: 1, duration: 1 }, 0);
        pinRef.current = tl.scrollTrigger ?? null;

        return () => {
          delete el.dataset.mode;
          pinRef.current = null;
        };
      });

      return () => {
        viewport.removeEventListener("scroll", onScroll);
        mm.revert();
      };
    },
    { scope: root },
  );

  /** Pin mode: keyboard focus on an off-screen card scrolls the page to reveal it. */
  const onFocus = (event: FocusEvent<HTMLUListElement>) => {
    const st = pinRef.current;
    const el = root.current;
    if (!st || !el || !event.target.closest("li")) return;
    const li = event.target.closest("li")!;
    const track = el.querySelector<HTMLElement>("[data-track]")!;
    const viewport = el.querySelector<HTMLElement>("[data-viewport]")!;
    const distance = track.scrollWidth - viewport.clientWidth;
    if (distance <= 0) return;
    const target = Math.min(1, Math.max(0, (li.offsetLeft - viewport.clientWidth * 0.15) / distance));
    scrollToTarget(st.start + (st.end - st.start) * target, { immediate: true });
  };

  /** Carousel mode: prev/next move by one card. */
  const step = (dir: 1 | -1) => {
    const viewport = root.current?.querySelector<HTMLElement>("[data-viewport]");
    const card = root.current?.querySelector<HTMLElement>("[data-card]");
    if (!viewport || !card) return;
    viewport.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section id={id} aria-labelledby={headingId} className="relative bg-background text-foreground">
      <div
        ref={root}
        className="group/work relative flex flex-col justify-center gap-10 overflow-hidden py-section data-[mode=pin]:h-svh data-[mode=pin]:min-h-[40rem] data-[mode=pin]:gap-8 data-[mode=pin]:pt-20 data-[mode=pin]:pb-10 md:gap-12"
      >
        <Container className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-3xl flex-col gap-5">
            <Eyebrow index={eyebrow.index}>{eyebrow.label}</Eyebrow>
            <h2 id={headingId} className="text-display-md text-foreground">
              {heading}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 group-data-[mode=pin]/work:hidden">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous case study"
                className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface-raised text-foreground transition-colors hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next case study"
                className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface-raised text-foreground transition-colors hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
            <Link
              href="/work"
              className="group/all inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong bg-surface-raised px-4 text-sm font-medium text-foreground shadow-soft transition-colors hover:border-foreground/25"
            >
              {allLabel}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 ease-expo-out group-hover/all:translate-x-0.5"
              />
            </Link>
          </div>
        </Container>

        <div
          data-viewport=""
          className="snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] group-data-[mode=pin]/work:snap-none group-data-[mode=pin]/work:overflow-visible [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingInline: EDGE }}
        >
          <ul
            data-track=""
            onFocus={onFocus}
            className="flex w-max gap-5 will-change-transform md:gap-6"
            style={{ paddingInline: EDGE }}
          >
            {cards.map((card, i) => (
              <li key={card.slug} data-card="" className="w-[min(82vw,26rem)] shrink-0 snap-start md:w-[min(30rem,42vw,62svh)]">
                <WorkCard card={card} index={i} viewLabel={viewLabel} />
              </li>
            ))}
            <li className="w-[min(60vw,16rem)] shrink-0 snap-start md:w-[min(18rem,24vw)]">
              <Link
                href="/work"
                className="group/end flex h-full flex-col justify-between rounded-2xl border border-dashed border-line-strong p-6 transition-colors duration-300 hover:border-indigo/50 hover:bg-indigo/5"
              >
                <span className="text-label text-muted-foreground">{"// More"}</span>
                <span className="flex flex-col gap-4">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-500 ease-expo-out group-hover/end:-rotate-45">
                    <ArrowRight aria-hidden="true" className="size-5" />
                  </span>
                  <span className="text-heading-md text-foreground">{allLabel}</span>
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <Container className="flex items-center gap-4" aria-hidden="true">
          <span className="text-label text-muted-foreground tabular-nums">
            <span data-counter="" className="text-foreground">
              01
            </span>
            <span className="mx-2 opacity-50">/</span>
            {String(total).padStart(2, "0")}
          </span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <span data-fill="" className="absolute inset-0 origin-left scale-x-[0.02] bg-gradient-to-r from-indigo to-cyan" />
          </span>
        </Container>
      </div>
    </section>
  );
}

function WorkCard({ card, index, viewLabel }: { card: WorkCardData; index: number; viewLabel: string }) {
  return (
    <Link
      href={card.href}
      data-cursor="view"
      className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card text-card-foreground shadow-card transition-[border-color,box-shadow] duration-300 ease-expo-out hover:border-line-strong hover:shadow-elevated"
    >
      {/* Name comes from the visible content (no aria-label, which would hide the card text). */}
      <span className="sr-only">{viewLabel}: </span>
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface">
        <Image
          src={card.image}
          alt=""
          sizes="(min-width: 768px) 480px, 82vw"
          className="size-full object-cover transition-transform duration-700 ease-expo-out group-hover/card:scale-[1.04] motion-reduce:transition-none"
        />
        <Badge variant="mono" className="absolute top-4 left-4 bg-surface-raised/90 backdrop-blur">
          {card.industry}
        </Badge>
        <span className="absolute top-4 right-4 font-mono text-[0.6875rem] tracking-[0.12em] text-white/80 tabular-nums mix-blend-difference">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <div className="flex items-center justify-between gap-4 text-label text-muted-foreground">
          <span className="truncate">{card.client}</span>
          <span className="tabular-nums">{card.year}</span>
        </div>
        <h3 className="line-clamp-2 text-heading-sm text-foreground">{card.title}</h3>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-4">
          {card.result ? (
            <p className="flex min-w-0 flex-col gap-1">
              <span className="font-mono text-heading-lg tracking-tight text-highlight tabular-nums">{card.result.metric}</span>
              <span className="line-clamp-1 text-caption text-muted-foreground">{card.result.label}</span>
            </p>
          ) : (
            <span />
          )}
          <span
            aria-hidden="true"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong transition-[background-color,color,border-color,transform] duration-500 ease-expo-out group-hover/card:-rotate-45 group-hover/card:border-transparent group-hover/card:bg-indigo group-hover/card:text-white"
          >
            <ArrowUpRight className="size-4 rotate-45" />
          </span>
        </div>
      </div>
    </Link>
  );
}
