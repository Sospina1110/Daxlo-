import { ArrowRight } from "lucide-react";
import { agendar, contacto, faq, nosotros } from "@/content/copy";
import { Badge, GlowButton, Orb } from "@/components/ui/primitives";
import { SectionHeading } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { Pregunta } from "./pregunta";
import { FormularioContacto } from "./formulario";
import { cn, glow } from "@/lib/utils";

// ------------------------------------------------ Quiénes somos

export function Nosotros() {
  const n = nosotros;
  return (
    // overflow-hidden: el halo de la foto se sale de su caja. Sin recortarlo, en
    // un celular la página queda más ancha que la pantalla y se desliza de lado.
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[400px_1fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-[400px]">
          <span aria-hidden className="resplandor absolute -left-12 -top-12 h-72 w-72" style={glow("41 196 245", 0.32, 1.4)} />
          <span aria-hidden className="resplandor absolute -bottom-12 -right-12 h-80 w-80" style={glow("27 53 208", 0.5, 1.4)} />
          <div className="relative overflow-hidden rounded-[28px] border border-line-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/equipo.webp"
              alt="Martín Zárate y Santiago Ospina, socios de Daxlo"
              width={800}
              height={1200}
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
          <p className="mt-4 text-center text-[15px] text-white/65">
            <span className="text-white">Martín Zárate</span> y <span className="text-white">Santiago Ospina</span>
          </p>
        </Reveal>
        <div>
          <SectionHeading badge={n.badge} titulo={n.titulo} alineacion="izquierda" />
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

export function Faq() {
  const f = faq;
  return (
    <section id="preguntas" className="relative py-24 md:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading badge={f.badge} titulo={f.titulo} alineacion="izquierda" />
          <Reveal delay={0.15} className="glass mt-8 rounded-[22px] p-6">
            <p className="font-display text-[20px] text-white">{f.ayuda}</p>
            <p className="mt-2 text-[17px] text-muted">{f.ayudaTexto}</p>
            <GlowButton href={contacto.whatsapp} className="mt-5" tamano="sm">
              {f.ayudaCta} <ArrowRight size={15} />
            </GlowButton>
          </Reveal>
        </div>
        <div className="space-y-10">
          {f.grupos.map((g) => (
            <div key={g.nombre}>
              <Reveal>
                <p className={cn("flex items-center gap-2.5 font-display text-[15px] font-medium uppercase tracking-[0.12em]", g.tono === "cyan" ? "text-cyan" : "text-[#8ea0ff]")}>
                  <span className={cn("h-2 w-2 rounded-full", g.tono === "cyan" ? "bg-cyan" : "bg-blue-bright")} />
                  {g.nombre}
                </p>
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
      </div>
    </section>
  );
}


// ------------------------------------------------ Agendar

export function Agendar() {
  const a = agendar;
  return (
    <section id="agendar" className="relative isolate overflow-hidden py-28 md:py-36">
      <span aria-hidden className="absolute -left-[20%] top-1/3 -z-10 h-[680px] w-[680px] resplandor" style={glow("41 196 245", 0.25, 1.44)} />
      <span aria-hidden className="absolute -right-[20%] top-1/4 -z-10 h-[680px] w-[680px] resplandor" style={glow("27 53 208", 0.45, 1.44)} />
      <div className="container-page">
        <div className="mx-auto max-w-[760px] text-center">
          <Reveal className="flex justify-center">
            <Orb tamano={64} className="animate-float" />
          </Reveal>
          <Reveal delay={0.05} className="mt-6">
            <Badge>{a.badge}</Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] text-white">{a.titulo}</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-[600px] text-[18px] leading-relaxed text-muted">{a.sub}</p>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="mx-auto mt-12 max-w-[720px]">
          <FormularioContacto />
        </Reveal>
      </div>
    </section>
  );
}





