// Motor de la cinta de luz: contexto WebGL, bucle, puntero, toque, pausas y
// calidad adaptativa. Sin dependencias. Lo carga CintaHero
// (src/components/ui/cinta-hero.tsx) con un import dinámico, después de
// hidratar y en tiempo ocioso: no pesa en la carga inicial ni en el LCP.
// Va detrás del hero del inicio y de la portada de cada línea (/coaching,
// /consultoria): la variante cambia la trayectoria y el tinte, no el motor.
//
// Nunca escribe en la consola: la suite E2E falla con cualquier
// console.error. Si algo sale mal, devuelve null y queda la banda CSS. Con
// WebGL por software (sin GPU) también: ver esRenderSoftware.

import { FRAGMENTO, MAX_ZONAS, VERTICE } from "./shader";

export { MAX_ZONAS };

export type EstadoCinta = "lista" | "pausa" | "quieta";

// Dónde va la cinta: el hero del inicio o la portada de una línea. Cambia la
// trayectoria y, en la portada, cuándo se vuelve a medir (ver crearMotor).
export type Variante = "hero" | "portada";

export type Modo = {
  // Bucle continuo. Sin él, un solo cuadro quieto.
  animar: boolean;
  // Mouse (se escucha pointermove), toque (un pulso al tocar) o nada.
  puntero: "fino" | "toque" | "ninguno";
  // Cuadros por segundo como máximo: 30 en pantallas táctiles (la cinta es lenta).
  fps: 60 | 30;
  movil: boolean;
};

export type Entorno = {
  reducido: boolean;
  ahorroDatos: boolean;
  memoria?: number;
  punteroFino: boolean;
  ancho: number;
};

export function leerEntorno(): Entorno {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  return {
    reducido: matchMedia("(prefers-reduced-motion: reduce)").matches,
    ahorroDatos: Boolean(nav.connection?.saveData),
    memoria: typeof nav.deviceMemory === "number" ? nav.deviceMemory : undefined,
    punteroFino: matchMedia("(hover: hover) and (pointer: fine)").matches,
    ancho: innerWidth,
  };
}

// Con "reducir movimiento", ahorro de datos o un equipo con poca memoria: un
// cuadro quieto, sin bucle ni reacción.
export function decidirModo(e: Entorno): Modo {
  const movil = e.ancho < 768;
  const animar = !e.reducido && !e.ahorroDatos && !(e.memoria !== undefined && e.memoria <= 2);
  return {
    animar,
    puntero: !animar ? "ninguno" : e.punteroFino ? "fino" : "toque",
    fps: movil || !e.punteroFino ? 30 : 60,
    movil,
  };
}

// Resolución del búfer en px del búfer por px CSS. No se multiplica por el DPR
// (la seda es difusa): tope de 1,6 megapíxeles y 0,75 en celular.
export const MEGAPIXELES = 1.6e6;
export function escalaRender(ancho: number, alto: number, movil: boolean, calidad = 1) {
  const tope = Math.min(1, Math.sqrt(MEGAPIXELES / Math.max(1, ancho * alto)));
  return tope * (movil ? 0.75 : 1) * calidad;
}

// Suavizado exponencial independiente de los cuadros por segundo: en τ
// segundos recorre el 63 % de la distancia.
export function acercar(actual: number, objetivo: number, dt: number, tau: number) {
  return actual + (objetivo - actual) * (1 - Math.exp(-dt / tau));
}

// Trayectoria de la cinta (x0, x1, y0, y1 en px CSS): plana a la izquierda y
// subiendo a la derecha.
// - Hero: en escritorio pasa por debajo de la fila del botón y sube por la
//   derecha, lejos del titular; en celular cruza en diagonal.
// - Portada: plana por debajo del titular gigante (en escritorio, por el hueco
//   a la izquierda del sub) y sube pasado su borde derecho (`derecha`, medido
//   en el motor). La subida no puede ser fija: "ti." termina antes de la mitad
//   y "empresa." llega casi al borde. El margen (8 % del ancho) cubre lo que la
//   segunda línea se corre con el scroll (+8 %). Así no pasa detrás del
//   gigante; detrás del sub sí puede pasar, sin brillos, por su tope.
export function trayectoria(ancho: number, alto: number, movil: boolean, variante: Variante = "hero", derecha = 0): [number, number, number, number] {
  if (variante === "portada") {
    const entre = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    if (movil) {
      const x0 = entre(derecha + 0.08 * ancho, 0.3 * ancho, 0.9 * ancho);
      return [x0, x0 + 0.7 * ancho, 0.72 * alto, 0];
    }
    const x0 = entre(derecha + 0.08 * ancho, 0.4 * ancho, 0.72 * ancho);
    return [x0, x0 + 0.55 * ancho, 0.78 * alto, -0.1 * alto];
  }
  return movil ? [0, 1.25 * ancho, 0.71 * alto, 0.02 * alto] : [0.5 * ancho, 1.12 * ancho, 0.715 * alto, -0.06 * alto];
}

