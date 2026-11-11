import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { agendar, cierre, contacto, faq, nosotros } from "@/content/copy";
import { hayAgenda } from "@/lib/agenda";
import { GlowButton } from "@/components/ui/primitives";
import { SectionHeading } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { Pregunta } from "./pregunta";
import { FormularioContacto } from "./formulario";
import { cn, glow } from "@/lib/utils";

// ------------------------------------------------ Cómo trabajamos (/nosotros)

// Página /nosotros, que desde el 2026-11-11 es "Cómo trabajamos": el titular es
// el h1. Sin retrato ni firma (salió la parte de los socios). El h1 a la
// izquierda y los párrafos a la derecha: el primero pesa más que los otros, y
// la última línea dice quién fundó Daxlo. El rediseño fino llega con las
// páginas de apoyo.
export function Nosotros({ migas }: { migas?: React.ReactNode }) {
  const n = nosotros;
  return (
    <section className="relative pb-16 pt-28 md:pb-24 md:pt-36">
      {migas && <div className="container-page">{migas}</div>}
      <div className="container-page mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5">
          <SectionHeading titulo={n.titulo} nivel={1} />
        </div>
        {/* Los párrafos entran en ola (data-escalonar, script del layout). */}
        <div data-escalonar="0.08" className="space-y-6 lg:col-span-6 lg:col-start-7 lg:pt-2">
          {n.parrafos.map((p, i) => (
            <Reveal key={i}>
              <p className={i === 0 ? "font-display text-headline-sm font-medium text-white md:text-[1.75rem] md:leading-[1.25]" : "max-w-[62ch] text-body-md text-muted"}>{p}</p>
            </Reveal>
          ))}
          <Reveal>
            <p className="border-t border-line-2 pt-6 text-body-xs text-white/70">{n.fundador}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------ Preguntas frecuentes

// Página /preguntas. Bajo el h1, qué es Daxlo y la regla de las dos líneas
// (faq.sub). Cada grupo lleva su ancla (faq.grupos[].ancla: #elegir,
// #coaching, #consultoria) para que las páginas enlacen directo a sus
// preguntas, y va primero el que decide entre las dos líneas. El grupo
// "Coaching o consultoría" no es de ninguna línea: su título va en blanco, sin
// cian ni azul, y no lleva enlace. Los de cada línea llevan, bajo el título,
// el enlace a su página (el de "Ver todas las preguntas", al revés).
const tituloGrupo = { cyan: "text-cyan", blue: "text-blue-soft", dual: "text-white/70" } as const;
const puntoGrupo = { cyan: "bg-cyan", blue: "bg-blue-bright", dual: "bg-white/50" } as const;

export function Faq({ migas }: { migas?: React.ReactNode }) {
  const f = faq;
  return (
    <section className="relative pb-20 pt-28 md:pb-32 md:pt-36">
      {migas && <div className="container-page">{migas}</div>}
      {/* El orden del HTML es el de lectura: titular, preguntas y al final la
          ayuda por WhatsApp. En escritorio la rejilla sube la ayuda a la
          columna izquierda, bajo el titular, y la deja fija mientras se leen
          las preguntas. */}
      <div className="container-page mt-10 grid gap-12 md:mt-14 lg:grid-cols-[0.8fr_1.2fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
        <div className="lg:col-start-1 lg:row-start-1">
          <SectionHeading titulo={f.titulo} sub={f.sub} nivel={1} />
        </div>
        <div className="space-y-10 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {f.grupos.map((g) => (
            <div key={g.nombre} id={g.ancla}>
              <Reveal>
                <h2 className={cn("flex items-center gap-2.5 font-display text-[15px] font-medium uppercase tracking-[0.12em]", tituloGrupo[g.tono])}>
                  <span aria-hidden className={cn("h-2 w-2 rounded-full", puntoGrupo[g.tono])} />
                  {g.nombre}
                </h2>
                {g.enlace && (
                  <Link
                    href={g.enlace.h}
                    className={cn(
                      "group mt-1 inline-flex min-h-[44px] items-center gap-2 text-[16px] font-medium transition-colors hover:text-white",
                      g.tono === "cyan" ? "text-cyan" : "text-blue-soft",
                    )}
                  >
                    {g.enlace.t}
                    <ArrowRight size={17} aria-hidden className="transition-[translate] ease-salida motion-safe:group-hover:translate-x-1" />
                  </Link>
                )}
              </Reveal>
              {/* Las preguntas entran en ola, con un escalón más corto
                  (0,05 s): son muchas y se leen de corrido. */}
              <div data-escalonar="0.05" className="mt-4 space-y-3">
                {g.preguntas.map((q) => (
                  <Reveal key={q.p}>
                    <Pregunta pregunta={q.p} respuesta={q.r} enlace={q.enlace} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="lg:sticky lg:top-28 lg:col-start-1 lg:row-start-2 lg:self-start">
          <Reveal delay={0.15} className="glass rounded-placa p-6">
            <p className="font-display text-[20px] text-white">{f.ayuda}</p>
            <p className="mt-2 text-[17px] text-muted">{f.ayudaTexto}</p>
            <GlowButton href={contacto.whatsapp} className="mt-5" tamano="sm">
              {f.ayudaCta} <ArrowRight size={15} />
            </GlowButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}


// ------------------------------------------------ Agendar

// Página /agendar: el titular es el h1 y el formulario queda a la vista.
// Entrada por rol: el h1 a los 0 s, el sub a los 0,08 s y el formulario a los
// 0,14 s. Sin orbe ni píldora sobre el titular (DESIGN.md, qué no hacer).
export function Agendar({ migas }: { migas?: React.ReactNode }) {
  const a = agendar;
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-28 md:pb-32 md:pt-36">
      <span aria-hidden className="absolute -left-[20%] top-1/3 -z-10 h-[680px] w-[680px] resplandor" style={glow("41 196 245", 0.25, 1.44)} />
      <span aria-hidden className="absolute -right-[20%] top-1/4 -z-10 h-[680px] w-[680px] resplandor" style={glow("27 53 208", 0.45, 1.44)} />
      <div className="container-page">
        {migas}
        <div className="mx-auto mt-10 max-w-[760px] text-center md:mt-12">
          <Reveal y={16}>
            <h1 className="text-headline-page text-white">{a.titulo}</h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-[600px] text-[18px] leading-relaxed text-muted">{a.sub}</p>
          </Reveal>
        </div>
        <Reveal delay={0.14} className="mx-auto mt-10 max-w-[720px] md:mt-12">
          <FormularioContacto />
        </Reveal>
        <PasosAgendar />
      </div>
    </section>
  );
}

// Qué pasa después de enviar, debajo del formulario (que sigue arriba y a la
// vista): la línea de nodos del recorrido de /consultoria (la de sin
// JavaScript), con tres puntos. Todos los nodos iguales; en blanco tenue, como
// el grupo "Coaching o consultoría" de /preguntas, porque la página es de las
// dos líneas. En celular, lista vertical con la línea a la izquierda; desde
// 640 px, tres columnas unidas por la línea de 1 px. El paso del medio dice lo
// mismo que la nota del cierre (con agenda de Cal.com o sin ella).
function PasosAgendar() {
  const p = agendar.pasos;
  const pasos = [{ texto: p.enviar }, { texto: hayAgenda() ? cierre.meta.agenda : cierre.meta.whatsapp }, { texto: p.conversar, nota: p.duracion }];
  return (
    <Reveal delay={0.14} className="mx-auto mt-12 max-w-[720px] md:mt-14">
      <ol aria-label={p.titulo} className="pasos-agendar grid gap-6 sm:grid-cols-3">
        {pasos.map((paso, i) => (
          <li key={paso.texto} className="relative pl-10 sm:pl-0 sm:pt-8">
            {i < pasos.length - 1 && (
              <span aria-hidden className="absolute bottom-[-36px] left-[15px] top-3 w-px bg-white/25 sm:bottom-auto sm:left-3 sm:right-[-24px] sm:top-[5.5px] sm:h-px sm:w-auto" />
            )}
            <span aria-hidden className="absolute left-[9.5px] top-1.5 h-3 w-3 rounded-full border border-white/50 bg-[#08090e] sm:left-0 sm:top-0" />
            <p className="text-[17px] leading-snug text-white">{paso.texto}</p>
            {paso.nota && <p className="mt-1 text-[15px] leading-snug text-muted">{paso.nota}</p>}
          </li>
        ))}
      </ol>
    </Reveal>
  );
}





