import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { agendarCon, hero } from "@/content/copy";
import { Iman } from "@/components/ui/iman";
import { GlowButton, Orb } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type TonoZona = "cyan" | "blue";

// Portada de la página de cada línea: el nombre del servicio, el titular
// gigante que se desliza con el scroll y el orbe de vidrio. Es el h1 de la
// página: la línea chica ("Coaching 1 a 1") le da a buscadores y lectores de
// pantalla el nombre del servicio, la gigante ("Para ti.") el tono.
// Debajo del sub va la acción de la primera pantalla: el mismo llamado del
// hero con la línea ya elegida (botón de luz: el azul relleno es solo del
// hero), la nota de cada línea bajo el botón (`nota`: una línea de datos en
// tramos; coaching: duración, formato y pago; consultoría: costo de la primera
// conversación y precio cerrado) y un atajo a la sección que explica cómo es.
// Sin nota, la del hero.
export function ZonaPortada({
  tono,
  eyebrow,
  gigante,
  sub,
  accion,
  nota = hero.meta,
  migas,
}: {
  tono: TonoZona;
  eyebrow: string;
  gigante: readonly [string, string] | readonly string[];
  sub: string;
  accion: { enlace: string; ancla: string };
  nota?: string | readonly string[];
  migas?: React.ReactNode;
}) {
  const cyan = tono === "cyan";
  const linea = cyan ? "coaching" : "consultoria";

  // portada-paralaje: la línea de tiempo del scroll que mueve el titular
  // gigante (globals.css). Sin JavaScript: este componente ya no hidrata.
  return (
    <div className="portada-paralaje relative overflow-hidden pb-4 pt-28 md:pb-16 md:pt-36">
      <div className="container-page">
        {migas}

        <h1 className="mt-8 md:mt-10">
          <span className="entrada flex items-center gap-3 font-sans text-[14px] font-medium uppercase tracking-[0.16em] text-white/70">
            <span className={cyan ? "h-px w-10 bg-cyan" : "h-px w-10 bg-blue-soft"} />
            {eyebrow}
          </span>{" "}
          <span className="mt-6 block font-display text-[clamp(3.2rem,17vw,10.5rem)] font-medium leading-[0.9] tracking-[-0.045em] md:mt-8 md:text-[clamp(3.9rem,13.5vw,10.5rem)]">
            {/* El desplazamiento con el scroll y la entrada van en elementos
                distintos: las dos animaciones usan transform y una taparía a
                la otra. El parallax es una animación de CSS atada al scroll
                (.paralaje-izquierda y .paralaje-derecha, globals.css), sin
                resorte: lo que sigue al scroll sigue al scroll; con "reducir
                movimiento", quieto.
                Entrada: las dos líneas suben el 22 % de su alto (unos 33 px
                en escritorio, 13 px en 375 px) en 800 ms, a los 0 y 0,08 s.
                Con el 105 % de antes (~158 px, sin máscara) el titular se leía
                como algo que flota hacia arriba. No llevan máscara: un
                overflow-hidden cortaría el halo del orbe. El orbe no flota:
                va dentro de una línea de lectura. */}
            <span className="paralaje-izquierda block">
              <span className="subir flex items-center gap-[0.16em] [--subir-desde:22%]">
                <Orb tamano="0.78em" tono={cyan ? "cyan" : "blue"} />
                <span>{gigante[0]}</span>
              </span>
            </span>{" "}
            <span className="paralaje-derecha block pl-[0.5em] md:pl-[1.7em]">
              {/* El degradado va en el mismo elemento que se anima, como en
                  el titular del inicio, para no perder el recorte del texto. */}
              <span
                className={`subir block [--subir-desde:22%] ${cyan ? "text-gradient-cyan" : "text-gradient-blue"}`}
                style={{ ["--retraso" as string]: "0.08s" } as React.CSSProperties}
              >
                {gigante[1]}
              </span>
            </span>
          </span>
        </h1>

        {/* El protagonista entra primero: el sub a los 0,18 s y la fila del
            botón a los 0,26 s; el botón queda quieto hacia los 0,86 s. */}
        <div className="mt-10 md:ml-auto md:mt-12 md:max-w-[560px]">
          <Reveal delay={0.18}>
            <p className="text-[19px] leading-relaxed text-white/80 md:text-[21px]">{sub}</p>
          </Reveal>
          {/* Orden en el DOM: botón, nota, enlace. La nota describe lo que pasa
              al tocar el botón, así que va pegada a él en pantalla y para
              lectores de pantalla; en celular, el enlace queda después. Desde
              640 px, la rejilla pone el botón y el enlace en una fila y la nota
              debajo (el foco sigue yendo del botón al enlace: la nota no es
              enfocable). */}
          <Reveal delay={0.26} className="mt-8">
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[auto_auto] sm:items-center sm:justify-start sm:gap-x-6 sm:gap-y-3">
              {/* Botón magnético (Iman): se corre hacia el puntero en vez de
                  subir 2 px. La rejilla lo estira: el botón ya no necesita
                  w-full ni su lugar en la rejilla. */}
              <Iman className="sm:col-start-1 sm:row-start-1">
                <GlowButton href={agendarCon(linea)} tono={tono} tamano="lg" elevar={false}>
                  {hero.cta}
                  <ArrowRight size={18} className="transition-[translate] ease-salida motion-safe:group-hover:translate-x-0.5" />
                </GlowButton>
              </Iman>
              <NotaBoton nota={nota} className="sm:col-span-2 sm:row-start-2" />
              <a
                href={`#${accion.ancla}`}
                className={cn(
                  "group mt-1 inline-flex min-h-[44px] items-center gap-2 self-start text-[16px] font-medium transition-colors hover:text-white sm:col-start-2 sm:row-start-1 sm:mt-0 sm:self-auto sm:justify-self-start",
                  cyan ? "text-cyan" : "text-blue-soft",
                )}
              >
                {accion.enlace}
                <ArrowDown size={16} aria-hidden className="transition-[translate] ease-salida motion-safe:group-hover:translate-y-0.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

// La nota bajo el botón, en `body-xs` (15 px) blanco al 70 %, con el chulo menta
// delante. Una frase va en una línea que se parte donde haga falta. En tramos
// (las dos líneas), el primero (lo que cuesta empezar) va con el chulo y los
// demás debajo, alineados con su texto: desde 640 px en una sola línea
// separados por "·" (blanco al 40 %, oculto a lectores de pantalla), y en
// celular uno por renglón. Así ningún renglón empieza con el separador. Sin
// margen propio: el aire con el botón lo pone el contenedor (gap de 12 px).
function NotaBoton({ nota, className }: { nota: string | readonly string[]; className?: string }) {
  const [primero, ...resto] = typeof nota === "string" ? [nota] : nota;
  return (
    <div className={cn("text-[15px] leading-snug text-white/70", className)}>
      <p className="flex items-start gap-2">
        <Check size={16} className="mt-[2px] shrink-0 text-mint" aria-hidden />
        {primero}
      </p>
      {resto.length > 0 && (
        <p className="mt-1 flex flex-col gap-y-1 pl-6 sm:flex-row sm:flex-wrap sm:gap-x-2">
          {resto.map((t, i) => (
            <span key={t} className="inline-flex gap-2 whitespace-nowrap">
              {i > 0 && (
                <>
                  <span aria-hidden className="hidden text-white/40 sm:inline">
                    ·
                  </span>
                  <span className="sr-only">. </span>
                </>
              )}
              {t}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