// Topes de luminancia del fondo detrás de cada texto (data-cinta-tope). El
// titular en degradado lo calcula el shader punto por punto.
export const TOPE_DEGRADADO = -1;
export function leerTope(valor: string | undefined | null) {
  if (valor === "degradado") return TOPE_DEGRADADO;
  const n = Number(valor);
  return Number.isFinite(n) && n > 0 ? n : 0.06;
}

// Velocidades angulares (rad/s): onda 18 s, onda secundaria 11 s, giro 23 s,
// respiración 15 s. La lámina trasera va a 0,62 de eso (unos 29 s).
const VEL = [0.349, 0.571, 0.27, 0.42] as const;
const TRASERA = 0.62;
// Pose del cuadro quieto (reducir movimiento): la cinta lejos del titular.
const T_QUIETO = 6.5;

export type Rect = { left: number; top: number; right: number; bottom: number };

// ------------------------------------------------------------ Zonas de lectura

// Un texto del hero (o una pieza de la barra): sus líneas, ya en px CSS de la
// sección, y el tope de luminancia del fondo detrás de él.
export type GrupoZonas = { tope: number; lineas: Rect[] };
export type Zona = Rect & { tope: number };

// El titular en degradado llega a pedir 0,012 en la punta azul (ver
// topeDegradado en el shader).
const TOPE_DEGRADADO_MIN = 0.012;

const area = (q: Rect) => Math.max(0, q.right - q.left) * Math.max(0, q.bottom - q.top);
const unir = (a: Rect, b: Rect): Rect => ({
  left: Math.min(a.left, b.left),
  top: Math.min(a.top, b.top),
  right: Math.max(a.right, b.right),
  bottom: Math.max(a.bottom, b.bottom),
});

// Tope de una caja que junta dos textos distintos: el más exigente de los dos.
function topeComun(a: number, b: number) {
  if (a < 0 && b < 0) return TOPE_DEGRADADO;
  if (a < 0 || b < 0) return Math.min(a < 0 ? b : a, TOPE_DEGRADADO_MIN);
  return Math.min(a, b);
}

// Reparte las líneas en `max` zonas como mucho, sin descartar ninguna. En
// pantallas angostas el subtítulo y el titular se parten en muchas líneas y
// con un tope fijo se perdían las últimas (el botón de menú quedaba sin
// protección). Mientras sobren, se fusiona el par de líneas seguidas del mismo
// texto cuya caja común agrega menos área; la caja conserva el tope de su
// texto, así que nunca protege menos. El peor caso es una caja por texto, unas
// seis. Si aun así no cupieran, se juntan textos vecinos con el tope más
// exigente.
export function empaquetarZonas(grupos: GrupoZonas[], max: number = MAX_ZONAS): Zona[] {
  const g = grupos
    .filter((x) => x.lineas.length > 0)
    .map((x) => ({ tope: x.tope, lineas: x.lineas.map((q) => ({ left: q.left, top: q.top, right: q.right, bottom: q.bottom })) }));
  let total = g.reduce((n, x) => n + x.lineas.length, 0);
  while (total > max) {
    let mejor: { lineas: Rect[]; i: number; caja: Rect; costo: number } | null = null;
    for (const x of g) {
      for (let i = 0; i + 1 < x.lineas.length; i++) {
        const caja = unir(x.lineas[i], x.lineas[i + 1]);
        const costo = area(caja) - area(x.lineas[i]) - area(x.lineas[i + 1]);
        if (!mejor || costo < mejor.costo) mejor = { lineas: x.lineas, i, caja, costo };
      }
    }
    if (!mejor) break;
    mejor.lineas.splice(mejor.i, 2, mejor.caja);
    total--;
  }
  // Aquí cada texto ya es una sola caja.
  while (g.length > Math.max(1, max)) {
    let i = 0;
    let costo = Infinity;
    for (let j = 0; j + 1 < g.length; j++) {
      const c = area(unir(g[j].lineas[0], g[j + 1].lineas[0])) - area(g[j].lineas[0]) - area(g[j + 1].lineas[0]);
      if (c < costo) {
        costo = c;
        i = j;
      }
    }
    g.splice(i, 2, { tope: topeComun(g[i].tope, g[i + 1].tope), lineas: [unir(g[i].lineas[0], g[i + 1].lineas[0])] });
  }
  return g.flatMap((x) => x.lineas.map((q) => ({ ...q, tope: x.tope })));
}

// ------------------------------------------------------------ Calidad adaptativa

// Escalones de resolución del búfer (fracción de escalaRender).
export const CALIDADES = [1, 0.75, 0.5625, 0.5] as const;
export type Nivel = { fps: 60 | 30; calidad: number };

// Qué hacer después de una ventana de 60 cuadros con un intervalo medio de
// `medio` ms. Primero baja de 60 a 30 cuadros, sin tocar la resolución: así un
// navegador que limita requestAnimationFrame a 30 Hz (ahorro de energía, una
// pestaña en segundo plano que vuelve) sigue a resolución completa y con la
// reacción al mouse. Solo si a 30 cuadros (una referencia fija, no la cadencia
// medida) tampoco alcanza, baja la resolución; si ni a la mitad alcanza (unos
// 21 cuadros por segundo), devuelve null: cuadro quieto.
export function siguienteNivel(medio: number, n: Nivel): Nivel | null {
  if (medio <= (1000 / n.fps) * 1.35 + 2) return n;
  if (n.fps === 60) return { fps: 30, calidad: n.calidad };
  const abajo = CALIDADES.find((c) => c < n.calidad - 1e-6);
  return abajo === undefined ? null : { fps: 30, calidad: abajo };
}

