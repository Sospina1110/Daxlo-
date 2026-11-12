import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { cierre, consultoria, inicio } from "@/content/copy";
import { enFrases } from "@/components/campo/frases";

// Un titular de dos frases se corta entre las frases. Los renglones son spans
// de bloque: el texto que leen los lectores de pantalla, los buscadores y las
// pruebas tiene que quedar idéntico al de copy.ts.
function montar(nodo: React.ReactNode) {
  const { container } = render(<h2>{nodo}</h2>);
  const h2 = container.querySelector("h2") as HTMLElement;
  return { h2, renglones: [...h2.querySelectorAll(":scope > span.cm-frase-linea")].map((s) => s.textContent?.trim()) };
}

describe("enFrases (titulares de dos frases)", () => {
  it("parte entre frases y conserva el texto", () => {
    const t = consultoria.problema.titulo;
    const { h2, renglones } = montar(enFrases(t));
    expect(renglones).toEqual(["Tu gente ya usa IA.", "Tu empresa trabaja igual."]);
    expect(h2.textContent).toBe(t);
  });

  it("también con otra afirmación de dos frases", () => {
    const dos = inicio.escena.tiempos[1];
    const { h2, renglones } = montar(enFrases(dos));
    expect(renglones).toHaveLength(2);
    expect(h2.textContent).toBe(dos);
  });

  it("una sola frase queda como texto, sin spans", () => {
    expect(enFrases(cierre.titulo)).toBe(cierre.titulo);
    expect(enFrases(consultoria.recorrido.titulo)).toBe(consultoria.recorrido.titulo);
  });
});
