import { createCn } from "cn/engine";
import tables from "./cn-tables.generated";

/**
 * Class merger that knows the Amitrix design tokens (fluid type scale, bg patterns).
 *
 * The stock `cn` treats unknown `text-*` classes as colours, so
 * `cn("text-display-xl", "text-muted-foreground")` would drop the size. The extension lives in
 * src/lib/cn.config.mjs and is compiled ahead of time into cn-tables.generated.ts, so the
 * browser ships ~5 KB of tables instead of `cn/config`'s runtime compiler (~25 KB gzip, plus
 * the compile work at startup). Regenerate after editing cn.config.mjs:
 *   npx cn build --full --no-css --config src/lib/cn.config.mjs -o src/lib/cn-tables.generated.ts
 */
export const cn = createCn(tables);
