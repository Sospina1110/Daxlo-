import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { dosFormas, rutas } from "@/content/copy";
import { LineaCapitulo, SectionHeading } from "@/components/ui/blocks";
import { sinCorte } from "@/lib/utils";

// ------------------------------------------------ Dos puertas

// Por dónde se entra, según quién hace el trabajo. Lo que cuenta cada línea
// vive en su página. Son dos filas a todo el ancho separadas por líneas, no
// dos tarjetas: no igualan alturas, así que ninguna queda con zona muerta.
// Cada fila es un solo enlace y se toca entera.
//
// Apagada por defecto. Con el puntero o con el foco la fila se enciende: una
// placa azul a todo el ancho funde, su filo se dibuja de izquierda a derecha,
// el mini diagrama hace su ciclo y la flecha avanza 4 px (.puerta, globals.css:
// solo opacity y transform). En pantallas táctiles se enciende sola la fila
// que cruza el centro de la pantalla (data-al-centro, script del layout).
export function DosPuertas() {
  return (
    <section aria-labelledby="titulo-puertas" className="seccion-capitulo relative">
      <LineaCapitulo />
      <div className="container-page">
        <SectionHeading id="titulo-puertas" titulo={dosFormas.titulo} sub={dosFormas.sub} alineacion="columnas" />
        <ul data-escalonar="0.08" className="mt-10 md:mt-14">
          <Puerta linea="coaching" datos={dosFormas.coaching} href={rutas.coaching} />
          <Puerta linea="consultoria" datos={dosFormas.consultoria} href={rutas.consultoria} />
        </ul>
      </div>
    </section>
  );
}

type DatosPuerta = { regla: string; titulo: string; linea: string; enlace: string; equipos?: string };

// Toda la fila se puede tocar: el enlace se estira sobre ella (after:inset-0)
// y conserva su nombre accesible ("Ver el coaching: Coaching de IA 1 a 1").
// Al presionar, la fila baja a 0.99 (.tarjeta-pulsable, globals.css).
//
// La aparición (data-revelar) va en el <li> que envuelve el article: la regla
// [data-revelar] va fuera de capa y su transition le ganaría a la de la fila.
// El <li> sigue siendo hijo directo del grupo escalonado.
function Puerta({ linea, datos, href }: { linea: "coaching" | "consultoria"; datos: DatosPuerta; href: string }) {
  return (
    <li data-revelar="">
      <article data-al-centro="" className="puerta tarjeta-pulsable group relative">
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-4 py-8 lg:min-h-[200px] lg:grid-cols-12 lg:items-center lg:py-10">
          {/* La regla, en grande: es lo que decide por cuál puerta se entra. */}
          <p className="font-display text-headline-row text-white lg:col-span-4">{datos.regla}</p>
          <MiniDiagrama linea={linea} className="row-span-2 self-start justify-self-end lg:order-3 lg:col-span-2 lg:row-span-1 lg:self-center lg:justify-self-center" />
          <div className="col-span-2 lg:order-2 lg:col-span-5">
            <h3 className="text-headline-sm text-white">{sinCorte(datos.titulo)}</h3>
            <p className="mt-2 max-w-[52ch] text-body-md text-muted">{datos.linea}</p>
            {datos.equipos && <p className="mt-3 max-w-[52ch] text-body-xs text-white/75">{datos.equipos}</p>}
            <Link href={href} className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-[16px] font-medium text-white after:absolute after:inset-0 after:content-[''] lg:mt-3">
              {datos.enlace}
              <span className="sr-only">: {datos.titulo}</span>
              <ArrowRight aria-hidden size={17} className="text-cyan lg:hidden" />
            </Link>
          </div>
          <span aria-hidden className="puerta-flecha relative hidden h-12 w-12 items-center justify-center justify-self-end rounded-full border border-line-2 text-white lg:order-4 lg:col-span-1 lg:flex">
            <ArrowRight size={18} />
            {/* Encendida: el círculo se rellena de blanco (una capa encima). */}
            <span className="puerta-flecha-llena">
              <ArrowRight size={18} />
            </span>
          </span>
        </div>
      </article>
    </li>
  );
}

// La regla dibujada con los objetos del sitio (DESIGN.md): la gente es un
// círculo blanco, el trabajo una ficha menta y el agente una placa azul.
// Coaching: una persona y su trabajo. Consultoría: tres personas, un agente y
// tres trabajos. Apagado, todo va en contorno y las fichas tenues; al
// encenderse la fila, cada objeto se rellena en ola (dos capas que cambian de
// opacidad) y las fichas avanzan. Decorativo: la regla va escrita al lado.
function MiniDiagrama({ linea, className }: { linea: "coaching" | "consultoria"; className?: string }) {
  const filas = linea === "coaching" ? [0] : [0, 1, 2];
  return (
    <span aria-hidden className={`mini ${className ?? ""}`}>
      <span className="mini-columna">
        {filas.map((i) => (
          <span key={i} className="mini-persona" style={{ ["--i" as string]: i } as React.CSSProperties} />
        ))}
      </span>
      <span className="mini-linea" />
      {linea === "consultoria" && (
        <>
          <span className="mini-agente" />
          <span className="mini-linea" />
        </>
      )}
      <span className="mini-columna">
        {filas.map((i) => (
          <span key={i} className="mini-ficha" style={{ ["--i" as string]: i } as React.CSSProperties} />
        ))}
      </span>
    </span>
  );
}
