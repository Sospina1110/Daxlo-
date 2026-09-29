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

  it("centro=true centra la lista; por defecto va a la izquierda", () => {
    const { rerender } = render(<Migas actual="Agendar" centro />);
    const lista = () => screen.getByRole("navigation", { name: "Migas de pan" }).querySelector("ol") as HTMLOListElement;
    expect(lista().className).toMatch(/\bjustify-center\b/);
    rerender(<Migas actual="Agendar" />);
    expect(lista().className).not.toMatch(/\bjustify-center\b/);
  });
});
