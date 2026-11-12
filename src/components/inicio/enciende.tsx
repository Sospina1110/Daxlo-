"use client";

import { useEffect, useRef } from "react";
import { limitar } from "@/lib/campo/entorno";
import { cn } from "@/lib/utils";

// Una afirmación que se enciende palabra por palabra siguiendo el scroll.
//
// Cada palabra va en su <span> y arranca apagada. Un frente de luz recorre la
// frase mientras el bloque cruza la pantalla: empieza cuando asoma al 86 %
// del alto y termina cuando su centro llega al 42 %. Cada palabra pasa de
// apagada a encendida mientras el frente la cruza (dura tres palabras), así
// que nunca se enciende un bloque de golpe; y como sigue al scroll, al subir
// se vuelve a apagar.
//
// El scroll llega a saltos (una vuelta de rueda son 100 px): el frente
// persigue su destino con un suavizado, un cuadro a la vez, y el bucle se
// detiene apenas llega. Solo se escucha el scroll mientras el bloque está en
// pantalla. Cada palabra recibe su avance en --v (0 a 1) y el CSS lo pasa a
// opacidad (campo.css, .cm-palabra).
//
// Sin JavaScript, o con «reducir movimiento», la frase está entera desde el
// principio: el apagado solo existe cuando este componente ya marcó el bloque
// con data-lista.
const ANCHO = 3;

export function Enciende({ texto, id, className }: { texto: string; id?: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const palabras = texto.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = [...el.querySelectorAll<HTMLElement>(".cm-palabra")];
    const n = spans.length;
    const puesto = new Float32Array(n).fill(-1);
    el.setAttribute("data-lista", "");
    let meta = 0;
    let actual = 0;
    let cuadro = 0;
    let activo = false;

    const pintar = () => {
      const frente = actual * (n + ANCHO);
      for (let i = 0; i < n; i++) {
        const v = Math.round(limitar((frente - i) / ANCHO) * 50) / 50;
        if (v === puesto[i]) continue;
        puesto[i] = v;
        spans[i].style.setProperty("--v", String(v));
      }
    };
    const paso = () => {
      cuadro = 0;
      actual += (meta - actual) * 0.16;
      if (Math.abs(meta - actual) < 0.002) actual = meta;
      pintar();
      if (actual !== meta) cuadro = requestAnimationFrame(paso);
    };
    const medir = () => {
      const caja = el.getBoundingClientRect();
      const alto = window.innerHeight;
      const desde = alto * 0.86;
      const hasta = alto * 0.42 - caja.height / 2;
      meta = limitar((desde - caja.top) / Math.max(1, desde - hasta));
      if (!cuadro) cuadro = requestAnimationFrame(paso);
    };
    const io = new IntersectionObserver((es) => {
      const dentro = es[es.length - 1].isIntersecting;
      if (dentro && !activo) {
        activo = true;
        window.addEventListener("scroll", medir, { passive: true });
        window.addEventListener("resize", medir);
      } else if (!dentro && activo) {
        activo = false;
        window.removeEventListener("scroll", medir);
        window.removeEventListener("resize", medir);
      }
      // Al entrar y al salir se mide una vez: un salto largo de scroll puede
      // pasar el bloque de largo entre dos cuadros.
      medir();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, []);

  return (
    <p ref={ref} id={id} className={cn("cm-enciende", className)}>
      {palabras.map((palabra, i) => (
        <span key={i} className="cm-palabra">
          {palabra}{" "}
        </span>
      ))}
    </p>
  );
}
