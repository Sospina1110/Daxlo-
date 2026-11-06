import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { dosFormas, rutas } from "@/content/copy";
import { enLineas, LineaCapitulo, SectionHeading } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { cn, sinCorte } from "@/lib/utils";

// ------------------------------------------------ Dos puertas

// Debajo del hero, el inicio solo reparte: el dolor en una línea (titular) y
// dos puertas según quién hace el trabajo. Lo que cuenta cada línea vive en su
// página. Son las únicas tarjetas del inicio, porque son enlaces: planas, sin
// vidrio ni resplandor. Una sola señal de para quién es cada una, en la
// primera fila: la regla dibujada en un pictograma (un nodo frente a tres que
// llegan a la misma barra) y escrita al lado como texto real. Sin píldora de
// audiencia encima: repetía lo mismo y sumaba un nivel antes del título.
export function DosPuertas() {
  return (
    <section className="relative py-16 md:py-24">
      <LineaCapitulo />
      <div className="container-page">
        <SectionHeading titulo={enLineas(dosFormas.titulo)} sub={dosFormas.sub} />
        <div data-escalonar="0.08" className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-2">
          <Puerta tono="cyan" datos={dosFormas.coaching} href={rutas.coaching} />
          <Puerta tono="blue" datos={dosFormas.consultoria} href={rutas.consultoria} />
        </div>
      </div>
    </section>
  );
}

type DatosPuerta = { regla: string; titulo: string; linea: string; enlace: string };

// Toda la tarjeta se puede tocar: el enlace se estira sobre ella (after:inset-0)
// y conserva su nombre accesible ("Ver el coaching: Coaching de IA 1 a 1").
// Al pasar o con foco, el borde toma el tono de la línea en 200 ms (con foco
// del teclado, de una vez); al presionar, la tarjeta baja a 0.99
// (.tarjeta-pulsable, globals.css). La flecha se corre 4 px solo con el mouse
// (quieta con "reducir movimiento" y con el foco).
//
// La aparición (data-revelar) va en un div aparte que envuelve el article: la
// regla [data-revelar] va fuera de capa y su transition le ganaba a la del
// borde, que cambiaba de golpe. El div sigue siendo hijo directo del grupo
// escalonado.
function Puerta({ tono, datos, href }: { tono: "cyan" | "blue"; datos: DatosPuerta; href: string }) {
  const cyan = tono === "cyan";
  return (
    <div data-revelar="" className="h-full">
      <article
        className={cn(
          "group tarjeta-pulsable relative flex h-full flex-col rounded-[24px] border border-line-2 bg-ink-2/60 p-6 sm:p-8 md:p-10",
          cyan ? "hover:border-cyan/40 focus-within:border-cyan/40" : "hover:border-blue-bright/45 focus-within:border-blue-bright/45",
        )}
      >
        {/* El pictograma y la regla van juntos: la regla se ve antes de leerse. */}
        <div className="mt-0 flex items-center gap-4">
          <Pictograma tono={tono} />
          <p className="text-[15px] leading-snug text-white/85">{datos.regla}</p>
        </div>
        <h3 className="mt-5 text-[28px] leading-tight text-white md:text-[32px]">{sinCorte(datos.titulo)}</h3>
        <p className="mb-6 mt-3 max-w-[460px] text-[18px] leading-relaxed text-muted">{datos.linea}</p>
        {/* Al pie de la tarjeta: los dos enlaces quedan a la misma altura. */}
        <Link
          href={href}
          className={cn(
            "mt-auto inline-flex min-h-[44px] items-center gap-2 self-start text-[16px] font-medium after:absolute after:inset-0 after:rounded-[24px] after:content-['']",
            cyan ? "text-cyan" : "text-blue-soft",
          )}
        >
          {datos.enlace}
          <span className="sr-only">: {datos.titulo}</span>
          <ArrowRight aria-hidden size={17} className="transition-[translate] ease-salida motion-safe:group-hover:translate-x-1" />
        </Link>
      </article>
    </div>
  );
}

// La regla dibujada: coaching, un nodo unido a una barra (lo haces tú solo);
// consultoría, tres nodos que llegan por tres líneas a la misma barra (lo
// hacen varias personas de tu equipo). Decorativo: la regla va escrita debajo.
function Pictograma({ tono, className }: { tono: "cyan" | "blue"; className?: string }) {
  const cyan = tono === "cyan";
  const trazo = cyan ? "stroke-cyan" : "stroke-blue-soft";
  const nodo = cyan ? "fill-cyan" : "fill-blue-soft";
  return (
    <svg aria-hidden viewBox="0 0 120 56" width={120} height={56} className={cn("block shrink-0", className)}>
      {cyan ? (
        <>
          <path d="M15 28 H48" className={trazo} strokeWidth="1" fill="none" />
          <circle cx="10" cy="28" r="5" className={nodo} />
        </>
      ) : (
        <>
          <path d="M15 10 C32 10 32 28 48 28 M15 28 H48 M15 46 C32 46 32 28 48 28" className={trazo} strokeOpacity="0.8" strokeWidth="1" fill="none" />
          <circle cx="10" cy="10" r="5" className={nodo} />
          <circle cx="10" cy="28" r="5" className={nodo} />
          <circle cx="10" cy="46" r="5" className={nodo} />
        </>
      )}
      <rect x="48.5" y="24.5" width="64" height="7" rx="3.5" className={cn(trazo, cyan ? "fill-cyan/25" : "fill-blue-soft/20")} strokeWidth="1" />
    </svg>
  );
}
