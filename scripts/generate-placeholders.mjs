#!/usr/bin/env node
/**
 * Placeholder image generator — run with `npm run content:placeholders`.
 *
 * Writes small, brand-coloured SVG placeholders to public/placeholders/:
 *   products/   logo (1:1), hero + 3 UI-mockup screenshots per product (16:10)
 *   services/   one abstract image per service (4:3)
 *   work/       case-study covers (16:10) + gallery shots (16:10)
 *   posts/      article covers (16:9)
 *   team/       avatars (1:1)
 *   clients/    "Client 0n" monochrome wordmarks (5:2)
 *
 * Every image carries a small "[PLACEHOLDER]" label. Replace them with real images
 * (same path, or point the content file at a new path) — see content/README.md.
 * Output is deterministic, so re-running only rewrites identical files.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "placeholders");

const C = {
  paper: "#FAFAF9",
  ink: "#0A0A12",
  ink2: "#11121C",
  ink3: "#181927",
  indigo: "#5B4CF5",
  cyan: "#22D3EE",
  slate: "#64748B",
  lineDark: "#1F2030",
  lineLight: "#E5E7EB",
};
const SANS = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** Tiny deterministic PRNG so output is stable between runs. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svg(w, h, body, { title, defs = "" } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"${
    title ? ` aria-label="${esc(title)}"` : ""
  }>${title ? `<title>${esc(title)}</title>` : ""}<defs>${defs}</defs>${body}</svg>\n`;
}

function write(rel, content) {
  const file = join(out, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return file;
}

function label(x, y, text = "[PLACEHOLDER]", fill = C.slate, size = 14, anchor = "start") {
  return `<text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" letter-spacing="2" fill="${fill}" text-anchor="${anchor}">${esc(text)}</text>`;
}

function grid(w, h, step, stroke, opacity = 1) {
  let d = "";
  for (let x = step; x < w; x += step) d += `M${x} 0V${h}`;
  for (let y = step; y < h; y += step) d += `M0 ${y}H${w}`;
  return `<path d="${d}" stroke="${stroke}" stroke-width="1" opacity="${opacity}" fill="none"/>`;
}

const rect = (x, y, w, h, fill, r = 8, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${extra ? " " + extra : ""}/>`;

// ---------------------------------------------------------------------------
// Product UI mockups (dark, 1600x1000)
// ---------------------------------------------------------------------------

function appChrome(w, h, accent, name, inner) {
  const sidebarW = 248;
  const top = 56;
  let nav = "";
  for (let i = 0; i < 7; i++) {
    const y = top + 92 + i * 44;
    const active = i === 1;
    nav += active ? rect(20, y - 14, sidebarW - 40, 34, accent, 8, 'opacity="0.18"') : "";
    nav += rect(36, y - 4, 14, 14, active ? accent : "#2A2C40", 4);
    nav += rect(62, y - 1, 70 + ((i * 37) % 60), 8, active ? "#C9CBE0" : "#33354A", 4);
  }
  return `
  ${rect(0, 0, w, h, C.ink, 0)}
  ${rect(0, 0, w, top, C.ink2, 0)}
  <circle cx="28" cy="28" r="6" fill="#2A2C40"/><circle cx="48" cy="28" r="6" fill="#2A2C40"/><circle cx="68" cy="28" r="6" fill="#2A2C40"/>
  ${rect(w / 2 - 220, 16, 440, 24, C.ink3, 12)}
  ${label(w / 2, 33, "app.placeholder.example", "#4B4E66", 12, "middle")}
  <path d="M0 ${top}H${w}" stroke="${C.lineDark}"/>
  ${rect(0, top, sidebarW, h - top, C.ink2, 0)}
  <path d="M${sidebarW} ${top}V${h}" stroke="${C.lineDark}"/>
  ${rect(24, top + 22, 28, 28, accent, 7)}
  <text x="64" y="${top + 42}" font-family="${SANS}" font-size="16" font-weight="600" fill="#E6E7F0">${esc(name)}</text>
  ${nav}
  ${rect(20, h - 76, sidebarW - 40, 52, C.ink3, 10)}
  ${label(36, h - 45, "[PLACEHOLDER UI]", "#4B4E66", 11)}
  <g transform="translate(${sidebarW},${top})">${inner(w - sidebarW, h - top)}</g>`;
}

function dashboard(w, h, accent, r) {
  const pad = 40;
  let s = `<text x="${pad}" y="58" font-family="${SANS}" font-size="26" font-weight="600" fill="#F1F2F8">Overview</text>`;
  s += rect(w - pad - 132, 30, 132, 40, accent, 10);
  s += rect(w - pad - 300, 30, 152, 40, C.ink3, 10, `stroke="${C.lineDark}"`);
  const cardW = (w - pad * 2 - 3 * 20) / 4;
  for (let i = 0; i < 4; i++) {
    const x = pad + i * (cardW + 20);
    s += rect(x, 100, cardW, 120, C.ink2, 14, `stroke="${C.lineDark}"`);
    s += rect(x + 22, 124, 90, 8, "#3A3D55", 4);
    s += rect(x + 22, 152, 60 + r() * 80, 26, "#E6E7F0", 6, 'opacity="0.85"');
    s += rect(x + 22, 194, 46, 8, i % 2 ? C.cyan : accent, 4, 'opacity="0.8"');
  }
  // chart
  const cx = pad, cy = 248, cw = w - pad * 2 - 380, ch = 360;
  s += rect(cx, cy, cw, ch, C.ink2, 14, `stroke="${C.lineDark}"`);
  s += rect(cx + 24, cy + 24, 140, 10, "#3A3D55", 5);
  let pts = [];
  for (let i = 0; i <= 12; i++) {
    const x = cx + 24 + (i * (cw - 48)) / 12;
    const y = cy + ch - 40 - (0.25 + 0.6 * (i / 12) * (0.6 + r() * 0.5)) * (ch - 120);
    pts.push([x, Math.max(cy + 70, y)]);
  }
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const area = `${line}L${pts.at(-1)[0]} ${cy + ch - 30}L${pts[0][0]} ${cy + ch - 30}Z`;
  for (let i = 1; i <= 4; i++) s += `<path d="M${cx + 24} ${cy + 70 + i * 60}H${cx + cw - 24}" stroke="${C.lineDark}"/>`;
  s += `<path d="${area}" fill="url(#area)"/><path d="${line}" stroke="url(#stroke)" stroke-width="3" fill="none"/>`;
  // side list
  const lx = cx + cw + 20, lw = 360;
  s += rect(lx, cy, lw, ch, C.ink2, 14, `stroke="${C.lineDark}"`);
  s += rect(lx + 24, cy + 24, 120, 10, "#3A3D55", 5);
  for (let i = 0; i < 6; i++) {
    const y = cy + 64 + i * 48;
    s += `<circle cx="${lx + 38}" cy="${y + 12}" r="12" fill="${i % 3 === 0 ? accent : "#2A2C40"}" opacity="${i % 3 === 0 ? 0.7 : 1}"/>`;
    s += rect(lx + 62, y + 2, 120 + r() * 100, 8, "#4A4D66", 4);
    s += rect(lx + 62, y + 16, 80 + r() * 60, 6, "#2E3044", 3);
  }
  // table
  const ty = cy + ch + 20;
  s += rect(pad, ty, w - pad * 2, h - ty - 30, C.ink2, 14, `stroke="${C.lineDark}"`);
  for (let i = 0; i < 4; i++) {
    const y = ty + 30 + i * 30;
    if (y > h - 50) break;
    s += rect(pad + 24, y, 180, 8, "#3E4158", 4);
    s += rect(pad + 300, y, 120, 8, "#2E3044", 4);
    s += rect(pad + 520, y, 90, 8, "#2E3044", 4);
    s += rect(w - pad - 120, y - 4, 80, 16, i % 2 ? C.cyan : accent, 8, 'opacity="0.22"');
  }
  return s;
}

function chat(w, h, accent, r) {
  const pad = 40;
  const panelW = 360;
  let s = `<text x="${pad}" y="58" font-family="${SANS}" font-size="26" font-weight="600" fill="#F1F2F8">Agent run</text>`;
  s += rect(pad + 150, 36, 86, 26, C.cyan, 13, 'opacity="0.16"');
  s += label(pad + 193, 54, "LIVE", C.cyan, 11, "middle");
  const mw = w - pad * 2 - panelW - 24;
  let y = 100;
  for (let i = 0; i < 6; i++) {
    const mine = i % 2 === 0;
    const bw = mw * (0.42 + r() * 0.3);
    const lines = 1 + Math.floor(r() * 3);
    const bh = 28 + lines * 20;
    const x = mine ? pad + mw - bw : pad + 44;
    if (!mine) s += rect(pad, y, 32, 32, accent, 9);
    s += rect(x, y, bw, bh, mine ? "#1D1F33" : C.ink2, 14, mine ? "" : `stroke="${C.lineDark}"`);
    for (let l = 0; l < lines; l++) s += rect(x + 18, y + 18 + l * 20, (bw - 36) * (l === lines - 1 ? 0.6 : 0.95), 8, mine ? "#5A5D7A" : "#40435C", 4);
    if (!mine && i === 3) {
      s += rect(x + 18, y + bh + 8, bw - 36, 64, "#0E0F18", 10, `stroke="${C.lineDark}"`);
      s += label(x + 34, y + bh + 34, "tool_call: search_records()", C.cyan, 12);
      s += rect(x + 34, y + bh + 48, 180, 7, "#2E3044", 3);
      y += 80;
    }
    y += bh + 22;
    if (y > h - 130) break;
  }
  s += rect(pad, h - 92, mw, 56, C.ink2, 14, `stroke="${C.lineDark}"`);
  s += rect(pad + 20, h - 68, 220, 8, "#3A3D55", 4);
  s += rect(pad + mw - 52, h - 82, 36, 36, accent, 10);
  const px = w - pad - panelW;
  s += rect(px, 30, panelW, h - 66, C.ink2, 14, `stroke="${C.lineDark}"`);
  s += rect(px + 24, 56, 110, 10, "#3A3D55", 5);
  for (let i = 0; i < 7; i++) {
    const yy = 92 + i * 62;
    if (yy > h - 120) break;
    s += rect(px + 24, yy, panelW - 48, 46, C.ink3, 10);
    s += `<circle cx="${px + 46}" cy="${yy + 23}" r="6" fill="${i < 4 ? C.cyan : "#3A3D55"}"/>`;
    s += rect(px + 64, yy + 14, 120 + r() * 80, 7, "#4A4D66", 3);
    s += rect(px + 64, yy + 27, 70 + r() * 50, 6, "#2E3044", 3);
  }
  return s;
}

function flow(w, h, accent, r) {
  const pad = 40;
  let s = `<text x="${pad}" y="58" font-family="${SANS}" font-size="26" font-weight="600" fill="#F1F2F8">Workflow</text>`;
  s += rect(pad, 90, w - pad * 2, h - 120, "#0C0D16", 14, `stroke="${C.lineDark}"`);
  // dotted canvas
  let dots = "";
  for (let x = pad + 20; x < w - pad; x += 28) for (let y = 110; y < h - 40; y += 28) dots += `M${x} ${y}h0.01`;
  s += `<path d="${dots}" stroke="#22243A" stroke-width="2.4" stroke-linecap="round"/>`;
  const nodes = [
    [pad + 70, 180], [pad + 70, 420], [pad + 400, 300], [pad + 730, 170], [pad + 730, 430], [pad + 1010, 300],
  ];
  const edges = [[0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5]];
  const nw = 220, nh = 92;
  for (const [a, b] of edges) {
    const [x1, y1] = nodes[a], [x2, y2] = nodes[b];
    const sx = x1 + nw, sy = y1 + nh / 2, ex = x2, ey = y2 + nh / 2, mx = (sx + ex) / 2;
    s += `<path d="M${sx} ${sy}C${mx} ${sy} ${mx} ${ey} ${ex} ${ey}" stroke="url(#stroke)" stroke-width="2" fill="none" opacity="0.8"/>`;
  }
  nodes.forEach(([x, y], i) => {
    if (x + nw > w - pad) return;
    const hl = i === 2;
    s += rect(x, y, nw, nh, C.ink2, 12, `stroke="${hl ? accent : C.lineDark}" stroke-width="${hl ? 2 : 1}"`);
    s += rect(x + 16, y + 18, 26, 26, i % 2 ? C.cyan : accent, 7, 'opacity="0.85"');
    s += rect(x + 54, y + 22, 100 + r() * 40, 8, "#C9CBE0", 4, 'opacity="0.8"');
    s += rect(x + 54, y + 38, 60 + r() * 40, 6, "#3A3D55", 3);
    s += rect(x + 16, y + 62, nw - 32, 6, "#23253A", 3);
  });
  return s;
}

const SCREENS = { dashboard, chat, flow };

function productScreen(name, accent, kind, seed) {
  const w = 1600, h = 1000;
  const r = rng(seed);
  const defs = `<linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${accent}" stop-opacity="0.45"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></linearGradient>
  <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>`;
  return svg(w, h, appChrome(w, h, accent, name, (iw, ih) => SCREENS[kind](iw, ih, accent, r)), {
    title: `[Placeholder] ${name} screenshot`,
    defs,
  });
}

function productHero(name, accent, kind, seed) {
  // Framed screenshot floating on an ink stage with a glow — 16:10.
  const w = 1600, h = 1000;
  const r = rng(seed);
  const defs = `<linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${accent}" stop-opacity="0.45"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></linearGradient>
  <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.62" r="0.55"><stop offset="0" stop-color="${accent}" stop-opacity="0.55"/><stop offset="0.6" stop-color="${C.cyan}" stop-opacity="0.08"/><stop offset="1" stop-color="${C.ink}" stop-opacity="0"/></radialGradient>
  <clipPath id="frame"><rect x="0" y="0" width="1600" height="1000" rx="28"/></clipPath>`;
  const inner = appChrome(1600, 1000, accent, name, (iw, ih) => SCREENS[kind](iw, ih, accent, r));
  const body = `${rect(0, 0, w, h, C.ink, 0)}${grid(w, h, 40, C.lineDark, 0.6)}${rect(0, 0, w, h, "url(#glow)", 0)}
  <g transform="translate(200,170) scale(0.75)"><g clip-path="url(#frame)">${inner}</g><rect x="0.5" y="0.5" width="1599" height="999" rx="28" fill="none" stroke="#2A2C40"/></g>
  ${label(48, 64, `// ${name.toUpperCase()}`, "#8B8FA8", 16)}${label(w - 48, 64, "[PLACEHOLDER]", "#8B8FA8", 16, "end")}`;
  return svg(w, h, body, { title: `[Placeholder] ${name} hero image`, defs });
}

function productLogo(letter, accent) {
  const s = 256;
  const body = `${rect(0, 0, s, s, C.ink, 56)}${rect(0, 0, s, s, "url(#lg)", 56, 'opacity="0.9"')}
  <text x="128" y="160" font-family="${SANS}" font-size="112" font-weight="700" fill="#FFFFFF" text-anchor="middle">${esc(letter)}</text>`;
  const defs = `<linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>`;
  return svg(s, s, body, { title: `[Placeholder] product logo ${letter}`, defs });
}

// ---------------------------------------------------------------------------
// Abstract covers (case studies, posts, services)
// ---------------------------------------------------------------------------

function abstractCover(w, h, { seed, a, b, motif, tag, dark = true }) {
  const r = rng(seed);
  const bg = dark ? C.ink : C.paper;
  const line = dark ? C.lineDark : C.lineLight;
  const defs = `<radialGradient id="g1" cx="${0.25 + r() * 0.5}" cy="${0.3 + r() * 0.4}" r="0.7"><stop offset="0" stop-color="${a}" stop-opacity="${dark ? 0.75 : 0.35}"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient>
  <radialGradient id="g2" cx="${0.5 + r() * 0.4}" cy="${0.5 + r() * 0.4}" r="0.6"><stop offset="0" stop-color="${b}" stop-opacity="${dark ? 0.55 : 0.3}"/><stop offset="1" stop-color="${b}" stop-opacity="0"/></radialGradient>
  <linearGradient id="ln" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  let m = "";
  const cx = w / 2, cy = h / 2;
  if (motif === "lattice") {
    const step = Math.round(w / 14);
    const pts = [];
    for (let y = step; y < h; y += step) for (let x = step; x < w; x += step) pts.push([x + (r() - 0.5) * step * 0.3, y + (r() - 0.5) * step * 0.3]);
    let d = "";
    pts.forEach(([x, y], i) => {
      const right = pts[i + 1];
      if (right && Math.abs(right[1] - y) < step / 2 && r() > 0.35) d += `M${x.toFixed(0)} ${y.toFixed(0)}L${right[0].toFixed(0)} ${right[1].toFixed(0)}`;
      const below = pts.find(([bx, by]) => by > y + step / 2 && Math.abs(bx - x) < step / 2);
      if (below && r() > 0.45) d += `M${x.toFixed(0)} ${y.toFixed(0)}L${below[0].toFixed(0)} ${below[1].toFixed(0)}`;
    });
    m += `<path d="${d}" stroke="url(#ln)" stroke-width="1.5" opacity="0.55" fill="none"/>`;
    pts.forEach(([x, y]) => {
      if (r() > 0.6) m += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(2 + r() * 4).toFixed(1)}" fill="${r() > 0.5 ? a : b}" opacity="0.9"/>`;
    });
  } else if (motif === "rings") {
    for (let i = 1; i <= 9; i++) m += `<circle cx="${cx}" cy="${cy}" r="${i * (h / 18)}" stroke="url(#ln)" stroke-width="${i % 3 ? 1 : 2}" opacity="${0.15 + i * 0.05}" fill="none"/>`;
    m += `<circle cx="${cx}" cy="${cy}" r="10" fill="${b}"/>`;
  } else if (motif === "bars") {
    const n = 22, bw = (w * 0.7) / n;
    for (let i = 0; i < n; i++) {
      const bh = h * (0.15 + 0.6 * Math.abs(Math.sin(i * 0.5 + r())));
      m += rect(w * 0.15 + i * bw, h * 0.82 - bh, bw * 0.55, bh, "url(#ln)", bw * 0.27, `opacity="${0.35 + (i / n) * 0.6}"`);
    }
  } else if (motif === "waves") {
    for (let i = 0; i < 12; i++) {
      const y0 = h * 0.25 + i * (h * 0.045);
      let d = `M0 ${y0}`;
      for (let x = 0; x <= w; x += w / 8) d += ` Q${x + w / 16} ${y0 + Math.sin(i * 0.7 + x / 180) * 60} ${x + w / 8} ${y0}`;
      m += `<path d="${d}" stroke="url(#ln)" stroke-width="1.5" opacity="${0.2 + i * 0.06}" fill="none"/>`;
    }
  } else if (motif === "phone") {
    const pw = h * 0.42, ph = h * 0.8;
    m += rect(cx - pw / 2, cy - ph / 2, pw, ph, dark ? C.ink2 : "#FFFFFF", 36, `stroke="url(#ln)" stroke-width="2"`);
    m += rect(cx - 40, cy - ph / 2 + 16, 80, 10, line, 5);
    for (let i = 0; i < 5; i++) m += rect(cx - pw / 2 + 24, cy - ph / 2 + 60 + i * 64, pw - 48, 48, i === 1 ? a : line, 10, `opacity="${i === 1 ? 0.6 : 1}"`);
  } else if (motif === "brackets") {
    m += `<text x="${cx}" y="${cy + h * 0.12}" font-family="${MONO}" font-size="${h * 0.36}" fill="url(#ln)" text-anchor="middle" opacity="0.9">{ }</text>`;
  } else if (motif === "cloud") {
    const nodes = [[0.3, 0.35], [0.5, 0.25], [0.7, 0.38], [0.38, 0.62], [0.62, 0.65], [0.5, 0.48]];
    let d = "";
    nodes.forEach(([x, y], i) => nodes.slice(i + 1).forEach(([x2, y2]) => (d += `M${x * w} ${y * h}L${x2 * w} ${y2 * h}`)));
    m += `<path d="${d}" stroke="url(#ln)" stroke-width="1.2" opacity="0.4"/>`;
    nodes.forEach(([x, y], i) => (m += rect(x * w - 34, y * h - 22, 68, 44, dark ? C.ink2 : "#FFFFFF", 10, `stroke="${i === 5 ? b : a}" stroke-width="2"`)));
  } else if (motif === "grid-blocks") {
    const s2 = Math.round(h / 10);
    for (let y = s2; y < h - s2; y += s2) for (let x = s2; x < w - s2; x += s2) if (r() > 0.82) m += rect(x + 2, y + 2, s2 - 4, s2 - 4, r() > 0.5 ? a : b, 6, `opacity="${(0.2 + r() * 0.6).toFixed(2)}"`);
  }
  const body = `${rect(0, 0, w, h, bg, 0)}${rect(0, 0, w, h, "url(#g1)", 0)}${rect(0, 0, w, h, "url(#g2)", 0)}
  ${grid(w, h, Math.round(w / 32), line, dark ? 0.55 : 0.8)}${m}
  ${label(40, 56, tag ? `// ${tag.toUpperCase()}` : "", dark ? "#8B8FA8" : C.slate, 16)}${label(w - 40, h - 36, "[PLACEHOLDER]", dark ? "#8B8FA8" : C.slate, 16, "end")}`;
  return svg(w, h, body, { title: `[Placeholder] ${tag ?? "cover"} image`, defs });
}

// ---------------------------------------------------------------------------
// Avatars + client logos
// ---------------------------------------------------------------------------

function avatar(initials, a, b, seed) {
  const s = 400;
  const r = rng(seed);
  const defs = `<linearGradient id="av" x1="${r()}" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const body = `${rect(0, 0, s, s, C.ink, 0)}${rect(0, 0, s, s, "url(#av)", 0, 'opacity="0.55"')}${grid(s, s, 25, "#FFFFFF", 0.06)}
  <circle cx="200" cy="160" r="72" fill="#FFFFFF" opacity="0.14"/><path d="M68 400C80 300 140 258 200 258S320 300 332 400Z" fill="#FFFFFF" opacity="0.14"/>
  <text x="200" y="182" font-family="${MONO}" font-size="64" font-weight="600" fill="#FFFFFF" text-anchor="middle">${esc(initials)}</text>
  ${label(200, 372, "[PLACEHOLDER]", "#FFFFFF", 14, "middle")}`;
  return svg(s, s, body, { title: `[Placeholder] avatar ${initials}`, defs });
}

const GLYPHS = [
  (c) => `<circle cx="28" cy="40" r="16" fill="none" stroke="${c}" stroke-width="5"/>`,
  (c) => `<rect x="12" y="24" width="32" height="32" rx="6" fill="${c}"/>`,
  (c) => `<path d="M12 56L28 24L44 56Z" fill="${c}"/>`,
  (c) => `<path d="M12 40h32M28 24v32" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`,
  (c) => `<path d="M12 28h32M12 40h24M12 52h32" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`,
  (c) => `<circle cx="20" cy="40" r="9" fill="${c}"/><circle cx="38" cy="40" r="9" fill="${c}" opacity="0.55"/>`,
  (c) => `<path d="M28 22l16 9v18l-16 9-16-9V31z" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>`,
  (c) => `<path d="M12 50Q28 14 44 50" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`,
];

function clientLogo(n) {
  const w = 200, h = 80;
  const glyphColor = n % 2 ? C.indigo : C.cyan;
  const body = `${GLYPHS[(n - 1) % GLYPHS.length](glyphColor)}
  <text x="56" y="48" font-family="${SANS}" font-size="22" font-weight="600" letter-spacing="-0.3" fill="${C.slate}">Client ${String(n).padStart(2, "0")}</text>`;
  return svg(w, h, body, { title: `[Placeholder] Client ${String(n).padStart(2, "0")} logo` });
}

// ---------------------------------------------------------------------------
// Generate
// ---------------------------------------------------------------------------

const products = [
  { slug: "agent-studio", name: "Agent Studio", letter: "A", accent: C.indigo, kinds: ["chat", "flow", "dashboard"] },
  { slug: "flow-builder", name: "Flow Builder", letter: "F", accent: "#7C6CFF", kinds: ["flow", "dashboard", "chat"] },
  { slug: "insight-hub", name: "Insight Hub", letter: "I", accent: "#0EA5C6", kinds: ["dashboard", "chat", "flow"] },
];
let count = 0;
products.forEach((p, i) => {
  write(`products/${p.slug}/logo.svg`, productLogo(p.letter, p.accent));
  write(`products/${p.slug}/hero.svg`, productHero(p.name, p.accent, p.kinds[0], 100 + i));
  p.kinds.forEach((k, j) => write(`products/${p.slug}/screen-0${j + 1}.svg`, productScreen(p.name, p.accent, k, 200 + i * 10 + j)));
  count += 5;
});

const services = [
  ["ai-agents-automation", "lattice", C.indigo, C.cyan, "AI agents"],
  ["custom-software", "brackets", C.indigo, C.cyan, "Custom software"],
  ["web-saas-platforms", "grid-blocks", C.indigo, C.cyan, "Web & SaaS"],
  ["mobile-apps", "phone", C.cyan, C.indigo, "Mobile"],
  ["product-design", "rings", "#8B7CFF", C.cyan, "Product design"],
  ["cloud-devops", "cloud", C.cyan, C.indigo, "Cloud & DevOps"],
];
services.forEach(([slug, motif, a, b, tag], i) => {
  write(`services/${slug}.svg`, abstractCover(1200, 900, { seed: 300 + i, a, b, motif, tag }));
  count++;
});

const work = [
  ["logistics-dispatch-agent", "lattice", C.indigo, C.cyan, "Logistics"],
  ["healthcare-intake-platform", "waves", C.cyan, C.indigo, "Healthcare"],
  ["fintech-mobile-app", "phone", "#8B7CFF", C.cyan, "Financial services"],
  ["retail-inventory-forecasting", "bars", C.indigo, C.cyan, "Retail"],
];
work.forEach(([slug, motif, a, b, tag], i) => {
  write(`work/${slug}/cover.svg`, abstractCover(1600, 1000, { seed: 400 + i, a, b, motif, tag }));
  write(`work/${slug}/gallery-01.svg`, productScreen("[Placeholder] Project", a, ["dashboard", "flow", "chat"][i % 3], 500 + i));
  write(`work/${slug}/gallery-02.svg`, abstractCover(1600, 1000, { seed: 450 + i, a: b, b: a, motif: "grid-blocks", tag: `${tag} — detail` }));
  count += 3;
});

const posts = [
  ["building-ai-agents-in-production", "lattice", C.indigo, C.cyan, "AI engineering"],
  ["our-process-discovery-to-launch", "waves", C.cyan, C.indigo, "Process"],
  ["case-study-deep-dive-dispatch-agent", "rings", "#8B7CFF", C.cyan, "Case study"],
];
posts.forEach(([slug, motif, a, b, tag], i) => {
  write(`posts/${slug}.svg`, abstractCover(1600, 900, { seed: 600 + i, a, b, motif, tag }));
  count++;
});

[
  ["founder", "P1", C.indigo, C.cyan],
  ["engineering-lead", "P2", C.cyan, C.indigo],
  ["design-lead", "P3", "#8B7CFF", C.cyan],
].forEach(([id, initials, a, b], i) => {
  write(`team/${id}.svg`, avatar(initials, a, b, 700 + i));
  count++;
});

for (let n = 1; n <= 8; n++) {
  write(`clients/client-${String(n).padStart(2, "0")}.svg`, clientLogo(n));
  count++;
}

// Testimonial avatars reuse the neutral avatar style.
[["testimonial-01", "T1"], ["testimonial-02", "T2"], ["testimonial-03", "T3"]].forEach(([id, initials], i) => {
  write(`testimonials/${id}.svg`, avatar(initials, i % 2 ? C.cyan : C.indigo, i % 2 ? C.indigo : C.cyan, 800 + i));
  count++;
});

console.log(`wrote ${count} placeholder SVGs to ${out}`);
