import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { inicioNosotros, rutas } from "@/content/copy";
import { enLineas, SectionHeading } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { cn, glow } from "@/lib/utils";

type TonoZona = "cyan" | "blue";

// Cada línea de servicio vive en su propio territorio: coaching con aire cian
// sobre el casi negro, consultoría más oscura y con resplandor azul. Sobre un
// sitio oscuro, el cambio de ambiente es lo que marca la frontera.
// Con `arriba` la zona abre la página: sin la línea de luz del borde, que
// quedaría pegada a la barra de navegación.
// Un solo resplandor, arriba, detrás de la portada: la contención es el sello
// (DESIGN.md). La luz de la segunda mitad de la página la pone el cierre.
// La zona de consultoría (#08090E) termina fundiéndose en el casi negro del
// resto de la página: antes acababa en un borde horizontal duro.
export function Zona({ tono, arriba = false, children }: { tono: TonoZona; arriba?: boolean; children: React.ReactNode }) {
  const cyan = tono === "cyan";
  return (
    <div className={cn("relative isolate", !cyan && "bg-[#08090e]")}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_calc(100%-240px),transparent)]">
        <span
          className={cn("resplandor animate-deriva absolute top-0 h-[760px] w-[760px]", cyan ? "-left-[22%]" : "-right-[22%]")}
          style={cyan ? glow("41 196 245", 0.14, 1.39) : glow("27 53 208", 0.35, 1.39)}
        />
      </div>
      {!cyan && <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[140px] bg-gradient-to-b from-transparent to-ink" />}
      {!arriba && (
        <div
          aria-hidden
          className={cn("h-px w-full bg-gradient-to-r from-transparent to-transparent", cyan ? "via-cyan/60" : "via-blue-bright/70")}
        />
      )}
      {children}
    </div>
  );
}

type Escena = { titulo: string; texto: string };

