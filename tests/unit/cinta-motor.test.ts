import { describe, expect, it } from "vitest";
import {
  acercar,
  CALIDADES,
  conMargen,
  decidirModo,
  empaquetarZonas,
  escalaRender,
  leerTope,
  MAX_ZONAS,
  MEGAPIXELES,
  siguienteNivel,
  subirCalidad,
  TOPE_DEGRADADO,
  trayectoria,
  type Entorno,
  type GrupoZonas,
  type Rect,
} from "@/lib/cinta/motor";
import { FRAGMENTO } from "@/lib/cinta/shader";

// Reglas del motor de la cinta del hero que no necesitan WebGL: cuándo anima,
// cómo escucha al usuario, a qué resolución dibuja y los topes de contraste.

const escritorio: Entorno = { reducido: false, ahorroDatos: false, punteroFino: true, ancho: 1440 };
const celular: Entorno = { reducido: false, ahorroDatos: false, punteroFino: false, ancho: 390 };

describe("decidirModo", () => {
  it("en escritorio con mouse: bucle a 60 cuadros y reacción al puntero", () => {
    expect(decidirModo(escritorio)).toEqual({ animar: true, puntero: "fino", fps: 60, movil: false });
  });

  it("en celular: bucle a 30 cuadros y un pulso al tocar, sin depender del hover", () => {
    expect(decidirModo(celular)).toEqual({ animar: true, puntero: "toque", fps: 30, movil: true });
  });

  it("con 'reducir movimiento': un cuadro quieto, sin bucle ni reacción", () => {
    for (const e of [escritorio, celular]) {
      const m = decidirModo({ ...e, reducido: true });
      expect(m.animar).toBe(false);
      expect(m.puntero).toBe("ninguno");
    }
  });

  it("con ahorro de datos o 2 GB de memoria o menos, también queda quieta", () => {
    expect(decidirModo({ ...celular, ahorroDatos: true }).animar).toBe(false);
    expect(decidirModo({ ...celular, memoria: 2 }).animar).toBe(false);
    expect(decidirModo({ ...celular, memoria: 1 }).puntero).toBe("ninguno");
    expect(decidirModo({ ...celular, memoria: 4 }).animar).toBe(true);
  });
});

describe("escalaRender", () => {
  it("en px CSS (sin multiplicar por el DPR) hasta 1,6 megapíxeles", () => {
    expect(escalaRender(1440, 966, false)).toBe(1);
    const grande = escalaRender(2560, 1300, false);
    expect(grande).toBeLessThan(1);
    expect(2560 * 1300 * grande * grande).toBeCloseTo(MEGAPIXELES, -3);
  });

  it("en celular dibuja a 0,75 y la calidad adaptativa la baja más", () => {
    expect(escalaRender(390, 980, true)).toBe(0.75);
    expect(escalaRender(390, 980, true, 0.5)).toBe(0.375);
  });
});

describe("acercar (inercia del puntero)", () => {
  it("en τ recorre el 63 % del camino y no depende de los cuadros por segundo", () => {
    expect(acercar(0, 100, 0.22, 0.22)).toBeCloseTo(63.2, 1);
    // Dos pasos de 11 ms llegan al mismo lugar que uno de 22 ms.
    expect(acercar(acercar(0, 100, 0.011, 0.22), 100, 0.011, 0.22)).toBeCloseTo(acercar(0, 100, 0.022, 0.22), 6);
    expect(acercar(40, 100, 0, 0.22)).toBe(40);
  });
});

