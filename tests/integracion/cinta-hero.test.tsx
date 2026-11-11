import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { coaching, consultoria, hero, rutas } from "@/content/copy";
import { ZonaPortada } from "@/components/sections/zona-portada";
import { Reveal } from "@/components/ui/reveal";
import { simularMovimientoReducido } from "../apoyo/entorno";

// El hero y la portada de cada línea con el fondo en movimiento. jsdom no
// tiene WebGL: el motor se reemplaza por un espía para revisar qué le pide el
// componente y cuándo.
const motor = vi.hoisted(() => ({ destruir: vi.fn(), devolver: true }));
vi.mock("@/lib/cinta/motor", async (original) => {
  const real = await original<typeof import("@/lib/cinta/motor")>();
  return {
    ...real,
    crearMotor: vi.fn(() => (motor.devolver ? { destruir: motor.destruir } : null)),
  };
});
vi.mock("next/link", () => import("../apoyo/link-simulado"));

const { crearMotor } = await import("@/lib/cinta/motor");
const crear = vi.mocked(crearMotor);

beforeEach(() => {
  crear.mockClear();
  motor.destruir.mockClear();
  motor.devolver = true;
});

// (El hero del inicio ya no lleva la cinta: desde el 2026-11-11 es negro
// plano, con una línea azul fina. Sus pruebas salieron con él; la cinta sigue
// detrás de la portada de cada línea hasta que esas páginas se rediseñen.)

describe("Portada de cada línea: la cinta detrás, sin orbe", () => {
  const lineas = [
    ["cyan", coaching.portada, 1, "cinta-cian", "0.035"],
    ["blue", consultoria.portada, -1, "cinta-azul", "0.02"],
  ] as const;

  for (const [tono, datos, tinte, clase] of lineas) {
    it(`${tono}: la cinta va dentro de la <section> de la portada, con su trayectoria y el tinte de la línea`, async () => {
      const { container } = render(<ZonaPortada tono={tono} {...datos} />);
      const seccion = container.querySelector("section");
      expect(seccion?.classList.contains("portada-paralaje")).toBe(true);
      const capa = seccion!.querySelector(".cinta") as HTMLElement;
      expect(capa.closest("[aria-hidden]")).not.toBeNull();
      expect(capa.className).toContain("pointer-events-none");
      expect(capa.dataset.cinta).toBe("carga");
      // La banda de respaldo imita la pose de la portada, con el tinte de la línea.
      expect(capa.querySelector(`.cinta-quieta-portada.${clase}`)).not.toBeNull();
      expect(capa.querySelector(".cinta-quieta")).toBeNull();
      await waitFor(() => expect(crear).toHaveBeenCalledTimes(1));
      const o = crear.mock.calls[0][0];
      expect(o.seccion).toBe(seccion);
      expect(o.variante).toBe("portada");
      expect(o.tinte).toBe(tinte);
    });
  }

  it("sin orbe: la primera línea del gigante es solo texto y la segunda conserva su sangría", () => {
    const { container } = render(<ZonaPortada tono="cyan" {...coaching.portada} />);
    const h1 = container.querySelector("h1") as HTMLElement;
    expect(h1.querySelector(".rounded-full")).toBeNull();
    const gigante = h1.querySelector("[data-cinta-esquivar]") as HTMLElement;
    const primera = gigante.querySelector(".paralaje-izquierda > .subir") as HTMLElement;
    expect(primera.children).toHaveLength(0);
    expect(primera.textContent).toBe(coaching.portada.gigante[0]);
    expect((gigante.querySelector(".paralaje-derecha") as HTMLElement).className).toContain("pl-[0.5em]");
  });

  it("marca cada texto con su tope de contraste para el fondo", () => {
    for (const [tono, datos, , , degradado] of lineas) {
      const { container, unmount } = render(<ZonaPortada tono={tono} {...datos} migas={<nav aria-label="Migas de pan">Inicio</nav>} />);
      const topes = [...container.querySelectorAll<HTMLElement>("[data-cinta-tope]")].map((e) => [e.textContent?.trim(), e.dataset.cintaTope]);
      expect(topes).toEqual([
        ["Inicio", "0.04"],
        [datos.eyebrow, "0.06"],
        [datos.gigante[0], "0.16"],
        [datos.gigante[1], degradado],
        [datos.sub, "0.07"],
        [hero.cta, "0.06"],
        [expect.any(String), "0.05"],
        [datos.accion.enlace, "0.04"],
      ]);
      unmount();
    }
  });
});

describe("Reveal: ritmo único de apariciones", () => {
  it("ningún bloque espera más de 0,32 s", () => {
    const { container } = render(
      <>
        <Reveal delay={0.12}>a</Reveal>
        <Reveal delay={0.04 * 10}>b</Reveal>
      </>,
    );
    const [a, b] = [...container.querySelectorAll<HTMLElement>("[data-revelar]")];
    expect(a.style.getPropertyValue("--retraso")).toBe("0.12s");
    expect(b.style.getPropertyValue("--retraso")).toBe("0.32s");
  });
});
