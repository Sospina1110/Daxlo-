import { describe, expect, it } from "vitest";
import { trazar } from "@/components/fondos/medir";
import { CICLO, desfase, LINEA_ACTIVA, margenDeLinea, PAPELES_A_MANO, PASO_FINAL, PASOS_ECOSISTEMA } from "@/lib/ecosistema";
import { ecosistema } from "@/content/copy";

// Lo que es cuenta pura de la dirección «Encendido»: el guion del ecosistema
// (src/lib/ecosistema.ts) y el trazado del hilo de luz
// (src/components/fondos/medir.ts). Lo que se ve está en tests/e2e.

describe("guion del ecosistema", () => {
  it("cuatro pasos, y el cuadro final es el último", () => {
    expect(PASOS_ECOSISTEMA).toBe(ecosistema.pasos.length);
    expect(PASO_FINAL).toBe(3);
  });

  it("en 'Hoy' hay papeles amontonados en cada carril", () => {
    expect(PAPELES_A_MANO).toHaveLength(ecosistema.carriles.length);
    for (const n of PAPELES_A_MANO) expect(n).toBeGreaterThanOrEqual(1);
  });

  it("los carriles van desfasados un tercio de ciclo: no se mueven a la vez", () => {
    expect(desfase(0)).toBe(0);
    expect(desfase(1)).toBeCloseTo(CICLO / 3, 2);
    expect(desfase(2)).toBeCloseTo((2 * CICLO) / 3, 2);
    expect(new Set([0, 1, 2].map(desfase)).size).toBe(3);
  });

  it("el observador solo ve una línea de la pantalla: los dos márgenes suman casi el 100 %", () => {
    for (const f of [LINEA_ACTIVA.escritorio, LINEA_ACTIVA.celular]) {
      const m = margenDeLinea(f).match(/^-([\d.]+)% 0px -([\d.]+)% 0px$/);
      expect(m, margenDeLinea(f)).not.toBeNull();
      const [arriba, abajo] = [Number(m?.[1]), Number(m?.[2])];
      expect(arriba).toBeCloseTo(f * 100, 1);
      expect(arriba + abajo).toBeGreaterThan(99.5);
      expect(arriba + abajo).toBeLessThan(100);
    }
    // En celular el escenario va fijo arriba: la línea queda más abajo.
    expect(LINEA_ACTIVA.celular).toBeGreaterThan(LINEA_ACTIVA.escritorio);
  });
});

describe("trazado del hilo de luz", () => {
  // Baja, cruza a la izquierda, baja por el margen, sigue recto (entra al
  // campo azul) y dobla hacia el botón.
  const pts = [
    { x: 900, y: 700, s: 0 },
    { x: 900, y: 900, s: 300 },
    { x: 100, y: 900, s: 500 },
    { x: 100, y: 4000, s: 3400 },
    { x: 100, y: 4300, s: 3700, clase: "hilo-campo" },
    { x: 126, y: 4300, s: 3740, clase: "hilo-campo" },
  ];
  const { tramos, esquinas } = trazar(pts, 14);

  it("un tramo por cada par de vértices, verticales y horizontales alternados", () => {
    expect(tramos).toHaveLength(pts.length - 1);
    expect(tramos.map((t) => t.vertical)).toEqual([true, false, true, true, false]);
    expect(tramos.map((t) => t.sentido)).toEqual([1, -1, 1, 1, 1]);
  });

  it("esquina solo donde dobla: un vértice en línea recta parte el tramo sin redondearlo", () => {
    expect(esquinas).toHaveLength(3);
    // El cuarto vértice está en línea recta: los dos tramos se tocan.
    expect(tramos[2].y + tramos[2].largo).toBe(4000);
    expect(tramos[3].y).toBe(4000);
    expect(tramos[3].clase).toBe("hilo-campo");
  });

  it("cada tramo se recorta el radio en las esquinas y nunca queda con largo negativo", () => {
    expect(tramos[0].y).toBe(700);
    expect(tramos[0].largo).toBe(200 - 14);
    expect(tramos[1].x).toBe(100 + 14);
    expect(tramos[1].largo).toBe(800 - 28);
    for (const t of tramos) expect(t.largo).toBeGreaterThanOrEqual(0);
    expect(trazar([{ x: 0, y: 0, s: 0 }, { x: 0, y: 10, s: 5 }, { x: 5, y: 10, s: 9 }], 14).tramos.every((t) => t.largo >= 0)).toBe(true);
  });

  it("el scroll de cada tramo avanza: ninguno termina antes de empezar", () => {
    for (const t of tramos) expect(t.b).toBeGreaterThan(t.a);
    for (let i = 1; i < tramos.length; i++) expect(tramos[i].a).toBeGreaterThanOrEqual(tramos[i - 1].a);
  });

  it("las esquinas caen del lado de los dos brazos", () => {
    // Primera: llega bajando y sale hacia la izquierda: borde derecho y de abajo.
    expect(esquinas[0]).toMatchObject({ horizontal: "right", vertical: "bottom", x: 900 - 14, y: 900 - 14 });
    // Segunda: llega desde la derecha y sale bajando: borde izquierdo y de arriba.
    expect(esquinas[1]).toMatchObject({ horizontal: "left", vertical: "top", x: 100, y: 900 });
  });
});
