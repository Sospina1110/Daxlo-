"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { Orb } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

type TonoZona = "cyan" | "blue";

// Portada de la página de cada línea: el nombre del servicio, el titular
// gigante que se desliza con el scroll y el orbe de vidrio. Es el h1 de la
// página: la línea chica ("Coaching 1 a 1") le da a buscadores y lectores de
// pantalla el nombre del servicio, la gigante ("Para ti.") el tono.
export function ZonaPortada({
  tono,
  eyebrow,
  gigante,
  sub,
  migas,
}: {
  tono: TonoZona;
  eyebrow: string;
  gigante: readonly [string, string] | readonly string[];
  sub: string;
  migas?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const cyan = tono === "cyan";

  return (
    <div ref={ref} className="relative overflow-hidden pb-4 pt-28 md:pb-16 md:pt-36">
      <div className="container-page">
        {migas}

        <h1 className="mt-8 md:mt-10">
          <span className="entrada flex items-center gap-3 font-sans text-[14px] font-medium uppercase tracking-[0.16em] text-white/70">
            <span className={cyan ? "h-px w-10 bg-cyan" : "h-px w-10 bg-[#8ea0ff]"} />
            {eyebrow}
          </span>{" "}
          <span className="mt-6 block font-display text-[clamp(3.2rem,17vw,10.5rem)] font-medium leading-[0.9] tracking-[-0.045em] md:mt-8 md:text-[clamp(3.9rem,13.5vw,10.5rem)]">
            {/* El desplazamiento con el scroll (Motion) y la entrada (CSS)
                van en elementos distintos: los dos usan transform, y la
                animación CSS taparía para siempre al de Motion. */}
            <m.span style={{ x: x1 }} className="block">
              <span className="subir flex items-center gap-[0.16em]">
                <Orb tamano="0.78em" tono={cyan ? "cyan" : "blue"} className="animate-float" />
                <span>{gigante[0]}</span>
              </span>
            </m.span>{" "}
            <m.span style={{ x: x2 }} className="block pl-[0.5em] md:pl-[1.7em]">
              {/* El degradado va en el mismo elemento que se anima, como en
                  el titular del inicio, para no perder el recorte del texto. */}
              <span
                className={`subir block ${cyan ? "text-gradient-cyan" : "text-gradient-blue"}`}
                style={{ ["--retraso" as string]: "0.12s" } as React.CSSProperties}
              >
                {gigante[1]}
              </span>
            </m.span>
          </span>
        </h1>

        <Reveal delay={0.1} className="mt-10 md:ml-auto md:mt-12 md:max-w-[560px]">
          <p className="text-[19px] leading-relaxed text-white/80 md:text-[21px]">{sub}</p>
        </Reveal>
      </div>
    </div>
  );
}
