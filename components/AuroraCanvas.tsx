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

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;

  // Perspectiva de bóveda: las cortinas se abren abajo y convergen arriba.
  float persp = mix(1.7, 0.6, uv.y);
  float px = (uv.x - 0.5) * persp;

  vec3 color = vec3(0.0);
  float weight = 0.0;

  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float depth = fi / 2.0; // 0 = cortina cercana, 1 = lejana

    // Trayectoria ondulante propia de cada cortina, con paralaje por capa.
    float drift = u_time * (0.05 + depth * 0.035) + fi * 4.7;
    float path = fbm(vec2(px * (2.2 + depth * 1.6) + drift, fi * 5.3));
    float center = mix(0.18, 0.84, path);

    float d = uv.y - center;
    float body = exp(-d * d * (30.0 - depth * 10.0));

    // Estrías verticales: los "rayos" que dan volumen a la cortina.
    float rays = 0.78 + 0.22 * noise(vec2(
      px * (9.0 - depth * 3.0) + path * 4.0,
      u_time * 0.16 + fi * 2.1
    ));

    // Paleta LOBO luminosa: óxido, oro y salvia con luz propia.
    vec3 tint = i == 0
      ? vec3(0.8, 0.36, 0.22)
      : i == 1
        ? vec3(0.78, 0.6, 0.28)
        : vec3(0.55, 0.62, 0.38);

    float w = body * rays * (1.0 - depth * 0.35);
    color += tint * w;
    weight += w;
  }

  float alpha = (1.0 - exp(-weight * 0.9)) * u_intensity;

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
  intensity = 0.42,
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

    const draw = (timeSeconds: number) => {
      gl.uniform1f(uTime, timeSeconds);
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
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [intensity]);

  return (
    <div aria-hidden="true" className="aurora-canvas">
      <canvas ref={canvasRef} />
    </div>
  );
}
