import { ArrowRight } from "lucide-react";
import { agendar, contacto, faq, nosotros } from "@/content/copy";
import { Badge, GlowButton, Orb } from "@/components/ui/primitives";
import { SectionHeading } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { Pregunta } from "./pregunta";
import { FormularioContacto } from "./formulario";
import { cn, glow } from "@/lib/utils";

// ------------------------------------------------ Quiénes somos

// Página /nosotros: el titular es el h1 y la foto carga de una vez, porque se
// ve apenas abre la página.
export function Nosotros({ migas }: { migas?: React.ReactNode }) {
  const n = nosotros;
  return (
    // overflow-hidden: el halo de la foto se sale de su caja. Sin recortarlo, en
    // un celular la página queda más ancha que la pantalla y se desliza de lado.
    <section className="relative overflow-hidden pb-20 pt-28 md:pb-32 md:pt-36">
      {migas && <div className="container-page">{migas}</div>}
      <div className="container-page mt-10 grid items-center gap-10 md:mt-14 lg:grid-cols-[400px_1fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-[400px] max-lg:order-2">
          <span aria-hidden className="resplandor absolute -left-12 -top-12 h-72 w-72" style={glow("41 196 245", 0.32, 1.4)} />
          <span aria-hidden className="resplandor absolute -bottom-12 -right-12 h-80 w-80" style={glow("27 53 208", 0.5, 1.4)} />
          <div className="relative overflow-hidden rounded-[28px] border border-line-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/equipo.webp"
              alt="Martín Zárate y Santiago Ospina, socios de Daxlo"
              width={800}
              height={1200}
              fetchPriority="high"
              className="aspect-[4/5] h-auto w-full object-cover object-[50%_30%] lg:aspect-[2/3]"
            />
          </div>
          <p className="mt-4 text-center text-[15px] text-white/65">
            <span className="text-white">Martín Zárate</span> y <span className="text-white">Santiago Ospina</span>
          </p>
        </Reveal>
        <div>
          <SectionHeading badge={n.badge} titulo={n.titulo} alineacion="izquierda" nivel={1} />
          <div className="mt-7 space-y-5">
            {n.parrafos.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="text-[18px] leading-relaxed text-muted">{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="text-gradient-dual mt-8 font-display text-[26px] font-medium leading-snug">{n.firma}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------ Preguntas frecuentes

// Página /preguntas. Cada grupo lleva su ancla (#coaching, #consultoria) para
// que las páginas de cada línea enlacen directo a sus preguntas.
export function Faq({ migas }: { migas?: React.ReactNode }) {
  const f = faq;
  const anclas = ["coaching", "consultoria"];
  return (
    <section className="relative pb-20 pt-28 md:pb-32 md:pt-36">
      {migas && <div className="container-page">{migas}</div>}
      {/* El orden del HTML es el de lectura: titular, preguntas y al final la
          ayuda por WhatsApp. En escritorio la rejilla sube la ayuda a la
          columna izquierda, bajo el titular, y la deja fija mientras se leen
          las preguntas. */}
      <div className="container-page mt-10 grid gap-12 md:mt-14 lg:grid-cols-[0.8fr_1.2fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
        <div className="lg:col-start-1 lg:row-start-1">
          <SectionHeading badge={f.badge} titulo={f.titulo} alineacion="izquierda" nivel={1} />
        </div>
        <div className="space-y-10 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {f.grupos.map((g, gi) => (
            <div key={g.nombre} id={anclas[gi]}>
              <Reveal>
                <h2 className={cn("flex items-center gap-2.5 font-display text-[15px] font-medium uppercase tracking-[0.12em]", g.tono === "cyan" ? "text-cyan" : "text-[#8ea0ff]")}>
                  <span aria-hidden className={cn("h-2 w-2 rounded-full", g.tono === "cyan" ? "bg-cyan" : "bg-blue-bright")} />
                  {g.nombre}
                </h2>
              </Reveal>
              <div className="mt-4 space-y-3">
                {g.preguntas.map((q, i) => (
                  <Reveal key={q.p} delay={0.04 * i}>
                    <Pregunta pregunta={q.p} respuesta={q.r} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="lg:sticky lg:top-28 lg:col-start-1 lg:row-start-2 lg:self-start">
          <Reveal delay={0.15} className="glass rounded-[22px] p-6">
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
export function Agendar({ migas }: { migas?: React.ReactNode }) {
  const a = agendar;
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-28 md:pb-32 md:pt-36">
      <span aria-hidden className="absolute -left-[20%] top-1/3 -z-10 h-[680px] w-[680px] resplandor" style={glow("41 196 245", 0.25, 1.44)} />
      <span aria-hidden className="absolute -right-[20%] top-1/4 -z-10 h-[680px] w-[680px] resplandor" style={glow("27 53 208", 0.45, 1.44)} />
      <div className="container-page">
        {migas}
        <div className="mx-auto mt-10 max-w-[760px] text-center md:mt-12">
          <Reveal className="flex justify-center">
            <Orb tamano={64} className="animate-float" />
          </Reveal>
          <Reveal delay={0.05} className="mt-6">
            <Badge>{a.badge}</Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] text-white">{a.titulo}</h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-[600px] text-[18px] leading-relaxed text-muted">{a.sub}</p>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="mx-auto mt-10 max-w-[720px] md:mt-12">
          <FormularioContacto />
        </Reveal>
      </div>
    </section>
  );
}





