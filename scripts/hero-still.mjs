// Builds public/hero/lattice-still.webp — the reduced-motion / no-JS still of the hero lattice.
//
// 1. Capture the lattice alone from the running dev server (1440x900, copy/header/grid/mask hidden),
//    e.g. with Playwright:
//      await page.addStyleTag({ content: `header, section[aria-labelledby="hero-title"] > :not([class*="lattice"])
//        { visibility: hidden !important } [class*="__lattice"] { mask-image: none !important }` });
//      await page.waitForTimeout(4500);
//      await page.locator('section[aria-labelledby="hero-title"]').screenshot({ path: "lattice.png" });
// 2. node scripts/hero-still.mjs --from=lattice.png
//
// The hero shows the still with the same radial mask and `mix-blend-mode: lighten`, so the ink
// background in the capture disappears into the page. Budget: < 60 KB.
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const from = arg("from");
if (!from) {
  console.error("usage: node scripts/hero-still.mjs --from=<capture.png> [--out=public/hero/lattice-still.webp]");
  process.exit(2);
}
const out = arg("out") ?? "public/hero/lattice-still.webp";
const BUDGET = 60 * 1024;

await mkdir(path.dirname(out), { recursive: true });

// Step quality down until the file fits the budget.
for (const quality of [72, 64, 56, 48, 40]) {
  await sharp(from)
    .resize(1280, 800, { fit: "cover", position: "centre" })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(out);
  const { size } = await stat(out);
  console.log(`${out}: q${quality} → ${(size / 1024).toFixed(1)} KB`);
  if (size <= BUDGET) break;
}
