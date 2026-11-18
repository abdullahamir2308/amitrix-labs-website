"use client";

import { useEffect, useRef, type RefObject } from "react";
import { buildLattice, LATTICE_COLORS, LATTICE_VIEW } from "./lattice-geometry";

export type LatticeCanvas2DProps = {
  active: boolean;
  scrollRef: RefObject<number>;
  onReady?: () => void;
};

/** Mobile framing: the sheet sits lower and more central under the stacked copy. */
const VIEW = { ...LATTICE_VIEW, positionX: 0.6, positionY: -1.3, rotationX: -1.1, rotationZ: 0.42 };
const FPS = 30;
const INTRO_SECONDS = 1.4;
const BUCKETS = 4;
const MAX_DPR = 1.25;

const rgb = (c: readonly number[]) => c.map((v) => Math.round(v * 255)).join(" ");

function makeSprite(color: readonly number[], size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, `rgb(235 250 255 / 1)`);
  grad.addColorStop(0.18, `rgb(${rgb(color)} / 0.95)`);
  grad.addColorStop(0.45, `rgb(${rgb(color)} / 0.22)`);
  grad.addColorStop(1, `rgb(${rgb(color)} / 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/**
 * Lighter 2D-canvas lattice for small screens: fewer nodes, 30fps, batched
 * strokes, sprite glows and a touch ripple in screen space. Same projection
 * maths as the WebGL scene so the two read as one design.
 */
export default function LatticeCanvas2D({ active, scrollRef, onReady }: LatticeCanvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    activeRef.current = active;
    if (active) wakeRef.current();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const lattice = buildLattice({ cols: 32, rows: 34, spacing: 0.62, dropout: 0.22, seed: 11 });
    const { nodes, seeds, edges, weights, extent } = lattice;
    const n = seeds.length;
    const sx = new Float32Array(n);
    const sy = new Float32Array(n);
    const sz = new Float32Array(n); // perspective scale
    const glow = new Float32Array(n);
    const vis = new Float32Array(n);
    const sprites = [LATTICE_COLORS.indigo, LATTICE_COLORS.violet, LATTICE_COLORS.cyan].map((c) => makeSprite(c, 64));
    const paths = Array.from({ length: BUCKETS }, () => [] as number[]);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let focal = 1;
    let stroke: CanvasGradient | string = "#5b4cf5";

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Phones: a soft, masked background layer reads fine at ~1.25x, and every canvas frame is
      // uploaded on the main thread (commit cost scales with pixels: 1.25x ≈ 30% less than 1.5x).
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      focal = h / 2 / Math.tan((VIEW.fov * Math.PI) / 360);
      const grad = ctx.createLinearGradient(0, h, w, 0);
      grad.addColorStop(0, `rgb(${rgb(LATTICE_COLORS.indigo)})`);
      grad.addColorStop(0.5, `rgb(${rgb(LATTICE_COLORS.violet)})`);
      grad.addColorStop(1, `rgb(${rgb(LATTICE_COLORS.cyan)})`);
      stroke = grad;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Touch / pointer ripple (screen space).
    const touch = { x: -9999, y: -9999, t: 99 };
    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      touch.x = e.clientX - rect.left;
      touch.y = e.clientY - rect.top;
      touch.t = 0;
    };
    window.addEventListener("pointerdown", onPointer, { passive: true });

    let time = 0;
    let intro = 0;
    let last = performance.now();
    let acc = 0;
    let raf = 0;
    let ready = false;

    const draw = () => {
      const s = Math.min(1, Math.max(0, scrollRef.current ?? 0));
      const eased = s * s * (3 - 2 * s);
      const opacity = 1 - Math.min(1, Math.max(0, (s - 0.05) / 0.65));
      const rx = VIEW.rotationX - eased * VIEW.scrollTilt;
      const rz = VIEW.rotationZ;
      const px = VIEW.positionX;
      const py = VIEW.positionY + eased * VIEW.scrollLift;
      const cx = Math.cos(rx);
      const snx = Math.sin(rx);
      const cz = Math.cos(rz);
      const snz = Math.sin(rz);
      const introE = 1 - Math.pow(1 - intro, 3);
      const ringR = touch.t * 420;
      const ringA = Math.exp(-touch.t * 1.8);

      for (let i = 0; i < n; i++) {
        const x = nodes[i * 2];
        const y = nodes[i * 2 + 1];
        let z =
          Math.sin(x * 0.42 + time * 0.42) * Math.cos(y * 0.38 - time * 0.3) * 0.46 +
          Math.sin((x * 0.7 - y * 0.5) * 0.6 + time * 0.55) * 0.2;
        const r = Math.hypot(x, y) / extent;
        const th = r * 0.9 + seeds[i] * 0.12;
        const v = Math.min(1, Math.max(0, (introE * 1.12 - th) / 0.14));
        vis[i] = v * v * (3 - 2 * v);
        z -= (1 - vis[i]) * 0.8;
        // Euler XYZ: rotate Z, then X; then translate; then perspective.
        const x1 = x * cz - y * snz;
        const y1 = x * snz + y * cz;
        const y2 = y1 * cx - z * snx;
        const z2 = y1 * snx + z * cx;
        const depth = VIEW.cameraZ - z2;
        const k = focal / Math.max(depth, 0.5);
        const X = w / 2 + (x1 + px) * k;
        const Y = h / 2 - (y2 + py) * k;
        // Ripple: lift nodes near the expanding ring and under the finger.
        const d = Math.hypot(X - touch.x, Y - touch.y);
        const g = (Math.exp(-((d - ringR) ** 2) / 1800) * 0.9 + Math.exp(-(d * d) / 9000)) * ringA;
        sx[i] = X;
        sy[i] = Y - g * 14;
        sz[i] = VIEW.cameraZ / Math.max(depth, 0.5);
        glow[i] = g;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // Lines, batched into a few alpha buckets.
      for (const p of paths) p.length = 0;
      for (let e = 0; e < weights.length; e++) {
        const a = edges[e * 2];
        const b = edges[e * 2 + 1];
        const v = Math.min(vis[a], vis[b]);
        if (v < 0.05) continue;
        const depthFade = Math.min(1, sz[a] * 1.2);
        const alpha = (0.1 + 0.25 * weights[e] * weights[e] + (glow[a] + glow[b]) * 0.25) * depthFade * v;
        const bucket = Math.min(BUCKETS - 1, Math.floor(alpha * BUCKETS * 1.6));
        paths[bucket].push(sx[a], sy[a], sx[b], sy[b]);
      }
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 0.8;
      for (let bkt = 0; bkt < BUCKETS; bkt++) {
        const p = paths[bkt];
        if (!p.length) continue;
        ctx.globalAlpha = ((bkt + 0.6) / BUCKETS) * 0.85 * opacity;
        ctx.beginPath();
        for (let j = 0; j < p.length; j += 4) {
          ctx.moveTo(p[j], p[j + 1]);
          ctx.lineTo(p[j + 2], p[j + 3]);
        }
        ctx.stroke();
      }

      // Nodes: tinted glow sprites.
      for (let i = 0; i < n; i++) {
        if (vis[i] < 0.02) continue;
        const X = sx[i];
        const Y = sy[i];
        if (X < -20 || X > w + 20 || Y < -20 || Y > h + 20) continue;
        const hub = seeds[i] > 0.955 ? 1 : 0;
        const size = (8 + hub * 12) * (0.75 + 0.5 * seeds[i]) * sz[i] * (1 + glow[i]) * vis[i];
        const tint = Math.min(1, Math.max(0, (X / w) * 0.7 + (1 - Y / h) * 0.3));
        const sprite = sprites[tint < 0.35 ? 0 : tint < 0.65 ? 1 : 2];
        ctx.globalAlpha = Math.min(1, (0.7 + hub * 0.35 + glow[i] * 0.6) * Math.min(1, sz[i] * 1.6)) * opacity;
        ctx.drawImage(sprite, X - size / 2, Y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      raf = 0;
      if (!activeRef.current) return;
      const dt = Math.min((now - last) / 1000, 1 / 15);
      last = now;
      acc += dt;
      if (acc >= 1 / FPS - 0.002) {
        time += acc;
        intro = Math.min(1, intro + acc / INTRO_SECONDS);
        touch.t += acc;
        acc = 0;
        draw();
        if (!ready) {
          ready = true;
          onReady?.();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    wakeRef.current = wake;
    if (activeRef.current) wake();

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = () => {};
      ro.disconnect();
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [scrollRef, onReady]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />;
}
