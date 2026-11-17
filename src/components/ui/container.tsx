import type { ComponentProps, ElementType } from "react"
import { cn } from "@/lib/cn"

const SIZES = {
  /** 42rem — long-form reading. */
  prose: "max-w-prose-site",
  /** 64rem — focused sections, forms. */
  narrow: "max-w-narrow",
  /** 80rem — default page width. */
  default: "max-w-site",
  /** 92rem — full-bleed grids, hero. */
  wide: "max-w-wide",
  full: "max-w-none",
} as const

export type ContainerSize = keyof typeof SIZES

type ContainerProps<T extends ElementType = "div"> = {
  as?: T
  size?: ContainerSize
} & Omit<ComponentProps<T>, "as">

/** Centred page-width wrapper with the fluid side gutter (px-gutter). */
function Container<T extends ElementType = "div">({
  as,
  size = "default",
  className,
  ...props
}: ContainerProps<T>) {
  const Tag: ElementType = as ?? "div"
  return (
    <Tag
      data-slot="container"
      className={cn("mx-auto w-full px-gutter", SIZES[size], className)}
      {...props}
    />
  )
}

export { Container }
