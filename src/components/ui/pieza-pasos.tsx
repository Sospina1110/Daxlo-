"use client";

import { useEffect, useRef } from "react";
import { ANCHO_ESCRITORIO, LINEA_ACTIVA, margenDeLinea } from "@/lib/ecosistema";

// Pieza por pasos: un escenario fijo y unos bloques de texto que lo cambian
// al pasar. Este componente solo decide qué paso está activo; todo lo que se
// ve lo hace el CSS a partir de tres atributos:
// - data-vivo en la raíz: la pieza está viva (hay JavaScript y no se pidió
//   «reducir movimiento»). Sin él, el escenario queda en su cuadro final y
//   todos los pasos encendidos: ese es el valor por defecto del marcado, así
//   el contenido completo está en el HTML.
// - data-paso="0…n" en el escenario ([data-escenario]) y data-activo en el
//   bloque de texto que se está leyendo ([data-paso-texto]).
// - data-pausa en el escenario cuando sale de la pantalla o la pestaña se
//   oculta: el CSS detiene lo que se mueve sin fin.
//
// El paso activo lo decide un IntersectionObserver que solo ve una línea de
// la pantalla (el centro en escritorio; más abajo en celular, donde el
// escenario va fijo arriba): el bloque que la cruza es el activo. No se
// escucha el scroll y no hay trabajo por cuadro.
export function PiezaPasos({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = ref.current;
    const escenario = raiz?.querySelector<HTMLElement>("[data-escenario]");
    if (!raiz || !escenario) return;
    const textos = [...raiz.querySelectorAll<HTMLElement>("[data-paso-texto]")];
    const final = escenario.dataset.paso ?? String(textos.length - 1);
    const reducir = matchMedia("(prefers-reduced-motion: reduce)");
    const ancho = matchMedia(`(min-width: ${ANCHO_ESCRITORIO}px)`);
    let pasos: IntersectionObserver | null = null;
    let vista: IntersectionObserver | null = null;

    const activar = (i: number) => {
      escenario.dataset.paso = String(i);
      textos.forEach((t, k) => t.toggleAttribute("data-activo", k === i));
    };
    const pausar = () => {
      const fuera = escenario.dataset.fuera === "1" || document.visibilityState === "hidden";
      escenario.toggleAttribute("data-pausa", fuera);
    };

    const apagar = () => {
      pasos?.disconnect();
      vista?.disconnect();
      pasos = vista = null;
      raiz.removeAttribute("data-vivo");
      escenario.removeAttribute("data-pausa");
      escenario.dataset.paso = final;
      textos.forEach((t) => t.removeAttribute("data-activo"));
    };

    const encender = () => {
      apagar();
      if (reducir.matches) return;
      raiz.setAttribute("data-vivo", "");
      const f = ancho.matches ? LINEA_ACTIVA.escritorio : LINEA_ACTIVA.celular;
      // Al arrancar, el último paso que ya cruzó la línea: antes de llegar a
      // la pieza es el primero y, si la página abrió más abajo, el último.
      const linea = innerHeight * f;
      activar(textos.reduce((i, t, k) => (t.getBoundingClientRect().top < linea ? k : i), 0));
      pasos = new IntersectionObserver(
        (es) => {
          for (const e of es) if (e.isIntersecting) activar(textos.indexOf(e.target as HTMLElement));
        },
        { rootMargin: margenDeLinea(f) },
      );
      textos.forEach((t) => pasos?.observe(t));
      vista = new IntersectionObserver((es) => {
        escenario.dataset.fuera = es[es.length - 1].isIntersecting ? "0" : "1";
        pausar();
      });
      vista.observe(escenario);
    };

    encender();
    reducir.addEventListener("change", encender);
    ancho.addEventListener("change", encender);
    document.addEventListener("visibilitychange", pausar);
    return () => {
      reducir.removeEventListener("change", encender);
      ancho.removeEventListener("change", encender);
      document.removeEventListener("visibilitychange", pausar);
      apagar();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
