import { azarCon, SIGNOS } from "./trama";

// Las partículas que forman la X de Daxlo al final de la escena fijada.
// Salen de donde la última foto tenía luz y llegan en espiral a su lugar en
// la X: la mayoría sobre el contorno de las tres piezas, el resto adentro.

// Las tres piezas de la X, en una caja de 403 × 300: la punta de flecha, el
// brazo de arriba (el azul) y el de abajo.
export const PIEZAS_X: { puntos: [number, number][]; azul: boolean }[] = [
  { puntos: [[0, 0], [121, 0], [255, 150], [121, 300], [0, 300], [133, 150]], azul: false },
  { puntos: [[281, 0], [403, 0], [271, 137], [211, 72]], azul: true },
  { puntos: [[271, 162], [403, 300], [283, 300], [215, 220]], azul: false },
];
export const ANCHO_X = 403;
export const ALTO_X = 300;

function area(p: [number, number][]) {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[(i + 1) % p.length];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}

function dentro(p: [number, number][], x: number, y: number) {
  let d = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i];
    const [xj, yj] = p[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d;
  }
  return d;
}

export type Particulas = {
  n: number;
  // Destino en la caja de la X (0 a ANCHO_X, 0 a ALTO_X).
  tx: Float32Array;
  ty: Float32Array;
  // Origen en la pantalla (0 a 1); lo fija sembrar().
  ox: Float32Array;
  oy: Float32Array;
  retraso: Float32Array;
  giro: Float32Array;
  fase: Float32Array;
  peso: Float32Array;
  lado: Float32Array;
  // 0 a 3, un signo; 4, un cuadrado.
  tipo: Uint8Array;
  azul: Uint8Array;
};

export const RETRASO_MAX = 0.42;

export function crearParticulas(n: number, semilla = 11): Particulas {
  const azar = azarCon(semilla);
  const p: Particulas = {
    n,
    tx: new Float32Array(n),
    ty: new Float32Array(n),
    ox: new Float32Array(n),
    oy: new Float32Array(n),
    retraso: new Float32Array(n),
    giro: new Float32Array(n),
    fase: new Float32Array(n),
    peso: new Float32Array(n),
    lado: new Float32Array(n),
    tipo: new Uint8Array(n),
    azul: new Uint8Array(n),
  };
  const areas = PIEZAS_X.map((z) => area(z.puntos));
  const total = areas.reduce((s, v) => s + v, 0);
  const normal = () => (azar() + azar() + azar() - 1.5) / 1.5;
  let k = 0;
  PIEZAS_X.forEach((pieza, z) => {
    const cuantas = z === PIEZAS_X.length - 1 ? n - k : Math.round((n * areas[z]) / total);
    const pts = pieza.puntos;
    const lados = pts.map((a, i) => {
      const b = pts[(i + 1) % pts.length];
      return Math.hypot(b[0] - a[0], b[1] - a[1]);
    });
    const perimetro = lados.reduce((s, v) => s + v, 0);
    const [minX, maxX] = [Math.min(...pts.map((q) => q[0])), Math.max(...pts.map((q) => q[0]))];
    const [minY, maxY] = [Math.min(...pts.map((q) => q[1])), Math.max(...pts.map((q) => q[1]))];
    for (let c = 0; c < cuantas && k < n; c++, k++) {
      const enBorde = azar() < 0.62;
      let x = 0;
      let y = 0;
      if (enBorde) {
        let d = azar() * perimetro;
        let i = 0;
        while (d > lados[i] && i < lados.length - 1) d -= lados[i++];
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        const f = d / lados[i];
        x = a[0] + (b[0] - a[0]) * f + normal() * 3.2;
        y = a[1] + (b[1] - a[1]) * f + normal() * 3.2;
      } else {
        for (let intento = 0; intento < 30; intento++) {
          x = minX + azar() * (maxX - minX);
          y = minY + azar() * (maxY - minY);
          if (dentro(pts, x, y)) break;
        }
      }
      p.tx[k] = x;
      p.ty[k] = y;
      p.ox[k] = azar();
      p.oy[k] = azar();
      p.retraso[k] = azar() * RETRASO_MAX;
      p.giro[k] = (azar() < 0.5 ? -1 : 1) * (0.5 + azar() * 1.1);
      p.fase[k] = azar() * Math.PI * 2;
      p.peso[k] = enBorde ? 0.62 + azar() * 0.38 : 0.2 + azar() * 0.4;
      const tam = azar();
      p.lado[k] = tam < 0.72 ? 2 : tam < 0.94 ? 3 : 4;
      p.tipo[k] = azar() < 0.24 ? Math.floor(azar() * SIGNOS.length) : 4;
      p.azul[k] = pieza.azul ? 1 : 0;
    }
  });
  return p;
}

