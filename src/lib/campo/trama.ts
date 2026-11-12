// La trama de puntos: una rejilla de puntos y signos pequeños sobre una
// fotografía, que deja ver la imagen por su luz. Cada celda lee cuánta luz
// tiene la foto debajo y se enciende más donde la foto es más clara. Un campo
// lento decide por dónde aparece (respira), el puntero la despierta a su
// alrededor y `cubrir` la extiende a toda la pantalla (los relevos de foto).
//
// Todo en un <canvas> 2D: puntos en pocos trazos (uno por nivel de opacidad)
// y los signos copiados de un atlas dibujado una vez.

export type Rejilla = { cols: number; filas: number; celda: number; ancho: number; alto: number };

export function crearRejilla(ancho: number, alto: number, celda: number): Rejilla {
  return { cols: Math.max(1, Math.ceil(ancho / celda)), filas: Math.max(1, Math.ceil(alto / celda)), celda, ancho, alto };
}

// Generador con semilla: la trama es la misma en cada visita.
export function azarCon(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// El recorte que hace object-fit: cover con object-position posX posY (0 a 1):
// qué rectángulo de la fuente se ve en una caja de ancho × alto.
// Con zoom (campo.css, --zoom), además se acerca alrededor de ese mismo punto.
export function encuadre(anchoFuente: number, altoFuente: number, ancho: number, alto: number, posX = 0.5, posY = 0.5, zoom = 1) {
  const escala = Math.max(ancho / anchoFuente, alto / altoFuente) * zoom;
  const sw = ancho / escala;
  const sh = alto / escala;
  return { sx: (anchoFuente - sw) * posX, sy: (altoFuente - sh) * posY, sw, sh };
}

// El encuadre que el CSS le da a una imagen o a un video en su caja:
// object-position y la variable --zoom (campo.css, .cm-foto).
export function leerEncuadre(el: Element) {
  const estilo = getComputedStyle(el);
  const [x = "50%", y = "50%"] = estilo.objectPosition.split(" ");
  const zoom = parseFloat(estilo.getPropertyValue("--zoom")) || 1;
  return { posX: parseFloat(x) / 100, posY: parseFloat(y) / 100, zoom };
}

let lienzoMuestra: HTMLCanvasElement | null = null;

// Luz de la fuente (foto o video) en cada celda de la rejilla, de 0 a 1.
// Devuelve null si la fuente todavía no se puede leer.
export function muestrear(
  fuente: HTMLImageElement | HTMLVideoElement,
  r: Rejilla,
  o: { posX?: number; posY?: number; zoom?: number } = {},
  destino?: Float32Array,
): Float32Array | null {
  const esVideo = "videoWidth" in fuente;
  const af = esVideo ? fuente.videoWidth : fuente.naturalWidth;
  const hf = esVideo ? fuente.videoHeight : fuente.naturalHeight;
  if (!af || !hf) return null;
  lienzoMuestra ??= document.createElement("canvas");
  const c = lienzoMuestra;
  if (c.width !== r.cols || c.height !== r.filas) {
    c.width = r.cols;
    c.height = r.filas;
  }
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const { sx, sy, sw, sh } = encuadre(af, hf, r.ancho, r.alto, o.posX, o.posY, o.zoom);
  let datos: Uint8ClampedArray;
  try {
    // La rejilla puede sobrar de la caja por un pedazo de celda.
    ctx.drawImage(fuente, sx, sy, sw, sh, 0, 0, r.ancho / r.celda, r.alto / r.celda);
    datos = ctx.getImageData(0, 0, r.cols, r.filas).data;
  } catch {
    return null;
  }
  const n = r.cols * r.filas;
  const salida = destino && destino.length === n ? destino : new Float32Array(n);
  for (let k = 0; k < n; k++) {
    const p = k * 4;
    salida[k] = (0.2126 * datos[p] + 0.7152 * datos[p + 1] + 0.0722 * datos[p + 2]) / 255;
  }
  return salida;
}

export const SIGNOS = ["0", "1", "+", "#"] as const;

// Los signos, dibujados una vez en una tira: se copian con drawImage.
export function crearAtlas(lado: number, color: string, familia: string) {
  const c = document.createElement("canvas");
  c.width = lado * SIGNOS.length;
  c.height = lado;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `500 ${Math.round(lado * 0.92)}px ${familia}`;
    SIGNOS.forEach((s, i) => ctx.fillText(s, lado * (i + 0.5), lado * 0.54));
  }
  return c;
}

