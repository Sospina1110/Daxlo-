"use client";

import { useEffect, useRef } from "react";
import { limitar } from "@/lib/campo/entorno";
import { enFrases } from "./frases";

// Tres cosas, una a la vez (paginas.css, .cp-lista).
//
// Sin JavaScript, con «reducir movimiento» o en pantallas angostas es una
// lista: cada fila con su número, su título y su línea. En escritorio la
// lista se fija mientras se baja: la fila que toca sube al centro y se
// enciende, y las otras quedan apagadas arriba y abajo.
//
// Este componente solo mide: con el avance del scroll dentro de la pista
// decide qué fila toca, la marca (data-on) y escribe --activo en la sección;
// el movimiento es una transición de CSS. Se mide en un cuadro por evento de
// scroll como mucho, y solo mientras la sección está en pantalla.
type Item = { titulo: string; texto?: string };

const FIJABLE = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

export function Lista({ id, rotulo, titulo, items }: { id: string; rotulo: string; titulo: string; items: readonly Item[] }) {
  const seccion = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = seccion.current;
    const pista = sec?.querySelector<HTMLElement>(".cp-lista-pista");
    if (!sec || !pista || !("IntersectionObserver" in window)) return;
    const mq = matchMedia(FIJABLE);
    const filas = [...sec.querySelectorAll<HTMLElement>(".cp-lista-item")];
    let cuadro = 0;
    let activo = -1;
    let oyendo = false;

    const medir = () => {
      cuadro = 0;
      if (!mq.matches) return;
      const caja = pista.getBoundingClientRect();
      const recorrido = Math.max(1, caja.height - window.innerHeight);
      const p = limitar(-caja.top / recorrido);
      const n = Math.min(filas.length - 1, Math.floor(p * filas.length));
      if (n === activo) return;
      activo = n;
      sec.style.setProperty("--activo", String(n));
      filas.forEach((f, i) => f.toggleAttribute("data-on", i === n));
    };
    const pedir = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };
    // Fijada o suelta, según el ancho y la preferencia de movimiento.
    const poner = () => {
      sec.toggleAttribute("data-fijada", mq.matches);
      activo = -1;
      if (!mq.matches) filas.forEach((f) => f.setAttribute("data-on", ""));
      medir();
    };
    const io = new IntersectionObserver((es) => {
      const dentro = es[es.length - 1].isIntersecting;
      if (dentro && !oyendo) {
        oyendo = true;
        window.addEventListener("scroll", pedir, { passive: true });
        window.addEventListener("resize", pedir);
      } else if (!dentro && oyendo) {
        oyendo = false;
        window.removeEventListener("scroll", pedir);
        window.removeEventListener("resize", pedir);
      }
      medir();
    });
    poner();
    io.observe(sec);
    mq.addEventListener("change", poner);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", poner);
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, []);

  return (
    <section ref={seccion} aria-labelledby={id} data-tema="oscuro" className="cp-oscuro cp-lista" style={{ "--n": items.length } as React.CSSProperties}>
      <div data-revelar="" data-centro="" className="cp-cabeza">
        <p className="cm-mono cm-corchete">{rotulo}</p>
        <h2 id={id} className="cm-titular cm-titular-l">
          {enFrases(titulo)}
        </h2>
      </div>
      <div className="cp-lista-pista">
        <div className="cp-lista-pegada">
          <ol className="cp-lista-items">
            {items.map((item, i) => (
              <li key={item.titulo} data-on="" data-sola={item.texto ? undefined : ""} className="cp-lista-item">
                <p aria-hidden="true" className="cm-mono">
                  [0{i + 1}]
                </p>
                <h3 className="cm-titular cm-titular-m">{item.titulo}</h3>
                {item.texto && <p className="cm-texto-l">{item.texto}</p>}
              </li>
            ))}
          </ol>
          <span aria-hidden="true" className="cp-lista-regla" />
        </div>
      </div>
    </section>
  );
}
