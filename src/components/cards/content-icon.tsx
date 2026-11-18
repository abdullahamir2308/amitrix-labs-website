import { createElement } from "react";
import {
  Bot,
  Box,
  ChartLine,
  Cloud,
  CodeXml,
  Database,
  Gauge,
  Globe,
  Layers,
  MessagesSquare,
  PenTool,
  Plug,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/**
 * Icon names used in /content (features[].icon, services.icon) → lucide components.
 * An explicit map (not `icons[name]`) keeps client bundles small. Unknown names fall back to Box;
 * add new names here when content starts using them.
 */
const ICONS: Record<string, LucideIcon> = {
  Bot,
  Box,
  ChartLine,
  Cloud,
  CodeXml,
  Database,
  Gauge,
  Globe,
  Layers,
  MessagesSquare,
  PenTool,
  Plug,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Workflow,
  Zap,
};

export function getContentIcon(name: string): LucideIcon {
  return ICONS[name] ?? Box;
}

export function ContentIcon({
  name,
  ...props
}: LucideProps & { name: string }) {
  return createElement(getContentIcon(name), {
    "aria-hidden": true,
    strokeWidth: 1.5,
    ...props,
  });
}