export type Cuadro = {
  // Segundos.
  t: number;
  // Luz de la foto por celda. Con `b` y `mezcla`, la trama pasa de una a otra.
  a: Float32Array | null;
  b?: Float32Array | null;
  mezcla?: number;
  // Cuánto se deja ver el campo que respira (0 a 1).
  fuerza: number;
  // Cobertura total, para los relevos (0 a 1).
  cubrir?: number;
  // El puntero, en px de la caja, con su fuerza (0 a 1).
  puntero?: { x: number; y: number; f: number } | null;
  // Opacidad general.
  alfa?: number;
};

export type Trama = {
  ajustar: (ancho: number, alto: number) => Rejilla;
  rejilla: () => Rejilla;
  contexto: () => CanvasRenderingContext2D | null;
  escala: () => number;
  // Borra y deja el contexto en px del lienzo.
  limpiar: () => void;
  pintar: (c: Cuadro) => void;
  atlas: (color: string) => HTMLCanvasElement;
  ladoSigno: () => number;
};

const NIVELES = 6;
// Tope de px del búfer: la trama es de puntos, no necesita toda la densidad
// de una pantalla de celular.
const TOPE_PX = 2.4e6;

export function crearTrama(lienzo: HTMLCanvasElement, o: { celda: number; color: string; semilla?: number }): Trama {
  const ctx = lienzo.getContext("2d");
  let r = crearRejilla(1, 1, o.celda);
  let esc = 1;
  let fase = new Float32Array(1);
  let suerte = new Uint8Array(1);
  let cubos: Uint32Array[] = [];
  let cuenta = new Uint32Array(NIVELES);
  let cubosSigno: Uint32Array[] = [];
  let cuentaSigno = new Uint32Array(NIVELES);
  let senI = new Float32Array(1);
  let cosJ = new Float32Array(1);
  let senD = new Float32Array(1);
  let lado = 8;
  const atlasPor = new Map<string, HTMLCanvasElement>();
  const familia = () => getComputedStyle(lienzo).fontFamily || "ui-monospace, monospace";

  const atlas = (color: string) => {
    const clave = `${color}|${lado}`;
    let a = atlasPor.get(clave);
    if (!a) {
      a = crearAtlas(lado, color, familia());
      atlasPor.set(clave, a);
    }
    return a;
  };

  function ajustar(ancho: number, alto: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    esc = Math.min(dpr, Math.sqrt(TOPE_PX / Math.max(1, ancho * alto)));
    lienzo.width = Math.max(1, Math.round(ancho * esc));
    lienzo.height = Math.max(1, Math.round(alto * esc));
    r = crearRejilla(ancho, alto, o.celda);
    const n = r.cols * r.filas;
    const azar = azarCon(o.semilla ?? 7);
    fase = new Float32Array(n);
    suerte = new Uint8Array(n);
    for (let k = 0; k < n; k++) {
      fase[k] = azar() * Math.PI * 2;
      suerte[k] = Math.floor(azar() * 256);
    }
    cubos = Array.from({ length: NIVELES }, () => new Uint32Array(n));
    cubosSigno = Array.from({ length: NIVELES }, () => new Uint32Array(n));
    senI = new Float32Array(r.cols);
    cosJ = new Float32Array(r.filas);
    senD = new Float32Array(r.cols + r.filas);
    lado = Math.max(6, Math.round(o.celda * esc * 0.9));
    atlasPor.clear();
    return r;
  }

  function limpiar() {
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
  }

  function pintar(c: Cuadro) {
    if (!ctx || !c.a || c.a.length !== r.cols * r.filas) return;
    const { cols, filas, celda } = r;
    const { t, a } = c;
    const b = c.b && c.b.length === a.length ? c.b : null;
    const mezcla = b ? (c.mezcla ?? 0) : 0;
    const cubrir = c.cubrir ?? 0;
    const alfaGeneral = c.alfa ?? 1;
    if (alfaGeneral <= 0.01) return;
    const punt = c.puntero && c.puntero.f > 0.01 ? c.puntero : null;
    // El halo del puntero: unas 14 celdas de radio.
    const sigma2 = 2 * (celda * 9) ** 2;

    for (let i = 0; i < cols; i++) senI[i] = Math.sin(i * 0.19 + t * 0.31);
    for (let j = 0; j < filas; j++) cosJ[j] = Math.cos(j * 0.23 - t * 0.24);
    for (let d = 0; d < cols + filas; d++) senD[d] = Math.sin(d * 0.085 + t * 0.17 + 1.7);
    cuenta.fill(0);
    cuentaSigno.fill(0);
    const umbralSigno = 30 + cubrir * 110;

    for (let j = 0; j < filas; j++) {
      const y = (j + 0.5) * celda;
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        const luz = b ? a[k] + (b[k] - a[k]) * mezcla : a[k];
        const campo = 0.5 + 0.25 * senI[i] * cosJ[j] + 0.25 * senD[i + j];
        let pres = ((campo - 0.5) * 3.2 + (luz - 0.26) * 1.9) * c.fuerza;
        if (pres < 0) pres = 0;
        else if (pres > 1) pres = 1;
        if (cubrir > 0) pres += (1 - pres) * cubrir * (0.45 + 0.55 * campo);
        if (punt) {
          const dx = (i + 0.5) * celda - punt.x;
          const dy = y - punt.y;
          const g = Math.exp(-(dx * dx + dy * dy) / sigma2) * punt.f * (0.5 + 0.5 * luz);
          if (g > pres) pres = g;
        }
        if (pres < 0.04) continue;
        const brillo = 0.74 + 0.26 * Math.sin(t * 1.6 + fase[k]);
        const alfa = pres * brillo * (0.2 + 0.8 * luz) * alfaGeneral;
        if (alfa < 0.035) continue;
        const nivel = Math.min(NIVELES - 1, Math.floor(alfa * NIVELES));
        if (suerte[k] < umbralSigno && pres > 0.3) cubosSigno[nivel][cuentaSigno[nivel]++] = k;
        else cubos[nivel][cuenta[nivel]++] = k;
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = o.color;
    const paso = celda * esc;
    const tira = atlas(o.color);
    for (let n = 0; n < NIVELES; n++) {
      if (!cuenta[n] && !cuentaSigno[n]) continue;
      ctx.globalAlpha = Math.min(1, (n + 0.7) / NIVELES);
      if (cuenta[n]) {
        ctx.beginPath();
        const lista = cubos[n];
        for (let q = 0; q < cuenta[n]; q++) {
          const k = lista[q];
          const i = k % cols;
          const j = (k - i) / cols;
          const luz = a[k];
          const s = Math.max(1, (1.1 + 2.3 * luz) * esc);
          ctx.rect(Math.round((i + 0.5) * paso - s / 2), Math.round((j + 0.5) * paso - s / 2), s, s);
        }
        ctx.fill();
      }
      const signos = cubosSigno[n];
      for (let q = 0; q < cuentaSigno[n]; q++) {
        const k = signos[q];
        const i = k % cols;
        const j = (k - i) / cols;
        ctx.drawImage(tira, (suerte[k] & 3) * lado, 0, lado, lado, Math.round((i + 0.5) * paso - lado / 2), Math.round((j + 0.5) * paso - lado / 2), lado, lado);
      }
    }
    ctx.globalAlpha = 1;
  }

  return { ajustar, rejilla: () => r, contexto: () => ctx, escala: () => esc, limpiar, pintar, atlas, ladoSigno: () => lado };
}
