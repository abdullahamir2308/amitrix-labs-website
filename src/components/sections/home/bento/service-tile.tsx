import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Cloud,
  CodeXml,
  Globe,
  PenTool,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SpotlightCard } from "@/components/motion";
import { cn } from "@/lib/cn";
import type { Service } from "@/lib/content";
import { VisualFrame } from "./visual-frame";
import { ServiceVisual } from "./visuals";

/** Lucide icons named in the services' `icon` frontmatter. */
const ICONS: Record<string, LucideIcon> = { Bot, CodeXml, Globe, Smartphone, PenTool, Cloud };

type Layout = {
  /** Grid span classes (1 col mobile → 2 cols md → 6 cols lg). */
  span: string;
  /** Text beside the visual (md+) instead of above it. */
  wide?: boolean;
  /** Stage alignment for the visual. */
  stage?: string;
  spot?: "indigo" | "cyan";
};

const LAYOUT: Record<string, Layout> = {
  "ai-agents-automation": { span: "md:col-span-2 lg:col-span-4", wide: true, spot: "cyan" },
  "custom-software": { span: "lg:col-span-2" },
  "web-saas-platforms": { span: "lg:col-span-2" },
  "mobile-apps": { span: "lg:col-span-2", stage: "items-end pb-0 pt-6" },
  "product-design": { span: "lg:col-span-2" },
  "cloud-devops": { span: "md:col-span-2 lg:col-span-6", wide: true, spot: "cyan" },
};

const DEFAULT_LAYOUT: Layout = { span: "lg:col-span-2" };

export function tileSpan(slug: string) {
  return (LAYOUT[slug] ?? DEFAULT_LAYOUT).span;
}

/**
 * One services bento tile: icon, title, summary and a looping UI fragment.
 * The whole tile is one link (stretched from the title), named by the title.
 */
export function ServiceTile({ service }: { service: Service }) {
  const layout = LAYOUT[service.slug] ?? DEFAULT_LAYOUT;
  const Icon = ICONS[service.icon] ?? Sparkles;

  return (
    <SpotlightCard
      color={layout.spot ?? "indigo"}
      size={420}
      className={cn(
        "group h-full w-full shadow-none transition-[border-color] duration-300 hover:border-line-strong",
        "outline-offset-4 outline-ring has-[a:focus-visible]:outline-2",
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-2xl)-1px)]",
          layout.wide && "md:flex-row",
        )}
      >
        <div
          className={cn(
            "relative z-[1] flex flex-col p-6 md:p-8",
            layout.wide && "md:w-[42%] md:shrink-0 md:justify-between lg:w-[40%]",
            layout.wide && service.slug === "cloud-devops" && "lg:w-[34%]",
          )}
        >
          <div className="mb-8 flex items-start justify-between md:mb-10">
            <span className="grid size-10 place-items-center rounded-xl border border-line bg-surface-raised text-foreground shadow-soft">
              <Icon className="size-[18px]" strokeWidth={1.6} aria-hidden="true" />
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-5 text-muted-foreground transition-[color,transform] duration-300 ease-[var(--ease-expo-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="text-heading-sm font-medium text-foreground">
              <Link
                href={service.url}
                className="outline-none after:absolute after:inset-0 after:z-20 after:content-['']"
              >
                {service.title}
              </Link>
            </h3>
            <p className="max-w-[46ch] text-body-sm text-muted-foreground">{service.summary}</p>
          </div>
        </div>

        <VisualFrame
          className={cn(
            "relative mt-auto flex min-h-60 flex-1 items-center justify-center px-6 pt-2 pb-8 md:min-h-64",
            layout.wide && "md:mt-0 md:py-8 md:pr-8 md:pl-0",
            layout.stage,
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-grid-fine mask-fade-radial opacity-70"
            style={{ "--grid-size": "20px" } as CSSProperties}
          />
          <div className="relative flex w-full justify-center transition-transform duration-500 ease-[var(--ease-expo-out)] group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
            <ServiceVisual slug={service.slug} />
          </div>
        </VisualFrame>
      </div>
    </SpotlightCard>
  );
}
