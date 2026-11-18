import {
  Bot,
  Cloud,
  CodeXml,
  Globe,
  PenTool,
  Smartphone,
  Sparkles,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** lucide names used by content/services (frontmatter `icon`). Unknown names fall back to Sparkles. */
const ICONS: Record<string, LucideIcon> = { Bot, Cloud, CodeXml, Globe, PenTool, Smartphone };

export function ServiceIcon({ name, ...props }: LucideProps & { name?: string }) {
  const Icon = (name && ICONS[name]) || Sparkles;
  return <Icon aria-hidden="true" {...props} />;
}
