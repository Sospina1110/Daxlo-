"use client";

import { useEffect, useRef } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn, IMAN_MAX_X, IMAN_MAX_Y, RESORTE_IMAN } from "@/lib/utils";

// Solo con mouse de verdad: en pantallas táctiles y con lápiz no hay puntero
// que seguir, y un toque no debe correr el botón.
const PUNTERO_FINO = "(hover: hover) and (pointer: fine)";

const limitar = (v: number) => Math.max(-1, Math.min(1, v));

// Botón magnético: el llamado se corre unos pocos píxeles hacia el puntero y
// vuelve con un resorte al salir. Solo en los tres llamados principales (hero,
// portada de cada línea y cierre); nunca en botones funcionales ni en la barra.
//
// - Lo máximo es IMAN_MAX_X × IMAN_MAX_Y (6 × 4 px), con el puntero en el
//   borde; con el puntero en el centro, 0. El botón siempre queda bajo el
//   puntero: se mueve hacia él, nunca se le escapa.
// - Dos resortes independientes (x e y) con RESORTE_IMAN: si el puntero
//   vuelve a entrar a mitad de la vuelta, el resorte cambia de destino desde
//   la posición y la velocidad que tiene, sin salto.
// - Se mide el div exterior, que no se mueve: una lectura y ninguna
//   escritura al DOM por evento. El movimiento va en el div interior por
//   valores de Motion: ningún render de React por cuadro, sin oyentes en
//   window (solo visibilitychange en document).
// - La caja no cambia (CLS 0): el exterior ocupa lo mismo que ocupaba el
//   botón, y el interior se mueve con transform.
// - Con "reducir movimiento", táctil, lápiz o teclado no se mueve: el
//   transform queda en none. Sin JavaScript, o antes de que cargue Motion, es
//   un div quieto y el botón funciona igual desde el HTML.
// - El div interior no recorta (sin overflow): el anillo de foco del botón
//   se ve entero. Lleva isolate para que la capa del halo del botón principal
//   (.iman-movil::after, globals.css) quede detrás del botón.
// - Nunca en el mismo elemento que .entrada, .subir o [data-revelar]: va
//   dentro de ellos. Son div y no span: las pruebas buscan la caja del texto
//   que se escribe solo como el primer span.grid del hero.
export function Iman({ children, className }: { children: React.ReactNode; className?: string }) {
  const exterior = useRef<HTMLDivElement>(null);
  const fino = useRef<MediaQueryList | null>(null);
  const reducir = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, RESORTE_IMAN);
  const sy = useSpring(y, RESORTE_IMAN);

  const soltar = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    fino.current = window.matchMedia(PUNTERO_FINO);
    // Con la pestaña oculta vuelve a su lugar: al regresar no queda corrido
    // hacia un puntero que ya no está ahí.
    const alCambiarPestana = () => {
      if (!document.hidden) return;
      x.set(0);
      y.set(0);
    };
    document.addEventListener("visibilitychange", alCambiarPestana);
    return () => document.removeEventListener("visibilitychange", alCambiarPestana);
  }, [x, y]);

  // Si "reducir movimiento" se enciende con el botón corrido, vuelve al
  // centro sin animar.
  useEffect(() => {
    if (!reducir) return;
    x.jump(0);
    y.jump(0);
    sx.jump(0);
    sy.jump(0);
  }, [reducir, x, y, sx, sy]);

  const seguir = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reducir || !fino.current?.matches) return;
    const caja = exterior.current?.getBoundingClientRect();
    if (!caja || !caja.width || !caja.height) return;
    const nx = limitar((e.clientX - (caja.left + caja.width / 2)) / (caja.width / 2));
    const ny = limitar((e.clientY - (caja.top + caja.height / 2)) / (caja.height / 2));
    x.set(nx * IMAN_MAX_X);
    y.set(ny * IMAN_MAX_Y);
  };

  return (
    <div
      ref={exterior}
      className={cn("relative grid", className)}
      onPointerEnter={seguir}
      onPointerMove={seguir}
      onPointerLeave={soltar}
      onPointerCancel={soltar}
      onBlur={soltar}
    >
      <m.div className="iman-movil relative isolate grid" style={{ x: sx, y: sy }}>
        {children}
      </m.div>
    </div>
  );
}
