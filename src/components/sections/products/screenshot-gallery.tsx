"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { WindowFrame } from "@/components/cards/window-frame";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ContentImage } from "@/lib/content";
import { cn } from "@/lib/cn";

export type GalleryItem = { image: ContentImage; alt: string };

/**
 * Screenshot / image gallery: first image large, the rest in a grid. Each opens a lightbox
 * (Base UI Dialog: focus trap, Esc to close) with previous / next buttons and arrow keys.
 */
export function ScreenshotGallery({
  items,
  label,
  framed = true,
}: {
  items: GalleryItem[];
  /** Mono label in each window frame's title bar. */
  label?: string;
  /** Wrap images in a window frame (product UI) or show them as plain rounded images. */
  framed?: boolean;
}) {
  const [open, setOpen] = useState(false);
  // Kept after closing so the dialog doesn't empty out during its exit animation.
  const [index, setIndex] = useState(0);
  if (!items.length) return null;

  const current = items[index] ?? items[0];
  const go = (delta: number) =>
    setIndex((i) => (i + delta + items.length) % items.length);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {items.map((item, i) => {
          const media = (
            <Image
              src={item.image}
              alt={item.alt}
              sizes={
                i === 0 && items.length % 2 === 1
                  ? "(min-width: 1280px) 80rem, 100vw"
                  : "(min-width: 768px) 50vw, 100vw"
              }
              placeholder={item.image.blurDataURL ? "blur" : "empty"}
              className="h-auto w-full transition-transform duration-700 ease-expo-out group-hover/shot:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover/shot:scale-100"
            />
          );
          return (
            <Reveal
              key={item.image.src}
              delay={i === 0 ? 0 : ((i - 1) % 2) * 0.08}
              className={cn(
                i === 0 &&
                  items.length > 1 &&
                  items.length % 2 === 1 &&
                  "md:col-span-2",
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
                data-cursor="view"
                data-cursor-label="Zoom"
                className={cn(
                  "group/shot relative block w-full cursor-zoom-in rounded-xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
                )}
              >
                {framed ? (
                  <WindowFrame label={label}>{media}</WindowFrame>
                ) : (
                  <span className="block overflow-hidden rounded-xl border border-line bg-surface">
                    {media}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-ink/70 text-paper opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/shot:opacity-100 group-focus-visible/shot:opacity-100"
                >
                  <Expand className="size-4" />
                </span>
                <span className="sr-only">Open image: {item.alt}</span>
              </button>
            </Reveal>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="section-dark w-[min(72rem,calc(100%-2rem))] max-w-none gap-3 border border-white/10 bg-[#0d0d16] p-3 sm:max-w-none md:p-4"
          onKeyDown={(e) => {
            if (items.length < 2) return;
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
        >
          <>
            <div className="relative overflow-hidden rounded-lg">
              <Image
                key={current.image.src}
                src={current.image}
                alt={current.alt}
                sizes="(min-width: 1200px) 72rem, 100vw"
                className="h-auto max-h-[78vh] w-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between gap-4 pr-1 pl-1">
              <div className="min-w-0">
                <DialogTitle className="truncate text-sm font-normal text-foreground">
                  {current.alt}
                </DialogTitle>
                <DialogDescription className="font-mono text-[0.6875rem] tracking-[0.12em] uppercase">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(items.length).padStart(2, "0")}
                </DialogDescription>
              </div>
              {items.length > 1 ? (
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="secondary"
                    size="icon-lg"
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon-lg"
                    onClick={() => go(1)}
                    aria-label="Next image"
                  >
                    <ChevronRight />
                  </Button>
                </div>
              ) : null}
            </div>
          </>
        </DialogContent>
      </Dialog>
    </>
  );
}
