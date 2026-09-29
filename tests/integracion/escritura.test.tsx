import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { hero } from "@/content/copy";
import { TextoQueSeEscribe } from "@/components/ui/escritura";
import { entorno, simularMovimientoReducido } from "../apoyo/entorno";

const FRASES = hero.tareas;

// El contenedor tiene una frase fantasma por cada frase (invisibles, para
// reservar la altura) y un último hijo con el texto que se escribe.
function partes(container: HTMLElement) {
  const caja = container.firstElementChild as HTMLElement;
  const hijos = [...caja.children] as HTMLElement[];
  return { caja, fantasmas: hijos.slice(0, -1), visible: hijos.at(-1) as HTMLElement };
}

// Cada letra es un setTimeout que se programa después de pintar; hay que
// avanzar de a un paso para que React agende el siguiente.
function avanzar(ms: number, veces = 1) {
  for (let i = 0; i < veces; i++) act(() => void vi.advanceTimersByTime(ms));
}

afterEach(() => {
  vi.useRealTimers();
});

describe("TextoQueSeEscribe", () => {
  it("reserva la altura de la frase más larga: todas las frases van invisibles en la misma celda de la grilla", () => {
    const { container } = render(<TextoQueSeEscribe frases={FRASES} />);
    const { caja, fantasmas, visible } = partes(container);
    expect(caja.className).toMatch(/\bgrid\b/);
    expect(fantasmas.map((f) => f.textContent)).toEqual([...FRASES]);
    for (const f of fantasmas) {
      expect(f.className).toMatch(/\binvisible\b/);
      expect(f.className).toContain("[grid-area:1/1]");
      // Los lectores de pantalla no leen las cuatro frases de golpe.
      expect(f.getAttribute("aria-hidden")).toBe("true");
    }
    // El texto visible ocupa la misma celda, así que nunca agranda la caja.
    expect(visible.className).toContain("[grid-area:1/1]");
    expect(visible.getAttribute("aria-hidden")).toBeNull();
  });

  it("con 'reducir movimiento' muestra la primera frase completa y no la cambia", () => {
    simularMovimientoReducido(true);
    vi.useFakeTimers();
    const { container } = render(<TextoQueSeEscribe frases={FRASES} />);
    expect(partes(container).visible.textContent).toBe(FRASES[0]);
    avanzar(500, 20);
    expect(partes(container).visible.textContent).toBe(FRASES[0]);
  });

  it("escribe letra por letra, sostiene la frase, la borra y pasa a la siguiente", async () => {
    vi.useFakeTimers();
    const { container } = render(<TextoQueSeEscribe frases={FRASES} />);
    // El IntersectionObserver avisa que está en pantalla.
    await act(async () => {});
    const texto = () => partes(container).visible.textContent;
    expect(texto()).toBe("");

    avanzar(32, 5);
    expect(texto()).toBe(FRASES[0].slice(0, 5));

    avanzar(32, FRASES[0].length - 5);
    expect(texto()).toBe(FRASES[0]);

    // Sostiene la frase completa dos segundos.
    avanzar(1900);
    expect(texto()).toBe(FRASES[0]);
    avanzar(100);

    // Borra más rápido de lo que escribe.
    avanzar(14, 3);
    expect(texto()).toBe(FRASES[0].slice(0, -3));
    avanzar(14, FRASES[0].length);
    expect(texto()).toBe("");

    // Pausa y arranca la segunda.
    avanzar(250);
    avanzar(32, 4);
    expect(texto()).toBe(FRASES[1].slice(0, 4));
  });

  it("después de la última frase vuelve a la primera", async () => {
    vi.useFakeTimers();
    const dos = ["Hola", "Chao"];
    const { container } = render(<TextoQueSeEscribe frases={dos} />);
    await act(async () => {});
    const texto = () => partes(container).visible.textContent;
    for (const f of dos) {
      avanzar(32, f.length);
      expect(texto()).toBe(f);
      avanzar(2000);
      avanzar(14, f.length);
      avanzar(250);
    }
    avanzar(32, 2);
    expect(texto()).toBe("Ho");
  });

  it("fuera de pantalla no escribe (no gasta procesador)", async () => {
    entorno.enPantalla = false;
    vi.useFakeTimers();
    const { container } = render(<TextoQueSeEscribe frases={FRASES} />);
    await act(async () => {});
    avanzar(100, 30);
    expect(partes(container).visible.textContent).toBe("");
  });
});
