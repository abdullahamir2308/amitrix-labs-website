import { createCn } from "cn/config";

/**
 * Class merger that knows the Amitrix design tokens.
 *
 * The stock `cn` treats unknown `text-*` classes as colours, so
 * `cn("text-display-xl", "text-muted-foreground")` would drop the size.
 * Registering the fluid type scale as font sizes keeps both.
 */
export const TYPE_SCALE = [
  "display-2xl",
  "display-xl",
  "display-lg",
  "display-md",
  "heading-lg",
  "heading-md",
  "heading-sm",
  "body-lg",
  "body",
  "body-sm",
  "caption",
  "label",
] as const;

export type TypeScale = (typeof TYPE_SCALE)[number];

export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: [...TYPE_SCALE] }],
      // Background patterns are images, so they must not cancel bg-<colour>.
      "bg-image": [{ bg: ["grid", "grid-fine", "dots"] }],
    },
  },
});
