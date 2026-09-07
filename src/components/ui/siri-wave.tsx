"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type SiriWaveVariant = "wave" | "fluid-dots"

const VERTEX_SHADER = `attribute vec2 aPos; void main(){ gl_Position=vec4(aPos,0.0,1.0); }`

const PRECISION_HEADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`

const WAVE_SHADER = PRECISION_HEADER + `
uniform vec2 iResolution; uniform float iTime;
const float PI = 3.14159265359;
const float AMPLITUDE   = 0.45;
const float FREQ        = 1.1;
const float ABER_FREQ   = 1.0;
const float SPEED       = 2.4;
const float WAVE_SCALE  = 1.5;
const float ABERRATION  = 2.6;
const float THICKNESS   = 3.0;
const float INTENSITY   = 2.;
const float FALLOFF     = 1.7;
const float EDGE_MASK   = 0.4;
const float EDGE_INSET  = 0.0;
const float BAND_FILL   = 30000.0;
const float BAND_THICK  = 0.08;
const float SOFTNESS    = 2.5;
const float LOW_AMP     = 6.0;
const float LOW_INT     = 1.5;
const float MID_ABER    = 0.8;
const float MID_ABAMP   = 0.05;
const float MID_BAND    = 20.0;
const float MID_SOFT    = 0.4;
const float HIGH_ABER   = 0.5;
const float HIGH_ABAMP  = 0.06;
const float RESOLVED    = 1.0;
const float UNRES_SCALE = 0.14;

