import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { agendarCon, cierre, contacto, faq, inicioNosotros, nosotros, otraLinea, preguntasLinea, rutas } from "@/content/copy";
import { Iman } from "@/components/ui/iman";
import { Badge, GlowButton, Orb } from "@/components/ui/primitives";
import { LineaCapitulo, SectionHeading } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { Pregunta } from "./pregunta";
import { hayAgenda } from "@/lib/agenda";
import { cn, glow, sinCorte } from "@/lib/utils";

type Linea = "coaching" | "consultoria";

// Bloques que conectan las páginas: el cierre con la invitación a agendar, el
// puente hacia la otra línea de servicio (/nosotros), las preguntas de cada
// línea y el resumen de quiénes somos del inicio.

// ------------------------------------------------ Cierre de cada página

// Debajo del botón, una línea con lo que pasa al tocarlo (con agenda de
// Cal.com: eliges el día y la hora; sin ella, te escribimos por WhatsApp) y,
// con `whatsapp`, un enlace de texto a WhatsApp para quien prefiere escribir.
// Solo lo piden el inicio, /coaching y /consultoria: /preguntas ya tiene su
// botón de WhatsApp en la ayuda, y /herramientas y /nosotros se quedan como
// estaban. Es un enlace, no un botón flotante, y se ve como enlace: subrayado
// tenue siempre (blanco al 30 %), que se enciende al pasar. Sin subrayado se
// leía como una nota más. Es el único bloque centrado de cada página y el
// único resplandor de su segunda mitad. Los resplandores van en una capa con
// máscara que se apaga hacia abajo: antes se cortaban en seco contra el pie.
//
// Entrada por rol: el orbe (adorno) solo funde y el titular entran a los 0 s,
// el sub a los 0,08 s y el botón con su nota juntos a los 0,14 s. Antes era
// una cola de 0 / 0,06 / 0,12 / 0,18 / 0,2 s. El botón es magnético (Iman).
export function CtaFinal({ linea, whatsapp = false }: { linea?: Linea; whatsapp?: boolean }) {
  const tono = linea === "coaching" ? "cyan" : linea === "consultoria" ? "blue" : "dual";
  return (
    <section aria-labelledby="titulo-cierre" className="relative isolate overflow-hidden py-20 md:py-32">
      <LineaCapitulo tono={tono} />
      <div aria-hidden className="mask-b pointer-events-none absolute inset-0 -z-10">
        <span className="resplandor animate-deriva absolute -left-[30%] top-[12%] h-[560px] w-[560px]" style={glow("41 196 245", 0.22, 1.44)} />
        <span className="resplandor animate-deriva absolute -right-[30%] top-0 h-[560px] w-[560px] [animation-delay:-8s]" style={glow("27 53 208", 0.4, 1.44)} />
      </div>
      <div className="container-page">
        <div className="mx-auto max-w-[720px] text-center">
          <Reveal y={0} className="flex justify-center">
            <Orb tamano={56} tono={tono} className="animate-float" />
          </Reveal>
          <Reveal y={16}>
            <h2 id="titulo-cierre" className="mt-7 text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-white">
              {cierre.titulo}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-[560px] text-[18px] leading-relaxed text-muted">{cierre.sub}</p>
          </Reveal>
          <Reveal delay={0.14} className="mt-9 flex justify-center">
            <Iman className="w-full max-w-[360px] sm:w-auto">
              <GlowButton href={linea ? agendarCon(linea) : rutas.agendar} tono={tono} tamano="lg" elevar={false}>
                {cierre.cta}
                <ArrowRight size={18} className="transition-[translate] ease-salida motion-safe:group-hover:translate-x-0.5" />
              </GlowButton>
            </Iman>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 flex items-center justify-center gap-2 text-[15px] text-white/70">
              <Check size={16} aria-hidden className="shrink-0 text-mint" />
              {hayAgenda() ? cierre.meta.agenda : cierre.meta.whatsapp}
            </p>
            {whatsapp && (
              <a
                href={contacto.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex min-h-[44px] items-center text-[15px] text-white/75 underline decoration-white/30 underline-offset-[5px] transition-colors hover:text-white hover:decoration-white"
              >
                {cierre.whatsapp}
              </a>
            )}
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
          {/* Tarjeta-enlace (.tarjeta-pulsable, globals.css): el borde toma el
              tono en 200 ms y al presionar baja a 0.99. */}
          <Link
            href={rutas[hacia]}
            className={cn(
              "group glass tarjeta-pulsable relative flex flex-col gap-6 overflow-hidden rounded-[28px] p-7 md:flex-row md:items-center md:justify-between md:gap-10 md:p-10",
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
              <span className="mt-3 block max-w-[560px] text-[18px] leading-relaxed text-muted">{sinCorte(o.texto)}</span>
            </span>
            <span className={cn("relative block text-[16px] font-medium md:shrink-0", cyan ? "text-cyan" : "text-blue-soft")}>
              {o.enlace}
              <ArrowRight size={17} className="ml-2 inline-block align-[-3px] transition-[translate] ease-salida motion-safe:group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------ Preguntas de una línea

// Las dudas de cada línea. Desde 1024 px, cabecera a la izquierda (fija
// mientras se leen las preguntas) y las preguntas a la derecha en filas
// abiertas; en celular, una debajo de la otra. Es sección de apoyo: h2 en la
// escala menor. Las respuestas están en el HTML del servidor pero cerradas:
// guardan el texto para buscadores sin alargar la lectura.
export function PreguntasLinea({ linea }: { linea: Linea }) {
  const cfg = preguntasLinea[linea];
  const grupo = faq.grupos[cfg.grupo];
  const cyan = linea === "coaching";
  return (
    <section aria-labelledby={`preguntas-${linea}`} className="relative py-14 md:py-24">
      <LineaCapitulo tono={cyan ? "cyan" : "blue"} />
      <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id={`preguntas-${linea}`} titulo={cfg.titulo} tono={cyan ? "cyan" : "blue"} alineacion="izquierda" escala="apoyo" />
          <Reveal delay={0.08}>
            <Link
              href={`${rutas.preguntas}#${linea}`}
              className={cn(
                "group mt-3 inline-flex min-h-[44px] items-center gap-2 text-[16px] font-medium transition-colors hover:text-white",
                cyan ? "text-cyan" : "text-blue-soft",
              )}
            >
              {preguntasLinea.todas}
              <ArrowRight size={17} aria-hidden className="transition-[translate] ease-salida motion-safe:group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <Reveal delay={0.06} className="border-t border-line lg:mt-2">
          {grupo.preguntas.map((q) => (
            <Pregunta key={q.p} pregunta={q.p} respuesta={q.r} enlace={q.enlace} variante="fila" />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------ Quiénes somos, en corto

// Las caras y la firma conjunta, en lugar de las cifras y los logos que Daxlo
// no puede publicar. Sin resplandor propio: en el inicio solo brillan el hero
// y el cierre. En celular el retrato va a la izquierda, como el texto que lo
// sigue, y no pasa de 200 px de alto: centrado y más grande ocupaba la
// pantalla entera antes del titular.
export function NosotrosResumen() {
  const n = nosotros;
  return (
    <section aria-labelledby="titulo-nosotros" className="relative py-16 md:py-24">
      <LineaCapitulo />
      <div className="container-page grid items-center gap-8 md:grid-cols-[240px_1fr] md:gap-14 lg:gap-20">
        {/* La foto es adorno: solo funde. */}
        <Reveal y={0} className="w-full max-w-[150px] md:max-w-none">
          <div className="overflow-hidden rounded-[24px] border border-line-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/equipo.webp"
              alt="Martín Zárate y Santiago Ospina, socios de Daxlo"
              width={800}
              height={1200}
              loading="lazy"
              className="aspect-[3/4] h-auto w-full object-cover object-[50%_28%]"
            />
          </div>
        </Reveal>
        <div>
          <SectionHeading id="titulo-nosotros" titulo={n.titulo} alineacion="izquierda" />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[620px] text-[18px] leading-relaxed text-muted">{inicioNosotros.linea}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-[620px] border-t border-line-2 pt-5 font-display text-[22px] font-medium leading-snug text-white">{n.firma}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link href={rutas.nosotros} className="group mt-4 inline-flex min-h-[44px] items-center gap-2 text-[16px] font-medium text-cyan transition-colors hover:text-white">
              {inicioNosotros.enlace}
              <ArrowRight size={17} aria-hidden className="transition-[translate] ease-salida motion-safe:group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
