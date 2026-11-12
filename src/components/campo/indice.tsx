"use client";

import { useEffect, useRef } from "react";

// El índice fijo de la izquierda (paginas.css, .cp-indice): una lista en
// mono que marca con «>» el bloque que se está viendo. Solo se ve en
// escritorio; en pantallas angostas no se pinta y no mide nada.
//
// `objetivo` es el selector de los bloques, que se buscan dentro del
// contenedor del índice. Toca el último cuyo borde de arriba ya pasó el 42 %
// del alto de la pantalla. Con `enlaces` cada fila lleva al ancla de su
// bloque (y entonces el índice es una navegación con nombre); sin ellos es
// decorativo.
type Props = { items: readonly string[]; objetivo: string; enlaces?: readonly string[]; nombre?: string };

export function Indice({ items, objetivo, enlaces, nombre }: Props) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = ref.current;
    const raiz = ul?.closest("[data-indice]");
    if (!ul || !raiz) return;
    const metas = [...raiz.querySelectorAll<HTMLElement>(objetivo)];
    const filas = [...ul.children] as HTMLElement[];
    let cuadro = 0;
    const medir = () => {
      cuadro = 0;
      if (ul.offsetParent === null) return;
      const linea = window.innerHeight * 0.42;
      let activo = 0;
      metas.forEach((m, i) => {
        if (m.getBoundingClientRect().top <= linea) activo = i;
      });
      filas.forEach((f, i) => f.toggleAttribute("data-on", i === activo));
    };
    const pedir = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, [objetivo]);

  const lista = (
    <ul ref={ref} aria-hidden={enlaces ? undefined : "true"} className="cm-mono cp-indice">
      {items.map((texto, i) => (
        <li key={texto} data-on={i === 0 ? "" : undefined}>
          {enlaces ? <a href={enlaces[i]}>{texto}</a> : texto}
        </li>
      ))}
    </ul>
  );
  return enlaces ? <nav aria-label={nombre}>{lista}</nav> : lista;
}
