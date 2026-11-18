/**
 * Shared renderer for the Open Graph images (src/app/**\/opengraph-image.tsx).
 *
 * Brand look: ink background, fine grid, a lattice of nodes and lines in indigo -> cyan, a mono
 * eyebrow, a large title and the domain in the footer. Satori only does flexbox + a CSS subset,
 * so the art (grid, glow, lattice) is one inline SVG used as a background image.
 *
 * Geist is read from the `geist` package (TTF files; Satori cannot parse WOFF2).
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 } as const;

const INK = "#0A0A12";
const PAPER = "#FAFAF9";
const INDIGO = "#5B4CF5";
const CYAN = "#22D3EE";
const HIGHLIGHT = "#8C7CFF";
const MUTED = "#9AA5B8";

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

const FONT_DIR = join(process.cwd(), "node_modules", "geist", "dist", "fonts");

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500 | 600;
  style: "normal";
};

let fontsPromise: Promise<OgFont[]> | undefined;

async function load(dir: string, file: string): Promise<ArrayBuffer> {
  const buf = await readFile(join(FONT_DIR, dir, file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

/** Read once per process, shared by every image. */
function getFonts(): Promise<OgFont[]> {
  fontsPromise ??= Promise.all([
    load("geist-sans", "Geist-Medium.ttf"),
    load("geist-sans", "Geist-SemiBold.ttf"),
    load("geist-mono", "GeistMono-Regular.ttf"),
    load("geist-mono", "GeistMono-Medium.ttf"),
  ]).then(([sansMedium, sansSemi, monoRegular, monoMedium]) => [
    { name: "Geist", data: sansMedium, weight: 500, style: "normal" },
    { name: "Geist", data: sansSemi, weight: 600, style: "normal" },
    { name: "Geist Mono", data: monoRegular, weight: 400, style: "normal" },
    { name: "Geist Mono", data: monoMedium, weight: 500, style: "normal" },
  ]);
  return fontsPromise;
}

// ---------------------------------------------------------------------------
// Background art (grid + glow + lattice), as an SVG data URI
// ---------------------------------------------------------------------------

/** Small deterministic PRNG so every title gets its own (stable) lattice. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function backgroundSvg(seed: number): string {
  const { width: W, height: H } = OG_SIZE;
  const rand = rng(seed);

  // Grid lines, faded towards the left edge by a mask.
  const step = 48;
  const grid: string[] = [];
  for (let x = step; x < W; x += step) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`);
  for (let y = step; y < H; y += step) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);

  // Lattice: a jittered grid of nodes on the right ~55% of the canvas, joined to neighbours.
  const cols = 7;
  const rows = 6;
  const x0 = 640;
  const dx = (W - x0 + 40) / (cols - 1);
  const dy = (H + 40) / (rows - 1);
  const pts: { x: number; y: number }[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: { x: number; y: number }[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        x: x0 + c * dx + (r % 2 ? dx / 2 : 0) - 20 + (rand() - 0.5) * dx * 0.45,
        y: -20 + r * dy + (rand() - 0.5) * dy * 0.45,
      });
    }
    pts.push(row);
  }
  const lines: string[] = [];
  const nodes: string[] = [];
  const link = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    if (rand() < 0.34) return;
    const faint = rand() < 0.45;
    lines.push(
      `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke-opacity="${faint ? 0.25 : 0.6}"/>`,
    );
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = pts[r][c];
      if (c + 1 < cols) link(p, pts[r][c + 1]);
      if (r + 1 < rows) {
        link(p, pts[r + 1][c]);
        // Offset rows: connect diagonally so the mesh reads as triangles.
        const d = r % 2 ? c + 1 : c - 1;
        if (d >= 0 && d < cols) link(p, pts[r + 1][d]);
      }
      const t = (p.x - x0) / (W - x0);
      const big = rand() < 0.16;
      const color = rand() < 0.5 ? INDIGO : CYAN;
      const radius = big ? 7 : 3.5;
      nodes.push(
        big
          ? `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${radius + 9}" fill="${color}" fill-opacity="0.16"/>` +
              `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${radius}" fill="${color}"/>`
          : `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${radius}" fill="${rand() < 0.3 ? PAPER : color}" fill-opacity="${(0.45 + 0.4 * t).toFixed(2)}"/>`,
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<radialGradient id="glowA" cx="0.8" cy="0.12" r="0.55"><stop offset="0" stop-color="${INDIGO}" stop-opacity="0.42"/><stop offset="1" stop-color="${INDIGO}" stop-opacity="0"/></radialGradient>
<radialGradient id="glowB" cx="0.98" cy="1" r="0.5"><stop offset="0" stop-color="${CYAN}" stop-opacity="0.22"/><stop offset="1" stop-color="${CYAN}" stop-opacity="0"/></radialGradient>
<linearGradient id="edge" gradientUnits="userSpaceOnUse" x1="${x0}" y1="0" x2="${W}" y2="${H}"><stop offset="0" stop-color="${INDIGO}"/><stop offset="1" stop-color="${CYAN}"/></linearGradient>
<radialGradient id="fade" cx="0.72" cy="0.3" r="0.8"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
<mask id="gridMask"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
<linearGradient id="latticeFadeG" x1="0" y1="0" x2="1" y2="0"><stop offset="0.45" stop-color="#000"/><stop offset="0.7" stop-color="#fff"/></linearGradient>
<mask id="latticeFade"><rect width="${W}" height="${H}" fill="url(#latticeFadeG)"/></mask>
</defs>
<rect width="${W}" height="${H}" fill="${INK}"/>
<rect width="${W}" height="${H}" fill="url(#glowA)"/>
<rect width="${W}" height="${H}" fill="url(#glowB)"/>
<g stroke="${PAPER}" stroke-opacity="0.07" stroke-width="1" mask="url(#gridMask)">${grid.join("")}</g>
<g mask="url(#latticeFade)">
<g stroke="url(#edge)" stroke-width="1.6" stroke-linecap="round">${lines.join("")}</g>
${nodes.join("")}
</g>
</svg>`;
}

/** The Lattice A mark (concept 1) for the top-left lockup. */
const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64"><g fill="none" stroke-width="2.25" stroke-linecap="round"><line x1="10" y1="16" x2="16" y2="26.5" stroke="${PAPER}" stroke-opacity="0.38"/><line x1="22" y1="16" x2="16" y2="26.5" stroke="${PAPER}" stroke-opacity="0.38"/><line x1="16" y1="5.5" x2="10" y2="16" stroke="${PAPER}"/><line x1="10" y1="16" x2="4" y2="26.5" stroke="${PAPER}"/><line x1="16" y1="5.5" x2="22" y2="16" stroke="${PAPER}"/><line x1="22" y1="16" x2="28" y2="26.5" stroke="${PAPER}"/><line x1="10" y1="16" x2="22" y2="16" stroke="${PAPER}"/></g><circle cx="16" cy="5.5" r="2.75" fill="${INDIGO}"/><circle cx="10" cy="16" r="2.75" fill="${PAPER}"/><circle cx="22" cy="16" r="2.75" fill="${PAPER}"/><circle cx="4" cy="26.5" r="2.75" fill="${PAPER}"/><circle cx="16" cy="26.5" r="2.75" fill="${CYAN}"/><circle cx="28" cy="26.5" r="2.75" fill="${PAPER}"/></svg>`;

const dataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
const MARK_URI = dataUri(MARK_SVG);

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

export type OgImageInput = {
  /** Mono label above the title, e.g. "Product — AI agents". Rendered as "// PRODUCT — AI AGENTS". */
  eyebrow: string;
  title: string;
  /** Optional supporting line under the title (clipped to two lines). */
  description?: string;
};

function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).replace(/[\s,;:.\-–—]+$/, "")}…`;
}

/** Title size steps down with length so up to ~100 characters stay within four lines. */
function titleSize(length: number): number {
  if (length <= 24) return 96;
  if (length <= 44) return 80;
  if (length <= 72) return 66;
  return 54;
}

export async function renderOgImage({ eyebrow, title, description }: OgImageInput): Promise<ImageResponse> {
  const fonts = await getFonts();
  const heading = clip(title, 110);
  const sub = description ? clip(description, 130) : undefined;
  const background = dataUri(backgroundSvg(hash(title)));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: INK,
          color: PAPER,
          fontFamily: "Geist",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>; next/image does not apply */}
        <img
          src={background}
          alt=""
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          style={{ position: "absolute", top: 0, left: 0 }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "56px 72px 60px",
          }}
        >
          {/* Lockup */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MARK_URI} alt="" width={44} height={44} />
            <div style={{ display: "flex", fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em" }}>{site.name}</div>
          </div>

          {/* Eyebrow + title */}
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 800 }}>
            <div
              style={{
                display: "flex",
                gap: 12,
                fontFamily: "Geist Mono",
                fontWeight: 500,
                fontSize: 24,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              <div style={{ display: "flex", color: HIGHLIGHT }}>{"//"}</div>
              <div style={{ display: "flex" }}>{clip(eyebrow, 48)}</div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: titleSize(heading.length),
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: "-0.035em",
              }}
            >
              {heading}
            </div>
            {sub ? (
              <div
                style={{
                  display: "flex",
                  marginTop: 24,
                  fontSize: 28,
                  lineHeight: 1.35,
                  fontWeight: 500,
                  color: MUTED,
                  maxWidth: 720,
                }}
              >
                {sub}
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: "Geist Mono",
              fontWeight: 400,
              fontSize: 24,
              letterSpacing: "0.04em",
              color: MUTED,
            }}
          >
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 6, backgroundColor: CYAN }} />
            <div style={{ display: "flex" }}>{site.domain}</div>
          </div>
        </div>

        {/* Brand gradient rule along the bottom edge */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 8,
            backgroundImage: `linear-gradient(90deg, ${INDIGO}, ${CYAN})`,
          }}
        />
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
