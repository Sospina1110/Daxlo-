"use client";

import { useEffect, useRef } from "react";
import type { Variante } from "@/lib/cinta/motor";

// Fondo en movimiento del hero: una cinta de luz azul y cian que ondula lenta
// y se inclina hacia el mouse. Es decorativa (aria-hidden, sin eventos).
// También va detrás de la portada de cada línea (variante="portada"), con
// otra trayectoria y el tinte de la línea (tono: cian en coaching, azul en
// consultoría). El motor es el mismo. `fondo` ("r g b", de 0 a 255): lo más
// claro que queda debajo del lienzo, para los topes de contraste.
//
// Lo que sale en el HTML es una banda quieta en CSS (respaldo sin JavaScript,
// sin WebGL, con WebGL por software o con ahorro de datos). El motor WebGL
// (src/lib/cinta/motor.ts) llega después de hidratar, en tiempo ocioso, con un
// import dinámico: el texto no lo espera y el lienzo no cuenta para el LCP.
// Cuando dibuja su primer cuadro, el lienzo aparece y la banda se apaga a la
// vez.
//
// Estados en data-cinta: "carga" (banda CSS), "lista" (bucle), "pausa" (fuera
// de vista o pestaña oculta), "quieta" (un cuadro: reducir movimiento) y
// "respaldo" (sin WebGL, por software o con cuadros que bloquean: se queda la
// banda).
export function CintaHero({ variante = "hero", tono, fondo }: { variante?: Variante; tono?: "cyan" | "blue"; fondo?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const capa = ref.current;
    const lienzo = capa?.querySelector("canvas");
    const seccion = capa?.closest("section");
    if (!capa || !lienzo || !seccion) return;
    let cancelado = false;
    let motor: { destruir: () => void } | null = null;
    // Sin importar nada del motor aquí: el valor va en el chunk diferido.
    const tinte = tono === "cyan" ? 1 : tono === "blue" ? -1 : 0;

    const arrancar = () => {
      import("@/lib/cinta/motor")
        .then(({ crearMotor, decidirModo, leerEntorno }) => {
          if (cancelado) return;
          motor = crearMotor({ lienzo, capa, seccion, modo: decidirModo(leerEntorno()), variante, tinte, fondo: fondo?.split(" ").map(Number) });
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
  }, [variante, tono, fondo]);

  // La banda de la portada imita su pose de reposo, con el tinte de la línea
  // (globals.css).
  const banda = variante === "portada" ? `cinta-quieta-portada ${tono === "blue" ? "cinta-azul" : "cinta-cian"}` : "cinta-quieta";
  return (
    <div ref={ref} aria-hidden data-cinta="carga" className="cinta pointer-events-none absolute inset-0">
      <div className="cinta-respaldo absolute inset-0">
        <div className={`${banda} fundir absolute inset-0`} />
      </div>
      <canvas className="cinta-lienzo absolute inset-0 h-full w-full" />
    </div>
  );
}
