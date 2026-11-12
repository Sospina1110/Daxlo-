"use client";

import { useEffect, useRef } from "react";
import { crearBucle } from "@/lib/campo/bucle";
import { leerEntorno } from "@/lib/campo/entorno";
import { crearTrama, leerEncuadre, muestrear } from "@/lib/campo/trama";

// La trama de puntos del hero: un lienzo encima del video. Lee la luz del
// póster (o del video, cuando ya corre) y se enciende donde hay luz;
// respira despacio y, con mouse, se despierta alrededor del puntero.
//
// Corre a 30 cuadros por segundo, solo mientras el hero está en pantalla y la
// pestaña visible. Con «reducir movimiento», ahorro de datos, poca memoria o
// render por software dibuja un solo cuadro, quieto y completo.
const COLOR = "rgb(214 238 252)";

export function TramaHero() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = ref.current;
    const caja = lienzo?.parentElement;
    const seccion = caja?.closest("section");
    const foto = caja?.querySelector("img");
    if (!lienzo || !caja || !seccion || !foto) return;

    const entorno = leerEntorno();
    const trama = crearTrama(lienzo, { celda: entorno.movil ? 10 : 11, color: COLOR, semilla: 5 });
    let luz: Float32Array | null = null;
    let ultimaMuestra = -1;
    // El puntero, suavizado: a dónde va y dónde está.
    const meta = { x: 0, y: 0, f: 0 };
    const puntero = { x: 0, y: 0, f: 0 };
    let ultimoGesto = 0;

    const tomar = () => {
      const video = caja.querySelector("video");
      const fuente = video && video.readyState >= 2 && !video.paused ? video : foto.complete ? foto : null;
      if (!fuente) return;
      luz = muestrear(fuente, trama.rejilla(), leerEncuadre(foto), luz ?? undefined) ?? luz;
    };

    const cuadro = (t: number) => {
      const video = caja.querySelector("video");
      if (!luz || (video && !video.paused && t - ultimaMuestra > 0.2)) {
        tomar();
        ultimaMuestra = t;
      }
      // El puntero se apaga solo si deja de moverse.
      if (meta.f && performance.now() - ultimoGesto > 1400) meta.f = 0;
      puntero.x += (meta.x - puntero.x) * 0.16;
      puntero.y += (meta.y - puntero.y) * 0.16;
      puntero.f += (meta.f - puntero.f) * 0.07;
      trama.limpiar();
      // Entra después de la foto: en dos segundos y medio.
      const entrada = entorno.animar ? Math.min(1, Math.max(0, (t - 0.9) / 2.5)) : 1;
      trama.pintar({ t, a: luz, fuerza: entrada, puntero: entorno.animar ? puntero : null });
    };

    const bucle = crearBucle(caja, cuadro, { continuo: entorno.animar, fps: 30 });

    const medir = () => {
      const r = caja.getBoundingClientRect();
      if (!r.width || !r.height) return;
      trama.ajustar(r.width, r.height);
      luz = null;
      tomar();
      bucle.pedir();
    };
    const alCargar = () => {
      tomar();
      bucle.pedir();
    };
    const ro = new ResizeObserver(medir);
    ro.observe(caja);
    foto.addEventListener("load", alCargar);
    // Los signos se dibujan con Geist Mono: cuando llega, se rehace el atlas.
    document.fonts?.ready.then(medir).catch(() => {});

    const alMover = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = caja.getBoundingClientRect();
      meta.x = e.clientX - r.left;
      meta.y = e.clientY - r.top;
      if (!puntero.f) {
        puntero.x = meta.x;
        puntero.y = meta.y;
      }
      meta.f = 1;
      ultimoGesto = performance.now();
    };
    const alSalir = () => {
      meta.f = 0;
    };
    if (entorno.animar && entorno.fino) {
      seccion.addEventListener("pointermove", alMover, { passive: true });
      seccion.addEventListener("pointerleave", alSalir, { passive: true });
    }

    return () => {
      bucle.destruir();
      ro.disconnect();
      foto.removeEventListener("load", alCargar);
      seccion.removeEventListener("pointermove", alMover);
      seccion.removeEventListener("pointerleave", alSalir);
    };
  }, []);

  return <canvas ref={ref} className="cm-trama" />;
}
