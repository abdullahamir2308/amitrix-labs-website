/**
 * Small helpers shared by the Phase 7 homepage sections (products, work,
 * process, stack, testimonials). Server-safe (no "use client").
 */

/**
 * Splits a site.sections eyebrow like "// 04 — OUR PRODUCTS" into the parts
 * <Eyebrow index="04">Our products</Eyebrow> expects (it draws the "//" and dash itself).
 */
export function parseEyebrow(raw: string): { index?: string; label: string } {
  const cleaned = raw.replace(/^\s*\/\/\s*/, "").trim();
  const match = cleaned.match(/^(\d+)\s*[—–-]\s*(.+)$/);
  if (match) return { index: match[1], label: match[2] };
  return { label: cleaned };
}

/** Product status → Badge variant + label. */
export const STATUS_BADGE = {
  live: { variant: "live", label: "Live" },
  beta: { variant: "beta", label: "Beta" },
  "coming-soon": { variant: "soon", label: "Coming soon" },
} as const;
