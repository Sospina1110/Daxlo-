"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { Puntos } from "@/components/ui/blocks";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const AZUL_CLARO = "#8ea0ff";

type Fase = { numero: string; titulo: string; texto: string; puntos: readonly string[] };

// Isla de cliente: las fases de consultoría apiladas con el scroll. Es lo único
// de la sección que necesita JavaScript; la cabecera y los visuales llegan
// como HTML del servidor.
export function Apilado({ items, visuales }: { items: readonly Fase[]; visuales: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const escritorio = useMediaQuery("(min-width: 1024px)");
  return (
    <div ref={ref} className="relative mt-14 lg:mt-20">
      {items.map((it, i) => (
        <TarjetaApilada key={it.numero} indice={i} total={items.length} progreso={scrollYProgress} escritorio={escritorio} item={it} visual={visuales[i]} />
      ))}
    </div>
  );
}

// Cada tarjeta queda fija arriba y la siguiente sube por encima, mientras las
// anteriores se encogen un poco hacia atrás. En móvil se muestran en columna:
// una tarjeta más alta que la pantalla no puede quedar fija sin cortarse.
function TarjetaApilada({
  indice,
  total,
  progreso,
  escritorio,
  item,
  visual,
}: {
  indice: number;
  total: number;
  progreso: MotionValue<number>;
  escritorio: boolean;
  item: Fase;
  visual: React.ReactNode;
}) {
  const escalaFinal = 1 - (total - 1 - indice) * 0.05;
  const escala = useTransform(progreso, [indice / total, 1], [1, escalaFinal]);
  const alterna = indice % 2 === 1;

  return (
    <div className="lg:sticky lg:h-[88vh]" style={escritorio ? { top: 104 + indice * 28 } : undefined}>
      <m.article
        style={escritorio ? { scale: escala } : undefined}
        className="relative mb-5 w-full origin-top overflow-hidden rounded-[28px] border border-line-2 bg-[#0e1019] shadow-[0_-24px_70px_rgba(0,0,0,0.55)] lg:mb-0 lg:grid lg:min-h-[500px] lg:grid-cols-2"
      >
        <div className={cn("flex flex-col justify-center p-6 sm:p-8 md:p-12", alterna && "lg:order-2")}>
          <span className="font-display text-[15px] font-medium tracking-[0.1em]" style={{ color: AZUL_CLARO }}>
            FASE {item.numero}
          </span>
          <h3 className="mt-4 text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight text-white">{item.titulo}</h3>
          <p className="mt-4 text-[18px] leading-relaxed text-muted">{item.texto}</p>
          <Puntos items={item.puntos} tono="blue" className="mt-7" />
        </div>
        <div
          className={cn(
            "relative overflow-hidden border-t border-line bg-gradient-to-br from-blue/25 via-ink-2 to-ink-2",
            "lg:border-t-0",
            alterna ? "lg:order-1 lg:border-r" : "lg:border-l",
          )}
        >
          {visual}
        </div>
      </m.article>
    </div>
  );
}
