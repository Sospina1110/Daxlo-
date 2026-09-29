"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { Orb } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

type TonoZona = "cyan" | "blue";

// Portada de zona: ordinal, titular gigante que se desliza con el scroll y el
// orbe de vidrio. Es el momento "AI Powered" de la plantilla.
export function ZonaPortada({
  id,
  tono,
  ordinal,
  eyebrow,
  gigante,
  sub,
}: {
  id: string;
  tono: TonoZona;
  ordinal: string;
  eyebrow: string;
  gigante: readonly [string, string] | readonly string[];
  sub: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["7%", "-7%"]);
  const cyan = tono === "cyan";

  return (
    <div id={id} ref={ref} className="relative overflow-hidden pb-16 pt-24 md:pb-24 md:pt-36">
      <div className="container-page">
        <Reveal className="flex items-center gap-3 text-[14px] font-medium uppercase tracking-[0.16em]">
          <span className={cyan ? "text-cyan" : "text-[#8ea0ff]"}>{ordinal}</span>
          <span className="h-px w-10 bg-line-2" />
          <span className="text-white/65">{eyebrow}</span>
        </Reveal>

        <h2 className="mt-8 font-display text-[clamp(3.9rem,13.5vw,10.5rem)] font-medium leading-[0.9] tracking-[-0.045em]">
          <m.span style={{ x: x1 }} className="flex items-center gap-[0.16em]">
            <Orb tamano="0.78em" tono={cyan ? "cyan" : "blue"} className="animate-float" />
            <span>{gigante[0]}</span>
          </m.span>{" "}
          <m.span style={{ x: x2 }} className="block pl-[0.6em] md:pl-[1.7em]">
            <span className={cyan ? "text-gradient-cyan" : "text-gradient-blue"}>{gigante[1]}</span>
          </m.span>
        </h2>

        <Reveal delay={0.1} className="mt-12 md:ml-auto md:max-w-[560px]">
          <p className="text-[19px] leading-relaxed text-white/80 md:text-[21px]">{sub}</p>
        </Reveal>
      </div>
    </div>
  );
}