// Elige de dónde sale cada partícula: celdas de la rejilla, con más
// probabilidad donde la foto tiene luz.
export function sembrar(p: Particulas, luz: Float32Array | null, cols: number, filas: number, semilla = 23) {
  const azar = azarCon(semilla);
  for (let k = 0; k < p.n; k++) {
    let i = 0;
    let j = 0;
    for (let intento = 0; intento < 12; intento++) {
      i = Math.floor(azar() * cols);
      j = Math.floor(azar() * filas);
      if (!luz || azar() < 0.12 + luz[j * cols + i] * 1.3) break;
    }
    p.ox[k] = (i + 0.5) / cols;
    p.oy[k] = (j + 0.5) / filas;
  }
}

const curva = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

export function pintarParticulas(
  ctx: CanvasRenderingContext2D,
  p: Particulas,
  o: {
    // Avance de la formación (0 a 1) y tiempo en segundos.
    q: number;
    t: number;
    alfa: number;
    // Caja del lienzo en px CSS, y px del búfer por px CSS.
    ancho: number;
    alto: number;
    esc: number;
    // Centro y ancho de la X, en px CSS.
    cx: number;
    cy: number;
    anchoX: number;
    color: string;
    colorAzul: string;
    atlas: HTMLCanvasElement;
    atlasAzul: HTMLCanvasElement;
    ladoSigno: number;
  },
) {
  if (o.alfa <= 0.01) return;
  const k = o.anchoX / ANCHO_X;
  const x0 = o.cx - o.anchoX / 2;
  const y0 = o.cy - (ALTO_X * k) / 2;
  const tramo = 1 - RETRASO_MAX;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // Dos pasadas (tinta y azul) para cambiar de color solo una vez.
  for (let pasada = 0; pasada < 2; pasada++) {
    ctx.fillStyle = pasada ? o.colorAzul : o.color;
    const tira = pasada ? o.atlasAzul : o.atlas;
    for (let i = 0; i < p.n; i++) {
      if (p.azul[i] !== pasada) continue;
      const local = Math.min(1, Math.max(0, (o.q - p.retraso[i]) / tramo));
      const e = curva(local);
      const tx = x0 + p.tx[i] * k;
      const ty = y0 + p.ty[i] * k;
      // Vuelve en espiral: lo que le falta de camino, girado.
      const falta = 1 - e;
      const dx = (p.ox[i] * o.ancho - tx) * falta;
      const dy = (p.oy[i] * o.alto - ty) * falta;
      const ang = p.giro[i] * falta * 1.5;
      const cos = Math.cos(ang);
      const sen = Math.sin(ang);
      const vivo = 0.4 + e * 1.1;
      const x = tx + dx * cos - dy * sen + Math.sin(o.t * 0.9 + p.fase[i]) * vivo;
      const y = ty + dx * sen + dy * cos + Math.cos(o.t * 0.7 + p.fase[i] * 1.3) * vivo;
      const alfa = o.alfa * p.peso[i] * (0.35 + 0.65 * e) * (0.82 + 0.18 * Math.sin(o.t * 1.3 + p.fase[i]));
      if (alfa < 0.02) continue;
      ctx.globalAlpha = Math.min(1, alfa);
      if (p.tipo[i] < 4) {
        ctx.drawImage(tira, p.tipo[i] * o.ladoSigno, 0, o.ladoSigno, o.ladoSigno, Math.round(x * o.esc - o.ladoSigno / 2), Math.round(y * o.esc - o.ladoSigno / 2), o.ladoSigno, o.ladoSigno);
      } else {
        const s = p.lado[i] * o.esc;
        ctx.fillRect(Math.round(x * o.esc - s / 2), Math.round(y * o.esc - s / 2), s, s);
      }
    }
  }
  ctx.globalAlpha = 1;
}
