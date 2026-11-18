import type { ReactNode, SVGProps } from "react";

/**
 * Simplified monochrome tech marks for the homepage tech-stack grid, keyed by
 * `site.techStack.tools[].logo`. Drawn in-house as recognisable line icons /
 * text marks (not the vendors' official artwork), all in `currentColor` on a
 * 32×32 grid. Unknown keys fall back to a text mark built from the name.
 */

const LINE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const TEXT = {
  fill: "currentColor",
  fontFamily: "var(--font-sans)",
  fontWeight: 700,
  letterSpacing: "-0.02em",
} as const;

function Atom({ rx = 13, ry = 5, cx = 16, cy = 16, dot = 2.4 }) {
  return (
    <>
      <g {...LINE} strokeWidth={1.4}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(60 ${cx} ${cy})`} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(120 ${cx} ${cy})`} />
      </g>
      <circle cx={cx} cy={cy} r={dot} fill="currentColor" />
    </>
  );
}

const PYTHON_HALF =
  "M16 3h-3.5a4 4 0 0 0-4 4v3H16v1.5H7a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h2V19a3.5 3.5 0 0 1 3.5-3.5h7a3 3 0 0 0 3-3V7a4 4 0 0 0-4-4z";

export const TECH_LOGOS: Record<string, ReactNode> = {
  react: <Atom />,
  "react-native": (
    <>
      <rect x="8.5" y="2.5" width="15" height="27" rx="3.5" {...LINE} />
      <path d="M14 26.2h4" {...LINE} />
      <Atom rx={5.6} ry={2.2} cy={14.5} dot={1.2} />
    </>
  ),
  nextjs: (
    <>
      <circle cx="16" cy="16" r="13.5" {...LINE} />
      <path d="M11.5 21.5v-11l10.5 14M20.5 10.5v7" {...LINE} />
    </>
  ),
  typescript: (
    <>
      <rect x="3.5" y="3.5" width="25" height="25" rx="4" {...LINE} />
      <text x="26" y="25.5" textAnchor="end" fontSize="11.5" {...TEXT}>
        TS
      </text>
    </>
  ),
  nodejs: (
    <>
      <path d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25z" {...LINE} />
      <text x="16" y="20" textAnchor="middle" fontSize="10.5" {...TEXT}>
        JS
      </text>
    </>
  ),
  python: (
    <>
      <g {...LINE} strokeWidth={1.4}>
        <path d={PYTHON_HALF} />
        <path d={PYTHON_HALF} transform="rotate(180 16 16)" />
      </g>
      <circle cx="12.2" cy="6.6" r="1.15" fill="currentColor" />
      <circle cx="19.8" cy="25.4" r="1.15" fill="currentColor" />
    </>
  ),
  ai: (
    <>
      <path
        d="M14 6c.8 6.2 4.8 10.2 11 11-6.2.8-10.2 4.8-11 11-.8-6.2-4.8-10.2-11-11 6.2-.8 10.2-4.8 11-11z"
        fill="currentColor"
      />
      <path d="M25 3.5c.3 2.3 1.7 3.7 4 4-2.3.3-3.7 1.7-4 4-.3-2.3-1.7-3.7-4-4 2.3-.3 3.7-1.7 4-4z" fill="currentColor" opacity="0.7" />
    </>
  ),
  postgres: (
    <g {...LINE}>
      <ellipse cx="16" cy="8" rx="10" ry="3.6" />
      <path d="M6 8v16c0 2 4.5 3.6 10 3.6S26 26 26 24V8" />
      <path d="M6 13.4c0 2 4.5 3.6 10 3.6s10-1.6 10-3.6M6 18.8c0 2 4.5 3.6 10 3.6s10-1.6 10-3.6" />
    </g>
  ),
  aws: (
    <>
      <text x="16" y="17" textAnchor="middle" fontSize="12.5" {...TEXT}>
        aws
      </text>
      <path d="M5.5 21.2c6.4 3.9 14.6 3.9 21 0" {...LINE} />
      <path d="M23.4 19.6l3.3 1.4-1.1 3.3" {...LINE} />
    </>
  ),
  gcp: (
    <>
      <path d="M10 24h13a5.5 5.5 0 0 0 .6-11 7.5 7.5 0 0 0-14.4 1.8A4.6 4.6 0 0 0 10 24z" {...LINE} />
      <path d="M13.5 19.5h6" {...LINE} />
    </>
  ),
  vercel: <path d="M16 5.5 28 26.5H4z" fill="currentColor" />,
  docker: (
    <>
      <g {...LINE} strokeWidth={1.2}>
        <rect x="6.5" y="13" width="3.4" height="3.4" rx=".4" />
        <rect x="10.5" y="13" width="3.4" height="3.4" rx=".4" />
        <rect x="14.5" y="13" width="3.4" height="3.4" rx=".4" />
        <rect x="18.5" y="13" width="3.4" height="3.4" rx=".4" />
        <rect x="10.5" y="9" width="3.4" height="3.4" rx=".4" />
        <rect x="14.5" y="9" width="3.4" height="3.4" rx=".4" />
        <rect x="14.5" y="5" width="3.4" height="3.4" rx=".4" />
      </g>
      <path d="M3 18.5h22.6c1.1-1.6 3.2-2.1 4.4-1.3-.4 1.6-1.6 2.7-3.2 2.9C24.9 24.6 20 27.5 13.6 27.5 7.6 27.5 4 24.2 3 18.5z" {...LINE} />
    </>
  ),
};

export type TechLogoProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  /** Key from site.techStack.tools[].logo. */
  logo: string;
  /** Used for the fallback text mark when `logo` is unknown. */
  name?: string;
};

/** Decorative by default (aria-hidden); pair it with a visible name. */
export function TechLogo({ logo, name, ...props }: TechLogoProps) {
  const mark = TECH_LOGOS[logo];
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" {...props}>
      {mark ?? (
        <>
          <rect x="3.5" y="3.5" width="25" height="25" rx="6" {...LINE} />
          <text x="16" y="20.5" textAnchor="middle" fontSize="11" {...TEXT}>
            {(name ?? logo).replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}
          </text>
        </>
      )}
    </svg>
  );
}
