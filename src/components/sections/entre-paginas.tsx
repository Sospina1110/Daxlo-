import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { agendar, agendarCon, cierre, contacto, faq, otraLinea, preguntasLinea, rutas } from "@/content/copy";
import { Iman } from "@/components/ui/iman";
import { Badge, GlowButton } from "@/components/ui/primitives";
import { LineaCapitulo, SectionHeading } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { Pregunta } from "./pregunta";
import { hayAgenda } from "@/lib/agenda";
import { cn, glow, sinCorte } from "@/lib/utils";

type Linea = "coaching" | "consultoria";

// Bloques que conectan las páginas: el cierre con la invitación a agendar, el
// puente hacia la otra línea de servicio (/nosotros) y las preguntas de cada
// línea.

// ------------------------------------------------ Cierre de cada página

// El cierre es donde termina el hilo de luz: un campo azul a todo el ancho
// (nivel 4 de superficie, DESIGN.md), el momento con más presencia de la
// página y no el más flojo. Todo a la izquierda: el titular en blanco, el sub
// en blanco al 86 % (6,6:1 sobre el azul) y el botón en menta con texto casi
// negro: sobre azul, el botón principal se invierte. A la derecha, en
// vertical, lo que pasa después de tocarlo (los tres nodos de /agendar). Con
// `whatsapp`, bajo el botón va un enlace de texto a WhatsApp para quien
// prefiere escribir: solo lo piden el inicio, /coaching y /consultoria
// (/preguntas ya tiene el suyo en la ayuda). Es un enlace, nunca un botón
// flotante. Sin orbe y sin resplandores sueltos.
//
// Movimiento (encendido.css, .cierre): el cierre amanece. El campo azul sube
// con el frente curvo, como un domo de luz con su filo cian, atado al scroll:
// mientras la sección entra, el domo pasa de asomar a cubrirla entera y el
// contenido funde cuando el campo ya lo sostiene. Sin soporte de
// animation-timeline el campo crece desde arriba (scaleY, 700 ms) y el
// contenido funde una vez (la marca [data-visible] la pone el script del
// layout, como en cualquier [data-revelar]); sin
// JavaScript o con «reducir movimiento» está completo y plano, que es el
// valor por defecto del CSS. El botón es magnético (Iman). data-hilo-fin: ahí
// muere el hilo.
export function CtaFinal({ linea, whatsapp = false }: { linea?: Linea; whatsapp?: boolean }) {
  const pasos = [agendar.pasos.enviar, hayAgenda() ? cierre.meta.agenda : cierre.meta.whatsapp, agendar.pasos.conversar];
  return (
    <section aria-labelledby="titulo-cierre" data-revelar="" className="cierre relative isolate overflow-hidden">
      <div aria-hidden className="cierre-campo absolute inset-0 -z-10">
        <span className="cierre-domo" />
        <span className="cierre-realce" />
      </div>
      <div className="cierre-contenido container-page grid gap-x-6 gap-y-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 id="titulo-cierre" className="max-w-[13em] text-headline-lg text-white">
            {cierre.titulo}
          </h2>
          <p className="mt-5 max-w-[40ch] text-body-lg text-white/[0.86]">{cierre.sub}</p>
          <div data-hilo-fin="" className="mt-9 flex flex-col items-stretch gap-x-7 gap-y-2 sm:flex-row sm:items-center">
            <Iman className="sm:w-auto">
              <GlowButton href={linea ? agendarCon(linea) : rutas.agendar} variante="papel" elevar={false}>
                {cierre.cta}
                <ArrowRight size={18} className="transition-[translate] ease-salida motion-safe:group-hover:translate-x-0.5" />
              </GlowButton>
            </Iman>
            {whatsapp && (
              <a
                href={contacto.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center text-body-xs text-white underline decoration-white/45 underline-offset-[5px] transition-colors hover:decoration-white sm:justify-start"
              >
                {cierre.whatsapp}
              </a>
            )}
          </div>
        </div>
        {/* Lo que pasa después, en vertical sobre una línea. */}
        <ol aria-label={agendar.pasos.titulo} className="cierre-pasos lg:col-span-4 lg:col-start-9">
          {pasos.map((p, i) => (
            <li key={p} className="relative flex items-start gap-4 pb-6 last:pb-0">
              {i < pasos.length - 1 && <span aria-hidden className="absolute bottom-0 left-[5.5px] top-4 w-px bg-white/35" />}
              <span aria-hidden className="relative mt-[6px] h-3 w-3 shrink-0 rounded-full border border-white bg-ink" />
              <span className="text-body-sm leading-snug text-white">{p}</span>
            </li>
          ))}
        </ol>
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
              "group glass tarjeta-pulsable relative flex flex-col gap-6 overflow-hidden rounded-placa p-7 md:flex-row md:items-center md:justify-between md:gap-10 md:p-10",
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
