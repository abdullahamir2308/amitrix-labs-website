import { Badge } from "@/components/ui/badge";
import type { ProductStatus } from "@/lib/content";

const STATUS: Record<
  ProductStatus,
  { label: string; variant: "live" | "beta" | "soon" }
> = {
  live: { label: "Live", variant: "live" },
  beta: { label: "Beta", variant: "beta" },
  "coming-soon": { label: "Coming soon", variant: "soon" },
};

/** Product status pill (live / beta / coming soon). */
export function StatusBadge({
  status,
  className,
}: {
  status: ProductStatus;
  className?: string;
}) {
  const { label, variant } = STATUS[status];
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
