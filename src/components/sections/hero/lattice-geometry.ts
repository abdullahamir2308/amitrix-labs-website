/**
 * Shared geometry for the hero lattice (WebGL scene, 2D canvas fallback) and the
 * static <LatticeMotif>. A triangular lattice — the same geometry as the
 * "Lattice A" mark — with a few edges dropped and a per-node seed, built from a
 * seeded PRNG so every render (server, client, still generator) is identical.
 */

export type LatticeOptions = {
  cols: number;
  rows: number;
  /** Distance between neighbouring nodes. */
  spacing: number;
  /** 0–1 share of edges removed, so the network reads organic rather than a mesh. */
  dropout?: number;
  seed?: number;
};

export type Lattice = {
  /** Node positions, centred on the origin: x0, y0, x1, y1, … */
  nodes: Float32Array;
  /** One random 0–1 value per node (size, hub status, reveal jitter). */
  seeds: Float32Array;
  /** Edge endpoints as node-index pairs: a0, b0, a1, b1, … */
  edges: Uint32Array;
  /** One random 0–1 brightness weight per edge. */
  weights: Float32Array;
  /** Half the diagonal of the lattice (for normalising distances). */
  extent: number;
  width: number;
  height: number;
};

/** Small, fast deterministic PRNG (mulberry32). */
export function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ROW_HEIGHT = Math.sqrt(3) / 2;

export function buildLattice({ cols, rows, spacing, dropout = 0.18, seed = 7 }: LatticeOptions): Lattice {
  const rand = prng(seed);
  const count = cols * rows;
  const nodes = new Float32Array(count * 2);
  const seeds = new Float32Array(count);
  const width = (cols - 0.5) * spacing;
  const height = (rows - 1) * spacing * ROW_HEIGHT;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const k = j * cols + i;
      nodes[k * 2] = (i + (j % 2) * 0.5) * spacing - width / 2;
      nodes[k * 2 + 1] = j * spacing * ROW_HEIGHT - height / 2;
      seeds[k] = rand();
    }
  }

  const edges: number[] = [];
  const weights: number[] = [];
  const add = (a: number, b: number) => {
    if (rand() < dropout) return;
    edges.push(a, b);
    weights.push(rand());
  };

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const k = j * cols + i;
      if (i + 1 < cols) add(k, k + 1);
      if (j + 1 < rows) {
        const up = (j + 1) * cols;
        // Odd rows are shifted right by half a cell.
        const left = j % 2 === 0 ? i - 1 : i;
        const right = j % 2 === 0 ? i : i + 1;
        if (left >= 0) add(k, up + left);
        if (right < cols) add(k, up + right);
      }
    }
  }

  return {
    nodes,
    seeds,
    edges: Uint32Array.from(edges),
    weights: Float32Array.from(weights),
    extent: Math.hypot(width, height) / 2,
    width,
    height,
  };
}

/** Brand colours as 0–1 RGB (match --brand-indigo / --brand-cyan in globals.css). */
export const LATTICE_COLORS = {
  indigo: [0x5b / 255, 0x4c / 255, 0xf5 / 255],
  violet: [0x8c / 255, 0x7c / 255, 0xff / 255],
  cyan: [0x22 / 255, 0xd3 / 255, 0xee / 255],
} as const;

/**
 * Scene framing shared by the WebGL scene and the 2D fallback, so both draw the
 * same composition: a tilted sheet, dense right of centre, receding upward.
 */
export const LATTICE_VIEW = {
  fov: 38,
  cameraZ: 12,
  /** Group transform (radians / world units). */
  rotationX: -1.02,
  rotationZ: 0.38,
  positionX: 2.6,
  positionY: -0.6,
  /** Extra tilt and lift applied over the scroll-out progress (0–1). */
  scrollTilt: 0.55,
  scrollLift: 1.6,
} as const;