// Las escenas del problema, compartidas por las dos zonas. Filas abiertas, sin
// caja ni icono, separadas por una regla de 1 px con un tramo corto del tono de
// la línea. Es la sección que continúa la portada, con el ritmo corto
// (DESIGN.md, Layout). Sin regla abajo: la sección siguiente abre con su línea
// de capítulo y las dos juntas se leían como un divisor doble.
// Dos formas: escena con título (consultoría: el título a la izquierda en
// `headline-sm`/`headline-md` y la línea a la derecha desde 1024 px) o escena
// de una sola línea (coaching: Outfit 500 de 22/28 px, hasta 60 caracteres por
// línea). El titular lleva la idea completa: sin bajada.
export function TarjetasProblema({
  titulo,
  sub,
  escenas,
  tono,
}: {
  titulo: string;
  sub?: string;
  escenas: readonly Escena[] | readonly string[];
  tono: TonoZona;
}) {
  const tramo = tono === "cyan" ? "bg-cyan" : "bg-blue-soft";
  return (
    <section className="relative py-12 md:pb-20 md:pt-16">
      <div className="container-page">
        <SectionHeading titulo={enLineas(titulo)} sub={sub} tono={tono} alineacion="izquierda" />
        <Reveal className="mt-10 md:mt-14">
          <ul>
            {escenas.map((e) =>
              typeof e === "string" ? (
                <li key={e} className="relative border-t border-line py-6 md:py-8">
                  <span aria-hidden className={cn("absolute -top-px left-0 h-px w-10", tramo)} />
                  <p className="max-w-[60ch] font-display text-[22px] font-medium leading-snug text-white/85 md:text-[28px] md:leading-tight">{e}</p>
                </li>
              ) : (
                <li key={e.titulo} className="relative grid gap-3 border-t border-line py-7 md:py-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-baseline lg:gap-12">
                  <span aria-hidden className={cn("absolute -top-px left-0 h-px w-10", tramo)} />
                  <h3 className="text-[22px] leading-snug text-white md:text-[32px] md:leading-tight">{e.titulo}</h3>
                  <p className="max-w-[60ch] text-[18px] leading-relaxed text-muted">{e.texto}</p>
                </li>
              ),
            )}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------ ¿Esto es para…?

type ListaPara = { titulo: string; items: readonly string[] };

// ¿Es para mí? El filtro honesto, compartido por las dos líneas, en filas
// abiertas: sin tarjeta, sin botón propio y sin resplandor (el único botón de
// la segunda mitad es el del cierre). La última línea de "No es para… si"
// termina en el enlace a la otra línea, en el tono de la zona: ese es el
// puente para quien entró por la puerta equivocada.
// - Consultoría (`cita`): a la izquierda el titular, la pregunta que filtra
//   como cita y la respuesta; a la derecha "No es para tu empresa si".
// - Coaching (`es`): dos columnas, "Es para ti si" y "No es para ti si".
// En las dos, abajo y a todo lo ancho, los dos socios (`socios`): quién está
// detrás, con el enlace a /nosotros.
export function ParaQuien({
  id,
  tono,
  titulo,
  cita,
  respuesta,
  es,
  noEs,
  enlace,
  socios,
}: {
  id: string;
  tono: TonoZona;
  titulo: string;
  cita?: string;
  respuesta?: string;
  es?: ListaPara;
  noEs: ListaPara;
  enlace: { texto: string; href: string };
  socios?: { texto: string };
}) {
  const noEsLista = <ListaFiltro lista={noEs} tono={tono} si={false} enlace={enlace} />;
  return (
    <section id={id} className="relative py-12 md:py-20">
      <div className="container-page">
        {cita ? (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <SectionHeading titulo={titulo} tono={tono} alineacion="izquierda" escala="apoyo" />
              <Reveal delay={0.08}>
                <p className="mt-7 max-w-[600px] border-t border-line-2 pt-6 font-display text-[22px] font-medium leading-snug text-white md:text-[28px] md:leading-[1.25]">
                  {cita}
                </p>
                {respuesta && <p className="mt-4 max-w-[560px] text-[18px] leading-relaxed text-white/80">{respuesta}</p>}
              </Reveal>
            </div>
            <Reveal delay={0.12} className="lg:pt-3">
              {noEsLista}
            </Reveal>
          </div>
        ) : (
          <>
            <SectionHeading titulo={titulo} tono={tono} alineacion="izquierda" escala="apoyo" />
            {/* Una pista que puede encogerse (minmax(0, 1fr)): con la pista
                implícita, un enlace largo ensanchaba la columna más allá de la
                pantalla en 320 px. */}
            <Reveal delay={0.08} className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-10 md:mt-10 md:grid-cols-2 md:gap-12">
              {es && <ListaFiltro lista={es} tono={tono} si />}
              {noEsLista}
            </Reveal>
          </>
        )}
        {socios && <FranjaSocios texto={socios.texto} tono={tono} />}
      </div>
    </section>
  );
}

// Una columna de "Es para… si" / "No es para… si": título en `headline-sm` y
// filas abiertas con regla de 1 px. El sí lleva el chulo del tono; el no, un
// guion blanco al 50 %. Con `enlace`, la última fila termina en él: en una
// línea desde 640 px; en celular se parte si no cabe (en 320 px "Ver la
// consultoría para empresas" no cabe con la flecha), y la flecha conserva su
// ancho.
function ListaFiltro({ lista, tono, si, enlace }: { lista: ListaPara; tono: TonoZona; si: boolean; enlace?: { texto: string; href: string } }) {
  const cyan = tono === "cyan";
  const ultima = lista.items.length - 1;
  return (
    <div>
      <h3 className="text-[22px] leading-snug text-white">{lista.titulo}</h3>
      <ul className="mt-4">
        {lista.items.map((t, i) => (
          <li key={t} className="flex items-start gap-3 border-t border-line py-5 text-[17px] leading-snug text-white/85">
            {si ? (
              <Check aria-hidden size={16} className={cn("mt-[3px] shrink-0", cyan ? "text-cyan" : "text-blue-soft")} />
            ) : (
              <Minus aria-hidden size={16} className="mt-[3px] shrink-0 text-white/50" />
            )}
            <span className="flex flex-col items-start">
              {t}
              {enlace && i === ultima && (
                <Link
                  href={enlace.href}
                  className={cn(
                    "group -mb-2.5 mt-1 inline-flex min-h-[44px] items-center gap-2 text-[16px] font-medium transition-colors hover:text-white sm:whitespace-nowrap",
                    cyan ? "text-cyan" : "text-blue-soft",
                  )}
                >
                  {enlace.texto}
                  <ArrowRight aria-hidden size={16} className="shrink-0 transition-transform motion-safe:group-hover:translate-x-1" />
                </Link>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Los dos socios, a todo lo ancho bajo una regla: la foto chica (96 × 96, con
// ancho y alto fijos para no mover nada al cargar), la firma conjunta y el
// enlace a /nosotros, para quien quiere saber quiénes son antes de agendar.
// La foto es un recorte cuadrado de 240 × 240 (equipo-cuadro.webp, ~8 KB, el
// mismo encuadre que se veía): la completa (equipo.webp, 54 KB) queda para el
// inicio y /nosotros, que la muestran grande.
function FranjaSocios({ texto, tono }: { texto: string; tono: TonoZona }) {
  return (
    <Reveal className="mt-12 flex items-center gap-5 border-t border-line pt-8 md:mt-16 md:gap-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/equipo-cuadro.webp"
        alt="Martín Zárate y Santiago Ospina, socios de Daxlo"
        width={96}
        height={96}
        loading="lazy"
        className="h-[72px] w-[72px] shrink-0 rounded-2xl border border-line-2 object-cover sm:h-24 sm:w-24"
      />
      <div className="min-w-0">
        <p className="max-w-[720px] font-display text-[19px] font-medium leading-snug text-white sm:text-[22px]">{texto}</p>
        <Link
          href={rutas.nosotros}
          className={cn(
            "group -mb-2.5 mt-1 inline-flex min-h-[44px] items-center gap-2 text-[16px] font-medium transition-colors hover:text-white",
            tono === "cyan" ? "text-cyan" : "text-blue-soft",
          )}
        >
          {inicioNosotros.enlace}
          <ArrowRight aria-hidden size={16} className="shrink-0 transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      </div>
    </Reveal>
  );
}
