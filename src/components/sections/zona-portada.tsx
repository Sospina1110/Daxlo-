import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { agendarCon, hero } from "@/content/copy";
import { CintaHero } from "@/components/ui/cinta-hero";
import { Iman } from "@/components/ui/iman";
import { GlowButton } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { FONDO_ZONA, RESPLANDOR_ZONA } from "./zona";

type TonoZona = "cyan" | "blue";

// Portada de la página de cada línea: el nombre del servicio y el titular
// gigante que se desliza con el scroll, sobre la cinta de luz del hero con el
// tinte de la línea (CintaHero variante="portada"). Es el h1 de la página: la
// línea chica ("Coaching 1 a 1") le da a buscadores y lectores de pantalla el
// nombre del servicio, la gigante ("Para ti.") el tono.
// Debajo del sub va la acción de la primera pantalla: el mismo llamado del
// hero con la línea ya elegida (botón de luz: el azul relleno es solo del
// hero), la nota de cada línea bajo el botón (`nota`: una línea de datos en
// tramos; coaching: duración, formato y pago; consultoría: costo de la primera
// conversación y precio cerrado) y un atajo a la sección que explica cómo es.
// Sin nota, la del hero.
//
// La cinta: es una <section> porque el motor mide y vigila la sección que la
// contiene. data-cinta-esquivar marca el titular gigante: la cinta sube
// pasado su borde derecho y no pasa detrás de él. Cada texto lleva
// data-cinta-tope, la luminancia máxima del fondo en movimiento detrás de él
// (ver src/lib/cinta y DESIGN.md). La segunda línea del gigante usa el
// degradado de la línea, no el del hero: el tope punto por punto
// (TOPE_DEGRADADO) no le sirve, así que lleva uno fijo (calculado cuando esa
// línea iba en degradado; ahora va en color plano, más claro que su extremo
// oscuro, así que el tope sigue cubriendo). En cian, 0,035 da
// 3,3:1 contra el extremo más oscuro (#1591c4). En azul, el extremo #1b35d0
// no llega a 3:1 ni sobre negro: el tope es apenas lo que la bruma de la seda
// ya pone (0,02 en la cuenta del shader, que supone debajo el centro del
// resplandor de la zona, de 0,014). La seda queda fuera de esa línea sin
// dejar una caja oscura alrededor de la palabra (con 0,012 se veía): en
// pantalla le suma menos de 0,003 a lo que ya pone ahí el resplandor.
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
  // Lo más claro que queda debajo de la cinta: el centro del resplandor de la
  // zona sobre su fondo. En coaching es más claro que el fondo con el que el
  // shader calcula los topes del hero y, sin esto, la seda detrás del sub
  // pasaba su tope en celular.
  const r = RESPLANDOR_ZONA[tono];
  const fondo = FONDO_ZONA[tono]
    .split(" ")
    .map((b, i) => +(+b + (+r.rgb.split(" ")[i] - +b) * r.alfa).toFixed(1))
    .join(" ");

  // portada-paralaje: la línea de tiempo del scroll que mueve el titular
  // gigante (globals.css). Sin JavaScript: el paralaje no espera a que nada
  // hidrate.
  return (
    <section className="portada-paralaje relative isolate overflow-hidden pb-4 pt-28 md:pb-16 md:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <CintaHero variante="portada" tono={tono} fondo={fondo} />
      </div>
      <div className="container-page">
        <div data-cinta-tope="0.04">{migas}</div>

        <h1 className="mt-8 md:mt-10">
          <span data-cinta-tope="0.06" className="entrada flex items-center gap-3 font-sans text-[14px] font-medium uppercase tracking-[0.16em] text-white/70">
            <span className={cyan ? "h-px w-10 bg-cyan" : "h-px w-10 bg-blue-soft"} />
            {eyebrow}
          </span>{" "}
          <span
            data-cinta-esquivar=""
            className="mt-6 block font-display text-display-giant md:mt-8"
          >
            {/* El desplazamiento con el scroll y la entrada van en elementos
                distintos: las dos animaciones usan transform y una taparía a
                la otra. El parallax es una animación de CSS atada al scroll
                (.paralaje-izquierda y .paralaje-derecha, globals.css), sin
                resorte: lo que sigue al scroll sigue al scroll; con "reducir
                movimiento", quieto.
                Entrada: las dos líneas suben el 22 % de su alto (unos 33 px
                en escritorio, 13 px en 375 px) en 800 ms, a los 0 y 0,08 s.
                Con el 105 % de antes (~158 px, sin máscara) el titular se leía
                como algo que flota hacia arriba. No llevan máscara: con un
                interlineado de 0,9 los trazos que bajan de la línea ("p" de
                "empresa") quedarían cortados.
                La primera línea arranca al ras del contenedor; la segunda
                conserva su sangría. */}
            <span className="paralaje-izquierda block">
              <span data-cinta-tope="0.16" className="subir block [--subir-desde:22%]">
                {gigante[0]}
              </span>
            </span>{" "}
            <span className="paralaje-derecha block pl-[0.5em] md:pl-[1.7em]">
              {/* Color plano: el degradado de texto queda solo en el h1 del
                  inicio (DESIGN.md). Los topes de la cinta se calcularon contra
                  el extremo más oscuro del degradado de antes: siguen valiendo. */}
              <span
                data-cinta-tope={cyan ? "0.035" : "0.02"}
                className={`subir block [--subir-desde:22%] ${cyan ? "text-cyan" : "text-blue-soft"}`}
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
            <p data-cinta-tope="0.07" className="text-[19px] leading-relaxed text-white/80 md:text-[21px]">
              {sub}
            </p>
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
                  <span data-cinta-tope="0.06">{hero.cta}</span>
                  <ArrowRight size={18} className="transition-[translate] ease-salida motion-safe:group-hover:translate-x-0.5" />
                </GlowButton>
              </Iman>
              <NotaBoton nota={nota} className="sm:col-span-2 sm:row-start-2" />
              <a
                href={`#${accion.ancla}`}
                data-cinta-tope="0.04"
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
    </section>
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
    <div data-cinta-tope="0.05" className={cn("text-[15px] leading-snug text-white/70", className)}>
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
