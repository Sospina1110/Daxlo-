"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Una afirmación que se enciende palabra por palabra mientras cruza la
// pantalla. Cada palabra va en su <span>: arranca apagada (gris claro) y pasa
// a tinta cuando la línea de lectura, al 78 % del alto de la pantalla, ya
// recorrió la parte del bloque que le toca. Lo encendido queda encendido.
//
// Se mide en un cuadro por evento de scroll como mucho, y solo mientras el
// bloque está en pantalla (un IntersectionObserver pone y quita el oyente).
// Sin JavaScript, o con «reducir movimiento», está entera desde el principio
// (campo.css): el apagado solo existe cuando este componente ya marcó el
// bloque con data-lista.
export function Enciende({ texto, id, className }: { texto: string; id?: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const palabras = texto.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = el.querySelectorAll(".cm-palabra");
    el.setAttribute("data-lista", "");
    let encendidas = 0;
    let cuadro = 0;
    let activo = false;
    const medir = () => {
      cuadro = 0;
      const caja = el.getBoundingClientRect();
      const alto = window.innerHeight;
      // Empieza cuando el bloque asoma al 78 % de la pantalla y termina cuando
      // su borde de abajo llega al 46 %.
      const p = (alto * 0.78 - caja.top) / Math.max(1, caja.height + alto * 0.32);
      const hasta = Math.round(Math.min(1, Math.max(0, p)) * spans.length);
      for (let i = encendidas; i < hasta; i++) spans[i].setAttribute("data-on", "");
      encendidas = Math.max(encendidas, hasta);
    };
    const pedir = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };
    const io = new IntersectionObserver((es) => {
      const dentro = es[es.length - 1].isIntersecting;
      if (dentro && !activo) {
        activo = true;
        window.addEventListener("scroll", pedir, { passive: true });
        window.addEventListener("resize", pedir);
      } else if (!dentro && activo) {
        activo = false;
        window.removeEventListener("scroll", pedir);
        window.removeEventListener("resize", pedir);
      }
      // Al entrar y al salir se mide una vez: un salto largo de scroll puede
      // pasar el bloque de largo entre dos cuadros.
      medir();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
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
