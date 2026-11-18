"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildLattice, LATTICE_COLORS, LATTICE_VIEW } from "./lattice-geometry";
import { linesFragment, linesVertex, pointsFragment, pointsVertex } from "./lattice-shaders";

export type LatticeSceneProps = {
  /** False pauses the render loop (off-screen or tab hidden). */
  active: boolean;
  /** 0–1 scroll-out progress of the hero, written by the parent. */
  scrollRef: RefObject<number>;
  onReady?: () => void;
};

const INTRO_SECONDS = 1.5;

type SceneObjects = {
  points: THREE.Points;
  lines: THREE.LineSegments;
  uniforms: Record<string, THREE.IUniform>;
  dispose: () => void;
};

function createScene(): SceneObjects {
  const lattice = buildLattice({ cols: 58, rows: 46, spacing: 0.5, dropout: 0.2, seed: 11 });
  const { nodes, seeds, edges, weights } = lattice;
  const nodeCount = seeds.length;

  const pointPositions = new Float32Array(nodeCount * 3);
  for (let i = 0; i < nodeCount; i++) {
    pointPositions[i * 3] = nodes[i * 2];
    pointPositions[i * 3 + 1] = nodes[i * 2 + 1];
  }
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
  pointsGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const edgeCount = weights.length;
  const linePositions = new Float32Array(edgeCount * 2 * 3);
  const lineSeeds = new Float32Array(edgeCount * 2);
  const lineWeights = new Float32Array(edgeCount * 2);
  for (let e = 0; e < edgeCount; e++) {
    for (let end = 0; end < 2; end++) {
      const n = edges[e * 2 + end];
      const v = e * 2 + end;
      linePositions[v * 3] = nodes[n * 2];
      linePositions[v * 3 + 1] = nodes[n * 2 + 1];
      lineSeeds[v] = seeds[n];
      lineWeights[v] = weights[e];
    }
  }
  const linesGeo = new THREE.BufferGeometry();
  linesGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  linesGeo.setAttribute("aSeed", new THREE.BufferAttribute(lineSeeds, 1));
  linesGeo.setAttribute("aWeight", new THREE.BufferAttribute(lineWeights, 1));

  const uniforms: Record<string, THREE.IUniform> = {
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uOpacity: { value: 1 },
    uExtent: { value: lattice.extent },
    uMouse: { value: new THREE.Vector2(999, 999) },
    uHover: { value: 0 },
    uRipple: { value: 0 },
    uPixelRatio: { value: 1 },
    uIndigo: { value: new THREE.Color().fromArray(LATTICE_COLORS.indigo) },
    uViolet: { value: new THREE.Color().fromArray(LATTICE_COLORS.violet) },
    uCyan: { value: new THREE.Color().fromArray(LATTICE_COLORS.cyan) },
  };

  const shared = {
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    premultipliedAlpha: true,
  } as const;
  const pointsMat = new THREE.ShaderMaterial({ ...shared, vertexShader: pointsVertex, fragmentShader: pointsFragment });
  const linesMat = new THREE.ShaderMaterial({ ...shared, vertexShader: linesVertex, fragmentShader: linesFragment });

  const points = new THREE.Points(pointsGeo, pointsMat);
  const lines = new THREE.LineSegments(linesGeo, linesMat);
  // Vertices move in the shader, so CPU-side bounds are meaningless.
  points.frustumCulled = false;
  lines.frustumCulled = false;

  return {
    points,
    lines,
    uniforms,
    dispose: () => {
      pointsGeo.dispose();
      linesGeo.dispose();
      pointsMat.dispose();
      linesMat.dispose();
    },
  };
}

