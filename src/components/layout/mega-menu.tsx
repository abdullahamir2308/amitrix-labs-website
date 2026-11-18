"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { ServiceIcon } from "./service-icon";
import type { MegaMenu, MenuImage, MenuItem } from "./nav-types";

const STATUS = {
  live: { variant: "live", label: "Live" },
  beta: { variant: "beta", label: "Beta" },
  "coming-soon": { variant: "soon", label: "Soon" },
} as const;

const isSvg = (img: MenuImage) => img.src.endsWith(".svg");

/** Body of the shared mega-menu panel: item list (icon, title, one line) + one featured card. */
export function MegaMenuContent({ menu, onNavigate }: { menu: MegaMenu; onNavigate: () => void }) {
  const twoCol = menu.items.length > 4;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_17rem] gap-2 p-2">
      <div className="flex min-w-0 flex-col px-1 pt-3 pb-1">
        <p className="eyebrow px-3 pb-2">
          <span aria-hidden="true" className="text-highlight">
            {"//"}
          </span>
          {menu.label}
        </p>
        <ul className={cn("grid gap-0.5", twoCol && "grid-cols-2")}>
          {menu.items.map((item) => (
            <li key={item.href}>
              <MenuLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
        <div className="mt-auto px-3 pt-3">
          <Link
            href={menu.href}
            onClick={onNavigate}
            className="group/all inline-flex items-center gap-1.5 rounded-sm text-[0.8125rem] font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            {menu.allLabel}
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-300 ease-expo-out group-hover/all:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {menu.featured ? (
        <Link
          href={menu.featured.href}
          onClick={onNavigate}
          className="group/feat relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-colors duration-300 hover:border-line-strong"
        >
          {menu.featured.image ? (
            <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-ink">
              <Image
                src={menu.featured.image.src}
                width={menu.featured.image.width}
                height={menu.featured.image.height}
                unoptimized={isSvg(menu.featured.image)}
                sizes="272px"
                alt=""
                className="size-full object-cover transition-transform duration-700 ease-expo-out group-hover/feat:scale-[1.04]"
              />
            </div>
          ) : null}
          <div className="flex flex-1 flex-col gap-1.5 p-4">
            <span className="text-label text-[0.625rem] text-highlight">{menu.featured.label}</span>
            <span className="line-clamp-2 text-sm leading-snug font-medium text-foreground">
              {menu.featured.title}
            </span>
            <span className="line-clamp-2 text-[0.8125rem] leading-snug text-muted-foreground">
              {menu.featured.description}
            </span>
            <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[0.8125rem] font-medium text-foreground">
              {menu.featured.cta}
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-300 ease-expo-out group-hover/feat:translate-x-0.5 group-hover/feat:-translate-y-0.5"
              />
            </span>
          </div>
        </Link>
      ) : null}
    </div>
  );
}

function MenuLink({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  const status = item.status ? STATUS[item.status] : null;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="group/item flex items-start gap-3.5 rounded-xl p-3 transition-colors duration-200 hover:bg-muted focus-visible:bg-muted"
    >
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surface-raised text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-[border-color,color] duration-200 group-hover/item:border-indigo/40 group-hover/item:text-highlight">
        {item.image ? (
          <Image
            src={item.image.src}
            width={40}
            height={40}
            unoptimized={isSvg(item.image)}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <ServiceIcon name={item.icon} className="size-[1.125rem]" strokeWidth={1.6} />
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 pt-0.5">
        <span className="flex items-center gap-2 text-sm leading-tight font-medium text-foreground">
          <span className="truncate">{item.title}</span>
          {status ? (
            <Badge variant={status.variant} className="h-5 px-1.5 text-[0.5625rem]">
              {status.label}
            </Badge>
          ) : null}
        </span>
        <span className="line-clamp-1 text-[0.8125rem] leading-snug text-muted-foreground">
          {item.description}
        </span>
      </span>
    </Link>
  );
}
