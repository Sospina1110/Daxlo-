import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { pausaAntesDe, TextoQueSeEscribe } from "@/components/ui/escritura";
import { entorno, simularMovimientoReducido } from "../apoyo/entorno";

// Frases de prueba. El componente ya no se usa en el inicio (desde el inicio
// «Campo», 2026-11-12, copy.ts no trae las tareas del recuadro): se prueba
// con las suyas.
const FRASES = [
  "Resume las reuniones de la semana y dime qué quedó pendiente",
  "Revisa la base de clientes y marca los que están duplicados",
  "Junta estas tres hojas de cálculo y arma el informe de la semana",
];

// El ritmo esperado, escrito aquí aparte (no se importa la tabla del
// componente): letra i = 26 ms + JITTER[i % 8]; 120 ms más después de una coma
// o un punto; 60 ms más después de cada tercer espacio.
const JITTER = [0, 18, 6, 30, 12, 24, 4, 34];
function esperado(frase: string, i: number) {
  let ms = 26 + JITTER[i % 8];
  const anterior = frase[i - 1];
  if (anterior === "," || anterior === ".") ms += 120;
  const espacios = [...frase.slice(0, i)].filter((c) => c === " ").length;
  if (anterior === " " && espacios % 3 === 0) ms += 60;
  return ms;
}
// Lo que tarda en escribir las primeras n letras.
const hasta = (frase: string, n: number) => Array.from({ length: n }, (_, i) => esperado(frase, i)).reduce((a, b) => a + b, 0);

// El contenedor tiene una frase fantasma por cada frase (invisibles, para
// reservar la altura) y un último hijo con el texto que se escribe y el cursor.
function partes(container: HTMLElement) {
  const caja = container.firstElementChild as HTMLElement;
  const hijos = [...caja.children] as HTMLElement[];
  const visible = hijos.at(-1) as HTMLElement;
  return {
    caja,
    fantasmas: hijos.slice(0, -1),
    visible,
    texto: visible.firstElementChild as HTMLElement,
    cursor: visible.querySelector(".animate-caret") as HTMLElement | null,
  };
}

