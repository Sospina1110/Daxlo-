import { ArrowRight, ArrowUp, Check, ChevronDown, Globe, MessageSquare, Paperclip, Workflow } from "lucide-react";
import { ecosistema, hero, rutas } from "@/content/copy";
import { GlowButton } from "@/components/ui/primitives";
import { ToolLogo } from "@/components/ui/blocks";
import { TextoQueSeEscribe } from "@/components/ui/escritura";
import { CintaHero } from "@/components/ui/cinta-hero";
import { Iman } from "@/components/ui/iman";
import { glow } from "@/lib/utils";

// Entrada por CSS (clase .entrada en globals.css): arranca apenas el navegador
// pinta, sin esperar a que cargue React. Es lo que evita la pantalla vacía en
// celulares lentos. `desde` (px) y `duracion` (s) reemplazan los 8 px y los
// 0,6 s del token.
//
// Línea de tiempo del hero (inicio / duración / recorrido):
// - frase de posicionamiento (apoyo): 0 / 600 ms / 8 px
// - titular, línea 1 (protagonista): 60 / 800 ms / 105 % bajo su máscara
// - titular, línea 2: 140 / 800 ms
// - sub (apoyo): 280 / 600 ms / 8 px
// - fila del botón y su nota (acción): 360 / 600 ms / 8 px
// - recuadro (apoyo grande): 480 / 750 ms / 20 px
// Pasos desiguales (60, 80, 140, 80 y 120 ms), no de metrónomo. El botón queda
// quieto a 0,96 s y el hero completo a 1,23 s; se puede tocar desde el primer
// cuadro en que se ve.
function Entrada({
  children,
  retraso = 0,
  desde,
  duracion,
  className = "",
}: {
  children: React.ReactNode;
  retraso?: number;
  desde?: number;
  duracion?: number;
  className?: string;
}) {
  const estilo: Record<string, string> = { "--retraso": `${retraso}s` };
  if (desde !== undefined) estilo["--desde"] = `${desde}px`;
  if (duracion !== undefined) estilo["--duracion"] = `${duracion}s`;
  return (
    <div className={`entrada ${className}`} style={estilo as React.CSSProperties}>
      {children}
    </div>
  );
}

// El hero cabe en la primera pantalla (.hero, globals.css: el alto de la
// pantalla, hasta 900 px). Arriba, la frase y el titular a todo el ancho;
// debajo, dos columnas: a la izquierda el sub, el botón y su nota; a la
// derecha, el recuadro que escribe, entero y sin bajar. En celular todo va en
// una columna y el recuadro asoma bajo la nota. En los celulares más chicos
// (320 px) se compacta un poco para que el botón quede en la primera pantalla.
export function Hero() {
  return (
    <section id="top" className="hero relative isolate overflow-hidden">
      <FondoHero />
      <div className="container-page relative">
        {/* El posicionamiento va arriba del titular, en frase y no en
            microrrótulo: es lo primero que se lee. */}
        <Entrada>
          <p data-cinta-tope="0.16" className="flex items-center gap-3 font-display text-[18px] font-medium tracking-[-0.01em] text-white md:text-[22px]">
            <span aria-hidden className="h-px w-8 shrink-0 bg-gradient-to-r from-cyan to-blue-bright md:w-10" />
            {hero.aliado}
          </p>
        </Entrada>

        {/* data-cinta-tope: luminancia máxima que puede tener el fondo en
            movimiento detrás de cada texto (ver src/lib/cinta). El degradado
            de texto queda solo aquí, en la segunda línea. */}
        <h1 className="mt-5 text-display-hero max-[359px]:mt-4 max-[359px]:text-[2.15rem] md:mt-6">
          <LineaTitular texto={hero.titulo[0]} retraso={0.06} tope="0.16" />{" "}
          <LineaTitular texto={hero.titulo[1]} retraso={0.14} clase="text-gradient-dual" tope="degradado" />
        </h1>

        <div className="mt-6 grid gap-x-6 gap-y-10 max-[359px]:mt-5 md:mt-9 lg:mt-[clamp(28px,5vh,52px)] lg:grid-cols-12">
          {/* La nota va al lado del botón, no debajo: debajo le caía encima
              el halo del botón y perdía contraste. */}
          <div className="lg:col-span-6">
            <Entrada retraso={0.28}>
              <p data-cinta-tope="0.055" className="max-w-[29em] text-body-md text-muted max-[359px]:leading-normal md:text-[19px]">
                {hero.sub}
              </p>
            </Entrada>

            {/* Un solo llamado, y debajo lo único que hace falta saber antes
                de tocarlo. En celular el botón ocupa el ancho: se toca con el
                pulgar. Con mouse, el botón se corre hacia el puntero (Iman) en
                vez de subir 2 px; la flecha avanza 2 px. */}
            <Entrada retraso={0.36} className="mt-7 flex flex-col items-stretch gap-4 max-[359px]:mt-6 sm:flex-row sm:items-center sm:gap-6 md:mt-9">
              <Iman>
                <GlowButton href={rutas.agendar} tamano="lg" variante="principal" elevar={false}>
                  {hero.cta}
                  <ArrowRight size={18} className="transition-[translate] ease-salida motion-safe:group-hover:translate-x-0.5" />
                </GlowButton>
              </Iman>
              <p data-cinta-tope="0.04" className="flex items-center justify-center gap-2 text-body-xs text-white/65 sm:justify-start lg:leading-snug">
                <Check size={16} className="text-mint" aria-hidden />
                {hero.meta}
              </p>
            </Entrada>
          </div>

          <Recuadro />
        </div>
      </div>
    </section>
  );
}