// Una ventana con margen (por debajo de 1,1 veces el intervalo): de a dos
// seguidas permiten subir un escalón. El umbral es más estricto que el de
// bajar, para que no oscile.
export function conMargen(medio: number, fps: 60 | 30) {
  return medio <= (1000 / fps) * 1.1;
}

export function subirCalidad(calidad: number) {
  return [...CALIDADES].reverse().find((c) => c > calidad + 1e-6) ?? 1;
}

// Guardián de los primeros cuadros, la primera ventana de la calidad
// adaptativa. siguienteNivel mide el ritmo después de 1,5 s y baja de a un
// escalón: con WebGL por software eso son decenas de tareas largas antes del
// cuadro quieto (en PageSpeed, unos 3,7 s de bloqueo). Aquí se mide lo que
// tarda el hilo principal en cada cuadro, desde que arranca el callback hasta
// la tarea siguiente (dibujar, pintar y entregar el lienzo): con GPU, de 2 a
// 12 ms; por software, de 35 a 125 ms, casi todo fuera del callback (medir
// solo el callback no lo ve). Si los GUARDIA_CUADROS primeros pasan todos de
// GUARDIA_MS, el motor se apaga y queda la banda. Todos, no el promedio: un
// cuadro lento suelto por la carga de la página no cuenta. null: faltan
// cuadros para decidir.
export const GUARDIA_CUADROS = 4;
export const GUARDIA_MS = 50;
export function cuadrosPesados(costos: readonly number[]): boolean | null {
  if (costos.length < GUARDIA_CUADROS) return null;
  return Math.min(...costos.slice(0, GUARDIA_CUADROS)) > GUARDIA_MS;
}

// Corre `fn` en la tarea siguiente, cuando el navegador ya pintó el cuadro.
// Con scheduler.postTask (Chromium, el de Lighthouse) va con prioridad alta:
// pasa antes que las tareas en cola de la página (la hidratación de React
// también va en mensajes), así que mide el cuadro y no la carga. Sin él, un
// mensaje.
function tareaSiguiente(fn: () => void) {
  const s = (globalThis as { scheduler?: { postTask?: (f: () => void, o: { priority: string }) => unknown } }).scheduler;
  if (s?.postTask) {
    s.postTask(fn, { priority: "user-blocking" });
    return;
  }
  const c = new MessageChannel();
  c.port1.onmessage = () => {
    c.port1.close();
    fn();
  };
  c.port2.postMessage(0);
}

// ------------------------------------------------------------ Render por software

// El Chromium sin GPU (Lighthouse y PageSpeed, máquinas virtuales, equipos sin
// controlador) dibuja WebGL en el procesador (SwiftShader, llvmpipe): cada
// cuadro bloquea el hilo principal. Ahí se queda la banda CSS, igual que sin
// WebGL. El contexto se pide con failIfMajorPerformanceCaveat (el navegador lo
// niega si iría por software) y, si aun así llega, se lee el renderizador.
export const RENDER_SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;
export function esRenderSoftware(renderer: string | null | undefined) {
  return !!renderer && RENDER_SOFTWARE.test(renderer);
}

// Chrome y Safari dan "WebKit WebGL" en RENDERER y el nombre real solo con
// WEBGL_debug_renderer_info. Firefox da el real en RENDERER y avisa en la
// consola si se pide la extensión (allá está obsoleta): solo se pide cuando
// RENDERER viene enmascarado.
export function leerRenderer(g: WebGLRenderingContext): string {
  try {
    const basico = String(g.getParameter(g.RENDERER) ?? "");
    if (basico && !/^webkit webgl$/i.test(basico.trim())) return basico;
    const ext = g.getExtension("WEBGL_debug_renderer_info");
    return ext ? String(g.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? basico) : basico;
  } catch {
    return "";
  }
}

// Cada línea de texto de un elemento, con los nodos de texto (no la caja del
// bloque, que va a todo lo ancho y dejaba rectángulos visibles sobre la seda).
export function lineasDeTexto(el: Element): Rect[] {
  const caminante = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const rango = document.createRange();
  const filas: Rect[] = [];
  for (let n = caminante.nextNode(); n; n = caminante.nextNode()) {
    if (!n.textContent?.trim()) continue;
    rango.selectNodeContents(n);
    for (const q of rango.getClientRects()) {
      if (q.width <= 2 || q.height <= 2) continue;
      const f = filas.find((f) => Math.abs(f.top - q.top) < q.height / 2);
      if (f) {
        f.left = Math.min(f.left, q.left);
        f.right = Math.max(f.right, q.right);
        f.bottom = Math.max(f.bottom, q.bottom);
      } else filas.push({ left: q.left, right: q.right, top: q.top, bottom: q.bottom });
    }
  }
  return filas;
}

