import { useEffect, useRef } from 'react'

/**
 * Contour-interference field, drawn as a single fullscreen fragment shader.
 * Raw WebGL2 rather than Three.js - this is one quad, and the whole thing costs
 * ~4 KB instead of ~150 KB of scene graph we would never use.
 *
 * Palette is passed in from CSS-side constants so the shader stays on-brand.
 */

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `#version 300 es
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;      // pixels, y already flipped
uniform float u_mouseHeat;  // 0..1, eases in while the pointer is present
out vec4 fragColor;

const vec3 PAPER = vec3(0.957, 0.945, 0.918);
const vec3 INK   = vec3(0.078, 0.071, 0.063);
const vec3 FLAME = vec3(0.886, 0.263, 0.110);
const vec3 TEAL  = vec3(0.051, 0.369, 0.349);

// Simplex noise (Ashima / Gustavson), trimmed to the 3D case.
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float sum = 0.0, amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * snoise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5 * u_res) / u_res.y;   // aspect-correct, origin centred
  vec2 m  = (u_mouse - 0.5 * u_res) / u_res.y;

  float t = u_time * 0.045;
  float dist = length(uv - m);

  // A ripple that decays outward from the cursor and deforms the field itself.
  float ripple = sin(dist * 26.0 - u_time * 2.4) * exp(-dist * 3.4) * 0.30 * u_mouseHeat;

  // Domain warp keeps the contours from looking like plain noise bands.
  vec2 warp = vec2(fbm(vec3(uv * 1.5, t)), fbm(vec3(uv * 1.5 + 11.7, t)));
  float field = fbm(vec3(uv * 1.9 + warp * 0.55, t)) + ripple;

  // Crisp, resolution-independent contour lines via screen-space derivatives.
  float g = field * 9.0;
  float d = abs(fract(g - 0.5) - 0.5) / max(fwidth(g), 1e-5);
  float line = 1.0 - min(d, 1.0);

  // Every 3rd contour is heavier, the way a real topo plot indexes its lines.
  float major = step(0.5, 1.0 - abs(fract(g / 3.0 - 0.5) - 0.5) * 2.0);
  line *= mix(0.42, 1.0, major);

  vec3 col = PAPER;
  col = mix(col, INK, line * 0.55);

  // Heat near the cursor: contours shift to vermilion, with a teal outer halo.
  float heat = exp(-dist * 2.6) * u_mouseHeat;
  col = mix(col, FLAME, line * heat * 1.15);
  col = mix(col, TEAL, line * exp(-dist * 1.1) * u_mouseHeat * 0.16);

  // Fade toward the bottom so the field hands off cleanly to the content below.
  float vfade = smoothstep(-0.62, 0.22, uv.y);
  col = mix(PAPER, col, 0.30 + 0.70 * vfade);

  fragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[ShaderField]', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export default function ShaderField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' })
    // No WebGL2 (or a blocked context): the CSS fallback behind the canvas stands in.
    if (!gl) {
      canvas.style.display = 'none'
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      canvas.style.display = 'none'
      return
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[ShaderField]', gl.getProgramInfoLog(prog))
      canvas.style.display = 'none'
      return
    }
    gl.useProgram(prog)

    // One fullscreen triangle strip.
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')
    const uHeat = gl.getUniformLocation(prog, 'u_mouseHeat')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    let heat = 0
    let heatTarget = 0
    let dpr = 1

    const resize = () => {
      // Cap DPR: this is a full-viewport fragment shader, and 3x costs 9x the fill.
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const w = Math.floor(canvas.clientWidth * dpr)
      const h = Math.floor(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      if (!target.x && !target.y) {
        target.x = cur.x = w * 0.72
        target.y = cur.y = h * 0.62
      }
      // With motion reduced there is no loop running, so repaint the one frame.
      if (reduce) draw()
    }

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      target.x = (e.clientX - r.left) * dpr
      target.y = (r.height - (e.clientY - r.top)) * dpr // flip to GL orientation
      heatTarget = 1
    }
    const onLeave = () => {
      heatTarget = 0
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerleave', onLeave)

    // Only burn GPU while the hero is actually on screen.
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      // Guard on raf so re-entering view cannot stack a second loop.
      if (visible && !reduce && !raf) raf = requestAnimationFrame(draw)
    })
    io.observe(canvas)

    let raf = 0
    const start = performance.now()

    const draw = () => {
      raf = 0
      const time = (performance.now() - start) / 1000
      // Ease the cursor and its heat so nothing snaps.
      cur.x += (target.x - cur.x) * 0.075
      cur.y += (target.y - cur.y) * 0.075
      heat += (heatTarget - heat) * 0.04

      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, reduce ? 12 : time)
      gl.uniform2f(uMouse, cur.x, cur.y)
      gl.uniform1f(uHeat, reduce ? 0.35 : heat)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      if (!reduce && visible) raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerleave', onLeave)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className={className} />
}