describe("calidad adaptativa (siguienteNivel)", () => {
  it("un navegador que limita a 30 Hz (33 ms) a 60 cuadros: baja a 30 sin tocar la resolución", () => {
    expect(siguienteNivel(33, { fps: 60, calidad: 1 })).toEqual({ fps: 30, calidad: 1 });
    // A 30 cuadros esos 33 ms ya caben: se queda a resolución completa.
    expect(siguienteNivel(33, { fps: 30, calidad: 1 })).toEqual({ fps: 30, calidad: 1 });
  });

  it("con los cuadros a tiempo no cambia nada", () => {
    expect(siguienteNivel(16.7, { fps: 60, calidad: 1 })).toEqual({ fps: 60, calidad: 1 });
    expect(siguienteNivel(24, { fps: 60, calidad: 0.75 })).toEqual({ fps: 60, calidad: 0.75 });
  });

  it("solo si a 30 cuadros tampoco alcanza baja la resolución, escalón por escalón, y al final queda quieta", () => {
    let n = siguienteNivel(60, { fps: 30, calidad: 1 });
    expect(n).toEqual({ fps: 30, calidad: 0.75 });
    n = siguienteNivel(60, n!);
    expect(n).toEqual({ fps: 30, calidad: 0.5625 });
    n = siguienteNivel(60, n!);
    expect(n).toEqual({ fps: 30, calidad: 0.5 });
    expect(siguienteNivel(60, n!)).toBeNull();
    // Unos 21 cuadros por segundo (46 ms) todavía pasan a 30.
    expect(siguienteNivel(46, { fps: 30, calidad: 0.5 })).toEqual({ fps: 30, calidad: 0.5 });
  });

  it("sube un escalón cuando hay margen, hasta resolución completa", () => {
    expect(CALIDADES[0]).toBe(1);
    expect(subirCalidad(0.5)).toBe(0.5625);
    expect(subirCalidad(0.5625)).toBe(0.75);
    expect(subirCalidad(0.75)).toBe(1);
    expect(subirCalidad(1)).toBe(1);
    // El umbral de subir (1,1 veces el intervalo) es más estricto que el de bajar (1,35).
    expect(conMargen(34, 30)).toBe(true);
    expect(conMargen(40, 30)).toBe(false);
    expect(siguienteNivel(40, { fps: 30, calidad: 0.75 })).toEqual({ fps: 30, calidad: 0.75 });
  });
});

describe("zonas de lectura (empaquetarZonas)", () => {
  const caja = (left: number, top: number, right: number, bottom: number): Rect => ({ left, top, right, bottom });
  const dentro = (q: Rect, z: Rect) => z.left <= q.left && z.top <= q.top && z.right >= q.right && z.bottom >= q.bottom;
  // Hero de 280 px: el titular en cuatro líneas, el subtítulo en siete, la
  // nota, y de la barra el logo y el botón de menú.
  const lineas = (n: number, y0: number, alto: number, ancho: number) => Array.from({ length: n }, (_, i) => caja(20, y0 + i * alto, 20 + ancho - (i % 3) * 30, y0 + (i + 1) * alto - 4));
  const logo = caja(16, 14, 110, 42);
  const menu = caja(232, 10, 268, 46);
  const grupos: GrupoZonas[] = [
    { tope: 0.16, lineas: lineas(2, 110, 38, 230) },
    { tope: TOPE_DEGRADADO, lineas: lineas(2, 186, 38, 240) },
    { tope: 0.055, lineas: lineas(7, 280, 28, 240) },
    { tope: 0.04, lineas: lineas(1, 520, 22, 200) },
    { tope: 0.16, lineas: [logo] },
    { tope: 0.16, lineas: [menu] },
  ];

  it("con más líneas que zonas no descarta ninguna: cada línea queda dentro de una zona con su tope", () => {
    expect(grupos.reduce((n, g) => n + g.lineas.length, 0)).toBeGreaterThan(MAX_ZONAS);
    const zonas = empaquetarZonas(grupos, MAX_ZONAS);
    expect(zonas.length).toBeLessThanOrEqual(MAX_ZONAS);
    for (const g of grupos) for (const q of g.lineas) expect(zonas.some((z) => z.tope === g.tope && dentro(q, z)), JSON.stringify(q)).toBe(true);
    // El logo y el botón de menú siguen ahí, tal cual.
    expect(zonas).toContainEqual({ ...logo, tope: 0.16 });
    expect(zonas).toContainEqual({ ...menu, tope: 0.16 });
  });

  it("si caben, deja una zona por línea (precisión por línea)", () => {
    const pocas = grupos.slice(0, 2);
    const zonas = empaquetarZonas(pocas, MAX_ZONAS);
    expect(zonas).toHaveLength(4);
  });

  it("aunque haya más textos que zonas, ninguno queda afuera y el tope combinado es el más exigente", () => {
    const zonas = empaquetarZonas(grupos, 3);
    expect(zonas.length).toBeLessThanOrEqual(3);
    for (const g of grupos)
      for (const q of g.lineas) {
        const z = zonas.find((z) => dentro(q, z));
        expect(z, JSON.stringify(q)).toBeDefined();
        if (g.tope > 0 && z!.tope > 0) expect(z!.tope).toBeLessThanOrEqual(g.tope);
      }
  });

  it("el GLSL declara las mismas zonas que el motor sube", () => {
    expect(FRAGMENTO).toContain(`uniform vec4 uR[${MAX_ZONAS}]`);
    expect(FRAGMENTO).toContain(`uniform float uC[${MAX_ZONAS}]`);
    expect(FRAGMENTO).toContain(`i < ${MAX_ZONAS}`);
  });
});

