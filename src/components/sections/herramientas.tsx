import { Plus } from "lucide-react";
import { herramientas } from "@/content/copy";
import { toolLogos, type ToolId } from "@/lib/logos";
import { Marquee, SectionHeading, ToolLogo } from "@/components/ui/blocks";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

// Fondo de la teja de cada logo: su color de marca con 12% de opacidad.
// Los símbolos blancos de OpenAI llevan un gris neutro.
function fondoMarca(id: ToolId) {
  const c = toolLogos[id].color;
  return c === "#FFFFFF" ? "rgba(255,255,255,0.08)" : `${c}1f`;
}

// El titular a la izquierda, una fila de tejas que pasa por debajo y, abajo,
// para qué sirve cada herramienta. Sin la esfera de vidrio detrás del h1
// (DESIGN.md, qué no hacer); la marquesina y las fichas salen con el rediseño
// propio de la página.
// Con `migas`, la sección abre la página /herramientas: su titular es el h1.
export function Herramientas({ migas }: { migas?: React.ReactNode }) {
  const h = herramientas;
  const principal = Boolean(migas);
  return (
    <section
      className="relative isolate overflow-hidden pb-16 pt-28 md:pb-36 md:pt-36"
      aria-labelledby="titulo-herramientas"
    >

      <div className="container-page relative">
        {migas}
        <SectionHeading id="titulo-herramientas" titulo={h.titulo} sub={h.sub} nivel={principal ? 1 : 2} className={principal ? "mt-10 md:mt-14" : undefined} />
      </div>

      <div className="relative mt-12 md:mt-16">
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
          <h2 className="text-headline-support text-white">{h.subtituloLista}</h2>
        </Reveal>
        {/* En celular cada herramienta es una fila (logo a la izquierda, texto
            a la derecha): como tarjetas, las ocho ocupaban cuatro pantallas.
            Entran en ola con un escalón más corto (0,06 s): son nueve. */}
        <Stagger as="ul" className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4" escalon={0.06}>
          {h.lista.map((t) => (
            <StaggerItem as="li" key={t.id} className="h-full">
              {/* Las fichas no se pueden pulsar: sin hover (DESIGN.md: hover
                  solo en lo pulsable). Antes cambiaban de borde y encendían un
                  resplandor con filter: blur(50px), de lo más caro de pintar. */}
              <article className="glass relative flex h-full flex-row items-start gap-4 overflow-hidden rounded-placa p-5 sm:flex-col sm:gap-0 sm:p-6">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12" style={{ background: fondoMarca(t.id) }}>
                  <ToolLogo id={t.id} tamano={24} />
                </span>
                <span className="relative block">
                  <h3 className="text-[20px] leading-tight text-white sm:mt-5 sm:text-[21px]">{t.nombre}</h3>
                  <p className="mt-1.5 text-[16px] leading-relaxed text-muted sm:mt-2 sm:text-[17px]">{t.uso}</p>
                </span>
              </article>
            </StaggerItem>
          ))}
          <StaggerItem as="li" className="h-full">
            <article className="flex h-full flex-row items-start gap-4 rounded-placa border border-dashed border-line-2 p-5 sm:flex-col sm:gap-0 sm:p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-2 text-white/70 sm:h-12 sm:w-12">
                <Plus size={22} />
              </span>
              <span className="block">
                <h3 className="text-[20px] leading-tight text-white sm:mt-5 sm:text-[21px]">{h.otra.titulo}</h3>
                <p className="mt-1.5 text-[16px] leading-relaxed text-muted sm:mt-2 sm:text-[17px]">{h.otra.texto}</p>
              </span>
            </article>
          </StaggerItem>
        </Stagger>
        <p className="mt-8 text-[13px] text-dim">{h.aviso}</p>
      </div>
    </section>
  );
}
