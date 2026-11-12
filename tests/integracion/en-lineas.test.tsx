import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { cierre, consultoria, inicio } from "@/content/copy";
import { enLineas } from "@/components/ui/blocks";

// Un h2 de dos frases se corta entre las frases (DESIGN.md, Typography). Los
// renglones son spans de bloque: el texto que leen los lectores de pantalla,
// los buscadores y las pruebas tiene que quedar idéntico al de copy.ts.
function montar(nodo: React.ReactNode) {
  const { container } = render(<h2>{nodo}</h2>);
  const h2 = container.querySelector("h2") as HTMLElement;
  return { h2, renglones: [...h2.querySelectorAll(":scope > span.block")].map((s) => s.textContent) };
}

describe("enLineas (titulares de dos frases)", () => {
  it("parte entre frases y conserva el texto", () => {
    const t = consultoria.problema.titulo;
    const { h2, renglones } = montar(enLineas(t));
    expect(renglones).toEqual(["Tu gente ya usa IA.", "Tu empresa trabaja igual."]);
    expect(h2.textContent).toBe(t);
  });

  // Otra de dos frases (la del segundo tiempo de la escena del inicio) y una
  // de una sola, que queda como estaba.
  it("también con otra afirmación de dos frases; la de una sola frase no se toca", () => {
    const dos = inicio.escena.tiempos[1];
    const { h2, renglones } = montar(enLineas(dos));
    expect(renglones).toHaveLength(2);
    expect(h2.textContent).toBe(dos);
    expect(enLineas(cierre.titulo)).toBe(cierre.titulo);
  });

  // Hoy ningún titular del sitio usa `corte` (el de qué cambia en /consultoria
  // pasó a ser de una frase sin coma); se prueba con el que lo usaba.
  it("con `corte`, parte después de la primera coma y deja la coma arriba", () => {
    const t = "Cambia quién sabe, quién revisa y quién ajusta.";
    const { h2, renglones } = montar(enLineas(t, ", "));
    expect(renglones).toEqual(["Cambia quién sabe,", "quién revisa y quién ajusta."]);
    expect(h2.textContent).toBe(t);
  });

  it("una sola frase queda como texto, sin spans", () => {
    const t = "Así implementamos la IA en tu empresa.";
    expect(enLineas(t)).toBe(t);
    expect(enLineas(t, ", ")).toBe(t);
  });
});