function Lattice({ scrollRef, onReady }: Omit<LatticeSceneProps, "active">) {
  const [scene] = useState(createScene);
  const groupRef = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  // Pointer state lives outside React: written by listeners, read per frame.
  const pointer = useRef({ ndc: new THREE.Vector2(), inside: false, speed: 0, lastX: 0, lastY: 0 });
  const tmp = useRef({
    raycaster: new THREE.Raycaster(),
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    hit: new THREE.Vector3(),
    inv: new THREE.Matrix4(),
    ray: new THREE.Ray(),
    mouse: new THREE.Vector2(999, 999),
    time: 0,
    intro: 0,
  });

  useEffect(() => {
    const p = pointer.current;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      p.ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      p.speed = Math.min(1, p.speed + Math.hypot(e.clientX - p.lastX, e.clientY - p.lastY) / 260);
      p.lastX = e.clientX;
      p.lastY = e.clientY;
      p.inside = true;
    };
    const onLeave = () => {
      p.inside = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  useEffect(() => {
    onReady?.();
    return scene.dispose;
  }, [scene, onReady]);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const t = tmp.current;
    const p = pointer.current;
    // Both materials share one uniforms object; reach it through the scene graph.
    const u = ((group.children[0] as THREE.LineSegments).material as THREE.ShaderMaterial).uniforms;
    // Clamp so a resumed loop (after pausing) doesn't jump.
    const dt = Math.min(delta, 1 / 30);

    t.time += dt;
    t.intro = Math.min(1, t.intro + dt / INTRO_SECONDS);
    u.uTime.value = t.time;
    u.uIntro.value = 1 - Math.pow(1 - t.intro, 3);
    u.uPixelRatio.value = gl.getPixelRatio();

    // Scroll-out: tilt back, lift, fade.
    const s = THREE.MathUtils.clamp(scrollRef.current ?? 0, 0, 1);
    const eased = s * s * (3 - 2 * s);
    group.rotation.x = LATTICE_VIEW.rotationX - eased * LATTICE_VIEW.scrollTilt;
    group.position.y = LATTICE_VIEW.positionY + eased * LATTICE_VIEW.scrollLift;
    u.uOpacity.value = 1 - THREE.MathUtils.smoothstep(s, 0.05, 0.7);

    // Cursor → lattice space (ray against the sheet's plane in local coordinates).
    group.updateMatrixWorld();
    t.raycaster.setFromCamera(p.ndc, camera);
    t.inv.copy(group.matrixWorld).invert();
    t.ray.copy(t.raycaster.ray).applyMatrix4(t.inv);
    const hit = p.inside ? t.ray.intersectPlane(t.plane, t.hit) : null;
    const follow = 1 - Math.exp(-dt * 7);
    if (hit) {
      if (u.uHover.value < 0.02) t.mouse.set(hit.x, hit.y);
      t.mouse.x += (hit.x - t.mouse.x) * follow;
      t.mouse.y += (hit.y - t.mouse.y) * follow;
    }
    (u.uMouse.value as THREE.Vector2).copy(t.mouse);
    const targetHover = hit ? 1 : 0;
    u.uHover.value += (targetHover - u.uHover.value) * (1 - Math.exp(-dt * 3));
    p.speed *= Math.exp(-dt * 2.2);
    u.uRipple.value += (p.speed - u.uRipple.value) * (1 - Math.exp(-dt * 5));
  });

  return (
    <group
      ref={groupRef}
      position={[LATTICE_VIEW.positionX, LATTICE_VIEW.positionY, 0]}
      rotation={[LATTICE_VIEW.rotationX, 0, LATTICE_VIEW.rotationZ]}
    >
      <primitive object={scene.lines} />
      <primitive object={scene.points} />
    </group>
  );
}

/** Full-bleed R3F canvas with the glowing lattice. Loaded with next/dynamic (ssr: false). */
export default function LatticeScene({ active, scrollRef, onReady }: LatticeSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: LATTICE_VIEW.fov, position: [0, 0, LATTICE_VIEW.cameraZ], near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, depth: false, stencil: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Lattice scrollRef={scrollRef} onReady={onReady} />
    </Canvas>
  );
}
