"use client";

import { useRef } from "react";
import { m, useInView } from "motion/react";
import { Clock, FilePen, FileSearch, FolderOpen, Mail, ScanText, Sheet, ShieldCheck } from "lucide-react";
import { consultoria } from "@/content/copy";
import { WindowDots } from "@/components/ui/primitives";
import { cn, EASE, glow } from "@/lib/utils";

const AZUL_CLARO = "#8ea0ff";

const iconosNodo: Record<string, React.ReactNode> = {
  correo: <Mail size={15} />,
  leer: <FileSearch size={15} />,
  extraer: <ScanText size={15} />,
  validar: <ShieldCheck size={15} />,
  hoja: <Sheet size={15} />,
  borrador: <FilePen size={15} />,
};

// Posición del centro de cada nodo, en % del lienzo.
const posiciones: Record<string, { x: number; y: number }> = {
  correo: { x: 13, y: 20 },
  leer: { x: 38, y: 20 },
  extraer: { x: 63, y: 20 },
  validar: { x: 63, y: 55 },
  borrador: { x: 38, y: 84 },
  hoja: { x: 86, y: 84 },
};

const conexiones = [
  "M13 20 L38 20",
  "M38 20 L63 20",
  "M63 20 L63 55",
  "M63 55 C 63 72, 38 66, 38 84",
  "M63 55 C 63 72, 86 66, 86 84",
];

export function Lienzo() {
  const a = consultoria.automatizamos;
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -120px 0px" });

  const barra = [
    { g: "Disparadores", i: [["Correo nuevo", <Mail key="1" size={14} />], ["Archivo en carpeta", <FolderOpen key="2" size={14} />], ["Horario fijo", <Clock key="3" size={14} />]] },
    { g: "Acciones", i: [["Leer documento", <FileSearch key="4" size={14} />], ["Extraer datos", <ScanText key="5" size={14} />], ["Validar reglas", <ShieldCheck key="6" size={14} />], ["Escribir en hoja", <Sheet key="7" size={14} />], ["Crear borrador", <FilePen key="8" size={14} />]] },
  ] as const;

  return (
    <div ref={ref} aria-hidden className="relative overflow-hidden rounded-[26px] border border-line-2 bg-ink-2/90 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
      <span className="absolute -bottom-40 -right-24 h-96 w-96 resplandor" style={glow("27 53 208", 0.45, 1.57)} />
      <div className="relative grid lg:grid-cols-[230px_1fr]">
        <aside className="hidden border-r border-line p-5 lg:block">
          <WindowDots />
          {barra.map((b) => (
            <div key={b.g} className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dim">{b.g}</p>
              <ul className="mt-2 space-y-0.5">
                {b.i.map(([t, icono]) => (
                  <li key={t} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] text-white/70">
                    <span style={{ color: AZUL_CLARO }}>{icono}</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <div className="p-5 md:p-7">
          <p className="font-display text-[17px] text-white">{a.lienzo}</p>
          <p className="text-[13px] text-dim">Así se ve un proceso documental automatizado</p>

          {/* Escritorio: lienzo con nodos y conexiones que se dibujan. */}
          <div data-motion-oculto="" className="bg-grid relative mt-5 hidden aspect-[1000/470] rounded-2xl border border-line md:block">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              {conexiones.map((d, i) => (
                <g key={d}>
                  <m.path
                    d={d}
                    fill="none"
                    stroke="rgba(142,160,255,0.35)"
                    strokeWidth="1.2"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={visible ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.35 + i * 0.3, ease: "easeInOut" }}
                  />
                  <m.path
                    d={d}
                    fill="none"
                    stroke="#8ea0ff"
                    strokeWidth="1.8"
                    strokeDasharray="4 6"
                    vectorEffect="non-scaling-stroke"
                    className="animate-flow"
                    initial={{ opacity: 0 }}
                    animate={visible ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 2 }}
                  />
                </g>
              ))}
            </svg>
            {a.nodos.map((n, i) => (
              <m.div
                key={n.id}
                className="absolute w-[22%] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${posiciones[n.id].x}%`, top: `${posiciones[n.id].y}%` }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={visible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.28, ease: EASE }}
              >
                <NodoFlujo id={n.id} titulo={n.titulo} detalle={n.detalle} />
              </m.div>
            ))}
          </div>

          {/* Móvil: el mismo flujo en columna. */}
          <ol className="mt-5 space-y-2.5 md:hidden">
            {a.nodos.slice(0, 4).map((n) => (
              <li key={n.id}>
                <NodoFlujo id={n.id} titulo={n.titulo} detalle={n.detalle} />
              </li>
            ))}
            <li className="grid grid-cols-2 gap-2.5">
              {a.nodos.slice(4).map((n) => (
                <NodoFlujo key={n.id} id={n.id} titulo={n.titulo} detalle={n.detalle} />
              ))}
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function NodoFlujo({ id, titulo, detalle }: { id: string; titulo: string; detalle: string }) {
  const esHoja = id === "hoja";
  const esBorrador = id === "borrador";
  return (
    <div
      className={cn(
        "rounded-xl border bg-ink/95 px-3.5 py-3 shadow-lg",
        esHoja ? "border-mint/30" : esBorrador ? "border-cyan/35" : "border-line-2",
      )}
    >
      <div className="flex items-center gap-2 text-[14px] text-white">
        <span style={{ color: esHoja ? "#e2f3ee" : esBorrador ? "#29c4f5" : AZUL_CLARO }}>{iconosNodo[id]}</span>
        <span className="leading-tight">{titulo}</span>
      </div>
      <p className="mt-1 text-[12px] leading-snug text-white/55">{detalle}</p>
      {(esHoja || esBorrador) && (
        <span
          className={cn(
            "mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
            esHoja ? "bg-mint/15 text-mint" : "bg-cyan/15 text-cyan",
          )}
        >
          {esHoja ? "Listo" : "Revisa una persona"}
        </span>
      )}
    </div>
  );
}
