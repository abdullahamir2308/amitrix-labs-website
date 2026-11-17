#!/usr/bin/env node
/**
 * Brand asset generator — run with `npm run brand:assets`.
 *
 * 1. Outlines the four concept wordmarks from the Geist font files (via opentype.js)
 *    into src/components/brand/wordmarks.generated.ts, so the /brand page and the
 *    exported files use identical letterforms (no font dependency in the SVGs).
 * 2. Writes the chosen logo (concept 01, lattice A) to public/brand as mark, wordmark and
 *    lockup SVGs in light and dark versions.
 * 3. Generates src/app/icon.svg, src/app/favicon.ico (16/32/48/64) and src/app/apple-icon.png.
 *
 * "-light" files are for light backgrounds (ink artwork); "-dark" files are for dark
 * backgrounds (paper artwork).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const geistDir = join(root, "node_modules", "geist", "dist", "fonts");

// ---------------------------------------------------------------------------
// Brand constants (keep in sync with src/components/brand/tokens.ts)
// ---------------------------------------------------------------------------
const COLORS = {
  paper: "#FAFAF9",
  ink: "#0A0A12",
  indigo: "#5B4CF5",
  cyan: "#22D3EE",
};
const MUTED_OPACITY = 0.55;
/** Lockup layout, in mark units (the mark is drawn on a 32-unit grid). */
const LOCKUP = { markSize: 32, gap: 10, capHeight: 13 };
LOCKUP.capTop = (LOCKUP.markSize - LOCKUP.capHeight) / 2;

const lattice = JSON.parse(
  readFileSync(join(root, "src/components/brand/lattice-mark.json"), "utf8"),
);

