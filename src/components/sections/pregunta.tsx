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
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const idBoton = `${id}-boton`;
  const idPanel = `${id}-panel`;
  const fila = variante === "fila";

  // Una pregunta que se abre pegada al borde de abajo (la última, en celular)
  // dejaba la respuesta fuera de la pantalla: el toque parecía no hacer nada.
  // Al terminar de abrir, si se ven menos de 96 px de la respuesta, se trae a
  // la vista lo justo ("nearest"). Con "reducir movimiento", sin animar.
  function alternar() {
    const abrir = !abierta;
    setAbierta(abrir);
    if (!abrir) return;
    const quieto = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    window.setTimeout(
      () => {
        const p = panel.current;
        if (!p) return;
        const r = p.getBoundingClientRect();
        if (r.top > window.innerHeight - 96) p.scrollIntoView?.({ block: "nearest", behavior: quieto ? "auto" : "smooth" });
      },
      quieto ? 0 : 320,
    );
  }
  return (
    <div
      className={cn(
        fila
          ? "border-b border-line"
          : cn("rounded-2xl border transition-colors duration-300", abierta ? "border-line-2 bg-white/[0.035]" : "border-line hover:border-line-2"),
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
            fila ? "min-h-[64px] py-5" : "min-h-[56px] px-5 py-4 md:px-6 md:py-5",
          )}
        >
          {pregunta}
          <Plus
            size={20}
            aria-hidden
            className={cn(
              "shrink-0 text-white/60 transition-[transform,color] duration-300 group-hover:text-white motion-reduce:transition-none",
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
          "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          abierta ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
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
              <Link href={enlace.h} className="inline-flex min-h-[44px] items-center gap-2 text-[16px] font-medium text-white/85 transition-colors hover:text-white">
                {enlace.t}
                <ArrowRight size={16} aria-hidden />
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
