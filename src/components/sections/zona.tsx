"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Badge, GlowButton, IconTile, Orb } from "@/components/ui/primitives";
import { SectionHeading } from "@/components/ui/blocks";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type TonoZona = "cyan" | "blue";

// Cada línea de servicio vive en su propio territorio: coaching con aire cian
// sobre el casi negro, consultoría más oscura y con resplandor azul. Sobre un
// sitio oscuro, el cambio de ambiente es lo que marca la frontera.
export function Zona({ tono, children }: { tono: TonoZona; children: React.ReactNode }) {
  const cyan = tono === "cyan";
  return (
    <div className={cn("relative isolate", !cyan && "bg-[#08090e]")}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span
          className={cn(
            "absolute h-[760px] w-[760px] rounded-full blur-[150px]",
            cyan ? "-left-[22%] top-0 bg-cyan/[0.14]" : "-right-[22%] top-0 bg-blue/[0.35]",
          )}
        />
        <span
          className={cn(
            "absolute top-[38%] h-[620px] w-[620px] rounded-full blur-[150px]",
            cyan ? "-right-[26%] bg-cyan/[0.06]" : "-left-[26%] bg-blue-bright/[0.12]",
          )}
        />
        <span
          className={cn(
            "absolute bottom-0 h-[680px] w-[680px] rounded-full blur-[150px]",
            cyan ? "-left-[24%] bg-cyan/[0.1]" : "-right-[24%] bg-blue/[0.3]",
          )}
        />
      </div>
      <div
        aria-hidden
        className={cn("h-px w-full bg-gradient-to-r from-transparent to-transparent", cyan ? "via-cyan/60" : "via-blue-bright/70")}
      />
      {children}
    </div>
  );
}

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
    <div id={id} ref={ref} className="relative overflow-hidden pb-16 pt-24 md:pb-24 md:pt-36" style={{ scrollMarginTop: 80 }}>
      <div className="container-page">
        <Reveal className="flex items-center gap-3 text-[14px] font-medium uppercase tracking-[0.16em]">
          <span className={cyan ? "text-cyan" : "text-[#8ea0ff]"}>{ordinal}</span>
          <span className="h-px w-10 bg-line-2" />
          <span className="text-white/65">{eyebrow}</span>
        </Reveal>

        <h2 className="mt-8 font-display text-[clamp(3.9rem,13.5vw,10.5rem)] font-medium leading-[0.9] tracking-[-0.045em]">
          <motion.span style={{ x: x1 }} className="flex items-center gap-[0.16em]">
            <Orb tamano="0.78em" tono={cyan ? "cyan" : "blue"} className="animate-float" />
            <span>{gigante[0]}</span>
          </motion.span>{" "}
          <motion.span style={{ x: x2 }} className="block pl-[0.6em] md:pl-[1.7em]">
            <span className={cyan ? "text-gradient-cyan" : "text-gradient-blue"}>{gigante[1]}</span>
          </motion.span>
        </h2>

        <Reveal delay={0.1} className="mt-12 md:ml-auto md:max-w-[560px]">
          <p className="text-[19px] leading-relaxed text-white/80 md:text-[21px]">{sub}</p>
        </Reveal>
      </div>
    </div>
  );
}

// Tres tarjetas de problema, compartidas por las dos zonas.
export function TarjetasProblema({
  titulo,
  sub,
  tarjetas,
  iconos,
  tono,
}: {
  titulo: string;
  sub: string;
  tarjetas: readonly { titulo: string; texto: string }[];
  iconos: React.ReactNode[];
  tono: TonoZona;
}) {
  return (
    <section className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading titulo={titulo} sub={sub} tono={tono} alineacion="izquierda" />
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3" escalon={0.12}>
          {tarjetas.map((t, i) => (
            <StaggerItem key={t.titulo} className="h-full">
              <article className="glass flex h-full flex-col rounded-[22px] p-7">
                <IconTile tono={tono}>{iconos[i]}</IconTile>
                <h3 className="mt-6 text-[22px] leading-snug text-white">{t.titulo}</h3>
                <p className="mt-3 text-[18px] leading-relaxed text-muted">{t.texto}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

// Bloque de calificación: la pregunta que filtra antes de la llamada.
export function TarjetaCalifica({
  titulo,
  sub,
  pregunta,
  respuesta,
  cta,
  tono,
}: {
  titulo: string;
  sub: string;
  pregunta: string;
  respuesta: readonly string[];
  cta: string;
  tono: TonoZona;
}) {
  const cyan = tono === "cyan";
  return (
    <section className="relative py-20 md:py-28">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading titulo={titulo} sub={sub} tono={tono} alineacion="izquierda" />
        <Reveal delay={0.1}>
          <div
            className={cn(
              "relative overflow-hidden rounded-[26px] border p-8 md:p-10",
              cyan ? "border-cyan/30 bg-gradient-to-br from-cyan-deep/40 via-ink-2 to-ink-2" : "border-blue-bright/35 bg-gradient-to-br from-blue/45 via-ink-2 to-ink-2",
            )}
          >
            <span aria-hidden className={cn("absolute -right-20 -top-24 h-64 w-64 rounded-full blur-[90px]", cyan ? "bg-cyan/30" : "bg-blue-bright/35")} />
            <Badge tono={tono} className="relative">
              La pregunta
            </Badge>
            <p className="relative mt-6 font-display text-[clamp(1.4rem,2.4vw,1.85rem)] font-medium leading-snug text-white">{pregunta}</p>
            <div className="relative mt-6 space-y-3 border-t border-white/10 pt-6">
              {respuesta.map((r) => (
                <p key={r} className="text-[18px] leading-relaxed text-white/80">
                  {r}
                </p>
              ))}
            </div>
            <div className="relative mt-8">
              <GlowButton href="#agendar" tono={tono}>
                {cta} <ArrowRight size={16} />
              </GlowButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
