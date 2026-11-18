// Tailwind class-merge extension for `cn` (compiled into src/lib/cn-tables.generated.ts).
// After changing it, regenerate the tables:
//   npx cn build --full --no-css --config src/lib/cn.config.mjs -o src/lib/cn-tables.generated.ts

/** Fluid type scale from globals.css. Without it, `cn("text-display-xl", "text-muted-foreground")` drops the size. */
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
];

const cnConfig = {
  extend: {
    classGroups: {
      "font-size": [{ text: [...TYPE_SCALE] }],
      // Background patterns are images, so they must not cancel bg-<colour>.
      "bg-image": [{ bg: ["grid", "grid-fine", "dots"] }],
    },
  },
};

export default cnConfig;
