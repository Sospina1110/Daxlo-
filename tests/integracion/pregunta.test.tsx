import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { faq } from "@/content/copy";
import { Pregunta } from "@/components/sections/pregunta";

const [q1, q2] = faq.grupos[0].preguntas;

function montar() {
  render(<Pregunta pregunta={q1.p} respuesta={q1.r} />);
  const boton = screen.getByRole("button", { name: q1.p });
  const panel = document.getElementById(boton.getAttribute("aria-controls") ?? "") as HTMLElement;
  return { boton, panel, user: userEvent.setup({ delay: null }) };
}

describe("Pregunta (acordeón de preguntas frecuentes)", () => {
  it("arranca cerrada: aria-expanded=false y la respuesta inerte", () => {
    const { boton, panel } = montar();
    expect(boton.getAttribute("aria-expanded")).toBe("false");
    expect(panel).not.toBeNull();
    // Cerrada no recibe foco ni se anuncia. (Testing Library no modela inert;
    // el efecto real sobre el foco se prueba en tests/e2e/preguntas.spec.ts.)
    expect(panel.hasAttribute("inert")).toBe(true);
  });

  it("la respuesta está en el HTML aunque esté cerrada (los buscadores la leen)", () => {
    const { panel } = montar();
    expect(panel.textContent).toBe(q1.r);
  });

  it("el botón y el panel se nombran entre sí: aria-controls ↔ aria-labelledby, con role=region", () => {
    const { boton, panel } = montar();
    expect(boton.id).not.toBe("");
    expect(panel.getAttribute("role")).toBe("region");
    expect(panel.getAttribute("aria-labelledby")).toBe(boton.id);
    expect(boton.getAttribute("aria-controls")).toBe(panel.id);
    expect(boton.getAttribute("type")).toBe("button");
    // La pregunta es un titular: el botón va dentro de un h3.
    expect(boton.parentElement?.tagName).toBe("H3");
  });

  it("un toque abre (aria-expanded=true, sin inert) y otro cierra", async () => {
    const { boton, panel, user } = montar();
    await user.click(boton);
    expect(boton.getAttribute("aria-expanded")).toBe("true");
    expect(panel.hasAttribute("inert")).toBe(false);
    expect(screen.getByRole("region", { name: q1.p }).textContent).toBe(q1.r);

    await user.click(boton);
    expect(boton.getAttribute("aria-expanded")).toBe("false");
    expect(panel.hasAttribute("inert")).toBe(true);
  });

  it("abre y cierra con el teclado (Enter y Espacio)", async () => {
    const { boton, panel, user } = montar();
    boton.focus();
    await user.keyboard("{Enter}");
    expect(boton.getAttribute("aria-expanded")).toBe("true");
    expect(panel.hasAttribute("inert")).toBe(false);
    await user.keyboard(" ");
    expect(boton.getAttribute("aria-expanded")).toBe("false");
    expect(panel.hasAttribute("inert")).toBe(true);
  });

  it("abierta muestra el panel con altura y opacidad completas; cerrada lo colapsa", async () => {
    const { boton, panel, user } = montar();
    expect(panel.className).toMatch(/grid-rows-\[0fr\]/);
    expect(panel.className).toMatch(/opacity-0/);
    await user.click(boton);
    expect(panel.className).toMatch(/grid-rows-\[1fr\]/);
    expect(panel.className).toMatch(/opacity-100/);
  });

  it("dos preguntas en la misma página no comparten ids y abren por separado", async () => {
    render(
      <>
        <Pregunta pregunta={q1.p} respuesta={q1.r} />
        <Pregunta pregunta={q2.p} respuesta={q2.r} />
      </>,
    );
    const user = userEvent.setup({ delay: null });
    const [b1, b2] = screen.getAllByRole("button");
    expect(b1.id).not.toBe(b2.id);
    expect(b1.getAttribute("aria-controls")).not.toBe(b2.getAttribute("aria-controls"));
    await user.click(b2);
    expect(b1.getAttribute("aria-expanded")).toBe("false");
    expect(b2.getAttribute("aria-expanded")).toBe("true");
  });
});