// ---------------------------------------------------------------------------
// Fonts + wordmark outlining
// ---------------------------------------------------------------------------
const loadFont = (file) => {
  const buf = readFileSync(join(geistDir, file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const FONT_FILES = {
  "sans-400": "geist-sans/Geist-Regular.ttf",
  "sans-500": "geist-sans/Geist-Medium.ttf",
  "sans-600": "geist-sans/Geist-SemiBold.ttf",
  "mono-500": "geist-mono/GeistMono-Medium.ttf",
};
const FONTS = Object.fromEntries(
  Object.entries(FONT_FILES).map(([k, file]) => [k, loadFont(file)]),
);

/**
 * Serialise opentype.js path commands. We avoid Path#toPathData because opentype.js 2.0's
 * rounding helper emits "NaN" for values with a tiny fractional part (e.g. 1e-7).
 */
function pathData(commands) {
  const n = (v) => {
    const s = (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, "");
    return s === "-0" ? "0" : s;
  };
  return commands
    .map((c) => {
      switch (c.type) {
        case "M":
        case "L":
          return `${c.type}${n(c.x)} ${n(c.y)}`;
        case "Q":
          return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
        case "C":
          return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
        case "Z":
          return "Z";
        default:
          throw new Error(`Unknown path command ${c.type}`);
      }
    })
    .join("");
}

/**
 * Wordmark specs per concept. `tracking` is in em. Fonts are sized so their cap height
 * equals LOCKUP.capHeight, which keeps every lockup optically consistent.
 */
const WORDMARK_SPECS = {
  lattice: {
    tracking: -0.02,
    segments: [
      { text: "Amitrix", font: "sans-600", tone: "fg" },
      { text: " Labs", font: "sans-400", tone: "fg" },
    ],
  },
  grid: {
    tracking: 0.14,
    segments: [
      { text: "AMITRIX", font: "sans-500", tone: "fg" },
      { text: " LABS", font: "sans-500", tone: "muted" },
    ],
  },
  hex: {
    tracking: -0.035,
    segments: [
      { text: "amitrix", font: "sans-600", tone: "fg" },
      { text: " labs", font: "sans-600", tone: "muted" },
    ],
  },
  mono: {
    tracking: 0,
    segments: [
      { text: "amitrix", font: "mono-500", tone: "fg" },
      { text: "/", font: "mono-500", tone: "indigo" },
      { text: "labs", font: "mono-500", tone: "fg" },
    ],
  },
};

function outlineWordmark(spec) {
  const run = (offsetX) => {
    let x = offsetX;
    const out = [];
    for (const seg of spec.segments) {
      const font = FONTS[seg.font];
      const size = (LOCKUP.capHeight / font.tables.os2.sCapHeight) * font.unitsPerEm;
      const opts = { kerning: true, letterSpacing: spec.tracking };
      // Baseline at y = capHeight, so the cap top sits at y = 0.
      const path = font.getPath(seg.text, x, LOCKUP.capHeight, size, opts);
      out.push({ tone: seg.tone, path });
      x += font.getAdvanceWidth(seg.text, size, opts);
    }
    return out;
  };

  const bboxOf = (parts) => {
    const b = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
    for (const { path } of parts) {
      const pb = path.getBoundingBox();
      b.x1 = Math.min(b.x1, pb.x1);
      b.y1 = Math.min(b.y1, pb.y1);
      b.x2 = Math.max(b.x2, pb.x2);
      b.y2 = Math.max(b.y2, pb.y2);
    }
    return b;
  };

  const first = bboxOf(run(0));
  const parts = run(-first.x1); // left edge of ink at x = 0
  const box = bboxOf(parts);
  const r = (n) => Math.round(n * 100) / 100;
  const segments = parts
    .map(({ tone, path }) => ({ tone, d: pathData(path.commands) }))
    .filter((s) => s.d.length > 0);
  if (segments.some((s) => s.d.includes("NaN"))) throw new Error("NaN in wordmark path");
  return {
    width: r(box.x2),
    top: r(box.y1),
    bottom: r(box.y2),
    capHeight: LOCKUP.capHeight,
    segments,
  };
}

const wordmarks = Object.fromEntries(
  Object.entries(WORDMARK_SPECS).map(([k, spec]) => [k, outlineWordmark(spec)]),
);

writeFileSync(
  join(root, "src/components/brand/wordmarks.generated.ts"),
  `// AUTO-GENERATED by scripts/brand-assets.mjs — do not edit by hand.
// Wordmark outlines from Geist (cap top at y = 0, baseline at y = capHeight).

export type WordmarkTone = "fg" | "muted" | "indigo" | "cyan";

export type WordmarkData = {
  width: number;
  top: number;
  bottom: number;
  capHeight: number;
  segments: readonly { tone: WordmarkTone; d: string }[];
};

export const LOCKUP = ${JSON.stringify(LOCKUP)} as const;

export const WORDMARKS = ${JSON.stringify(wordmarks, null, 2)} as const satisfies Record<string, WordmarkData>;
`,
);

// ---------------------------------------------------------------------------
// SVG builders for the chosen logo (concept 01, lattice A)
// ---------------------------------------------------------------------------
const nodeById = Object.fromEntries(lattice.nodes.map((n) => [n.id, n]));

/** Mark artwork as SVG elements. `fg` is a colour or "currentColor". */
function latticeArt(fg) {
  const tone = (t) => (t === "indigo" ? COLORS.indigo : t === "cyan" ? COLORS.cyan : fg);
  const lines = lattice.edges
    .map(({ from, to, tone: t }) => {
      const a = nodeById[from];
      const b = nodeById[to];
      const op = t === "faint" ? ` stroke-opacity="${lattice.faintOpacity}"` : "";
      return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${fg}"${op}/>`;
    })
    .join("");
  const nodes = lattice.nodes
    .map((n) => `<circle cx="${n.x}" cy="${n.y}" r="${lattice.nodeRadius}" fill="${tone(n.tone)}"/>`)
    .join("");
  return `<g fill="none" stroke-width="${lattice.strokeWidth}" stroke-linecap="round">${lines}</g>${nodes}`;
}

function wordmarkArt(wm, fg) {
  const tone = (t) =>
    t === "indigo" ? COLORS.indigo : t === "cyan" ? COLORS.cyan : fg;
  return wm.segments
    .map(
      (s) =>
        `<path d="${s.d}" fill="${tone(s.tone)}"${s.tone === "muted" ? ` fill-opacity="${MUTED_OPACITY}"` : ""}/>`,
    )
    .join("");
}

const svgDoc = (viewBox, body, w, h, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const fmt = (n) => Math.round(n * 100) / 100;

function markSvg(fg) {
  return svgDoc("0 0 32 32", latticeArt(fg), 32, 32, "Amitrix Labs");
}

function wordmarkSvg(fg) {
  const wm = wordmarks.lattice;
  const h = wm.bottom - wm.top;
  return svgDoc(
    `0 ${fmt(wm.top)} ${fmt(wm.width)} ${fmt(h)}`,
    wordmarkArt(wm, fg),
    fmt(wm.width * 2),
    fmt(h * 2),
    "Amitrix Labs",
  );
}

function lockupSvg(fg) {
  const wm = wordmarks.lattice;
  const x = LOCKUP.markSize + LOCKUP.gap;
  const y = LOCKUP.capTop;
  const top = Math.min(0, y + wm.top);
  const bottom = Math.max(LOCKUP.markSize, y + wm.bottom);
  const width = x + wm.width;
  return svgDoc(
    `0 ${fmt(top)} ${fmt(width)} ${fmt(bottom - top)}`,
    `${latticeArt(fg)}<g transform="translate(${x} ${y})">${wordmarkArt(wm, fg)}</g>`,
    fmt(width * 2),
    fmt((bottom - top) * 2),
    "Amitrix Labs",
  );
}

/** Mark on a rounded ink tile — used for raster favicons so it reads on any tab colour. */
function tileSvg(px, { radius = 7, scale = 0.74 } = {}) {
  const offset = (32 - 32 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${px}" height="${px}">` +
    `<rect width="32" height="32" rx="${radius}" fill="${COLORS.ink}"/>` +
    `<g transform="translate(${offset} ${offset}) scale(${scale})">${latticeArt(COLORS.paper)}</g></svg>`;
}

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------
const brandDir = join(root, "public/brand");
mkdirSync(brandDir, { recursive: true });

const files = {
  "amitrix-mark-light.svg": markSvg(COLORS.ink),
  "amitrix-mark-dark.svg": markSvg(COLORS.paper),
  "amitrix-wordmark-light.svg": wordmarkSvg(COLORS.ink),
  "amitrix-wordmark-dark.svg": wordmarkSvg(COLORS.paper),
  "amitrix-lockup-light.svg": lockupSvg(COLORS.ink),
  "amitrix-lockup-dark.svg": lockupSvg(COLORS.paper),
};
for (const [name, svg] of Object.entries(files)) writeFileSync(join(brandDir, name), svg);

// icon.svg: transparent mark that follows the browser colour scheme.
writeFileSync(
  join(root, "src/app/icon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">` +
    `<style>svg{color:${COLORS.ink}}@media (prefers-color-scheme:dark){svg{color:${COLORS.paper}}}</style>` +
    `${latticeArt("currentColor")}</svg>\n`,
);

// favicon.ico: 16, 32, 48 and 64 px tiles.
const raster = (svg) => sharp(Buffer.from(svg)).png().toBuffer();
const icoPngs = await Promise.all([16, 32, 48, 64].map((px) => raster(tileSvg(px))));
writeFileSync(join(root, "src/app/favicon.ico"), await pngToIco(icoPngs));

// apple-icon.png: 180x180, full-bleed ink (iOS applies its own corner mask).
writeFileSync(
  join(root, "src/app/apple-icon.png"),
  await raster(tileSvg(180, { radius: 0, scale: 0.62 })),
);

// Preview PNGs for review (not committed; written to the OS temp dir if requested).
if (process.env.BRAND_PREVIEW_DIR) {
  const dir = process.env.BRAND_PREVIEW_DIR;
  mkdirSync(dir, { recursive: true });
  for (const [i, png] of icoPngs.entries()) writeFileSync(join(dir, `favicon-${[16, 32, 48, 64][i]}.png`), png);
  for (const [name, svg] of Object.entries(files)) {
    const bg = name.includes("-dark") ? COLORS.ink : COLORS.paper;
    await sharp(Buffer.from(svg), { density: 600 })
      .flatten({ background: bg })
      .png()
      .toFile(join(dir, name.replace(".svg", ".png")));
  }
}

console.log("Brand assets written:");
console.log("  src/components/brand/wordmarks.generated.ts");
for (const name of Object.keys(files)) console.log(`  public/brand/${name}`);
console.log("  src/app/icon.svg, src/app/favicon.ico, src/app/apple-icon.png");
