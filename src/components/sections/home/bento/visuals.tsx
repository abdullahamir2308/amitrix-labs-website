import type { ReactNode } from "react";
import {
  BatteryFull,
  Check,
  FlaskConical,
  GitCommitHorizontal,
  Lock,
  Package,
  Rocket,
  Wifi,
} from "lucide-react";
import { LatticeMark } from "@/components/brand/logos";
import { cn } from "@/lib/cn";
import s from "./bento.module.css";

/*
 * Decorative UI fragments for the services bento (aria-hidden by <VisualFrame>).
 * The labels inside them are illustrative interface text, not marketing copy.
 * One accent element loops per visual — see bento.module.css.
 */

function Lights() {
  return (
    <span className={s.lights}>
      <i />
      <i />
      <i />
    </span>
  );
}

/** AI agents: a chat with tool-call steps; the "thinking" dots are the accent. */
function AgentChat() {
  return (
    <div className={s.chat}>
      <div className={s.userMsg}>Triage today&apos;s support inbox and draft replies.</div>
      <div className={s.agentRow}>
        <span className={s.avatar}>
          <LatticeMark width={15} height={15} aria-hidden="true" />
        </span>
        <div className={cn(s.panel, s.agentMsg)}>
          <ul className={s.steps}>
            <li className={s.step}>
              <Check className={s.check} strokeWidth={2} />
              <code>inbox.search</code>
              <span className={s.mono}>status:open</span>
            </li>
            <li className={s.step}>
              <Check className={s.check} strokeWidth={2} />
              <code>kb.retrieve</code>
              <span className={s.mono}>policies, past replies</span>
            </li>
            <li className={cn(s.step, s.thinking)}>
              <span className={s.dots}>
                <i />
                <i />
                <i />
              </span>
              <span>Drafting replies</span>
            </li>
          </ul>
          <div className={s.approve}>
            <span className={s.mono}>Needs approval</span>
            <span className={s.pills}>
              <span className={s.pill}>Edit</span>
              <span className={cn(s.pill, s.pillPrimary)}>Approve</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Custom software: a code editor; the last line types itself. */
function CodeEditor() {
  const lines: ReactNode[] = [
    <>
      <span className={s.kw}>import</span> {"{ erp, db }"} <span className={s.kw}>from</span>{" "}
      <span className={s.str}>&quot;@/lib&quot;</span>
    </>,
    " ",
    <>
      <span className={s.kw}>export async function</span> <span className={s.fn}>syncOrders</span>() {"{"}
    </>,
    <>
      {"  "}
      <span className={s.kw}>const</span> orders = <span className={s.kw}>await</span> erp.orders.
      <span className={s.fn}>list</span>()
    </>,
    <>
      {"  "}
      <span className={s.typed}>
        <span className={s.kw}>return</span> db.orders.<span className={s.fn}>upsert</span>(orders)
      </span>
    </>,
    "}",
  ];
  return (
    <div className={cn(s.panel, s.editor)}>
      <div className={s.chrome}>
        <Lights />
        <span className={s.mono}>sync-orders.ts</span>
      </div>
      <div className={s.code}>
        {lines.map((line, i) => (
          <div key={i} className={s.line}>
            <span className={s.ln}>{i + 1}</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Web & SaaS: a browser with a small dashboard; the chart line draws. */
function BrowserDashboard() {
  return (
    <div className={cn(s.panel, s.browser)}>
      <div className={s.chrome}>
        <Lights />
        <span className={cn(s.url, s.mono)}>
          <Lock width={8} height={8} strokeWidth={2} />
          app.yourproduct.com
        </span>
      </div>
      <div className={s.dash}>
        <div className={s.side}>
          <span className={s.sideLogo} />
          <span className={cn(s.bar, s.sideActive)} />
          <span className={s.bar} />
          <span className={s.bar} style={{ width: "75%" }} />
          <span className={s.bar} style={{ width: "85%" }} />
        </div>
        <div className={s.main}>
          <div className={s.kpis}>
            {[0, 1, 2].map((k) => (
              <div key={k} className={s.kpi}>
                <span className={s.bar} />
                <span className={cn(s.bar, s.kpiValue)} style={{ width: `${80 - k * 14}%` }} />
              </div>
            ))}
          </div>
          <div className={s.chartBox}>
            <svg className={s.chart} viewBox="0 0 240 70" fill="none">
              {[10, 30, 50].map((y) => (
                <line key={y} className={s.grid} x1="0" x2="240" y1={y} y2={y} strokeDasharray="2 3" />
              ))}
              <path
                className={s.chartLine}
                pathLength={1}
                d="M2 58 C 22 56, 30 44, 48 46 S 76 54, 92 40 S 120 22, 138 30 S 168 42, 184 24 S 214 12, 238 8"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile: a phone whose card carousel swipes. */
function PhoneSwipe() {
  return (
    <div className={s.phone}>
      <div className={s.screen}>
        <div className={s.status}>
          <span>9:41</span>
          <span className={s.island} />
          <span style={{ display: "inline-flex", gap: 3 }}>
            <Wifi width={9} height={9} strokeWidth={2} />
            <BatteryFull width={10} height={10} strokeWidth={2} />
          </span>
        </div>
        <div className={s.appHead}>
          <span className={s.bar} />
          <span className={s.avatarDot} />
        </div>
        <div className={s.carousel}>
          <div className={s.strip}>
            <div className={cn(s.card, s.cardAccent)}>
              <span className={s.bar} />
              <span className={s.bar} />
            </div>
            <div className={s.card}>
              <span className={s.bar} />
              <span className={s.bar} />
            </div>
            <div className={s.card}>
              <span className={s.bar} />
              <span className={s.bar} />
            </div>
          </div>
        </div>
        <div className={s.rows}>
          {[0, 1, 2].map((r) => (
            <div key={r} className={s.row}>
              <i />
              <span>
                <span className={s.bar} style={{ width: `${88 - r * 12}%` }} />
                <span className={s.bar} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FRAMES = [
  { label: "Button", left: 0, top: 0, h: 86 },
  { label: "Input", left: 174, top: 0, h: 86, selected: true },
  { label: "Toggle", left: 0, top: 104, h: 92 },
  { label: "Colour", left: 174, top: 104, h: 92 },
] as const;

function FrameContent({ label }: { label: string }) {
  switch (label) {
    case "Button":
      return (
        <>
          <span className={s.btnSample}>Continue</span>
          <span className={s.btnGhost}>Cancel</span>
        </>
      );
    case "Input":
      return <span className={s.input}>name@company.com</span>;
    case "Toggle":
      return (
        <>
          <span className={cn(s.toggle, s.toggleOn)} />
          <span className={s.toggle} />
        </>
      );
    default:
      return (
        <span className={s.swatches}>
          <i style={{ background: "var(--brand-ink)" }} />
          <i style={{ background: "var(--brand-indigo)" }} />
          <i style={{ background: "var(--brand-cyan)" }} />
          <i style={{ background: "var(--brand-slate)" }} />
          <i style={{ background: "var(--brand-paper)" }} />
        </span>
      );
  }
}

/** Product design: a component sheet; a multiplayer-style cursor moves between frames. */
function DesignBoard() {
  return (
    <div className={s.board}>
      {FRAMES.map((f) => (
        <div
          key={f.label}
          className={cn(s.frame, "selected" in f && s.frameSelected)}
          style={{ left: f.left, top: f.top, width: 156, height: f.h }}
        >
          <span className={s.mono}>{f.label}</span>
          <div className={s.frameBody} style={{ position: "relative" }}>
            <FrameContent label={f.label} />
            {"selected" in f ? (
              <>
                <span className={s.handle} style={{ left: -3, top: -3 }} />
                <span className={s.handle} style={{ right: -3, top: -3 }} />
                <span className={s.handle} style={{ left: -3, bottom: -3 }} />
                <span className={s.handle} style={{ right: -3, bottom: -3 }} />
              </>
            ) : null}
          </div>
        </div>
      ))}
      <div className={s.cursor}>
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path d="M1.5 1.2 14 6.4 8.4 8.3 6.5 13.9z" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
        </svg>
        <span className={s.cursorTag}>Design</span>
      </div>
    </div>
  );
}

const STAGES = [
  { label: "Commit", Icon: GitCommitHorizontal },
  { label: "Build", Icon: Package },
  { label: "Test", Icon: FlaskConical },
  { label: "Deploy", Icon: Rocket },
] as const;

/** Cloud & DevOps: a deploy pipeline; a signal pulse travels the rail. */
function Pipeline() {
  return (
    <div className={cn(s.panel, s.pipeline)}>
      <div className={s.pipeHead}>
        <span className={s.mono}>production · main@4f2c9e1</span>
        <span className={s.mono} style={{ color: "var(--success)" }}>
          ● Ready
        </span>
      </div>
      <div className={s.track}>
        <div className={s.rail}>
          <span className={s.comet} />
        </div>
        <ol className={s.stages}>
          {STAGES.map(({ label, Icon }) => (
            <li key={label} className={s.stage}>
              <span className={s.node}>
                <Icon strokeWidth={1.75} />
              </span>
              <span className={s.mono}>{label}</span>
            </li>
          ))}
          <li className={s.stage}>
            <span className={cn(s.node, s.nodeLive)}>
              <span className={s.live} />
            </span>
            <span className={s.mono}>Live</span>
          </li>
        </ol>
      </div>
      <div className={s.regions}>
        {["us-east", "eu-west", "ap-south"].map((r) => (
          <span key={r} className={cn(s.region, s.mono)}>
            <i />
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

const VISUALS: Record<string, () => ReactNode> = {
  "ai-agents-automation": AgentChat,
  "custom-software": CodeEditor,
  "web-saas-platforms": BrowserDashboard,
  "mobile-apps": PhoneSwipe,
  "product-design": DesignBoard,
  "cloud-devops": Pipeline,
};

/** The fragment for a service slug (falls back to the code editor). */
export function ServiceVisual({ slug }: { slug: string }) {
  const Visual = VISUALS[slug] ?? CodeEditor;
  return <Visual />;
}
