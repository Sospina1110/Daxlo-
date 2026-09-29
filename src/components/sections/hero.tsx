import { ArrowRight, ArrowUp, BarChart3, Check, ChevronDown, Globe, MessageSquare, Paperclip, Workflow } from "lucide-react";
import { hero, rutas } from "@/content/copy";
import { Badge, GlowButton, WindowDots } from "@/components/ui/primitives";
import { ToolLogo } from "@/components/ui/blocks";
import { TextoQueSeEscribe } from "@/components/ui/escritura";
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

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pb-8 pt-32 md:pt-44">
      <FondoHero />
      <div className="container-page relative">
        <Entrada>
          <Badge>
            <span className="sm:hidden">{hero.badgeCorto}</span>
            <span className="hidden sm:inline">{hero.badge}</span>
          </Badge>
        </Entrada>

        <h1 className="mt-7 text-[clamp(2.7rem,6.6vw,5rem)] max-[359px]:text-[2.3rem] leading-[1.02] tracking-[-0.03em]">
          <LineaTitular texto={hero.titulo[0]} retraso={0.1} />{" "}
          <LineaTitular texto={hero.titulo[1]} retraso={0.22} clase="text-gradient-dual pb-1" />
        </h1>

        <Entrada retraso={0.45}>
          <p className="mt-7 max-w-[580px] text-[18px] leading-relaxed text-muted md:text-[19px]">{hero.sub}</p>
        </Entrada>

        {/* Un solo llamado, y debajo lo único que hace falta saber antes de
            tocarlo. En celular el botón ocupa el ancho: se toca con el pulgar. */}
        <Entrada retraso={0.55} className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6">
          <GlowButton href={rutas.agendar} tamano="lg">
            {hero.cta}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </GlowButton>
          <p className="flex items-center justify-center gap-2 text-[15px] text-white/60 sm:justify-start">
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
function LineaTitular({ texto, retraso, clase }: { texto: string; retraso: number; clase?: string }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span className={`subir block ${clase ?? ""}`} style={{ ["--retraso" as string]: `${retraso}s` } as React.CSSProperties}>
        {texto}
      </span>
    </span>
  );
}

// Haces de luz diagonales, resplandores de esquina y rejilla tenue. Todo en
// código: la plantilla usa un render 3D que no se puede reutilizar.
//
// Sin filtros de desenfoque: cada haz es un degradado a lo largo con una
// máscara suave a lo ancho. Se ve igual, y un celular no tiene que calcular
// desenfoques gaussianos (en Chrome, los filtros SVG corren en el procesador).
function FondoHero() {
  // Misma geometría que el SVG original (viewBox 900, preserveAspectRatio
  // xMaxYMin slice, rotado -38° sobre el centro): un cuadrado del lado mayor
  // del contenedor, pegado arriba a la derecha. Posiciones en % de ese lado.
  const haces = [
    { y: 300, h: 16, o: 0.95 },
    { y: 352, h: 7, o: 0.7 },
    { y: 392, h: 24, o: 0.85 },
    { y: 452, h: 5, o: 0.55 },
    { y: 488, h: 12, o: 0.75 },
    { y: 560, h: 30, o: 0.5 },
  ];
  const pct = (v: number) => `${((v / 900) * 100).toFixed(3)}%`;
  const degradado = "linear-gradient(90deg, rgba(41,196,245,0) 0%, rgba(61,90,255,0.95) 45%, rgba(41,196,245,0.9) 80%, rgba(41,196,245,0) 100%)";
  const suave = (m: string) => ({ maskImage: m, WebkitMaskImage: m });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_20%,#000_20%,transparent_75%)]" />
      <div className="fundir absolute -right-[14%] -top-[6%] h-[980px] w-[78%] overflow-hidden [mask-image:linear-gradient(to_left,#000_45%,transparent)] max-md:-right-[40%] max-md:w-[140%] max-md:opacity-50">
        <div className="animate-breathe absolute right-0 top-0 aspect-square w-[max(100%,980px)] rotate-[-38deg] md:will-change-[opacity]">
          {haces.map((h) => (
            <div key={h.y} className="absolute" style={{ left: pct(-150), width: pct(1250), top: pct(h.y), height: pct(h.h), opacity: h.o }}>
              <span className="absolute inset-x-0 top-[-150%] h-[400%]" style={{ background: degradado, opacity: 0.35, ...suave("linear-gradient(to bottom, transparent, #000 50%, transparent)") }} />
              <span className="absolute inset-0 rounded-full" style={{ background: degradado, ...suave("linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)") }} />
              <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-[#d8f6ff] opacity-70" />
            </div>
          ))}
        </div>
      </div>
      <span className="resplandor absolute -bottom-[30%] -left-[18%] h-[640px] w-[640px]" style={glow("41 196 245", 0.35, 1.44)} />
      <span className="resplandor absolute -bottom-[34%] right-[-10%] h-[620px] w-[620px]" style={glow("27 53 208", 0.5, 1.48)} />
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
              <Ficha icono={<BarChart3 size={14} />} clase="hidden sm:inline-flex">
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

