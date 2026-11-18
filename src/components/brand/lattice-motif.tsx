import { useId } from "react";
import { cn } from "@/lib/cn";
import { buildLattice } from "@/components/sections/hero/lattice-geometry";

// Static, lightweight decorative lattice (SVG/CSS, no WebGL) for the final CTA,
// 404 page and dark panels. Same triangular geometry and indigo → cyan palette
// as the hero lattice. Server-renderable; one <svg> with five paths.
export type LatticeMotifProps = {
  className?: string;
  /** Visual density of nodes */
  density?: "sparse" | "normal" | "dense";
  /** Fade edges with a radial mask */
  fade?: boolean;
};

const DENSITY = {
  sparse: { cols: 14, rows: 10, spacing: 80 },
  normal: { cols: 20, rows: 14, spacing: 56 },
  dense: { cols: 28, rows: 20, spacing: 40 },
} as const;

const MASK = "radial-gradient(ellipse 60% 62% at 50% 50%, #000 28%, transparent 78%)";

type Geometry = { viewBox: string; lines: [string, string, string]; nodes: string; hubs: { x: number; y: number }[] };

const cache = new Map<string, Geometry>();

function geometry(density: keyof typeof DENSITY): Geometry {
  const hit = cache.get(density);
  if (hit) return hit;
  const { cols, rows, spacing } = DENSITY[density];
  const { nodes, seeds, edges, weights, width, height } = buildLattice({ cols, rows, spacing, dropout: 0.24, seed: 5 });
  const pad = spacing * 0.6;
  const ox = width / 2 + pad;
  const oy = height / 2 + pad;
  const r = (v: number) => Math.round(v * 10) / 10;
  const x = (i: number) => r(nodes[i * 2] + ox);
  const y = (i: number) => r(nodes[i * 2 + 1] + oy);

  // Lines in three brightness buckets → three paths.
  const lines: [string[], string[], string[]] = [[], [], []];
  for (let e = 0; e < weights.length; e++) {
    const a = edges[e * 2];
    const b = edges[e * 2 + 1];
    const bucket = weights[e] > 0.82 ? 2 : weights[e] > 0.45 ? 1 : 0;
    lines[bucket].push(`M${x(a)} ${y(a)}L${x(b)} ${y(b)}`);
  }

  // Regular nodes as one path of tiny circles; ~5% become glowing hubs.
  const nr = r(Math.max(1.4, spacing * 0.035));
  const dots: string[] = [];
  const hubs: { x: number; y: number }[] = [];
  for (let i = 0; i < seeds.length; i++) {
    if (seeds[i] > 0.95) hubs.push({ x: x(i), y: y(i) });
    else dots.push(`M${r(x(i) - nr)} ${y(i)}a${nr} ${nr} 0 1 0 ${r(nr * 2)} 0a${nr} ${nr} 0 1 0 ${-r(nr * 2)} 0`);
  }

  const result: Geometry = {
    viewBox: `0 0 ${r(width + pad * 2)} ${r(height + pad * 2)}`,
    lines: [lines[0].join(""), lines[1].join(""), lines[2].join("")],
    nodes: dots.join(""),
    hubs,
  };
  cache.set(density, result);
  return result;
}

export function LatticeMotif({ className, density = "normal", fade = true }: LatticeMotifProps) {
  const id = useId().replace(/:/g, "");
  const g = geometry(density);
  const { spacing } = DENSITY[density];
  const stroke = `url(#${id}-line)`;

  return (
    <div
      aria-hidden="true"
      data-slot="lattice-motif"
      className={cn("pointer-events-none overflow-hidden select-none", className)}
      style={fade ? { maskImage: MASK, WebkitMaskImage: MASK } : undefined}
    >
      <svg viewBox={g.viewBox} preserveAspectRatio="xMidYMid slice" className="block size-full" fill="none">
        <defs>
          <linearGradient id={`${id}-line`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#5b4cf5" />
            <stop offset="0.5" stopColor="#8c7cff" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
          <radialGradient id={`${id}-hub`}>
            <stop offset="0" stopColor="#e6f9ff" />
            <stop offset="0.18" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#5b4cf5" stopOpacity="0.25" />
            <stop offset="1" stopColor="#5b4cf5" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g stroke={stroke} strokeWidth={1} vectorEffect="non-scaling-stroke">
          <path d={g.lines[0]} strokeOpacity={0.14} vectorEffect="non-scaling-stroke" />
          <path d={g.lines[1]} strokeOpacity={0.26} vectorEffect="non-scaling-stroke" />
          <path d={g.lines[2]} strokeOpacity={0.45} vectorEffect="non-scaling-stroke" />
        </g>
        <path d={g.nodes} fill={stroke} fillOpacity={0.7} />
        <g>
          {g.hubs.map((h) => (
            <circle key={`${h.x}-${h.y}`} cx={h.x} cy={h.y} r={spacing * 0.32} fill={`url(#${id}-hub)`} />
          ))}
        </g>
      </svg>
    </div>
  );
}
