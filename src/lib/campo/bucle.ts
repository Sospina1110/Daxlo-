// El pulso de un lienzo del inicio.
//
// - Continuo: un requestAnimationFrame con tope de cuadros por segundo, solo
//   mientras el elemento está en pantalla y la pestaña visible.
// - A demanda (equipos que no aguantan el bucle): un cuadro al entrar en
//   pantalla, y uno por cuadro de scroll o de cambio de tamaño como mucho.
//
// `cuadro` recibe el tiempo en segundos desde que arrancó el bucle, sin
// contar lo que estuvo pausado: al volver, la animación sigue donde iba.

export type Bucle = { destruir: () => void; pedir: () => void };

export function crearBucle(el: Element, cuadro: (t: number) => void, o: { continuo: boolean; fps?: number }): Bucle {
  const intervalo = 1000 / (o.fps ?? 30);
  let visible = false;
  let id = 0;
  let ultimo = 0;
  let reloj = 0;
  let anterior = 0;

  const paso = (ahora: number) => {
    id = 0;
    if (!visible || document.hidden) return;
    if (o.continuo) id = requestAnimationFrame(paso);
    if (o.continuo && ahora - ultimo < intervalo - 2) return;
    // El reloj no cuenta los saltos largos (pestaña oculta, fuera de pantalla).
    if (anterior) reloj += Math.min(100, ahora - anterior);
    anterior = ahora;
    ultimo = ahora;
    cuadro(reloj / 1000);
  };
  const pedir = () => {
    if (!id && visible && !document.hidden) id = requestAnimationFrame(paso);
  };
  const alVer = () => {
    anterior = 0;
    pedir();
  };

  const io = new IntersectionObserver(
    (es) => {
      visible = es[es.length - 1].isIntersecting;
      if (visible) alVer();
      else if (id) {
        cancelAnimationFrame(id);
        id = 0;
      }
    },
    { rootMargin: "80px" },
  );
  io.observe(el);
  document.addEventListener("visibilitychange", alVer);
  window.addEventListener("resize", pedir);
  if (!o.continuo) window.addEventListener("scroll", pedir, { passive: true });

  return {
    pedir,
    destruir() {
      io.disconnect();
      document.removeEventListener("visibilitychange", alVer);
      window.removeEventListener("resize", pedir);
      window.removeEventListener("scroll", pedir);
      if (id) cancelAnimationFrame(id);
    },
  };
}
