import type { ComponentProps, ElementType, ReactNode } from "react"
import { cn } from "@/lib/cn"

type EyebrowProps<T extends ElementType = "p"> = {
  as?: T
  /** Section number, rendered as "01". Numbers are zero-padded. */
  index?: string | number
  children: ReactNode
} & Omit<ComponentProps<T>, "as" | "children">

/**
 * Mono section label: `<Eyebrow index="01">Services</Eyebrow>` → "// 01 — SERVICES".
 * The "//" and dash are decorative (aria-hidden), so screen readers hear "01 Services".
 */
function Eyebrow<T extends ElementType = "p">({
  as,
  index,
  children,
  className,
  ...props
}: EyebrowProps<T>) {
  const Tag: ElementType = as ?? "p"
  const number =
    index === undefined
      ? null
      : typeof index === "number"
        ? String(index).padStart(2, "0")
        : index
  return (
    <Tag data-slot="eyebrow" className={cn("eyebrow", className)} {...props}>
      <span aria-hidden="true" className="text-highlight">
        {"//"}
      </span>
      {number !== null ? (
        <>
          <span className="text-foreground tabular-nums">{number}</span>
          <span aria-hidden="true" className="opacity-60">
            —
          </span>
        </>
      ) : null}
      <span>{children}</span>
    </Tag>
  )
}

export { Eyebrow }
