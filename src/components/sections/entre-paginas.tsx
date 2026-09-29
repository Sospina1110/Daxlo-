import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { agendarCon, cierre, faq, inicioNosotros, nosotros, otraLinea, preguntasLinea, rutas } from "@/content/copy";
import { Badge, GlowButton, Orb } from "@/components/ui/primitives";
import { SectionHeading } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { Pregunta } from "./pregunta";
import { cn, glow } from "@/lib/utils";

type Linea = "coaching" | "consultoria";

// Bloques que conectan las páginas: el cierre con la invitación a agendar, el
// puente hacia la otra línea de servicio, las preguntas de cada línea y el
// resumen de quiénes somos del inicio.

// ------------------------------------------------ Cierre de cada página

export function CtaFinal({ linea }: { linea?: Linea }) {
  const tono = linea === "coaching" ? "cyan" : linea === "consultoria" ? "blue" : "dual";
  return (
    <section aria-labelledby="titulo-cierre" className="relative isolate overflow-hidden py-20 md:py-32">
      <span aria-hidden className="resplandor absolute -left-[30%] top-1/4 -z-10 h-[560px] w-[560px]" style={glow("41 196 245", 0.22, 1.44)} />
      <span aria-hidden className="resplandor absolute -right-[30%] top-0 -z-10 h-[560px] w-[560px]" style={glow("27 53 208", 0.4, 1.44)} />
      <div className="container-page">
        <div className="mx-auto max-w-[720px] text-center">
          <Reveal className="flex justify-center">
            <Orb tamano={56} tono={tono} className="animate-float" />
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="titulo-cierre" className="mt-7 text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-white">
              {cierre.titulo}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-[560px] text-[18px] leading-relaxed text-muted">{cierre.sub}</p>
          </Reveal>
          <Reveal delay={0.18} className="mt-9 flex justify-center">
            <GlowButton href={linea ? agendarCon(linea) : rutas.agendar} tono={tono} tamano="lg" className="w-full max-w-[360px] sm:w-auto">
              {cierre.cta}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </GlowButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------ Puente a la otra línea

export function OtraLinea({ hacia }: { hacia: Linea }) {
  const o = otraLinea[hacia];
  const cyan = hacia === "coaching";
  return (
    <section className="relative py-10 md:py-16">
      <div className="container-page">
        <Reveal>
          <Link
            href={rutas[hacia]}
            className={cn(
              "group glass relative flex flex-col gap-6 overflow-hidden rounded-[26px] p-7 transition-colors duration-300 md:flex-row md:items-center md:justify-between md:gap-10 md:p-10",
              cyan ? "hover:border-cyan/40" : "hover:border-blue-bright/45",
            )}
          >
            <span
              aria-hidden
              className="resplandor absolute -right-16 -top-20 h-60 w-60"
              style={cyan ? glow("41 196 245", 0.22, 1.6) : glow("61 90 255", 0.3, 1.6)}
            />
            <span className="relative block">
              <Badge tono={cyan ? "cyan" : "blue"}>{o.etiqueta}</Badge>
              <span className="mt-4 block font-display text-[26px] font-medium leading-tight text-white md:text-[32px]">{o.titulo}</span>
              <span className="mt-3 block max-w-[560px] text-[18px] leading-relaxed text-muted">{o.texto}</span>
            </span>
            <span className={cn("relative block text-[16px] font-medium md:shrink-0", cyan ? "text-cyan" : "text-[#8ea0ff]")}>
              {o.enlace}
              <ArrowRight size={17} className="ml-2 inline-block align-[-3px] transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------ Preguntas de una línea

export function PreguntasLinea({ linea }: { linea: Linea }) {
  const cfg = preguntasLinea[linea];
  const grupo = faq.grupos[cfg.grupo];
  const cyan = linea === "coaching";
  return (
    <section aria-labelledby={`preguntas-${linea}`} className="relative py-14 md:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id={`preguntas-${linea}`} titulo={cfg.titulo} tono={cyan ? "cyan" : "blue"} alineacion="izquierda" />
          <Reveal delay={0.12}>
            <Link
              href={`${rutas.preguntas}#${linea}`}
              className={cn("mt-6 inline-flex items-center gap-2 text-[16px] font-medium", cyan ? "text-cyan" : "text-[#8ea0ff]")}
            >
              {preguntasLinea.todas}
              <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>
        <div className="space-y-3">
          {grupo.preguntas.map((q, i) => (
            <Reveal key={q.p} delay={0.04 * i}>
              <Pregunta pregunta={q.p} respuesta={q.r} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------ Quiénes somos, en corto

export function NosotrosResumen() {
  const n = nosotros;
  return (
    <section aria-labelledby="titulo-nosotros" className="relative overflow-hidden py-14 md:py-28">
      <div className="container-page grid items-center gap-10 md:grid-cols-[300px_1fr] md:gap-14 lg:grid-cols-[340px_1fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-[340px]">
          <span aria-hidden className="resplandor absolute -bottom-10 -right-10 h-64 w-64" style={glow("27 53 208", 0.45, 1.4)} />
          <div className="relative overflow-hidden rounded-[24px] border border-line-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/equipo.webp"
              alt="Martín Zárate y Santiago Ospina, socios de Daxlo"
              width={800}
              height={1200}
              loading="lazy"
              className="aspect-[4/3] h-auto w-full object-cover object-[50%_28%] md:aspect-[2/3]"
            />
          </div>
        </Reveal>
        <div>
          <SectionHeading id="titulo-nosotros" badge={n.badge} titulo={n.titulo} alineacion="izquierda" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-[18px] leading-relaxed text-muted">{n.parrafos[2]}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-gradient-dual mt-6 font-display text-[22px] font-medium leading-snug md:text-[24px]">{n.firma}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link href={rutas.nosotros} className="mt-7 inline-flex items-center gap-2 text-[16px] font-medium text-cyan">
              {inicioNosotros.enlace}
              <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