// Cada línea sube desde abajo de una máscara. El degradado va en el propio
// elemento animado para que el recorte de texto no se pierda. El relleno de
// abajo deja sitio a los trazos que bajan de la línea (la "p").
function LineaTitular({ texto, retraso, clase, tope }: { texto: string; retraso: number; clase?: string; tope: string }) {
  return (
    <span className="block overflow-hidden pb-[0.12em] [margin-bottom:-0.06em]">
      <span data-cinta-tope={tope} className={`subir block pb-[0.04em] ${clase ?? ""}`} style={{ ["--retraso" as string]: `${retraso}s` } as React.CSSProperties}>
        {texto}
      </span>
    </span>
  );
}

// La cinta de luz en movimiento (CintaHero) y los resplandores de esquina. Con
// WebGL, los resplandores los pinta el shader (para medir bien el contraste) y
// estos se apagan. Sin rejilla de fondo (DESIGN.md, qué no hacer). La capa se
// funde en sus últimos 160 px: el hero no termina en un corte.
function FondoHero() {
  return (
    <div aria-hidden className="hero-fondo pointer-events-none absolute inset-0 -z-10">
      <CintaHero />
      <span data-cinta-resplandor="cian 0.35" className="resplandor absolute -bottom-[30%] -left-[18%] h-[640px] w-[640px]" style={glow("41 196 245", 0.35, 1.44)} />
      <span data-cinta-resplandor="azul 0.5" className="resplandor absolute -bottom-[34%] right-[-10%] h-[620px] w-[620px]" style={glow("27 53 208", 0.5, 1.48)} />
    </div>
  );
}

// El recuadro que escribe: una ventana de chat con el historial a un lado y,
// en grande, el texto que se escribe solo. Es decorativo y va rotulado
// "Ejemplo": la búsqueda y las tareas son ejemplos del tipo de trabajo, no
// datos de nadie. Es opaco (Penumbra): la cinta pasa por detrás y la seda se
// ve por sus bordes (data-cinta-recuadro: el motor traza la cinta a través de
// él). Cuando termina de escribirse la primera tarea, un papel menta sale de
// su borde inferior, baja y se apaga (.hero-papel, globals.css): ahí nace el
// hilo de luz que baja por la página (data-hilo-origen).
function Recuadro() {
  return (
    <Entrada retraso={0.48} desde={20} duracion={0.75} className="relative lg:col-span-6 lg:col-start-7">
      <div aria-hidden data-cinta-recuadro="" className="hero-recuadro relative">
        <div className="relative flex h-full overflow-hidden rounded-placa border border-line-2 bg-ink-2 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          <span className="absolute inset-x-5 top-0 h-px bg-[image:var(--filo)]" />
          {/* El historial: solo desde 640 px. */}
          <div className="hidden w-[204px] shrink-0 flex-col border-r border-line p-4 sm:flex">
            <span className="rotulo px-2 text-white/45">{ecosistema.etiqueta}</span>
            <ul className="mt-3 space-y-0.5">
              {hero.historial.map((h, i) => (
                <li key={h} className="flex items-center gap-2.5 rounded-ficha px-2 py-2 text-caption" style={{ opacity: 1 - i * 0.15 }}>
                  <MessageSquare size={14} className="shrink-0 text-white/40" />
                  <span className="truncate text-white/60">{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2 p-4 pb-0">
              <span className="inline-flex items-center gap-2 rounded-ficha border border-line-2 px-3 py-1.5 text-[14px] text-white/85">
                <ToolLogo id="claude" tamano={15} />
                Claude
                <ChevronDown size={14} className="text-white/50" />
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-ficha border border-line-2 text-white/60">
                <Globe size={15} />
              </span>
              <span className="rotulo ml-auto text-white/45 sm:hidden">{ecosistema.etiqueta}</span>
            </div>
            {/* Primero una búsqueda que se tacha y da paso a las tareas: el
                paso "Hoy" del ecosistema ("Usas la IA como un buscador…")
                nombra lo que se acaba de ver (hero.busqueda). */}
            <div className="hero-escritura min-h-[104px] flex-1 px-5 py-5 font-display text-[19px] font-medium leading-snug tracking-[-0.01em] text-white md:text-[23px]">
              <TextoQueSeEscribe frases={hero.tareas} busqueda={hero.busqueda} />
            </div>
            <div className="flex items-center justify-between gap-3 p-4 pt-0">
              <div className="flex flex-wrap gap-2">
                <Ficha icono={<Paperclip size={14} />}>Adjuntar</Ficha>
                <Ficha icono={<Workflow size={14} />}>Automatizar</Ficha>
              </div>
              <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-gradient-to-br from-cyan to-blue text-white shadow-[0_0_24px_rgba(41,196,245,0.45)]">
                <ArrowUp size={18} />
              </span>
            </div>
          </div>
        </div>
        {/* El papel que se desprende y el punto del que nace el hilo. */}
        <span data-hilo-origen="" className="absolute bottom-0 left-[22%] h-px w-px" />
        <span className="hero-papel ficha-papel absolute left-[22%] top-full">{hero.papel}</span>
      </div>
    </Entrada>
  );
}

function Ficha({ children, icono }: { children: React.ReactNode; icono: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-ficha border border-line-2 px-3 py-1.5 text-caption text-white/70">
      {icono}
      {children}
    </span>
  );
}
