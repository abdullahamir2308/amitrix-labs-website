import type { ComponentType, ReactNode, SVGProps } from "react";
import lattice from "./lattice-mark.json";
import { BRAND } from "./tokens";
import {
  LOCKUP,
  WORDMARKS,
  type WordmarkData,
  type WordmarkTone,
} from "./wordmarks.generated";

/*
 * Logo concepts for Amitrix Labs. Every mark is drawn on a 32-unit grid with a 2.25
 * stroke, uses currentColor for the main artwork (so it adapts to light and dark) and the
 * brand indigo / cyan as accents. Wordmarks are outlined from Geist by
 * scripts/brand-assets.mjs, so they render identically everywhere.
 */

const STROKE = 2.25;
const MUTED_OPACITY = 0.55;

type LogoProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> & {
  /** Accessible name. Ignored when aria-hidden is set. */
  title?: string;
};

function Svg({
  title = "Amitrix Labs",
  viewBox,
  children,
  ...props
}: LogoProps & { viewBox: string; children: ReactNode }) {
  const hidden = props["aria-hidden"] === true || props["aria-hidden"] === "true";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="none"
      role={hidden ? undefined : "img"}
      aria-label={hidden ? undefined : title}
      {...props}
    >
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Mark artwork (32 x 32)
// ---------------------------------------------------------------------------

const toneColor = (tone: string) =>
  tone === "indigo" ? BRAND.indigo : tone === "cyan" ? BRAND.cyan : "currentColor";

/** 01 — Lattice A: six lattice nodes; the outer edges and crossbar draw the A. */
function LatticeArt() {
  const byId = Object.fromEntries(lattice.nodes.map((n) => [n.id, n]));
  return (
    <>
      <g stroke="currentColor" strokeWidth={lattice.strokeWidth} strokeLinecap="round">
        {lattice.edges.map((e) => {
          const a = byId[e.from];
          const b = byId[e.to];
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeOpacity={e.tone === "faint" ? lattice.faintOpacity : undefined}
            />
          );
        })}
      </g>
      {lattice.nodes.map((n) => (
        <circle key={n.id} cx={n.x} cy={n.y} r={lattice.nodeRadius} fill={toneColor(n.tone)} />
      ))}
    </>
  );
}

/** 02 — Grid A: one grid cell; a signal pulse passing through it forms the A. */
function GridArt() {
  return (
    <>
      <rect
        x={4.125}
        y={4.125}
        width={23.75}
        height={23.75}
        rx={4}
        stroke="currentColor"
        strokeWidth={STROKE}
      />
      <polyline
        points="4.125,22 10,22 16,8.5 22,22 27.875,22"
        stroke={BRAND.indigo}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1={12.22}
        y1={17}
        x2={19.78}
        y2={17}
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <circle cx={16} cy={8.5} r={2.75} fill={BRAND.cyan} />
    </>
  );
}

const HEX = (() => {
  const r = 12.5;
  const pts = [-90, -30, 30, 90, 150, 210].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return { x: +(16 + r * Math.cos(a)).toFixed(2), y: +(16 + r * Math.sin(a)).toFixed(2) };
  });
  return pts;
})();

/** 03 — Hex network: a hexagon of nodes with an isometric "Y" core (a lab block). */
function HexArt() {
  const [top, , lowerRight, , lowerLeft] = HEX;
  return (
    <>
      <polygon
        points={HEX.map((p) => `${p.x},${p.y}`).join(" ")}
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <g stroke={BRAND.indigo} strokeWidth={STROKE} strokeLinecap="round">
        {[top, lowerLeft, lowerRight].map((p) => (
          <line key={`${p.x}-${p.y}`} x1={16} y1={16} x2={p.x} y2={p.y} />
        ))}
      </g>
      {HEX.map((p) => (
        <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r={2.5} fill="currentColor" />
      ))}
      <circle cx={16} cy={16} r={3} fill={BRAND.cyan} />
    </>
  );
}