vec3 spectral4(int s){
    float x = float(s);
    return clamp(vec3(abs(x-3.0)-1.0, 2.0-abs(x-2.0), 2.0-abs(x-4.0)), 0.0, 1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 R = iResolution.xy;
    float aspect = R.x / R.y;
    vec2 p = (fragCoord + 0.5) * 2.0 / R - 1.0;
    p.x *= aspect;
    float yScreen = p.y;
    p /= max(WAVE_SCALE, 0.1);

    float t   = iTime;
    float low  = clamp(0.45 + 0.45*sin(t*0.8)*sin(t*0.37+1.0), 0.0, 1.0);
    float mid  = clamp(0.40 + 0.40*sin(t*1.7+2.0)*sin(t*0.53), 0.0, 1.0);
    float high = clamp(0.30 + 0.30*sin(t*2.9+4.0)*sin(t*0.71+2.0), 0.0, 1.0);

    float res   = clamp(RESOLVED, 0.0, 1.0);
    float drift = mod(t, 20.0*PI) * SPEED;

    float xN  = p.x / max(aspect, 1.0);
    float env = cos(PI*0.5 * min(abs(0.9*xN), 1.0));
    env *= env;

    float A1    = AMPLITUDE + 0.01*low*LOW_AMP;
    float A2    = A1 + mid*MID_ABAMP + high*HIGH_ABAMP;
    float AB    = (ABERRATION + mid*MID_ABER + high*HIGH_ABER)*res;
    float th    = mix(0.1, 0.01*THICKNESS, res);
    float inten = mix(0.1, 0.01*(INTENSITY + low*LOW_INT), res);
    float soft  = 0.01*res*max(0.0, SOFTNESS + mid*MID_SOFT);

    float dUnres = max(length(p) - mix(0.14, UNRES_SCALE, res), 0.0);
    float yMain = A1 * env * res * sin(p.x*FREQ + drift);

    float bandFillTh = max(BAND_THICK, 1e-4);
    float bandAmt    = 1e-4 * BAND_FILL * inten;
    vec3 num = vec3(0.0), den = vec3(0.0);
    for(int s = 0; s < 4; s++){
        vec3 hue = mix(vec3(1.0), spectral4(s), res);
        den += hue;
        float ab = mix(-AB, AB, float(s)/3.0);
        float yL = A2 * env * res * sin(p.x*ABER_FREQ + drift + ab);
        float d   = mix(dUnres, abs(p.y - yL), res);
        float lor = mix(1.0/(1.0 + (0.02*d)*(0.02*d)), 1.0, res);
        float line = inten / (sqrt(d*d + soft*soft) + th);
        float lo = min(yMain, yL), hi = max(yMain, yL);
        float dBand = max(0.0, max(p.y - hi, lo - p.y));
        float band  = bandAmt / (dBand + bandFillTh);
        num += hue * lor * (line + band);
    }
    vec3 col = num / den;

    float dM    = mix(dUnres, abs(p.y - yMain), res);
    float lorM  = mix(1.0/(1.0 + (0.02*dM)*(0.02*dM)), 1.0, res);
    float boost = (1.0 - res) * (14.0*low + 4.0);
    col += 0.5 * inten * (lorM + boost) / (sqrt(dM*dM + soft*soft) + th);

    col = pow(max(col, 0.0), vec3(1.5));
    float emT = clamp((abs(yScreen) - 1.0 + EDGE_INSET) / (-max(EDGE_MASK, 1e-4)), 0.0, 1.0);
    float em  = emT*emT*(3.0 - 2.0*emT);
    float gauss = exp(-pow(xN*FALLOFF, 2.0));
    col *= mix(1.0, em*gauss, res);
    col *= res;
    float alpha = clamp(max(col.r, max(col.g, col.b)) * 1.5, 0.0, 1.0);
    fragColor = vec4(col, alpha);
}
void main(){ mainImage(gl_FragColor, gl_FragCoord.xy); }`

const FLUID_DOTS_SHADER = PRECISION_HEADER + `
uniform vec2 iResolution; uniform float iTime;
const float TAU = 6.28318530718;
const int   N   = 6;
const float SMOOTH_K = 0.08;
const float INTENSITY  = 0.0025;
const float FALLOFF_P  = 1.35;
const float FADE_START = 0.02;
const float FADE_END   = 0.56;
const float ABERR = 0.005;
const vec3  SPECTRAL = vec3(0.0, 0.5, 1.0) * ABERR;
const float HUE_SPEED = 0.06;
const float COLOR_K   = 0.5;
const float SAT       = 0.01;
const float HUE_SPAN  = 0.667;
const float MERGE_PERIOD = 6.0;
const float T_MOVE   = 1.25;
const float STAGGER  = 0.33;
const float HOLD     = 0.0;
const float W = 4.6;
const float L = 3.2;
const float PIERCE  = 0.12;
const float RECOIL  = 0.035;
const float REC_LAG = 0.11;
const float GATHER_PERIOD = 12.0;
const float GATHER_START  = 9.2;
const float GATHER_HOLD   = 0.8;
const float GATHER_R      = 0.008;
const float GATHER_DIM    = 0.85;
const float GATHER_IN     = 1.8;
const float GATHER_IN_L   = 7.5;
const float BURST_W = 6.5;
const float BURST_L = 4.0;
const float CHARGE_T     = 0.30;
const float CHARGE_SHRK  = 0.18;

float hash11(float p){ return fract(sin(p * 127.1) * 43758.5453123); }
float smin(float a, float b, float k){
    float h = max(k - abs(a-b), 0.0) / k;
    return min(a, b) - h*h*k*(1.0/4.0);
}
vec3 hue2rgb(float h){
    float r = abs(h*6.0 - 3.0) - 1.0;
    float g = 2.0 - abs(h*6.0 - 2.0);
    float b = 2.0 - abs(h*6.0 - 4.0);
    return clamp(vec3(r,g,b), 0.0, 1.0);
}
float easeInOut(float x){
    float x2 = x*x;
    return x2 / (x2 + (1.0 - x)*(1.0 - x));
}
float settle(float t){
    if(t <= 0.0) return 0.0;
    if(t >= 1.0) return 1.0;
    return 1.0 - exp(-W*t) * cos(L*t);
}
float dotR(float id, float seed, float t){
    return (0.040 + 0.010*sin(t*1.7 + seed*TAU)) * (1.0 + 0.12*(id - 2.5)/2.5);
}
float dotSD(vec2 p, vec2 pos, float r, float t, float id, float wib){
    float d = length(p - pos) - r;
    d += 0.003 * sin(atan(p.y - pos.y, p.x - pos.x)*3.0 + t*2.5 + id) * wib;
    return d;
}
vec3 scene(vec2 p, float t){
    float tau_merge = mod(t, MERGE_PERIOD);
    float cycleId   = floor(t / MERGE_PERIOD);
    float k = mod(cycleId, 3.0);
    float te = tau_merge / T_MOVE;

    float tau_g = mod(t, GATHER_PERIOD);
    float gCycle = floor(t / GATHER_PERIOD);
    float gT = (tau_g - GATHER_START) / GATHER_IN;
    float g = (tau_g >= GATHER_START && tau_g < GATHER_START + GATHER_IN) ? easeInOut(clamp(gT, 0.0, 1.0)) :
              (tau_g >= GATHER_START + GATHER_IN && tau_g < GATHER_START + GATHER_IN + GATHER_HOLD) ? 1.0 :
              (tau_g >= GATHER_START + GATHER_IN + GATHER_HOLD) ?
                 1.0 - settle((tau_g - (GATHER_START + GATHER_IN + GATHER_HOLD)) * (1.0 / (GATHER_PERIOD - (GATHER_START + GATHER_IN + GATHER_HOLD)))) : 0.0;
    float gC = clamp(g, 0.0, 1.0);
    float gBright = 1.0 - GATHER_DIM * gC;
    float chargeT = clamp((tau_g - (GATHER_START - CHARGE_T)) / CHARGE_T, 0.0, 1.0);
    float charge = (tau_g >= GATHER_START - CHARGE_T && tau_g < GATHER_START) ? easeInOut(chargeT) : 0.0;

    vec3 total3 = vec3(1e5);
    vec3 cAcc = vec3(0.0);
    float wAcc = 1e-6;
    for(int i=0; i<N; i++){
        float fi   = float(i);
        float seed = hash11(fi);
        float ang = fi/float(N)*TAU + t*0.35;
        vec2 dir  = vec2(cos(ang), sin(ang));
        float R = 0.17 + 0.010*sin(t*1.0) + 0.007*sin(t*1.3 + seed*TAU);
        float pairId   = mod(fi, 3.0);
        float moverLow = mod(k + pairId, 2.0);
        float isMover  = (fi < 2.5) ? step(moverLow, 0.5) : step(0.5, moverLow);
        float goStart  = pairId * STAGGER;
        float retStart = 3.0*STAGGER + HOLD + pairId * STAGGER;
        float m   = (settle(te - goStart)           - settle(te - retStart))           * isMover;
        float rec = (settle(te - goStart - REC_LAG) - settle(te - retStart - REC_LAG)) * (1.0 - isMover);
        float rSelf = dotR(fi, seed, t);
        rSelf = mix(rSelf, 0.036, gC);
        rSelf *= 1.0 - CHARGE_SHRK * charge;
        float fj    = mod(fi + 3.0, 6.0);
        float rPart = dotR(fj, hash11(fj), t);
        float deep   = -(R + RECOIL) - PIERCE * rPart;
        float radial = mix(R, deep, m) + RECOIL * rec;
        radial = mix(radial, GATHER_R, g);
        vec2  pos    = radial * dir;
        float sdR = dotSD(p - SPECTRAL.r*dir, pos, rSelf, t, fi, 1.0 - gC);
        float sdG = dotSD(p - SPECTRAL.g*dir, pos, rSelf, t, fi, 1.0 - gC);
        float sdB = dotSD(p - SPECTRAL.b*dir, pos, rSelf, t, fi, 1.0 - gC);
        total3 = vec3( smin(total3.r, sdR, SMOOTH_K),
                       smin(total3.g, sdG, SMOOTH_K),
                       smin(total3.b, sdB, SMOOTH_K) );
        float hue = fract(fi/float(N) + t*HUE_SPEED) * HUE_SPAN;
        vec3 dotCol = mix(vec3(1.0), hue2rgb(hue), SAT);
        float w = exp(-sdG * COLOR_K);
        cAcc += w * dotCol;
        wAcc += w;
    }
    vec3 sd3    = max(total3, vec3(0.0)) + 1e-4;
    vec3 core3  = clamp(INTENSITY / pow(sd3, vec3(FALLOFF_P)), 0.0, 1.0);
    vec3 edge3  = 1.0 - smoothstep(vec3(FADE_START), vec3(FADE_END), sd3);
    vec3 bright = core3 * edge3 * gBright;
    return bright * (cAcc / wAcc);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 res = iResolution.xy;
    vec2 p = (2.0*fragCoord - res) / min(res.x, res.y);
    float t = iTime;
    p /= 1.0 + 0.03*sin(t*1.0);
    vec3 col = scene(p, t);
    col *= 1.0 + 0.05*sin(t*1.0 + 1.0);
    col = pow(col, vec3(1.0/1.2));
    col = min(col, 1.0);
    float n = fract(sin(dot(fragCoord, vec2(12.9898,78.233)))*43758.5453);
    col += (n - 0.5)/255.0;
    fragColor = vec4(col, 1.0);
}
void main(){ mainImage(gl_FragColor, gl_FragCoord.xy); }`

const FRAGMENT_SHADERS: Record<SiriWaveVariant, string> = {
  wave: WAVE_SHADER,
  "fluid-dots": FLUID_DOTS_SHADER,
}

export interface SiriWaveProps
  extends Omit<React.HTMLAttributes<HTMLCanvasElement>, "children"> {
  variant?: SiriWaveVariant
  size?: number
  renderScale?: number
}

/**
 * High-performance, indestructible SVG Wave Orb.
 * Guaranteed 60fps GPU animation, zero WebGL context limit issues, zero memory leaks.
 * Perfect for avatars, buttons, and mobile devices.
 */
function SvgSiriWave({
  size = 32,
  className = "",
  style = {}
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const rawId = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const grad1 = `sg1_${rawId}`;
  const grad2 = `sg2_${rawId}`;
  const grad3 = `sg3_${rawId}`;
  const orb = `sorb_${rawId}`;
  const filterId = `sflt_${rawId}`;

  return (
    <div
      className={cn("relative flex items-center justify-center select-none pointer-events-none rounded-full overflow-hidden shrink-0", className)}
      style={{ width: size, height: size, ...style }}
    >
      <style>{`
        @keyframes siriWaveBob1 {
          0%, 100% { transform: scaleY(0.7) rotate(0deg); opacity: 0.85; }
          50% { transform: scaleY(1.35) rotate(5deg); opacity: 1; }
        }
        @keyframes siriWaveBob2 {
          0%, 100% { transform: scaleY(1.3) rotate(0deg); opacity: 0.9; }
          50% { transform: scaleY(0.65) rotate(-5deg); opacity: 0.8; }
        }
        @keyframes siriWaveBob3 {
          0%, 100% { transform: scaleX(0.85) scaleY(0.9); opacity: 0.75; }
          50% { transform: scaleX(1.1) scaleY(1.3); opacity: 1; }
        }
        @keyframes siriWaveBob4 {
          0%, 100% { transform: scaleY(0.8) rotate(3deg); opacity: 0.8; }
          50% { transform: scaleY(1.2) rotate(-3deg); opacity: 0.95; }
        }
        @keyframes siriOrbPulse {
          0%, 100% { transform: scale(0.85); opacity: 0.75; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
      
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id={grad1} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2a70" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#00d2ff" />
          </linearGradient>

          <linearGradient id={grad2} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f5a0" />
            <stop offset="50%" stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#ff2a70" />
          </linearGradient>

          <linearGradient id={grad3} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ff90e8" />
            <stop offset="50%" stopColor="#ff7836" />
            <stop offset="100%" stopColor="#5a32fa" />
          </linearGradient>

          <radialGradient id={orb} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#ff2a70" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#00d2ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#5a32fa" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Darkened Backdrop to ensure vivid contrast on light backgrounds */}
        <circle cx="50" cy="50" r="48" fill="#0f0728" fillOpacity="0.75" />

        {/* Ambient Pulsing Core Orb */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill={`url(#${orb})`}
          style={{ transformOrigin: '50px 50px', animation: 'siriOrbPulse 2.6s ease-in-out infinite' }}
        />

        {/* Dynamic Harmonic Sine Waves */}
        <g style={{ transformOrigin: '50px 50px' }} filter={`url(#${filterId})`}>
          {/* Wave 1 */}
          <path
            d="M 10 50 Q 30 22, 50 50 T 90 50"
            stroke={`url(#${grad1})`}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ transformOrigin: '50px 50px', animation: 'siriWaveBob1 2.2s ease-in-out infinite' }}
          />
          {/* Wave 2 */}
          <path
            d="M 10 50 Q 30 78, 50 50 T 90 50"
            stroke={`url(#${grad2})`}
            strokeWidth="3.4"
            strokeLinecap="round"
            style={{ transformOrigin: '50px 50px', animation: 'siriWaveBob2 2.7s ease-in-out infinite' }}
          />
          {/* Wave 3 */}
          <path
            d="M 16 50 Q 34 32, 50 50 T 84 50"
            stroke={`url(#${grad3})`}
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transformOrigin: '50px 50px', animation: 'siriWaveBob3 3.1s ease-in-out infinite' }}
          />
          {/* Wave 4 */}
          <path
            d="M 20 50 Q 36 66, 50 50 T 80 50"
            stroke={`url(#${grad1})`}
            strokeWidth="2.4"
            strokeLinecap="round"
            style={{ transformOrigin: '50px 50px', animation: 'siriWaveBob4 2.4s ease-in-out infinite' }}
          />
        </g>
      </svg>
    </div>
  );
}