// Cada fase (escribir, sostener, seleccionar, pausa) se agenda después de que
// React pinta la anterior: se avanza dentro de act() para que alcance a
// agendar la siguiente.
function avanzar(ms: number) {
  act(() => void vi.advanceTimersByTime(ms));
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

  it("el ritmo del componente es el de una persona: base, jitter, coma y tercer espacio", () => {
    for (const f of [...FRASES, "Hola, mundo. Uno dos tres cuatro cinco seis siete"]) {
      for (let i = 0; i < f.length; i++) expect(pausaAntesDe(f, i), `${f} [${i}]`).toBe(esperado(f, i));
    }
    // Sin azar: la misma frase da siempre lo mismo.
    expect(pausaAntesDe("abc", 1)).toBe(26 + 18);
    expect(pausaAntesDe("a, b", 2)).toBe(26 + 6 + 120);
    expect(pausaAntesDe("a b c d", 6)).toBe(26 + 4 + 60);
    expect(pausaAntesDe("a b c d", 4)).toBe(26 + 12);
  });

  it("con 'reducir movimiento' muestra la primera frase completa y no la cambia", () => {
    simularMovimientoReducido(true);
    vi.useFakeTimers();
    const { container } = render(<TextoQueSeEscribe frases={FRASES} />);
    expect(partes(container).visible.textContent).toBe(FRASES[0]);
    for (let i = 0; i < 20; i++) avanzar(500);
    expect(partes(container).visible.textContent).toBe(FRASES[0]);
    // Sin cursor fijo de escritura: el CSS de "reducir movimiento" lo deja quieto.
    expect(partes(container).visible.hasAttribute("data-escribiendo")).toBe(false);
  });

  it("escribe con ritmo de persona, sostiene la frase 1,8 s, la selecciona, la borra de una vez y pasa a la siguiente", async () => {
    vi.useFakeTimers();
    const frase = FRASES[0];
    const { container } = render(<TextoQueSeEscribe frases={FRASES} />);
    // El IntersectionObserver avisa que está en pantalla.
    await act(async () => {});
    const texto = () => partes(container).visible.textContent;
    const escribiendo = () => partes(container).visible.hasAttribute("data-escribiendo");
    expect(texto()).toBe("");

    // La primera letra llega a los 26 ms, ni antes ni después.
    avanzar(25);
    expect(texto()).toBe("");
    avanzar(1);
    expect(texto()).toBe(frase.slice(0, 1));
    expect(escribiendo()).toBe(true);

    // Cinco letras, al ritmo esperado.
    avanzar(hasta(frase, 5) - 26 - 1);
    expect(texto()).toBe(frase.slice(0, 4));
    avanzar(1);
    expect(texto()).toBe(frase.slice(0, 5));

    // El resto de la frase.
    avanzar(hasta(frase, frase.length) - hasta(frase, 5));
    expect(texto()).toBe(frase);

    // Sostiene la frase completa 1,8 s, con el cursor parpadeando (sin
    // data-escribiendo).
    avanzar(0);
    expect(escribiendo()).toBe(false);
    avanzar(1799);
    expect(texto()).toBe(frase);
    expect(partes(container).texto.className).not.toContain("bg-cyan/35");
    avanzar(1);

    // Seleccionada 260 ms, con el color de ::selection; el texto sigue entero.
    expect(partes(container).texto.className).toContain("bg-cyan/35");
    expect(texto()).toBe(frase);
    expect(escribiendo()).toBe(true);
    avanzar(259);
    expect(texto()).toBe(frase);
    avanzar(1);

    // Se borra de una vez (no letra por letra) y pausa 300 ms.
    expect(texto()).toBe("");
    expect(partes(container).texto.className).not.toContain("bg-cyan/35");
    expect(escribiendo()).toBe(false);
    avanzar(300);

    // Arranca la segunda.
    avanzar(hasta(FRASES[1], 4));
    expect(texto()).toBe(FRASES[1].slice(0, 4));
  });

  it("al borrarse, la frase sale en un solo bloque: una copia seleccionada que solo vive en la pausa", async () => {
    vi.useFakeTimers();
    const frase = FRASES[0];
    const { container } = render(<TextoQueSeEscribe frases={FRASES} />);
    await act(async () => {});
    const salida = () => container.querySelector<HTMLElement>(".salida-escritura");
    avanzar(hasta(frase, frase.length));
    avanzar(0);
    avanzar(1800);
    // Seleccionada: todavía no hay copia.
    expect(salida()).toBeNull();
    avanzar(260);
    // En el mismo paso en que se borra, la copia ya está: con la frase entera,
    // seleccionada, sin anunciarse y antes del texto visible (que sigue siendo
    // el último hijo, vacío).
    const copia = salida();
    expect(copia).not.toBeNull();
    expect(copia!.textContent).toBe(frase);
    expect(copia!.getAttribute("aria-hidden")).toBe("true");
    expect(copia!.firstElementChild!.className).toContain("bg-cyan/35");
    expect(copia!.className).toContain("[grid-area:1/1]");
    expect(copia!.nextElementSibling).toBe(partes(container).visible);
    expect(partes(container).visible.textContent).toBe("");
    // Termina la pausa: la copia se va y arranca la frase siguiente.
    avanzar(300);
    expect(salida()).toBeNull();
  });

  it("con 'reducir movimiento' no hay copia que sale", () => {
    simularMovimientoReducido(true);
    vi.useFakeTimers();
    const { container } = render(<TextoQueSeEscribe frases={FRASES} />);
    for (let i = 0; i < 20; i++) {
      avanzar(500);
      expect(container.querySelector(".salida-escritura")).toBeNull();
    }
  });

  it("el cursor conserva siempre animate-caret (el script de pausa lo observa)", async () => {
    vi.useFakeTimers();
    const { container } = render(<TextoQueSeEscribe frases={["Hola"]} />);
    await act(async () => {});
    for (let i = 0; i < 30; i++) {
      expect(partes(container).cursor, `paso ${i}`).not.toBeNull();
      avanzar(100);
    }
  });

  it("después de la última frase vuelve a la primera", async () => {
    vi.useFakeTimers();
    const dos = ["Hola", "Chao"];
    const { container } = render(<TextoQueSeEscribe frases={dos} />);
    await act(async () => {});
    const texto = () => partes(container).visible.textContent;
    for (const f of dos) {
      avanzar(hasta(f, f.length));
      expect(texto()).toBe(f);
      avanzar(0);
      avanzar(1800);
      avanzar(260);
      expect(texto()).toBe("");
      avanzar(300);
    }
    avanzar(hasta("Hola", 2));
    expect(texto()).toBe("Ho");
  });

  // I4 (2026-11-06): en el hero, lo primero es una búsqueda que no se
  // selecciona: se tacha (las rayas las pinta el CSS; jsdom no mide renglones)
  // durante 400 + 600 + 1000 ms, sale tachada y da paso a la primera tarea.
  describe("con una búsqueda que se tacha (hero)", () => {
    const BUSQUEDA = "¿Cómo se ordena una base de clientes?";

    it("la búsqueda también reserva su alto: va primera entre los fantasmas", () => {
      const { container } = render(<TextoQueSeEscribe frases={FRASES} busqueda={BUSQUEDA} />);
      expect(partes(container).fantasmas.map((f) => f.textContent)).toEqual([BUSQUEDA, ...FRASES]);
    });

    it("con 'reducir movimiento' no aparece: queda la primera tarea, quieta", () => {
      simularMovimientoReducido(true);
      vi.useFakeTimers();
      const { container } = render(<TextoQueSeEscribe frases={FRASES} busqueda={BUSQUEDA} />);
      expect(partes(container).visible.textContent).toBe(FRASES[0]);
      for (let i = 0; i < 20; i++) {
        avanzar(500);
        expect(partes(container).visible.textContent).toBe(FRASES[0]);
        expect(container.querySelector(".texto-tachado, .salida-escritura, .raya-busqueda")).toBeNull();
      }
    });

    it("escribe la búsqueda, la tacha sin seleccionarla, sale tachada y sigue con la primera tarea", async () => {
      vi.useFakeTimers();
      const { container } = render(<TextoQueSeEscribe frases={FRASES} busqueda={BUSQUEDA} />);
      await act(async () => {});
      const texto = () => partes(container).visible.textContent;
      const clase = () => partes(container).texto.className;
      const salida = () => container.querySelector<HTMLElement>(".salida-escritura");

      avanzar(hasta(BUSQUEDA, BUSQUEDA.length));
      expect(texto()).toBe(BUSQUEDA);
      avanzar(0);
      // Tachándose: baja al 75 % (.texto-tachado), sin el cian de la selección.
      expect(clase()).toContain("texto-tachado");
      expect(clase()).not.toContain("bg-cyan/35");
      avanzar(1999);
      expect(texto()).toBe(BUSQUEDA);
      expect(salida()).toBeNull();
      avanzar(1);

      // Borrada de una vez: la copia sale tachada, no seleccionada.
      expect(texto()).toBe("");
      const copia = salida();
      expect(copia?.textContent).toBe(BUSQUEDA);
      expect(copia!.firstElementChild!.className).toContain("texto-tachado-quieto");
      expect(copia!.firstElementChild!.className).not.toContain("bg-cyan/35");
      expect(clase()).not.toContain("texto-tachado");
      avanzar(300);
      expect(salida()).toBeNull();

      // La primera tarea, con su ritmo y su selección de siempre.
      avanzar(hasta(FRASES[0], 4));
      expect(texto()).toBe(FRASES[0].slice(0, 4));
    });

    it("después de la última frase vuelve a la búsqueda", async () => {
      vi.useFakeTimers();
      const dos = ["Hola", "Chao"];
      const { container } = render(<TextoQueSeEscribe frases={dos} busqueda="¿Qué es?" />);
      await act(async () => {});
      const texto = () => partes(container).visible.textContent;
      avanzar(hasta("¿Qué es?", 8));
      expect(texto()).toBe("¿Qué es?");
      avanzar(0);
      avanzar(2000);
      avanzar(300);
      for (const f of dos) {
        avanzar(hasta(f, f.length));
        expect(texto()).toBe(f);
        avanzar(0);
        avanzar(1800);
        avanzar(260);
        avanzar(300);
      }
      avanzar(hasta("¿Qué es?", 2));
      expect(texto()).toBe("¿Q");
    });
  });

  it("fuera de pantalla no escribe (no gasta procesador)", async () => {
    entorno.enPantalla = false;
    vi.useFakeTimers();
    const { container } = render(<TextoQueSeEscribe frases={FRASES} />);
    await act(async () => {});
    for (let i = 0; i < 30; i++) avanzar(100);
    expect(partes(container).visible.textContent).toBe("");
  });
});
