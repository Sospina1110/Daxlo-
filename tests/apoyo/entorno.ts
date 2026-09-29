// Estado del navegador simulado que comparten las pruebas de componentes.
// jsdom no trae IntersectionObserver, ResizeObserver ni matchMedia; el archivo
// tests/preparar.ts los instala leyendo de aquí, y cada prueba ajusta lo que
// necesita (movimiento reducido, si los elementos entran en pantalla).

type Oyente = (e: MediaQueryListEvent) => void;

export const entorno = {
  // prefers-reduced-motion: reduce
  movimientoReducido: false,
  // Lo que responde IntersectionObserver al observar un elemento.
  enPantalla: true,
  // Ancho de ventana para las consultas min-width / max-width.
  ancho: 375,
};

const listas = new Set<ListaSimulada>();

function coincide(consulta: string) {
  if (consulta.includes("prefers-reduced-motion")) {
    return consulta.includes("no-preference") ? !entorno.movimientoReducido : entorno.movimientoReducido;
  }
  const min = consulta.match(/min-width:\s*(\d+)px/);
  if (min) return entorno.ancho >= Number(min[1]);
  const max = consulta.match(/max-width:\s*(\d+)px/);
  if (max) return entorno.ancho <= Number(max[1]);
  return false;
}

class ListaSimulada {
  readonly media: string;
  onchange: Oyente | null = null;
  private oyentes = new Set<Oyente>();
  constructor(consulta: string) {
    this.media = consulta;
    listas.add(this);
  }
  get matches() {
    return coincide(this.media);
  }
  addEventListener(_tipo: string, fn: Oyente) {
    this.oyentes.add(fn);
  }
  removeEventListener(_tipo: string, fn: Oyente) {
    this.oyentes.delete(fn);
  }
  addListener(fn: Oyente) {
    this.oyentes.add(fn);
  }
  removeListener(fn: Oyente) {
    this.oyentes.delete(fn);
  }
  dispatchEvent() {
    return true;
  }
  avisar() {
    const evento = { matches: this.matches, media: this.media } as MediaQueryListEvent;
    this.oyentes.forEach((fn) => fn(evento));
    this.onchange?.(evento);
  }
}

export function matchMediaSimulado(consulta: string) {
  return new ListaSimulada(consulta) as unknown as MediaQueryList;
}

// Cambia la preferencia de movimiento y avisa a quien la esté escuchando, como
// hace el sistema operativo. Motion guarda la preferencia en un valor global
// que solo se actualiza con este aviso.
export function simularMovimientoReducido(activo: boolean) {
  entorno.movimientoReducido = activo;
  listas.forEach((l) => l.avisar());
}

export class IntersectionObserverSimulado {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  private objetivos = new Set<Element>();
  constructor(private alCambiar: IntersectionObserverCallback) {}
  observe(el: Element) {
    this.objetivos.add(el);
    // Como el navegador: la primera notificación llega después, no dentro de observe().
    queueMicrotask(() => {
      if (!this.objetivos.has(el)) return;
      const caja = el.getBoundingClientRect();
      const entrada = {
        target: el,
        isIntersecting: entorno.enPantalla,
        intersectionRatio: entorno.enPantalla ? 1 : 0,
        boundingClientRect: caja,
        intersectionRect: caja,
        rootBounds: null,
        time: performance.now(),
      } as IntersectionObserverEntry;
      this.alCambiar([entrada], this as unknown as IntersectionObserver);
    });
  }
  unobserve(el: Element) {
    this.objetivos.delete(el);
  }
  disconnect() {
    this.objetivos.clear();
  }
  takeRecords() {
    return [];
  }
}

export class ResizeObserverSimulado {
  observe() {}
  unobserve() {}
  disconnect() {}
}

export function reiniciarEntorno() {
  entorno.movimientoReducido = false;
  entorno.enPantalla = true;
  entorno.ancho = 375;
  listas.forEach((l) => l.avisar());
}
