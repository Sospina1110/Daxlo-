// Medición de la página para el hilo de luz.
//
// El hilo ata su dibujo al scroll con animaciones de CSS
// (animation-timeline: scroll(root)) que corren en el compositor. Para eso
// necesita saber, una vez, dónde está cada cosa. Esto mide al cargar, al
// cambiar el tamaño de la ventana y cuando cambia el alto del documento (una
// pregunta que se abre, las fuentes que terminan de cargar). Nunca en cada
// cuadro de scroll.
export function alMedir(medir: () => void): () => void {
  let cuadro = 0;
  const pedir = () => {
    cancelAnimationFrame(cuadro);
    cuadro = requestAnimationFrame(medir);
  };
  const ro = new ResizeObserver(pedir);
  ro.observe(document.body);
  addEventListener("resize", pedir);
  document.fonts?.ready.then(pedir).catch(() => {});
  pedir();
  return () => {
    cancelAnimationFrame(cuadro);
    ro.disconnect();
    removeEventListener("resize", pedir);
  };
}

export type Punto = { x: number; y: number; s: number; clase?: string };
export type Tramo = { vertical: boolean; x: number; y: number; largo: number; sentido: 1 | -1; a: number; b: number; clase: string };
export type Esquina = { x: number; y: number; r: number; horizontal: "left" | "right"; vertical: "top" | "bottom"; a: number; b: number };

// De una lista de vértices (x, y y el scroll `s` en el que la cabeza del hilo
// llega a cada uno) saca los tramos rectos y las esquinas redondas. Un vértice
// en línea recta con sus vecinos no lleva esquina: solo parte el tramo (así
// un tramo puede cambiar de aspecto, como al entrar al campo azul). Función
// pura: la prueban las unitarias.
export function trazar(pts: readonly Punto[], radio: number): { tramos: Tramo[]; esquinas: Esquina[] } {
  const tramos: Tramo[] = [];
  const esquinas: Esquina[] = [];
  const dobla = (i: number) => {
    if (i <= 0 || i >= pts.length - 1) return false;
    const a = pts[i - 1];
    const b = pts[i];
    const c = pts[i + 1];
    return (a.x === b.x) !== (b.x === c.x);
  };
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const vertical = a.x === b.x;
    const sentido = (vertical ? Math.sign(b.y - a.y) : Math.sign(b.x - a.x)) >= 0 ? 1 : -1;
    const recorteA = dobla(i) ? radio : 0;
    const recorteB = dobla(i + 1) ? radio : 0;
    const desde = (vertical ? a.y : a.x) + sentido * recorteA;
    const hasta = (vertical ? b.y : b.x) - sentido * recorteB;
    const largo = Math.max(0, Math.abs(hasta - desde));
    tramos.push({
      vertical,
      x: vertical ? a.x : Math.min(desde, hasta),
      y: vertical ? Math.min(desde, hasta) : a.y,
      largo,
      sentido,
      a: a.s,
      b: Math.max(a.s + 1, b.s),
      clase: b.clase ?? "",
    });
    if (dobla(i + 1)) {
      const c = pts[i + 2];
      const sx = Math.sign(a.x - b.x) || Math.sign(c.x - b.x) || 1;
      const sy = Math.sign(a.y - b.y) || Math.sign(c.y - b.y) || 1;
      esquinas.push({
        x: sx > 0 ? b.x : b.x - radio,
        y: sy > 0 ? b.y : b.y - radio,
        r: radio,
        horizontal: sx > 0 ? "left" : "right",
        vertical: sy > 0 ? "top" : "bottom",
        a: b.s - 6,
        b: b.s + 10,
      });
    }
  }
  return { tramos, esquinas };
}
