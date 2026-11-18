import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import type { Product } from "@/lib/content";
import { cn } from "@/lib/cn";
import { StatusBadge } from "./status-badge";
import { WindowFrame } from "./window-frame";

export type ProductCardData = Pick<
  Product,
  | "name"
  | "slug"
  | "url"
  | "tagline"
  | "status"
  | "category"
  | "logo"
  | "heroImage"
>;

export type ProductCardProps = {
  product: ProductCardData;
  /** "wide" puts the screenshot beside the text on md+ (first card in the grid). */
  layout?: "default" | "wide";
  /** Prioritise the image (above the fold). */
  priority?: boolean;
  className?: string;
};

/** Product tile: framed screenshot, logo, name, status badge, category and tagline. */
export function ProductCard({
  product,
  layout = "default",
  priority,
  className,
}: ProductCardProps) {
  const wide = layout === "wide";
  return (
    <SpotlightCard
      className={cn(
        "group/product h-full overflow-hidden bg-surface-raised shadow-none",
        className,
      )}
    >
      <Link
        href={product.url}
        className={cn(
          "relative flex h-full flex-col rounded-[inherit] focus-visible:outline-offset-[-2px]",
          wide && "md:grid md:grid-cols-[1fr_1.15fr] md:items-stretch",
        )}
      >
        {/* Media */}
        <div
          className={cn(
            "relative overflow-hidden border-b border-line bg-[radial-gradient(120%_90%_at_50%_0%,rgb(91_76_245/0.22),transparent_60%)] px-5 pt-6 sm:px-8 sm:pt-8",
            wide && "md:order-2 md:border-b-0 md:border-l md:px-10 md:pt-12",
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grid opacity-60 mask-fade-radial"
          />
          <WindowFrame
            label={product.category}
            className="translate-y-px rounded-b-none border-b-0 transition-transform duration-700 ease-expo-out group-hover/product:-translate-y-1.5 motion-reduce:transition-none"
          >
            <Image
              src={product.heroImage}
              alt=""
              placeholder={product.heroImage.blurDataURL ? "blur" : "empty"}
              sizes={
                wide
                  ? "(min-width: 768px) 55vw, 100vw"
                  : "(min-width: 768px) 45vw, 100vw"
              }
              loading={priority ? "eager" : undefined}
              fetchPriority={priority ? "high" : undefined}
              className="aspect-[16/10] w-full object-cover object-top"
            />
          </WindowFrame>
        </div>

        {/* Text */}
        <div
          className={cn(
            "flex flex-1 flex-col gap-5 p-6 sm:p-8",
            wide && "md:justify-between md:p-10",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src={product.logo}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-lg ring-1 ring-line"
              />
              <p className="eyebrow min-w-0 truncate">{product.category}</p>
            </div>
            <StatusBadge status={product.status} />
          </div>
          <div className="flex flex-col gap-3">
            <h2
              className={cn(
                "text-heading-md text-foreground",
                wide && "md:text-heading-lg",
              )}
            >
              {product.name}
            </h2>
            <p className="max-w-prose text-body text-muted-foreground">
              {product.tagline}
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-foreground">
            Explore
            <span className="sr-only"> {product.name}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-highlight transition-transform duration-300 ease-expo-out group-hover/product:translate-x-0.5 group-hover/product:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </SpotlightCard>
  );
}