describe("trayectoria", () => {
  it("en escritorio va plana por debajo de la fila del botón y sale arriba a la derecha", () => {
    const [x0, x1, y0, y1] = trayectoria(1440, 966, false);
    expect(x0).toBeGreaterThanOrEqual(1440 * 0.45);
    expect(x1).toBeGreaterThan(1440);
    expect(y0).toBeGreaterThan(966 * 0.68);
    expect(y1).toBeLessThan(0);
  });
});

// Contraste: el tope de cada texto, aplicado al peor fondo (azul de marca o
// cian a la alfa que da esa luminancia), deja el texto en AA.
const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]: number[]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contraste = (a: number[], b: number[]) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const INK = [13, 14, 20].map((v) => v / 255);
const mezcla = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
// Fondo de esa luminancia: el casi negro con el color de la cinta encima.
function fondoCon(luminancia: number, color: number[]) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (lum(mezcla(INK, color, m)) > luminancia) hi = m;
    else lo = m;
  }
  return mezcla(INK, color, lo);
}

describe("topes de contraste del hero", () => {
  const AZUL = [27, 53, 208].map((v) => v / 255);
  const CIAN = [41, 196, 245].map((v) => v / 255);
  const BLANCO = [1, 1, 1];
  // [texto, tope, opacidad del blanco, contraste exigido]
  const casos: [string, number, number, number][] = [
    ["titular blanco (80 px: texto grande)", leerTope("0.16"), 1, 3],
    ["subtítulo (18-19 px, blanco al 66 %)", leerTope("0.055"), 0.66, 4.5],
    ["nota del botón (15 px, blanco al 60 %)", leerTope("0.04"), 0.6, 4.5],
    ["enlaces de la barra (15 px, blanco al 70 %)", 0.06, 0.7, 4.5],
  ];
  for (const [texto, tope, alfa, minimo] of casos) {
    it(`${texto}: ${minimo}:1 con el fondo en su tope (${tope})`, () => {
      for (const color of [AZUL, CIAN]) {
        const fondo = fondoCon(tope, color);
        const letra = mezcla(fondo, BLANCO, alfa);
        expect(contraste(letra, fondo)).toBeGreaterThanOrEqual(minimo);
      }
    });
  }

  it("el titular en degradado lo resuelve el shader punto por punto", () => {
    expect(leerTope("degradado")).toBe(TOPE_DEGRADADO);
    expect(TOPE_DEGRADADO).toBeLessThan(0);
    // Sin valor válido, un tope prudente.
    expect(leerTope("x")).toBe(0.06);
  });

  it("la punta azul del degradado (#3d5aff) pide un fondo casi negro: por eso el tope va por punto", () => {
    const azulVivo = [61, 90, 255].map((v) => v / 255);
    const tope = (lum(azulVivo) + 0.05) / 3.3 - 0.05;
    expect(tope).toBeLessThan(0.02);
    expect(contraste(azulVivo, fondoCon(tope, AZUL))).toBeGreaterThanOrEqual(3);
  });
});
