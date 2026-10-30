import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { hero, rutas } from "@/content/copy";
import { Hero } from "@/components/sections/hero";
import { Reveal } from "@/components/ui/reveal";
import { simularMovimientoReducido } from "../apoyo/entorno";

// El hero con el fondo en movimiento. jsdom no tiene WebGL: el motor se
// reemplaza por un espía para revisar qué le pide el componente y cuándo.
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

describe("Hero: fondo en movimiento", () => {
  it("el botón principal sigue siendo el mismo enlace, con el mismo texto, a la agenda", () => {
    render(<Hero />);
    const boton = screen.getByRole("link", { name: hero.cta });
    expect(boton.getAttribute("href")).toBe(rutas.agendar);
    expect(boton.className).toContain("boton-principal");
    // Tamaño del texto del botón grande: 16 px y 17 px desde 360 px.
    expect(boton.className).toContain("text-[16px]");
    expect(boton.className).toContain("min-[360px]:text-[17px]");
    // Es el único botón principal del hero.
    expect(document.querySelectorAll(".boton-principal")).toHaveLength(1);
  });

  it("el fondo es decorativo: oculto para lectores de pantalla y sin recibir toques", () => {
    const { container } = render(<Hero />);
    const capa = container.querySelector(".cinta") as HTMLElement;
    expect(capa).not.toBeNull();
    expect(capa.closest("[aria-hidden]")).not.toBeNull();
    expect(capa.className).toContain("pointer-events-none");
    expect(capa.querySelector("canvas")).not.toBeNull();
    // Sale del servidor con la banda CSS a la vista; el lienzo llega después.
    expect(capa.dataset.cinta).toBe("carga");
    expect(capa.querySelector(".cinta-quieta")).not.toBeNull();
  });

  it("el texto no espera al motor: está en el HTML antes de que el fondo arranque", () => {
    render(<Hero />);
    expect(crear).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(hero.titulo[0]);
    expect(screen.getByText(hero.sub)).toBeTruthy();
  });

  it("marca cada texto con su tope de contraste para el fondo", () => {
    const { container } = render(<Hero />);
    const topes = [...container.querySelectorAll<HTMLElement>("[data-cinta-tope]")].map((e) => [e.textContent?.trim(), e.dataset.cintaTope]);
    expect(topes).toEqual([
      [hero.titulo[0], "0.16"],
      [hero.titulo[1], "degradado"],
      [hero.sub, "0.055"],
      [hero.meta, "0.04"],
    ]);
  });

  it("sin 'reducir movimiento' arranca el bucle (en pantalla táctil, con pulso al tocar)", async () => {
    render(<Hero />);
    await waitFor(() => expect(crear).toHaveBeenCalledTimes(1));
    const { modo, lienzo, seccion } = crear.mock.calls[0][0];
    expect(modo.animar).toBe(true);
    expect(modo.puntero).toBe("toque");
    expect(lienzo.tagName).toBe("CANVAS");
    expect(seccion.id).toBe("top");
  });

  it("con 'reducir movimiento' pide un solo cuadro quieto, sin reacción al puntero", async () => {
    simularMovimientoReducido(true);
    render(<Hero />);
    await waitFor(() => expect(crear).toHaveBeenCalledTimes(1));
    const { modo } = crear.mock.calls[0][0];
    expect(modo.animar).toBe(false);
    expect(modo.puntero).toBe("ninguno");
  });

  it("al desmontar suelta el motor", async () => {
    const { unmount } = render(<Hero />);
    await waitFor(() => expect(crear).toHaveBeenCalled());
    unmount();
    expect(motor.destruir).toHaveBeenCalledTimes(1);
  });

  it("sin WebGL se queda la banda CSS (respaldo), sin errores", async () => {
    motor.devolver = false;
    const { container } = render(<Hero />);
    await waitFor(() => expect((container.querySelector(".cinta") as HTMLElement).dataset.cinta).toBe("respaldo"));
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
