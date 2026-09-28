import { ArrowRight } from "lucide-react";
import { Badge, GlowButton, IconTile } from "@/components/ui/primitives";
import { SectionHeading } from "@/components/ui/blocks";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn, glow } from "@/lib/utils";

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
          className={cn("resplandor absolute top-0 h-[760px] w-[760px]", cyan ? "-left-[22%]" : "-right-[22%]")}
          style={cyan ? glow("41 196 245", 0.14, 1.39) : glow("27 53 208", 0.35, 1.39)}
        />
        <span
          className={cn("resplandor absolute top-[38%] h-[620px] w-[620px]", cyan ? "-right-[26%]" : "-left-[26%]")}
          style={cyan ? glow("41 196 245", 0.06, 1.48) : glow("61 90 255", 0.12, 1.48)}
        />
        <span
          className={cn("resplandor absolute bottom-0 h-[680px] w-[680px]", cyan ? "-left-[24%]" : "-right-[24%]")}
          style={cyan ? glow("41 196 245", 0.1, 1.44) : glow("27 53 208", 0.3, 1.44)}
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
            <span aria-hidden className="resplandor absolute -right-20 -top-24 h-64 w-64" style={cyan ? glow("41 196 245", 0.3, 1.7) : glow("61 90 255", 0.35, 1.7)} />
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
