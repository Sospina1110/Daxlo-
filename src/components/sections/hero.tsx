import { ArrowRight, ArrowUp, BarChart3, Check, ChevronDown, Globe, MessageSquare, Paperclip, Workflow } from "lucide-react";
import { hero, rutas } from "@/content/copy";
import { Badge, GlowButton, WindowDots } from "@/components/ui/primitives";
import { ToolLogo } from "@/components/ui/blocks";
import { TextoQueSeEscribe } from "@/components/ui/escritura";
import { CintaHero } from "@/components/ui/cinta-hero";
import { glow } from "@/lib/utils";

// Entrada por CSS (clase .entrada en globals.css): arranca apenas el navegador
// pinta, sin esperar a que cargue React. Es lo que evita la pantalla vacía en
// celulares lentos.
function Entrada({ children, retraso = 0, className = "" }: { children: React.ReactNode; retraso?: number; className?: string }) {
  return (
    <div className={`entrada ${className}`} style={{ ["--retraso" as string]: `${retraso}s` } as React.CSSProperties}>
      {children}
    </div>
  );
}

// En los celulares más chicos (320 px) el hero se compacta un poco para que el
// botón de agendar quede dentro de la primera pantalla.
export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pb-8 pt-28 max-[359px]:pt-24 md:pt-44">
      <FondoHero />
      <div className="container-page relative">
        <Entrada>
          <Badge>
            <span className="sm:hidden">{hero.badgeCorto}</span>
            <span className="hidden sm:inline">{hero.badge}</span>
          </Badge>
        </Entrada>

        {/* data-cinta-tope: luminancia máxima que puede tener el fondo en
            movimiento detrás de cada texto (ver src/lib/cinta). */}
        <h1 className="mt-6 text-[clamp(2.7rem,6.6vw,5rem)] leading-[1.02] tracking-[-0.03em] max-[359px]:mt-5 max-[359px]:text-[2.15rem]">
          <LineaTitular texto={hero.titulo[0]} retraso={0.1} tope="0.16" />{" "}
          <LineaTitular texto={hero.titulo[1]} retraso={0.22} clase="text-gradient-dual pb-1" tope="degradado" />
        </h1>

        <Entrada retraso={0.45}>
          <p data-cinta-tope="0.055" className="mt-5 max-w-[580px] text-[18px] leading-relaxed text-muted max-[359px]:mt-4 max-[359px]:leading-normal md:mt-7 md:text-[19px]">{hero.sub}</p>
        </Entrada>

        {/* Un solo llamado, y debajo lo único que hace falta saber antes de
            tocarlo. En celular el botón ocupa el ancho: se toca con el pulgar. */}
        <Entrada retraso={0.55} className="mt-8 flex flex-col max-[359px]:mt-6 md:mt-9 items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6">
          <GlowButton href={rutas.agendar} tamano="lg" variante="principal">
            {hero.cta}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </GlowButton>
          <p data-cinta-tope="0.04" className="flex items-center justify-center gap-2 text-[15px] text-white/60 sm:justify-start">
            <Check size={16} className="text-mint" aria-hidden />
            {hero.meta}
          </p>
        </Entrada>

        <Maqueta />
      </div>
    </section>
  );
}

// Cada línea sube desde abajo de una máscara. El degradado va en el propio
// elemento animado para que el recorte de texto no se pierda.
function LineaTitular({ texto, retraso, clase, tope }: { texto: string; retraso: number; clase?: string; tope: string }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span data-cinta-tope={tope} className={`subir block ${clase ?? ""}`} style={{ ["--retraso" as string]: `${retraso}s` } as React.CSSProperties}>
        {texto}
      </span>
    </span>
  );
}

// Rejilla tenue, la cinta de luz en movimiento (CintaHero) y los resplandores
// de esquina. La cinta reemplaza a los haces diagonales de antes: ocupa la
// misma capa, ondula sola y responde al mouse. Con WebGL, los resplandores
// los pinta el shader (para medir bien el contraste) y estos se apagan.
function FondoHero() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_20%,#000_20%,transparent_75%)]" />
      <CintaHero />
      <span data-cinta-resplandor="cian 0.35" className="resplandor absolute -bottom-[30%] -left-[18%] h-[640px] w-[640px]" style={glow("41 196 245", 0.35, 1.44)} />
      <span data-cinta-resplandor="azul 0.5" className="resplandor absolute -bottom-[34%] right-[-10%] h-[620px] w-[620px]" style={glow("27 53 208", 0.5, 1.48)} />
    </div>
  );
}

// Recuadro de chat que se escribe solo, delante de una ventana con historial.
// Es decorativo: las tareas son ejemplos del tipo de trabajo, no datos de nadie.
function Maqueta() {
  return (
    <Entrada retraso={0.7} className="relative mt-16 md:mt-24">
      <div aria-hidden className="relative mx-auto max-w-[1020px]">
        <div className="glass absolute -left-2 top-12 hidden h-[330px] w-[58%] overflow-hidden rounded-2xl bg-ink-2/70 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] md:block">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <WindowDots />
          </div>
          <ul className="space-y-1 p-4">
            {hero.historial.map((h, i) => (
              <li key={h} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px]" style={{ opacity: 1 - i * 0.16 }}>
                <MessageSquare size={15} className="text-white/45" />
                <span className="text-white/60">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative ml-auto w-full overflow-hidden rounded-2xl border border-line-2 bg-ink-2/95 shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:w-[74%]">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan to-blue-bright" />
          <div className="flex items-center gap-2 p-4 pb-0">
            <span className="inline-flex items-center gap-2 rounded-lg border border-line-2 px-3 py-1.5 text-[14px] text-white/85">
              <ToolLogo id="claude" tamano={15} />
              Claude
              <ChevronDown size={14} className="text-white/50" />
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line-2 text-white/60">
              <Globe size={15} />
            </span>
          </div>
          <div className="min-h-[104px] px-5 py-6 text-[18px] leading-snug text-white md:min-h-[96px] md:text-[21px]">
            <TextoQueSeEscribe frases={hero.tareas} />
          </div>
          <div className="flex items-center justify-between gap-3 p-4 pt-0">
            <div className="flex flex-wrap gap-2">
              <Ficha icono={<Paperclip size={14} />}>Adjuntar</Ficha>
              <Ficha icono={<Workflow size={14} />}>Automatizar</Ficha>
              <Ficha icono={<BarChart3 size={14} />} clase="max-sm:hidden">
                Analizar
              </Ficha>
            </div>
            <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-blue text-white shadow-[0_0_24px_rgba(41,196,245,0.45)]">
              <ArrowUp size={18} />
            </span>
          </div>
        </div>
      </div>
    </Entrada>
  );
}

function Ficha({ children, icono, clase = "" }: { children: React.ReactNode; icono: React.ReactNode; clase?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border border-line-2 px-3 py-1.5 text-[13px] text-white/70 ${clase}`}>
      {icono}
      {children}
    </span>
  );
}