/** 04 — Mono AL: an indigo tile with a mono-style Λ and L; a cyan pixel sits in the L's notch. */
function MonoArt() {
  return (
    <>
      <rect x={2} y={2} width={28} height={28} rx={7} fill={BRAND.indigo} />
      <path
        fill="#FFFFFF"
        d="M7 23 9.75 9h3l2.75 14H13l-1.75-8.91L9.5 23H7ZM18 9h2.5v11.5H25V23h-7V9Z"
      />
      <rect x={22.5} y={9} width={2.5} height={2.5} fill={BRAND.cyan} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Wordmark + lockup
// ---------------------------------------------------------------------------

function WordmarkPaths({ data }: { data: WordmarkData }) {
  const fill = (tone: WordmarkTone) => toneColor(tone);
  return (
    <>
      {data.segments.map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill={fill(s.tone)}
          fillOpacity={s.tone === "muted" ? MUTED_OPACITY : undefined}
        />
      ))}
    </>
  );
}

function makeMark(Art: ComponentType) {
  function Mark(props: LogoProps) {
    return (
      <Svg viewBox="0 0 32 32" {...props}>
        <Art />
      </Svg>
    );
  }
  return Mark;
}

function makeWordmark(data: WordmarkData) {
  function Wordmark(props: LogoProps) {
    return (
      <Svg viewBox={`0 ${data.top} ${data.width} ${data.bottom - data.top}`} {...props}>
        <WordmarkPaths data={data} />
      </Svg>
    );
  }
  return Wordmark;
}

function makeLockup(Art: ComponentType, data: WordmarkData) {
  const x = LOCKUP.markSize + LOCKUP.gap;
  const y = LOCKUP.capTop;
  const top = Math.min(0, y + data.top);
  const bottom = Math.max(LOCKUP.markSize, y + data.bottom);
  const viewBox = `0 ${top} ${x + data.width} ${bottom - top}`;
  function Lockup(props: LogoProps) {
    return (
      <Svg viewBox={viewBox} {...props}>
        <Art />
        <g transform={`translate(${x} ${y})`}>
          <WordmarkPaths data={data} />
        </g>
      </Svg>
    );
  }
  return Lockup;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type LogoConcept = {
  number: string;
  name: string;
  description: string;
  Mark: ComponentType<LogoProps>;
  Wordmark: ComponentType<LogoProps>;
  Lockup: ComponentType<LogoProps>;
};

export const LatticeMark = makeMark(LatticeArt);
export const LatticeWordmark = makeWordmark(WORDMARKS.lattice);
export const LatticeLockup = makeLockup(LatticeArt, WORDMARKS.lattice);

export const LOGO_CONCEPTS: LogoConcept[] = [
  {
    number: "01",
    name: "Lattice A",
    description:
      "Six nodes on a triangular lattice. The outer edges and crossbar draw the A; the faint inner edges and the cyan base node hint at the network underneath.",
    Mark: LatticeMark,
    Wordmark: LatticeWordmark,
    Lockup: LatticeLockup,
  },
  {
    number: "02",
    name: "Grid A",
    description:
      "A single grid cell with a signal pulse running through it. The pulse peaks into an A; the crossbar closes it.",
    Mark: makeMark(GridArt),
    Wordmark: makeWordmark(WORDMARKS.grid),
    Lockup: makeLockup(GridArt, WORDMARKS.grid),
  },
  {
    number: "03",
    name: "Hex network",
    description:
      "A hexagon of nodes with an isometric Y core: a node network that also reads as a building block or a lab cube.",
    Mark: makeMark(HexArt),
    Wordmark: makeWordmark(WORDMARKS.hex),
    Lockup: makeLockup(HexArt, WORDMARKS.hex),
  },
  {
    number: "04",
    name: "Mono AL",
    description:
      "A monospace monogram: a crossbar-less Λ and an L on an indigo tile, with a single cyan pixel in the L's notch. Pairs with a Geist Mono wordmark.",
    Mark: makeMark(MonoArt),
    Wordmark: makeWordmark(WORDMARKS.mono),
    Lockup: makeLockup(MonoArt, WORDMARKS.mono),
  },
];
