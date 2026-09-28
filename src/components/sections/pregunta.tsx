"use client";

import { useId, useState } from "react";
import { m } from "motion/react";
import { Plus } from "lucide-react";
import { cn, EASE } from "@/lib/utils";

// La respuesta queda siempre en el HTML (los buscadores la leen); cerrada se
// oculta con `inert` para que no reciba foco ni se anuncie.
export function Pregunta({ pregunta, respuesta }: { pregunta: string; respuesta: string }) {
  const [abierta, setAbierta] = useState(false);
  const id = useId();
  return (
    <div className={cn("rounded-2xl border transition-colors duration-300", abierta ? "border-line-2 bg-white/[0.035]" : "border-line hover:border-line-2")}>
      <button
        type="button"
        aria-expanded={abierta}
        aria-controls={id}
        onClick={() => setAbierta((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[17px] font-medium text-white md:px-6 md:py-5 md:text-[18px]"
      >
        {pregunta}
        <m.span animate={{ rotate: abierta ? 45 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 text-white/60">
          <Plus size={20} />
        </m.span>
      </button>
      <m.div
        id={id}
        role="region"
        inert={!abierta}
        initial={false}
        animate={{ height: abierta ? "auto" : 0, opacity: abierta ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-[17px] leading-relaxed text-muted md:px-6">{respuesta}</p>
      </m.div>
    </div>
  );
}
