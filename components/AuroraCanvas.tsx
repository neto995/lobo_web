"use client";

import { useEffect, useRef } from "react";

/* Aurora 3D — cortinas de luz con perspectiva de bóveda renderizadas en
   WebGL. Paleta LOBO (óxido, oro apagado, salvia); nada de azules SaaS.
   Se anima sola, se pausa fuera de viewport y respeta reduced-motion
   (un frame estático). Si WebGL falla, el ::before CSS queda de fondo. */

const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 u_res;
uniform float u_time;
uniform float u_intensity;
uniform float u_scroll;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p *= 2.03;
    amp *= 0.5;
  }
  return value;
}

// Tres cortes del mismo campo de ruido forman un volumen barato. Al desplazar
// z obtenemos humo que rota y respira, no una textura plana que solo se mueve.
float volumeNoise(vec2 p, float z) {
  float z0 = floor(z);
  float fz = smoothstep(0.0, 1.0, fract(z));
  return mix(fbm(p + vec2(z0 * 5.17, z0 * 2.83)),
             fbm(p + vec2((z0 + 1.0) * 5.17, (z0 + 1.0) * 2.83)), fz);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;

  vec2 p = uv - 0.5;
  p.x *= u_res.x / max(u_res.y, 1.0);

  // Cámara muy lenta con un pequeño avance al hacer scroll.
  float camera = u_time * 0.055 + u_scroll * 0.9;
  float angle = 0.10 * sin(camera * 0.38) + u_scroll * 0.055;
  mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  p = rotation * p;

  vec3 color = vec3(0.0);
  float weight = 0.0;

  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float depth = fi / 2.0; // 0 = cortina cercana, 1 = lejana

    // Planos a distintas profundidades: escala, velocidad y desplazamiento
    // diferentes producen paralaje. Dos muestras deformadas suavizan el humo.
    float z = camera * (0.55 + depth * 0.22) + fi * 2.7;
    vec2 layerP = p * (1.45 + depth * 0.72);
    layerP.x += mix(-0.38, 0.34, depth) + sin(camera * 0.31 + fi) * 0.08;
    layerP.y += u_scroll * (0.12 + depth * 0.16);
    float warp = volumeNoise(layerP * 1.35, z);
    float cloud = volumeNoise(layerP + vec2(warp * 0.44, -warp * 0.30), z + 0.8);
    float body = smoothstep(0.42, 0.76, cloud);
    body *= 1.0 - smoothstep(0.08, 0.70, length(layerP * vec2(0.72, 1.0)));
    float wisps = 0.72 + 0.28 * volumeNoise(layerP * 2.4, z + 1.6);

    // Paleta LOBO luminosa: óxido, oro y salvia con luz propia.
    vec3 tint = i == 0
      ? vec3(0.8, 0.36, 0.22)
      : i == 1
        ? vec3(0.78, 0.6, 0.28)
        : vec3(0.55, 0.62, 0.38);

    float w = body * wisps * (0.58 - depth * 0.10);
    color += tint * w;
    weight += w;
  }

  float alpha = (1.0 - exp(-weight * 0.72)) * u_intensity;

  // Fundido en los bordes para integrarse con la sección.
  alpha *= smoothstep(0.0, 0.14, uv.y) * smoothstep(1.0, 0.86, uv.y);
  alpha *= smoothstep(0.0, 0.06, uv.x) * smoothstep(1.0, 0.94, uv.x);

  vec3 premult = (color / max(weight, 0.001)) * alpha;
  gl_FragColor = vec4(premult, alpha);
}
`;

// Resolución interna baja: el degradado es suave, el escalado lo disimula
// y mantiene barato el fragment shader.
const RENDER_SCALE = 0.4;
const MAX_RENDER_WIDTH = 640;

function compileProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vert = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const frag = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vert || !frag) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function AuroraCanvas({
  intensity = 0.3,
}: {
  intensity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const program = compileProgram(gl);
    if (!program) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uIntensity = gl.getUniformLocation(program, "u_intensity");
    const uScroll = gl.getUniformLocation(program, "u_scroll");
    gl.uniform1f(uIntensity, intensity);

    const syncSize = () => {
      const width = Math.min(
        Math.max(Math.round(canvas.clientWidth * RENDER_SCALE), 120),
        MAX_RENDER_WIDTH,
      );
      const height = Math.max(
        Math.round(width * (canvas.clientHeight / Math.max(canvas.clientWidth, 1))),
        80,
      );
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let scrollTarget = 0;
    let scrollCurrent = 0;

    const updateScrollTarget = () => {
      const rect = canvas.getBoundingClientRect();
      scrollTarget = (window.innerHeight * 0.5 - (rect.top + rect.height * 0.5)) /
        Math.max(window.innerHeight, 1);
    };

    const draw = (timeSeconds: number) => {
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.035;
      gl.uniform1f(uTime, timeSeconds);
      gl.uniform1f(uScroll, scrollCurrent);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let running = false;

    const loop = (now: number) => {
      draw(now / 1000);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reducedMotion.matches) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    syncSize();
    updateScrollTarget();
    // Frame estático inicial (y único, con reduced-motion).
    draw(12);

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
      if (!running) draw(12);
    });
    resizeObserver.observe(canvas);

    // Solo anima mientras la sección está en viewport.
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    intersectionObserver.observe(canvas);
    window.addEventListener("scroll", updateScrollTarget, { passive: true });

    const onMotionChange = () => {
      if (reducedMotion.matches) stop();
      else start();
    };
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
      window.removeEventListener("scroll", updateScrollTarget);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [intensity]);

  return (
    <div aria-hidden="true" className="aurora-canvas">
      <canvas ref={canvasRef} />
    </div>
  );
}
