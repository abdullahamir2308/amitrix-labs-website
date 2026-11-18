/**
 * GLSL for the hero lattice. Points and line segments share one displacement
 * function (`latticeHeight`), so lines always meet their nodes exactly; all
 * animation runs on the GPU and the CPU only updates a few uniforms per frame.
 * Output is premultiplied colour for additive blending (ONE, ONE).
 */

const common = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;     // 0 → 1 draw-in
  uniform float uOpacity;   // scroll fade
  uniform float uExtent;    // half-diagonal of the lattice
  uniform vec2  uMouse;     // cursor in lattice space
  uniform float uHover;     // 0–1 cursor presence
  uniform float uRipple;    // 0–1 smoothed cursor speed
  uniform vec3  uIndigo;
  uniform vec3  uViolet;
  uniform vec3  uCyan;

  attribute float aSeed;

  varying vec3  vColor;
  varying float vAlpha;

  // Slow "breathing" swell: two crossing waves plus a radial pulse.
  float field(vec2 p, float t) {
    float h = sin(p.x * 0.42 + t * 0.42) * cos(p.y * 0.38 - t * 0.3) * 0.46;
    h += sin((p.x * 0.7 - p.y * 0.5) * 0.6 + t * 0.55) * 0.2;
    h += sin(length(p) * 0.75 - t * 0.65) * 0.1;
    return h;
  }

  // Cursor: a soft hill under the pointer plus a travelling ring (the ripple).
  float cursorLift(vec2 p, out float glow) {
    float d = distance(p, uMouse);
    float hill = exp(-d * d / 2.4);
    float ring = sin(d * 2.6 - uTime * 4.2) * exp(-d * 0.45);
    glow = hill * uHover;
    return (hill * 0.75 + ring * (0.06 + 0.16 * uRipple)) * uHover;
  }

  // Draw-in: radiates from the centre, with a little per-node jitter.
  float reveal(vec2 p, float seed) {
    float r = length(p) / uExtent;
    float th = r * 0.9 + seed * 0.12;
    return smoothstep(th, th + 0.14, uIntro * 1.12);
  }

  vec3 tint(vec2 p) {
    float t = clamp((p.x * 0.85 + p.y * 0.5) / (uExtent * 1.3) + 0.5, 0.0, 1.0);
    vec3 c = mix(uIndigo, uViolet, smoothstep(0.0, 0.45, t));
    return mix(c, uCyan, smoothstep(0.45, 0.95, t));
  }

  float depthFade(float z) {
    return smoothstep(30.0, 9.0, z) * smoothstep(2.0, 5.0, z);
  }
`;

export const pointsVertex = /* glsl */ `
  uniform float uPixelRatio;
  ${common}
  void main() {
    vec2 p = position.xy;
    float glow;
    float lift = cursorLift(p, glow);
    float h = field(p, uTime) + lift;
    float vis = reveal(p, aSeed);
    vec4 mv = modelViewMatrix * vec4(p, h - (1.0 - vis) * 0.8, 1.0);
    gl_Position = projectionMatrix * mv;

    float hub = step(0.955, aSeed);
    float size = mix(4.2, 11.0, hub) * (0.7 + 0.6 * aSeed) * (1.0 + glow * 1.6);
    gl_PointSize = size * uPixelRatio * (13.0 / -mv.z) * vis;

    vColor = mix(tint(p), vec3(0.86, 0.97, 1.0), glow * 0.6 + hub * 0.2);
    float crest = max(h, 0.0);
    vAlpha = (0.55 + 0.5 * hub + 0.7 * glow + crest * 0.6) * depthFade(-mv.z) * uOpacity * vis;
  }
`;

export const pointsFragment = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float core = smoothstep(0.5, 0.15, d);
    float halo = exp(-d * d * 4.5) * 0.5;
    float a = (core + halo) * vAlpha;
    if (a < 0.002) discard;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

export const linesVertex = /* glsl */ `
  attribute float aWeight;
  ${common}
  void main() {
    vec2 p = position.xy;
    float glow;
    float lift = cursorLift(p, glow);
    float h = field(p, uTime) + lift;
    float vis = reveal(p, aSeed);
    vec4 mv = modelViewMatrix * vec4(p, h - (1.0 - vis) * 0.8, 1.0);
    gl_Position = projectionMatrix * mv;

    vColor = mix(tint(p), vec3(0.8, 0.95, 1.0), glow * 0.5);
    float crest = max(h, 0.0);
    vAlpha = (0.1 + 0.32 * aWeight * aWeight + 0.6 * glow + crest * 0.2) * depthFade(-mv.z) * uOpacity * vis;
  }
`;

export const linesFragment = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(vColor * vAlpha, vAlpha);
  }
`;
