// Se carga antes de cada archivo de Vitest (setupFiles). En jsdom instala lo
// que le falta al navegador simulado; en entorno node (pruebas del build) no
// hace nada.
import { afterEach } from "vitest";
import { IntersectionObserverSimulado, matchMediaSimulado, reiniciarEntorno, ResizeObserverSimulado } from "./apoyo/entorno";

if (typeof window !== "undefined") {
  const w = window as unknown as Record<string, unknown>;
  w.IntersectionObserver = IntersectionObserverSimulado;
  w.ResizeObserver = ResizeObserverSimulado;
  w.matchMedia = matchMediaSimulado;
  // jsdom no desplaza nada y avisa "Not implemented" en cada llamada.
  window.scrollTo = (() => {}) as typeof window.scrollTo;
  Element.prototype.scrollIntoView = function () {};

  const { cleanup } = await import("@testing-library/react");
  afterEach(() => {
    cleanup();
    reiniciarEntorno();
    window.history.replaceState(null, "", "/");
  });
}
