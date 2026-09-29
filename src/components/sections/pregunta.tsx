"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// La respuesta queda siempre en el HTML (los buscadores la leen); cerrada se
// oculta con `inert` para que no reciba foco ni se anuncie.
//
// Abre y cierra con CSS (grid-template-rows de 0fr a 1fr): no depende de que
// Motion haya cargado, así que responde desde el primer toque.
export function Pregunta({ pregunta, respuesta }: { pregunta: string; respuesta: string }) {
  const [abierta, setAbierta] = useState(false);
  const id = useId();
  const idBoton = `${id}-boton`;
  const idPanel = `${id}-panel`;
  return (
    <div className={cn("rounded-2xl border transition-colors duration-300", abierta ? "border-line-2 bg-white/[0.035]" : "border-line hover:border-line-2")}>
      <h3 className="font-sans text-[17px] font-medium tracking-normal md:text-[18px]">
        <button
          id={idBoton}
          type="button"
          aria-expanded={abierta}
          aria-controls={idPanel}
          onClick={() => setAbierta((v) => !v)}
          className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-white md:px-6 md:py-5"
        >
          {pregunta}
          <Plus size={20} aria-hidden className={cn("shrink-0 text-white/60 transition-transform duration-300", abierta && "rotate-45")} />
        </button>
      </h3>
      <div
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
          <p className="px-5 pb-5 text-[17px] leading-relaxed text-muted md:px-6">{respuesta}</p>
        </div>
      </div>
    </div>
  );
}
