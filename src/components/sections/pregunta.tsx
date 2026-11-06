"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// La respuesta queda siempre en el HTML (los buscadores la leen); cerrada se
// oculta con `inert` para que no reciba foco ni se anuncie.
//
// Abre y cierra con CSS (grid-template-rows de 0fr a 1fr): no depende de que
// Motion haya cargado, así que responde desde el primer toque.
// Excepción documentada a "solo transform y opacity": grid-template-rows anima
// el alto, es decir, el layout. Se acepta porque lo dispara el usuario (esos
// layout-shift llevan hadRecentInput y no cuentan para CLS) y porque es lo que
// permite abrir sin esperar a Motion. No se extiende a nada más.
//
// Ritmo (DESIGN.md, Motion):
// - Abrir: el alto en 260 ms y la opacidad en 200 ms con 60 ms de retraso: el
//   texto aparece cuando ya hay alto y no asoma aplastado.
// - Cerrar: el alto en 200 ms y la opacidad en 120 ms, sin retraso: el texto se
//   va primero y el cierre dura menos que la apertura.
// - El "+" gira 45° en 200 ms (termina antes que el alto) y baja a 0.9 al
//   presionar con dedo o mouse.
// - Con el teclado (Enter o Espacio, event.detail 0) todo cambia de una vez.
//
// `enlace` (opcional) va al final de la respuesta, en su propio renglón: no es
// parte del texto que se publica en los datos estructurados (FAQPage).
//
// Dos formas (DESIGN.md, Components):
// - `caja` (/preguntas): cada pregunta en su recuadro de 16 px de radio.
// - `fila` (/coaching y /consultoria): fila abierta con regla de 1 px abajo,
//   sin caja ni relleno lateral, como las demás listas de esas páginas. Nueve
//   recuadros apilados se leían como una pila de tarjetas.
export function Pregunta({
  pregunta,
  respuesta,
  enlace,
  variante = "caja",
}: {
  pregunta: string;
  respuesta: string;
  enlace?: { t: string; h: string };
  variante?: "caja" | "fila";
}) {
  const [abierta, setAbierta] = useState(false);
  // Si el último cambio llegó del teclado: entonces no se anima.
  const [teclado, setTeclado] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const idBoton = `${id}-boton`;
  const idPanel = `${id}-panel`;
  const fila = variante === "fila";

  // Una pregunta que se abre pegada al borde de abajo (la última, en celular)
  // dejaba la respuesta fuera de la pantalla: el toque parecía no hacer nada.
  // Al terminar de abrir (280 ms, justo después de los 260 ms del alto), si se
  // ven menos de 96 px de la respuesta, se trae a la vista lo justo
  // ("nearest"). Con "reducir movimiento" o con teclado, sin esperar ni animar.
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
      quieto ? 0 : 280,
    );
  }
  return (
    <div
      className={cn(
        fila
          ? "border-b border-line"
          : cn("rounded-2xl border transition-colors", abierta ? "border-line-2 bg-white/[0.035]" : "border-line hover:border-line-2"),
      )}
    >
      <h3 className="font-sans text-[17px] font-medium tracking-normal md:text-[18px]">
        <button
          id={idBoton}
          type="button"
          aria-expanded={abierta}
          aria-controls={idPanel}
          onClick={alternar}
          className={cn(
            "group flex w-full items-center justify-between gap-4 text-left text-white",
            // En la caja, al presionar se aclara el fondo, al instante.
            fila ? "min-h-[64px] py-5" : "min-h-[56px] rounded-2xl px-5 py-4 active:bg-white/[0.04] md:px-6 md:py-5",
          )}
        >
          {pregunta}
          {/* rotate-45 usa la propiedad rotate (Tailwind 4): con
              transition-[transform] el giro era instantáneo. */}
          <Plus
            size={20}
            aria-hidden
            className={cn(
              "shrink-0 text-white/60 group-hover:text-white motion-safe:[.group:active:not(:focus-visible)_&]:scale-90",
              teclado ? "transition-none" : "transition-[rotate,scale,color] ease-salida motion-reduce:transition-none",
              abierta && "rotate-45 text-white",
            )}
          />
        </button>
      </h3>
      <div
        ref={panel}
        id={idPanel}
        role="region"
        aria-labelledby={idBoton}
        inert={!abierta}
        className={cn(
          "grid ease-salida",
          teclado ? "transition-none" : "[transition-property:grid-template-rows,opacity] motion-reduce:transition-none",
          abierta
            ? "grid-rows-[1fr] opacity-100 [transition-delay:0ms,60ms] [transition-duration:260ms,200ms]"
            : "grid-rows-[0fr] opacity-0 [transition-delay:0ms,0ms] [transition-duration:200ms,120ms]",
        )}
      >
        <div className="overflow-hidden">
          <p
            className={cn(
              "text-[17px] leading-relaxed text-muted",
              fila ? "max-w-[64ch] pr-9" : "px-5 md:px-6",
              enlace ? "pb-1" : fila ? "pb-6" : "pb-5",
            )}
          >
            {respuesta}
          </p>
          {enlace && (
            <p className={fila ? "pb-4" : "px-5 pb-3 md:px-6"}>
              {" "}
              <Link href={enlace.h} className="group inline-flex min-h-[44px] items-center gap-2 text-[16px] font-medium text-white/85 transition-colors hover:text-white">
                {enlace.t}
                <ArrowRight size={16} aria-hidden className="transition-[translate] ease-salida motion-safe:group-hover:translate-x-1" />
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
