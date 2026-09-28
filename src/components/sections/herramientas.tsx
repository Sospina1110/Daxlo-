import { Plus } from "lucide-react";
import { herramientas } from "@/content/copy";
import { toolLogos, type ToolId } from "@/lib/logos";
import { Orb } from "@/components/ui/primitives";
import { Marquee, SectionHeading, ToolLogo } from "@/components/ui/blocks";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

// Fondo de la teja de cada logo: su color de marca con 12% de opacidad.
// Los símbolos blancos de OpenAI llevan un gris neutro.
function fondoMarca(id: ToolId) {
  const c = toolLogos[id].color;
  return c === "#FFFFFF" ? "rgba(255,255,255,0.08)" : `${c}1f`;
}

// Las integraciones de la plantilla: orbe detrás del titular y una fila de
// tejas que pasa por debajo. Abajo, qué hacemos con cada herramienta.
export function Herramientas() {
  const h = herramientas;
  return (
    <section id="herramientas" className="relative isolate overflow-hidden py-28 md:py-36" aria-labelledby="titulo-herramientas">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-16 -z-10 -translate-x-1/2 md:top-6">
        <Orb tamano="min(560px, 96vw)" tono="dual" className="animate-float opacity-90" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-ink via-transparent to-ink" />

      <div className="container-page relative">
        <SectionHeading id="titulo-herramientas" badge={h.badge} titulo={h.titulo} sub={h.sub} />
      </div>

      <div className="relative mt-16 md:mt-24">
        <Marquee duracion={44} espacio={16}>
          {h.lista.map((t) => (
            <span
              key={t.id}
              className="flex items-center gap-3 rounded-2xl border border-line-2 bg-ink-2/95 py-3.5 pl-3.5 pr-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: fondoMarca(t.id) }}>
                <ToolLogo id={t.id} tamano={24} />
              </span>
              <span className="whitespace-nowrap font-display text-[18px] text-white">{t.nombre}</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-page mt-20 md:mt-24">
        <Reveal>
          <h3 className="text-[26px] text-white md:text-[30px]">{h.subtituloLista}</h3>
        </Reveal>
        <Stagger as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" escalon={0.06}>
          {h.lista.map((t) => (
            <StaggerItem as="li" key={t.id} className="h-full">
              <article
                className="glass group relative flex h-full flex-col overflow-hidden rounded-[20px] p-6 transition-colors duration-300 hover:border-line-2"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-[50px] transition-opacity duration-500 group-hover:opacity-70"
                  style={{ background: toolLogos[t.id].color }}
                />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: fondoMarca(t.id) }}>
                  <ToolLogo id={t.id} tamano={26} />
                </span>
                <h4 className="relative mt-5 text-[21px] text-white">{t.nombre}</h4>
                <p className="relative mt-2 text-[17px] leading-relaxed text-muted">{t.uso}</p>
              </article>
            </StaggerItem>
          ))}
          <StaggerItem as="li" className="h-full">
            <article className="flex h-full flex-col rounded-[20px] border border-dashed border-line-2 p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line-2 text-white/70">
                <Plus size={22} />
              </span>
              <h4 className="mt-5 text-[21px] text-white">{h.otra.titulo}</h4>
              <p className="mt-2 text-[17px] leading-relaxed text-muted">{h.otra.texto}</p>
            </article>
          </StaggerItem>
        </Stagger>
        <p className="mt-8 text-[13px] text-dim">{h.aviso}</p>
      </div>
    </section>
  );
}
