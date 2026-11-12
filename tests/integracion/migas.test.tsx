import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Migas } from "@/components/ui/migas";

vi.mock("next/link", () => import("../apoyo/link-simulado"));

describe("Migas de pan", () => {
  it("es una navegación con nombre, con Inicio enlazado al inicio y la página actual marcada", () => {
    render(<Migas actual="Coaching 1 a 1" />);
    const migas = screen.getByRole("navigation", { name: "Migas de pan" });
    const items = [...migas.querySelectorAll("li")];
    // Inicio, separador, página actual. El separador no cuenta para lectores.
    expect(items).toHaveLength(3);
    expect(within(migas).getAllByRole("listitem")).toHaveLength(2);

    const inicio = within(migas).getByRole("link", { name: "Inicio" });
    expect(inicio.getAttribute("href")).toBe("/");

    const actual = items[2];
    expect(actual.getAttribute("aria-current")).toBe("page");
    expect(actual.textContent).toBe("Coaching 1 a 1");
    // La página actual no es un enlace a sí misma.
    expect(within(actual).queryByRole("link")).toBeNull();
    expect(within(migas).getAllByRole("link")).toHaveLength(1);
  });

  it("el separador es decorativo", () => {
    render(<Migas actual="Agendar" />);
    const separador = screen.getByRole("navigation", { name: "Migas de pan" }).querySelectorAll("li")[1];
    expect(separador.getAttribute("aria-hidden")).toBe("true");
    expect(separador.textContent).toBe("");
  });

  it("es una lista ordenada (la jerarquía importa)", () => {
    render(<Migas actual="Herramientas" />);
    expect(screen.getByRole("navigation", { name: "Migas de pan" }).querySelector("ol")).not.toBeNull();
  });

  // En las páginas de cada línea el titular ya empieza con el nombre de la
  // página: a la vista quedan «Inicio /» y el rótulo del titular. La página
  // actual sigue en el HTML, para lectores de pantalla y buscadores.
  it("soloInicio deja la página actual solo para lectores, sin quitarla del HTML", () => {
    const { rerender } = render(<Migas actual="Coaching de IA 1 a 1" soloInicio />);
    const actual = () => screen.getByRole("navigation", { name: "Migas de pan" }).querySelector('[aria-current="page"]') as HTMLElement;
    expect(actual().textContent).toBe("Coaching de IA 1 a 1");
    expect(actual().className).toMatch(/\bsr-only\b/);
    rerender(<Migas actual="Agendar" />);
    expect(actual().className).not.toMatch(/\bsr-only\b/);
  });
});
