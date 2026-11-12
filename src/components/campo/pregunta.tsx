"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";

// Una pregunta frecuente (paginas.css, .cp-pregunta): una fila entre líneas
// punteadas con la pregunta, un signo de más y la respuesta.
//
// La respuesta queda siempre en el HTML (los buscadores la leen); cerrada se
// oculta con `inert` para que no reciba foco ni se anuncie.
//
// Abre y cierra con CSS (grid-template-rows de 0fr a 1fr): no depende de
// ninguna librería, así que responde desde el primer toque. Es la única
// excepción a «solo transform y opacity»: anima el alto, pero lo dispara el
// usuario (esos saltos no cuentan para CLS). Abrir tarda más que cerrar, y la
// línea vertical del signo de más se acuesta. Con el teclado (Enter o
// Espacio, event.detail 0) todo cambia de una vez.
//
// `enlace` (opcional) va al final de la respuesta, en su propio renglón: no
// es parte del texto que se publica en los datos estructurados (FAQPage).
export function Pregunta({ pregunta, respuesta, enlace }: { pregunta: string; respuesta: string; enlace?: { t: string; h: string } }) {
  const [abierta, setAbierta] = useState(false);
  // Si el último cambio llegó del teclado: entonces no se anima.
  const [teclado, setTeclado] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const idBoton = `${id}-boton`;
  const idPanel = `${id}-panel`;

  // Una pregunta que se abre pegada al borde de abajo (la última, en celular)
  // dejaba la respuesta fuera de la pantalla: el toque parecía no hacer nada.
  // Al terminar de abrir, si se ven menos de 96 px de la respuesta, se trae a
  // la vista lo justo. Con «reducir movimiento» o con teclado, sin esperar.
  function alternar(e: React.MouseEvent<HTMLButtonElement>) {
    const abrir = !abierta;
    const conTeclado = e.detail === 0;
    setTeclado(conTeclado);
    setAbierta(abrir);
    if (!abrir) return;
    const quieto = (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false) || conTeclado;
    window.setTimeout(
      () => {
        const p = panel.current;
        if (!p) return;
        const r = p.getBoundingClientRect();
        if (r.top > window.innerHeight - 96) p.scrollIntoView?.({ block: "nearest", behavior: quieto ? "auto" : "smooth" });
      },
      quieto ? 0 : 340,
    );
  }

  return (
    <div data-teclado={teclado ? "" : undefined} className="cp-pregunta">
      <h3>
        <button id={idBoton} type="button" aria-expanded={abierta} aria-controls={idPanel} onClick={alternar} className="cp-pregunta-boton">
          {pregunta}
          <span aria-hidden="true" className="cp-pregunta-mas" />
        </button>
      </h3>
      <div ref={panel} id={idPanel} role="region" aria-labelledby={idBoton} inert={!abierta} data-abierta={abierta ? "" : undefined} className="cp-pregunta-panel">
        <div>
          <p className="cm-texto-m cp-pregunta-respuesta">{respuesta}</p>
          {enlace && (
            <p>
              <Link href={enlace.h} className="cm-enlace">
                {enlace.t}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
