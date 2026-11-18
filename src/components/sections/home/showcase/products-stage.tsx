"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import type { ContentImage, ProductStatus } from "@/lib/content";
import { STATUS_BADGE } from "./section-utils";
import { useScrollRefresh } from "./use-scroll-refresh";

export type ShowcaseProduct = {
  slug: string;
  name: string;
  tagline: string;
  status: ProductStatus;
  category: string;
  href: string;
  image: ContentImage;
  alt: string;
};

/** Same condition as the `md:motion-safe:` classes that show this stage. */
const DESKTOP_MOTION = "(min-width: 48rem) and (prefers-reduced-motion: no-preference)";

/**
 * Pinned products stage (desktop + motion only; the parent hides it otherwise).
 * The frame scales/tilts up while the stage scrolls into view, then the stage
 * pins and scroll scrubs a cross-fade between product screenshots. The active
 * product (nearest to the scrub position) highlights on the left.
 */
export function ProductsStage({ products, exploreLabel }: { products: ShowcaseProduct[]; exploreLabel: string }) {
  const root = useRef<HTMLDivElement>(null);
  const pinRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const count = products.length;
  useScrollRefresh();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        const stage = root.current!;
        const frame = stage.querySelector<HTMLElement>("[data-frame]");
        const shots = gsap.utils.toArray<HTMLElement>("[data-shot]", stage);
        const rail = stage.querySelector<HTMLElement>("[data-rail]");

        // 1. Enter: frame rises, untilts and scales up until the stage is centred (pin start).
        gsap.fromTo(
          frame,
          { scale: 0.84, rotateX: 16, yPercent: 8 },
          {
            scale: 1,
            rotateX: 0,
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: stage, start: "top bottom", end: "center center", scrub: 0.6 },
          },
        );

        if (count < 2) return;

        // 2. Pin: one "segment" per product transition; fades sit mid-segment so each
        //    product holds still for a moment before and after.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            pin: true,
            anticipatePin: 1,
            start: "center center",
            end: () => `+=${window.innerHeight * 0.9 * (count - 1)}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.round(self.progress * (count - 1))),
          },
        });
        pinRef.current = tl.scrollTrigger ?? null;

        shots.forEach((shot, i) => {
          if (i === 0) return;
          const at = i - 1 + 0.3;
          tl.fromTo(shot, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.4 }, at);
          tl.to(shots[i - 1], { autoAlpha: 0, duration: 0.4 }, at);
        });
        if (rail) tl.fromTo(rail, { scaleY: 1 / count }, { scaleY: 1, duration: count - 1 }, 0);
        tl.set({}, {}, count - 1); // pad so progress maps 1:1 to product index

        return () => {
          pinRef.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [count] },
  );

  const goTo = (index: number) => {
    const st = pinRef.current;
    if (!st || count < 2) {
      setActive(index);
      return;
    }
    scrollToTarget(st.start + ((st.end - st.start) * index) / (count - 1) + 1);
  };

  const current = products[active] ?? products[0];

  return (
    <div ref={root} className="relative flex items-center py-6">
      <div className="grid w-full grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-10 lg:gap-16">
        {/* Left: index, names, active product details */}
        <div className="flex flex-col gap-8">
          <p className="text-label text-muted-foreground tabular-nums" aria-hidden="true">
            <span className="text-signal">{String(active + 1).padStart(2, "0")}</span>
            <span className="mx-2 opacity-50">/</span>
            {String(count).padStart(2, "0")}
          </p>

          <div className="relative pl-6">
            <span aria-hidden="true" className="absolute inset-y-1 left-0 w-px bg-line" />
            <span
              aria-hidden="true"
              data-rail=""
              className="absolute inset-y-1 left-0 w-px origin-top bg-gradient-to-b from-cyan to-indigo shadow-[0_0_12px_rgb(34_211_238/0.6)]"
            />
            <ol className="flex flex-col gap-1">
              {products.map((p, i) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === active ? "true" : undefined}
                    className={cn(
                      "rounded-sm py-1.5 text-left text-heading-md transition-colors duration-300 ease-expo-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                      i === active ? "text-foreground" : "text-foreground/35 hover:text-foreground/70",
                    )}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* Details: stacked in one grid cell (height = tallest), cross-fade via opacity/transform */}
          <div className="grid">
            {products.map((p, i) => {
              const badge = STATUS_BADGE[p.status];
              const on = i === active;
              return (
                <div
                  key={p.slug}
                  inert={!on}
                  aria-hidden={!on}
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col items-start gap-4 transition-[opacity,transform] duration-500 ease-expo-out",
                    on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <span className="text-label text-muted-foreground">{p.category}</span>
                  </div>
                  <p className="max-w-md text-body-lg text-muted-foreground">{p.tagline}</p>
                  <Link
                    href={p.href}
                    className="group/link inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 px-4 py-2.5 text-sm font-medium text-signal transition-[background-color,box-shadow] duration-300 hover:bg-cyan/15 hover:shadow-glow-cyan"
                  >
                    {exploreLabel}
                    <span className="sr-only"> {p.name}</span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 ease-expo-out group-hover/link:translate-x-0.5"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: browser frame */}
        <div className="relative [perspective:1600px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 -bottom-16 top-1/3 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(34_211_238/0.22),rgb(91_76_245/0.12)_45%,transparent_70%)] blur-2xl"
          />
          <div
            data-frame=""
            className="origin-[50%_100%] overflow-hidden rounded-xl border border-white/10 bg-surface shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_40px_120px_-40px_rgb(34_211_238/0.35)] will-change-transform"
          >
            <div className="flex h-10 items-center gap-3 border-b border-white/8 bg-surface-raised px-4">
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
              </span>
              <span className="mx-auto flex h-6 min-w-0 max-w-[60%] flex-1 items-center justify-center gap-1.5 truncate rounded-md border border-white/8 bg-background/60 px-3 font-mono text-[0.6875rem] text-muted-foreground">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgb(34_211_238/0.8)]" />
                <span className="truncate">amitrixlabs.com/products/{current.slug}</span>
              </span>
              <span aria-hidden="true" className="w-[42px]" />
            </div>
            <div className="relative aspect-[16/10] bg-background">
              {products.map((p, i) => (
                <div
                  key={p.slug}
                  data-shot=""
                  className={cn("absolute inset-0", i > 0 && "invisible opacity-0")}
                >
                  <Image
                    src={p.image}
                    alt={p.alt}
                    sizes="(min-width: 1280px) 720px, 58vw"
                    className="size-full object-cover"
                  />
                </div>
              ))}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
