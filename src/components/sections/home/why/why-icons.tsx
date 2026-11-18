import { cn } from "@/lib/cn";
import s from "./why.module.css";

/*
 * Custom 24px line icons for "Why Amitrix", keyed by the lucide icon name
 * used in `site.why[].icon`. Hover animations live in why.module.css and are
 * driven by the parent column (`.item`, exported as `whyItemClass`).
 */

export const whyItemClass = s.item;
export const whyTileClass = s.tile;

function Zap() {
  return (
    <svg viewBox="0 0 24 24" className={s.icon} aria-hidden="true">
      <path className={s.speed} pathLength={1} d="M1.5 9h3.5" />
      <path className={s.speed} pathLength={1} d="M1 12.5h4.5" />
      <path className={s.speed} pathLength={1} d="M2 16h3" />
      <path className={s.bolt} d="M14.5 2.5 7 13h5.5l-1 8.5L19 11h-5.5l1-8.5Z" />
    </svg>
  );
}

function Layers() {
  return (
    <svg viewBox="0 0 24 24" className={s.icon} aria-hidden="true">
      <path className={cn(s.layerNew)} pathLength={1} d="M3 20l9 4 9-4" />
      <path className={s.layerBot} d="M3 16.5l9 4.5 9-4.5" />
      <path className={s.layerMid} d="M3 12l9 4.5 9-4.5" />
      <path className={s.layerTop} d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" />
    </svg>
  );
}

function Sparkles() {
  return (
    <svg viewBox="0 0 24 24" className={s.icon} aria-hidden="true">
      <path
        className={s.spark}
        d="M10 4l1.55 4.7a2 2 0 0 0 1.25 1.25L17.5 11.5l-4.7 1.55a2 2 0 0 0-1.25 1.25L10 19l-1.55-4.7a2 2 0 0 0-1.25-1.25L2.5 11.5l4.7-1.55a2 2 0 0 0 1.25-1.25Z"
      />
      <path className={s.twinkle} d="M19 2.5v4M17 4.5h4" />
      <path className={s.twinkle} d="M19.5 17.5v3M18 19h3" />
    </svg>
  );
}

const ICONS: Record<string, () => React.JSX.Element> = { Zap, Layers, Sparkles };

export function WhyIcon({ name }: { name: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon />;
}
