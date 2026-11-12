// Lo que aguanta el equipo de quien visita: decide si los lienzos del inicio
// corren en bucle o dibujan solo cuando hace falta.
//
// Un cuadro quieto (sin bucle) con «reducir movimiento», ahorro de datos, poca
// memoria o render por software. Esto último es el Chromium sin tarjeta
// gráfica (Lighthouse y PageSpeed, máquinas virtuales): ahí cada cuadro de un
// lienzo se dibuja en el procesador y bloquea el hilo principal. Se detecta
// así: se pide un contexto WebGL de prueba que el navegador niega si iría por
// software y, si aun así llega, se lee el nombre del renderizador.

export type Entorno = {
  // Bucle continuo. Sin él, los lienzos dibujan a demanda.
  animar: boolean;
  // «Reducir movimiento»: además de no animar, la escena fijada no se fija.
  reducido: boolean;
  // Mouse o trackpad: la trama reacciona al puntero.
  fino: boolean;
  movil: boolean;
};

const RENDER_SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;

let software: boolean | undefined;

export function renderPorSoftware(): boolean {
  if (software !== undefined) return software;
  software = false;
  try {
    const lienzo = document.createElement("canvas");
    const gl = lienzo.getContext("webgl", { failIfMajorPerformanceCaveat: true }) as WebGLRenderingContext | null;
    if (!gl) {
      software = true;
    } else {
      let nombre = String(gl.getParameter(gl.RENDERER) ?? "");
      if (!nombre || /^webkit webgl$/i.test(nombre.trim())) {
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        if (ext) nombre = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? nombre);
      }
      software = RENDER_SOFTWARE.test(nombre);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    software = true;
  }
  return software;
}

export function leerEntorno(): Entorno {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ahorro = Boolean(nav.connection?.saveData);
  const pocaMemoria = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
  return {
    animar: !reducido && !ahorro && !pocaMemoria && !renderPorSoftware(),
    reducido,
    fino: matchMedia("(hover: hover) and (pointer: fine)").matches,
    movil: innerWidth < 768,
  };
}

// Si se puede poner un video de fondo: nunca con «reducir movimiento» ni con
// ahorro de datos, y tampoco donde los lienzos no corren (poca memoria o
// render por software): ahí queda el póster.
export function admiteVideo(): boolean {
  return leerEntorno().animar;
}

export const limitar = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// Escalón suave entre a y b (0 antes de a, 1 después de b).
export function suave(a: number, b: number, v: number) {
  const x = limitar((v - a) / (b - a));
  return x * x * (3 - 2 * x);
}