export type Motor = { destruir: () => void };

type Opciones = {
  lienzo: HTMLCanvasElement;
  // La capa del fondo: recibe data-cinta, data-modo y data-puntero.
  capa: HTMLElement;
  seccion: HTMLElement;
  modo: Modo;
  variante?: Variante;
  // Tinte de la seda: 1 hacia el cian (coaching), -1 hacia el azul
  // (consultoría), 0 los colores del hero.
  tinte?: number;
  // Lo más claro que queda debajo del lienzo (sRGB de 0 a 255), contra lo que
  // se calculan los topes de contraste. En la portada, el centro del
  // resplandor de su zona; sin valor, el del hero (FONDO en el shader).
  fondo?: readonly number[];
};

export function crearMotor({ lienzo, capa, seccion, modo: modoInicial, variante = "hero", tinte = 0, fondo }: Opciones): Motor | null {
  let modo = modoInicial;
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = lienzo.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: true,
    }) as WebGLRenderingContext | null;
  } catch {
    gl = null;
  }
  if (!gl) return null;
  // Por software: se suelta el contexto antes de compilar nada (compilar ya
  // es una tarea larga ahí) y queda la banda.
  if (esRenderSoftware(leerRenderer(gl))) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }

  type Uniformes = Record<string, WebGLUniformLocation | null>;
  let U: Uniformes = {};

  function preparar(g: WebGLRenderingContext) {
    const compilar = (tipo: number, fuente: string) => {
      const s = g.createShader(tipo);
      if (!s) return null;
      g.shaderSource(s, fuente);
      g.compileShader(s);
      return g.getShaderParameter(s, g.COMPILE_STATUS) ? s : null;
    };
    const v = compilar(g.VERTEX_SHADER, VERTICE);
    const f = compilar(g.FRAGMENT_SHADER, FRAGMENTO);
    const p = g.createProgram();
    if (!v || !f || !p) return false;
    g.attachShader(p, v);
    g.attachShader(p, f);
    g.bindAttribLocation(p, 0, "a");
    g.linkProgram(p);
    if (!g.getProgramParameter(p, g.LINK_STATUS)) return false;
    g.useProgram(p);
    const b = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, b);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
    g.enableVertexAttribArray(0);
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
    U = {};
    for (const n of ["uRes", "uEsc", "uLinea", "uFase", "uFaseB", "uPtr", "uMov", "uDesp", "uR", "uC", "uGrad", "uGlowA", "uGlowB", "uFalda", "uTinte", "uFondo"]) {
      U[n] = g.getUniformLocation(p, n);
    }
    g.clearColor(0, 0, 0, 0);
    return true;
  }
  if (!preparar(gl)) return null;

  // ------------------------------------------------------------ Medidas
  let W = 1;
  let H = 1;
  let arribaDoc = 0;
  let izquierda = 0;
  let escala = 1;
  let calidad = 1;
  const rects = new Float32Array(MAX_ZONAS * 4).fill(-9e3);
  const topes = new Float32Array(MAX_ZONAS).fill(1);
  const grad = new Float32Array([0, 0, 1, 1]);
  const glowA = new Float32Array(4);
  const glowB = new Float32Array(4);
  const resplandoresCss = [...seccion.querySelectorAll<HTMLElement>("[data-cinta-resplandor]")];
  // Portada: borde derecho del titular gigante ([data-cinta-esquivar]), en px
  // CSS de la sección. De él sale la trayectoria (ver trayectoria).
  let derecha = 0;

  // `borde`: también vuelve a medir el borde del titular. Las medidas que
  // dispara el scroll no lo tocan: la trayectoria sale del titular en reposo
  // y no sigue al paralaje (su margen ya lo cubre).
  function medir(borde = true) {
    const r = seccion.getBoundingClientRect();
    if (borde) {
      derecha = 0;
      for (const el of seccion.querySelectorAll("[data-cinta-esquivar]")) {
        for (const q of lineasDeTexto(el)) derecha = Math.max(derecha, q.right - r.left);
      }
    }
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    arribaDoc = r.top + scrollY;
    izquierda = r.left;
    // Zonas de lectura: el texto del hero y, de la barra fija, lo que se ve
    // arriba del todo (posición con scroll en 0). Todo en px CSS de la sección.
    const enSeccion = (q: Rect, fija: boolean): Rect => {
      const dy = fija ? r.top + scrollY : r.top;
      return { left: q.left - r.left, top: q.top - dy, right: q.right - r.left, bottom: q.bottom - dy };
    };
    const grupos: GrupoZonas[] = [];
    for (const el of seccion.querySelectorAll<HTMLElement>("[data-cinta-tope]")) {
      const tope = leerTope(el.dataset.cintaTope);
      if (tope === TOPE_DEGRADADO) {
        const c = el.getBoundingClientRect();
        grad.set([c.left - r.left, c.top - r.top, c.width, c.height]);
      }
      grupos.push({ tope, lineas: lineasDeTexto(el).map((q) => enSeccion(q, false)) });
    }
    const barra = document.querySelector('nav[aria-label="Principal"]');
    if (barra) {
      const visibles = [...barra.querySelectorAll<HTMLElement>("ul, a > img, button[aria-controls]")].filter((e) => e.getClientRects().length > 0);
      for (const e of visibles) {
        if (e.tagName === "UL") grupos.push({ tope: 0.06, lineas: lineasDeTexto(e).map((q) => enSeccion(q, true)) });
        else grupos.push({ tope: 0.16, lineas: [enSeccion(e.getBoundingClientRect(), true)] });
      }
    }
    rects.fill(-9e3);
    topes.fill(1);
    empaquetarZonas(grupos, MAX_ZONAS).forEach((z, k) => {
      rects.set([z.left, z.top, z.right, z.bottom], k * 4);
      topes[k] = z.tope;
    });
    // Resplandores de esquina (los mismos <span> del CSS, medidos con su scale).
    glowA.fill(0);
    glowB.fill(0);
    for (const e of resplandoresCss) {
      const c = e.getBoundingClientRect();
      const [tono, alfa] = (e.dataset.cintaResplandor ?? "").split(" ");
      const destino = tono === "azul" ? glowB : glowA;
      destino.set([c.left + c.width / 2 - r.left, c.top + c.height / 2 - r.top, c.width / 2, Number(alfa) || 0]);
    }
    redimensionar();
  }

  function redimensionar() {
    escala = escalaRender(W, H, modo.movil, calidad);
    const bw = Math.max(1, Math.round(W * escala));
    const bh = Math.max(1, Math.round(H * escala));
    if (lienzo.width !== bw || lienzo.height !== bh) {
      lienzo.width = bw;
      lienzo.height = bh;
    }
    gl?.viewport(0, 0, bw, bh);
  }

  // ------------------------------------------------------------ Estado
  let t = 0;
  let px = 0;
  let py = 0;
  let inf = 0;
  let ene = 0;
  let pulso = 0;
  let ptrX = 0;
  let ptrY = 0;
  let ultimoMov = -1e9;
  let enVentana = false;
  let hayPuntero = false;
  let marcaPuntero = "";
  const reposo = () => (modo.movil ? [W * 0.8, H * 0.18] : [W * 0.8, H * 0.32]);

  function marcar(nombre: string, valor: string) {
    if (capa.dataset[nombre] !== valor) capa.dataset[nombre] = valor;
  }

  function actualizar(dt: number, ahora: number) {
    t += dt;
    const [rx, ry] = reposo();
    let tx = rx;
    let ty = ry;
    let objetivo = 0;
    if (modo.puntero === "fino" && hayPuntero && enVentana) {
      const x = ptrX - izquierda;
      const y = ptrY + scrollY - arribaDoc;
      if (y >= -40 && y <= H + 40) {
        tx = x;
        ty = y;
        objetivo = ahora - ultimoMov < 3000 ? 1 : 0.5;
      }
    } else if (modo.puntero === "toque" && pulso > 0.02) {
      tx = ptrX - izquierda;
      ty = ptrY + scrollY - arribaDoc;
      objetivo = pulso;
    }
    // Sin influencia la posición salta al puntero: así la luz no cruza la
    // pantalla desde el reposo al entrar.
    if (inf < 0.04 && objetivo > 0) {
      px = tx;
      py = ty;
    }
    const nx = acercar(px, tx, dt, objetivo > 0 ? 0.22 : 1.2);
    const ny = acercar(py, ty, dt, objetivo > 0 ? 0.22 : 1.2);
    const v = objetivo > 0 && dt > 0 ? Math.hypot(nx - px, ny - py) / dt / W : 0;
    px = nx;
    py = ny;
    const tauInf = objetivo > inf ? (modo.puntero === "toque" ? 0.25 : 0.3) : 1.1;
    inf = acercar(inf, objetivo, dt, tauInf);
    const eObj = Math.min(1, v / 1.2);
    ene = acercar(ene, eObj, dt, eObj > ene ? 0.09 : 0.8);
    pulso *= Math.exp(-dt / 0.9);
    if (modo.puntero === "fino") marcar("puntero", inf > 0.5 ? "activo" : inf < 0.05 ? "reposo" : capa.dataset.puntero ?? "reposo");
  }

  function fases(tiempo: number, factor: number, extra: number) {
    return VEL.map((w, i) => ((tiempo * w * factor + (i < 2 ? extra : 0)) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
  }

  function dibujar() {
    const g = gl;
    if (!g || g.isContextLost()) return;
    const sc = Math.min(1, Math.max(0, (scrollY - arribaDoc) / H));
    const tiempo = modo.animar ? t : T_QUIETO;
    const despertar = modo.animar ? 0.6 + 0.4 * (1 - Math.pow(1 - Math.min(1, t / 1.6), 3)) : 1;
    const fa = fases(tiempo, 1, sc * 1.1);
    const fb = fases(tiempo, TRASERA, sc * 1.1);
    const [x0, x1, y0, y1] = trayectoria(W, H, modo.movil, variante, derecha);
    g.uniform2f(U.uRes, W, H);
    g.uniform1f(U.uEsc, escala);
    g.uniform4f(U.uLinea, x0, x1, y0, y1);
    g.uniform4f(U.uFase, fa[0], fa[1], fa[2], fa[3]);
    g.uniform4f(U.uFaseB, fb[0], fb[1], fb[2], fb[3]);
    g.uniform4f(U.uPtr, px, py, inf, ene);
    g.uniform3f(U.uMov, despertar, sc, (tiempo * 0.6) % (Math.PI * 2));
    // Paralaje global: toda la cinta se corre un poco hacia el puntero.
    g.uniform2f(U.uDesp, (px - W / 2) * 0.03 * inf, (py - H / 2) * 0.03 * inf);
    g.uniform4fv(U.uR, rects);
    g.uniform1fv(U.uC, topes);
    g.uniform4fv(U.uGrad, grad);
    g.uniform4fv(U.uGlowA, glowA);
    g.uniform4fv(U.uGlowB, glowB);
    g.uniform1f(U.uFalda, modo.movil ? 90 : 130);
    g.uniform1f(U.uTinte, tinte);
    if (fondo && fondo.length === 3) g.uniform3f(U.uFondo, fondo[0] / 255, fondo[1] / 255, fondo[2] / 255);
    else g.uniform3f(U.uFondo, -1, -1, -1);
    g.clear(g.COLOR_BUFFER_BIT);
    g.drawArrays(g.TRIANGLES, 0, 3);
  }

  // ------------------------------------------------------------ Bucle
  let raf = 0;
  let visible = true;
  let pestana = document.visibilityState !== "hidden";
  let ultimo = 0;
  let primero = true;
  let destruido = false;
  let perdido = false;
  // Calidad adaptativa: intervalo medio entre cuadros dibujados, en ventanas
  // de 60 cuadros (ver siguienteNivel).
  let muestras = 0;
  let suma = 0;
  let arranque = 0;
  // Los cuadros por segundo que pide el equipo (decidirModo). Si bajó de 60 a
  // 30, cuándo fue (o cuándo se volvió a probar 60).
  let fpsBase = modo.fps;
  let bajoA30 = 0;
  // Ventanas seguidas con margen, y el castigo si una subida de calidad falla
  // en la ventana siguiente (se duplica: no oscila).
  let holgadas = 0;
  let recienSubida = false;
  let esperaSubir = 20_000;
  let noSubirHasta = 0;
  // Si la calidad adaptativa dejó un cuadro quieto (no la preferencia del
  // sistema), el modo con el que se vuelve a probar, y desde cuándo.
  let quietoPorRitmo: Modo | null = null;
  let quietoDesde = 0;
  // Guardián (cuadrosPesados): lo que tardó el hilo principal en cada uno de
  // los primeros cuadros, hasta la tarea siguiente (tareaSiguiente). null: ya
  // decidió.
  let costos: number[] | null = [];

  function vigilar(inicio: number) {
    if (!costos) return;
    tareaSiguiente(() => {
      if (!costos || destruido) return;
      costos.push(performance.now() - inicio);
      const pesados = cuadrosPesados(costos);
      if (pesados === null) return;
      costos = null;
      if (pesados) abandonar();
    });
  }

  function cuadro(ahora: number) {
    raf = 0;
    if (!corriendo()) return;
    raf = requestAnimationFrame(cuadro);
    const intervalo = 1000 / modo.fps;
    if (!primero && ahora - ultimo < intervalo - 4) return;
    const inicio = performance.now();
    const dt = primero ? 0 : Math.min(0.05, (ahora - ultimo) / 1000);
    if (!primero && ahora - arranque > 1500) {
      suma += ahora - ultimo;
      if (++muestras >= 60) ajustarCalidad(suma / muestras, ahora);
    }
    ultimo = ahora;
    actualizar(dt, ahora);
    dibujar();
    if (primero) {
      // El primer cuadro no cuenta para el guardián: lleva el encendido y,
      // en algunos controladores, la compilación diferida del shader.
      primero = false;
      arranque = ahora;
      encender();
    } else vigilar(inicio);
  }

  // Empieza a medir de nuevo, sin contar el primer segundo y medio.
  function calentar() {
    muestras = 0;
    suma = 0;
    holgadas = 0;
    arranque = performance.now();
  }

  function ajustarCalidad(medio: number, ahora: number) {
    muestras = 0;
    suma = 0;
    const veniaDeSubir = recienSubida;
    recienSubida = false;
    const sig = siguienteNivel(medio, { fps: modo.fps, calidad });
    if (!sig) {
      // Ni a 30 cuadros y la mitad de resolución alcanza: cuadro quieto, como
      // con "reducir movimiento". Se vuelve a probar al recuperar el foco o la
      // pestaña (sondear).
      quietoPorRitmo = modo;
      quietoDesde = ahora;
      cambiarModo({ ...modo, animar: false, puntero: "ninguno" });
      return;
    }
    if (sig.fps !== modo.fps) {
      holgadas = 0;
      bajoA30 = ahora;
      cambiarModo({ ...modo, fps: sig.fps });
      return;
    }
    if (sig.calidad !== calidad) {
      holgadas = 0;
      if (veniaDeSubir) {
        noSubirHasta = ahora + esperaSubir;
        esperaSubir = Math.min(esperaSubir * 2, 300_000);
      }
      calidad = sig.calidad;
      redimensionar();
      return;
    }
    holgadas = conMargen(medio, modo.fps) ? holgadas + 1 : 0;
    // A 30 por descarte: cada 18 s se vuelve a probar 60. Si el navegador
    // limita a 30 Hz, los cuadros salen iguales y no cuesta nada.
    if (modo.fps < fpsBase && ahora - bajoA30 > 18_000) {
      bajoA30 = ahora;
      holgadas = 0;
      cambiarModo({ ...modo, fps: fpsBase });
      return;
    }
    if (calidad < 1 && holgadas >= 2 && ahora >= noSubirHasta) {
      holgadas = 0;
      recienSubida = true;
      calidad = subirCalidad(calidad);
      redimensionar();
    }
  }

  // Al volver la pestaña o el foco a la ventana: un bajón pasajero (la carga
  // de la página, el ahorro de energía) no deja la cinta a 30 cuadros ni
  // quieta para siempre. Si vuelve a fallar, la calidad adaptativa la baja de
  // nuevo.
  function sondear() {
    if (destruido || perdido) return;
    const ahora = performance.now();
    if (quietoPorRitmo) {
      if (ahora - quietoDesde < 10_000) return;
      const m = quietoPorRitmo;
      quietoPorRitmo = null;
      calidad = CALIDADES[CALIDADES.length - 1];
      calentar();
      cambiarModo({ ...m, fps: 30 });
      return;
    }
    if (modo.animar && modo.fps < fpsBase) {
      bajoA30 = ahora;
      calentar();
      cambiarModo({ ...modo, fps: fpsBase });
    }
  }

  const corriendo = () => modo.animar && visible && pestana && !destruido && !perdido;

  function reanudar() {
    if (corriendo()) {
      if (!raf) {
        ultimo = performance.now();
        raf = requestAnimationFrame(cuadro);
      }
      marcar("cinta", "lista");
    } else if (modo.animar) {
      marcar("cinta", "pausa");
    }
    escucharPuntero(modo.puntero === "fino" && visible && pestana && modo.animar);
  }

  function detener() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  // Primer cuadro: el lienzo aparece (transición CSS) y los resplandores CSS
  // se apagan, porque ahora los pinta el shader.
  function encender() {
    for (const e of resplandoresCss) {
      e.style.transition = "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1)";
      e.style.opacity = "0";
    }
    marcar("cinta", modo.animar ? (corriendo() ? "lista" : "pausa") : "quieta");
  }

  function cuadroQuieto() {
    detener();
    dibujar();
    if (primero) {
      primero = false;
      encender();
    }
    marcar("cinta", "quieta");
  }

  function cambiarModo(nuevo: Modo) {
    modo = nuevo;
    marcar("modo", modo.animar ? modo.puntero : "quieto");
    if (modo.puntero !== "fino") capa.removeAttribute("data-puntero");
    if (!modo.animar) {
      escucharPuntero(false);
      inf = 0;
      ene = 0;
      redimensionar();
      cuadroQuieto();
    } else {
      redimensionar();
      reanudar();
    }
  }

  // ------------------------------------------------------------ Puntero y toque
  const alMover = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    ptrX = e.clientX;
    ptrY = e.clientY;
    ultimoMov = performance.now();
    enVentana = true;
    hayPuntero = true;
  };
  const alSalir = (e: MouseEvent) => {
    if (!e.relatedTarget) enVentana = false;
  };
  const alPerderFoco = () => {
    enVentana = false;
  };
  let escuchando = false;
  function escucharPuntero(si: boolean) {
    if (si === escuchando) return;
    escuchando = si;
    if (si) {
      addEventListener("pointermove", alMover, { passive: true });
      document.addEventListener("mouseout", alSalir, { passive: true });
      addEventListener("blur", alPerderFoco);
    } else {
      removeEventListener("pointermove", alMover);
      document.removeEventListener("mouseout", alSalir);
      removeEventListener("blur", alPerderFoco);
      enVentana = false;
    }
  }
  // Toque: un pulso donde cae el dedo. Pasivo y sin preventDefault: el scroll
  // y los toques en enlaces siguen iguales.
  const alTocar = (e: PointerEvent) => {
    if (modo.puntero !== "toque") return;
    ptrX = e.clientX;
    ptrY = e.clientY;
    pulso = 1;
  };
  seccion.addEventListener("pointerdown", alTocar, { passive: true });

  // ------------------------------------------------------------ Vigilancia
  const io = new IntersectionObserver(
    (es) => {
      visible = es[es.length - 1].isIntersecting;
      if (!visible) detener();
      if (modo.animar) reanudar();
    },
    { threshold: 0 },
  );
  io.observe(seccion);

  const alCambiarPestana = () => {
    pestana = document.visibilityState !== "hidden";
    if (!pestana) detener();
    else sondear();
    if (modo.animar) reanudar();
  };
  document.addEventListener("visibilitychange", alCambiarPestana);
  addEventListener("focus", sondear);

  // Una medida por cuadro como mucho. Si en el mismo cuadro la pide algo que
  // no es el scroll, se mide también el borde del titular.
  let pendiente = 0;
  let conBorde = false;
  const programar = (borde: boolean) => {
    conBorde ||= borde;
    if (pendiente) return;
    pendiente = requestAnimationFrame(() => {
      pendiente = 0;
      const b = conBorde;
      conBorde = false;
      if (destruido) return;
      medir(b);
      if (!modo.animar) dibujar();
    });
  };
  const remedir = () => programar(true);
  const ro = new ResizeObserver(remedir);
  ro.observe(seccion);
  // Las líneas del titular suben desde una máscara al cargar: se vuelven a
  // medir cuando termina cada entrada, y cuando llegan las fuentes.
  seccion.addEventListener("animationend", remedir);
  document.fonts?.ready.then(remedir).catch(() => {});

  // Portada: el titular gigante se corre a lo ancho con el scroll (paralaje
  // de CSS, globals.css) y las zonas de lectura quedarían viejas. Se vuelven
  // a medir con el scroll, una vez por cuadro como mucho y solo con la cinta a
  // la vista. Es barato: medir solo lee (los rectángulos de unas quince líneas
  // y la caja de la sección), no escribe en el DOM ni cambia el lienzo. Se
  // eligió esto y no zonas infladas porque el corrimiento depende del ancho
  // (de 28 a 90 px) y unas cajas de ese tamaño en un titular de 168 px
  // apagarían la seda en un área mucho mayor que el texto. La trayectoria, en
  // cambio, no se mueve: sale del titular en reposo con un margen que cubre el
  // corrimiento, así que la seda no cruza por donde pasa el titular (llega, a
  // lo sumo, su halo tenue, que las zonas recortan).
  // Las entradas del sub y la acción son transiciones (Reveal): también se
  // mide al terminar cada una. El hero no escucha nada de esto.
  const alScroll = () => {
    if (visible) programar(false);
  };
  if (variante === "portada") {
    addEventListener("scroll", alScroll, { passive: true });
    seccion.addEventListener("transitionend", remedir);
  }

  const mqReducir = matchMedia("(prefers-reduced-motion: reduce)");
  const alCambiarPreferencia = () => {
    const nuevo = decidirModo(leerEntorno());
    fpsBase = nuevo.fps;
    quietoPorRitmo = null;
    calentar();
    cambiarModo(nuevo);
  };
  mqReducir.addEventListener?.("change", alCambiarPreferencia);

  const alPerder = (e: Event) => {
    e.preventDefault();
    perdido = true;
    detener();
  };
  const alRecuperar = () => {
    perdido = false;
    if (gl && preparar(gl)) {
      medir();
      if (modo.animar) reanudar();
      else dibujar();
    }
  };
  lienzo.addEventListener("webglcontextlost", alPerder);
  lienzo.addEventListener("webglcontextrestored", alRecuperar);

  // ------------------------------------------------------------ Arranque
  medir();
  marcar("modo", modo.animar ? modo.puntero : "quieto");
  if (modo.puntero === "fino") marcar("puntero", "reposo");
  {
    const [rx, ry] = reposo();
    px = rx;
    py = ry;
  }
  if (modo.animar) reanudar();
  else cuadroQuieto();

  // Detiene todo y suelta los oyentes. Los resplandores CSS vuelven a verse.
  // Con `perderContexto`, también el contexto WebGL, sin esperar a la
  // recolección: el navegador admite pocos a la vez.
  function soltar(perderContexto: boolean) {
    if (destruido) return;
    destruido = true;
    detener();
    if (pendiente) cancelAnimationFrame(pendiente);
    escucharPuntero(false);
    io.disconnect();
    ro.disconnect();
    seccion.removeEventListener("pointerdown", alTocar);
    seccion.removeEventListener("animationend", remedir);
    seccion.removeEventListener("transitionend", remedir);
    removeEventListener("scroll", alScroll);
    document.removeEventListener("visibilitychange", alCambiarPestana);
    removeEventListener("focus", sondear);
    mqReducir.removeEventListener?.("change", alCambiarPreferencia);
    lienzo.removeEventListener("webglcontextlost", alPerder);
    lienzo.removeEventListener("webglcontextrestored", alRecuperar);
    for (const e of resplandoresCss) {
      e.style.opacity = "";
      e.style.transition = "";
    }
    if (perderContexto) gl?.getExtension("WEBGL_lose_context")?.loseContext();
    gl = null;
  }

  // Guardián: los primeros cuadros bloquean el hilo principal (WebGL por
  // software que la detección no vio, o un equipo que no da). Se apaga del
  // todo y queda la banda CSS, como sin WebGL; el lienzo funde a 0 y la banda
  // vuelve (globals.css). No se vuelve a probar.
  function abandonar() {
    soltar(true);
    capa.removeAttribute("data-modo");
    capa.removeAttribute("data-puntero");
    marcar("cinta", "respaldo");
  }

  return {
    destruir() {
      // Al desmontar (cambio de página) se suelta el contexto ya. Si el lienzo
      // sigue en la página (React en desarrollo monta dos veces), no.
      soltar(!lienzo.isConnected);
    },
  };
}