export const SiriWave = React.memo(function SiriWave({
  variant = "wave",
  size = 420,
  renderScale = 0.75,
  className,
  style,
  ...props
}: SiriWaveProps) {
  // Always use the indestructible vector wave for icons & avatars (size <= 96)
  // to avoid hitting the browser's global 8-16 WebGL context limit.
  if (size <= 96) {
    return (
      <SvgSiriWave
        size={size}
        className={className}
        style={style}
      />
    );
  }

  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = React.useState(false)
  const [webGlFailed, setWebGlFailed] = React.useState(false)

  React.useEffect(() => {
    let cancelId: any
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      cancelId = (window as any).requestIdleCallback(() => setIsReady(true), { timeout: 400 })
      return () => (window as any).cancelIdleCallback?.(cancelId)
    } else {
      const timer = setTimeout(() => setIsReady(true), 150)
      return () => clearTimeout(timer)
    }
  }, [])

  React.useEffect(() => {
    if (!isReady || webGlFailed) return
    const canvas = canvasRef.current
    if (!canvas) return

    let gl: WebGLRenderingContext | null = null
    try {
      gl = canvas.getContext("webgl", { alpha: true, powerPreference: "low-power" }) ||
           (canvas.getContext("experimental-webgl", { alpha: true }) as WebGLRenderingContext)
    } catch {
      setWebGlFailed(true)
      return
    }
    if (!gl) {
      setWebGlFailed(true)
      return
    }

    let raf = 0
    let program: WebGLProgram | null = null
    let vs: WebGLShader | null = null
    let fs: WebGLShader | null = null
    let buffer: WebGLBuffer | null = null
    let isVisible = true

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? false
    }, { threshold: 0.05 })
    observer.observe(canvas)

    try {
      const compile = (type: number, src: string) => {
        if (!gl || gl.isContextLost()) return null
        const shader = gl.createShader(type)
        if (!shader) return null
        gl.shaderSource(shader, src)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader)
          return null
        }
        return shader
      }

      program = gl.createProgram()
      if (!program) {
        setWebGlFailed(true)
        return
      }

      vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER)
      fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADERS[variant])
      if (!vs || !fs) {
        if (vs) gl.deleteShader(vs)
        if (fs) gl.deleteShader(fs)
        if (program) gl.deleteProgram(program)
        setWebGlFailed(true)
        return
      }

      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        setWebGlFailed(true)
        return
      }
      gl.useProgram(program)

      buffer = gl.createBuffer()
      if (!buffer) {
        setWebGlFailed(true)
        return
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      )
      const aPos = gl.getAttribLocation(program, "aPos")
      if (aPos >= 0) {
        gl.enableVertexAttribArray(aPos)
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
      }

      const uResolution = gl.getUniformLocation(program, "iResolution")
      const uTime = gl.getUniformLocation(program, "iTime")

      const dim = Math.max(24, Math.round(size * renderScale))
      canvas.width = dim
      canvas.height = dim
      gl.viewport(0, 0, dim, dim)

      const start = typeof performance !== "undefined" ? performance.now() : Date.now()

      const frame = () => {
        if (!gl || !program) return
        if (isVisible && document.visibilityState === "visible") {
          const now = typeof performance !== "undefined" ? performance.now() : Date.now()
          const t = (now - start) / 1000

          gl.clearColor(0, 0, 0, 0)
          gl.clear(gl.COLOR_BUFFER_BIT)

          if (uResolution) gl.uniform2f(uResolution, dim, dim)
          if (uTime) gl.uniform1f(uTime, t)

          gl.enable(gl.BLEND)
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

          gl.drawArrays(gl.TRIANGLES, 0, 3)
        }
        raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    } catch {
      setWebGlFailed(true)
    }

    return () => {
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
      if (gl) {
        if (program) gl.deleteProgram(program)
        if (vs) gl.deleteShader(vs)
        if (fs) gl.deleteShader(fs)
        if (buffer) gl.deleteBuffer(buffer)
      }
    }
  }, [isReady, variant, size, renderScale, webGlFailed])

  if (webGlFailed) {
    return (
      <SvgSiriWave
        size={size}
        className={className}
        style={style}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("block bg-transparent pointer-events-none transition-opacity duration-300", isReady ? "opacity-100" : "opacity-0", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  )
})

export default SiriWave
