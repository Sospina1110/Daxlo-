"use client";

import { useEffect, useRef } from "react";

// Fondo en movimiento del hero: una cinta de luz azul y cian que ondula lenta
// y se inclina hacia el mouse. Es decorativa (aria-hidden, sin eventos).
//
// Lo que sale en el HTML es una banda quieta en CSS (respaldo sin JavaScript,
// sin WebGL o con ahorro de datos). El motor WebGL (src/lib/cinta/motor.ts)
// llega después de hidratar, en tiempo ocioso, con un import dinámico: el
// texto del hero no lo espera y el lienzo no cuenta para el LCP. Cuando
// dibuja su primer cuadro, el lienzo aparece y la banda se apaga a la vez.
//
// Estados en data-cinta: "carga" (banda CSS), "lista" (bucle), "pausa" (fuera
// de vista o pestaña oculta), "quieta" (un cuadro: reducir movimiento) y
// "respaldo" (sin WebGL: se queda la banda).
export function CintaHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const capa = ref.current;
    const lienzo = capa?.querySelector("canvas");
    const seccion = capa?.closest("section");
    if (!capa || !lienzo || !seccion) return;
    let cancelado = false;
    let motor: { destruir: () => void } | null = null;

    const arrancar = () => {
      import("@/lib/cinta/motor")
        .then(({ crearMotor, decidirModo, leerEntorno }) => {
          if (cancelado) return;
          motor = crearMotor({ lienzo, capa, seccion, modo: decidirModo(leerEntorno()) });
          if (!motor) capa.dataset.cinta = "respaldo";
        })
        .catch(() => {
          if (!cancelado) capa.dataset.cinta = "respaldo";
        });
    };

    const w = window as Window & { requestIdleCallback?: (fn: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let ocioso = 0;
    let espera: ReturnType<typeof setTimeout> | undefined;
    if (w.requestIdleCallback) ocioso = w.requestIdleCallback(arrancar, { timeout: 1200 });
    else espera = setTimeout(arrancar, 300);

    return () => {
      cancelado = true;
      if (ocioso) w.cancelIdleCallback?.(ocioso);
      if (espera) clearTimeout(espera);
      motor?.destruir();
    };
  }, []);

  return (
    <div ref={ref} aria-hidden data-cinta="carga" className="cinta pointer-events-none absolute inset-0">
      <div className="cinta-respaldo absolute inset-0">
        <div className="cinta-quieta fundir absolute inset-0" />
      </div>
      <canvas className="cinta-lienzo absolute inset-0 h-full w-full" />
    </div>
  );
}
