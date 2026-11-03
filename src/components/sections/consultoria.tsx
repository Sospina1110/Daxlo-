import { ArrowRight } from "lucide-react";
import { consultoria, otraLinea, rutas } from "@/content/copy";
import { LineaCapitulo, SectionHeading } from "@/components/ui/blocks";
import { cn } from "@/lib/utils";
import { ParaQuien, TarjetasProblema, Zona } from "./zona";
import { ZonaPortada } from "./zona-portada";

// La página contesta en orden: ¿qué es? (portada), ¿me pasa a mí? (escenas),
// ¿qué cambia? (hoy → después), ¿cómo lo hacen? (recorrido) y ¿es para mi
// empresa y con quién hablo? (para quién). Cómo elegimos el primer proceso va
// en las preguntas. Las preguntas y el cierre los pone la página.
export function ZonaConsultoria({ migas }: { migas?: React.ReactNode }) {
  const c = consultoria;
  const p = c.paraQuien;
  return (
    <Zona tono="blue" arriba>
      <ZonaPortada tono="blue" {...c.portada} migas={migas} />
      <TarjetasProblema tono="blue" titulo={c.problema.titulo} escenas={c.problema.escenas} />
      <CambiosEmpresa />
      <Recorrido />
      <ParaQuien
        id="para-tu-empresa"
        tono="blue"
        titulo={p.titulo}
        cita={p.cita}
        respuesta={p.respuesta}
        noEs={p.noEs}
        enlace={{ texto: otraLinea.coaching.enlace, href: rutas.coaching }}
        socios={p.socios}
      />
    </Zona>
  );
}

// ------------------------------------------------ Qué cambia

// Hoy → después, en filas con regla. El peso cae en el resultado: "Hoy" en
// Inter de 18 px blanco al 75 % con la raya al 40 % (al 66 % con la raya al
// 45 % costaba leerlo), "Después" en Outfit 500 de 22 px blanco.
// Es el momento de autor de la página (DESIGN.md, Motion): desde 1024 px, cada
// "Hoy" se tacha al entrar en pantalla con una raya de 1 px que crece de
// izquierda a derecha (solo transform). Por debajo de 1024 px el tachado es
// fijo (line-through). Sin JavaScript o con "reducir movimiento", tachado y
// quieto. El id sigue siendo que-automatizamos: lo usan la redirección
// #automatizamos, los enlaces viejos, el pie y las pruebas.
function CambiosEmpresa() {
  const a = consultoria.cambios;
  return (
    <section id="que-automatizamos" className="relative py-16 md:py-24">
      <LineaCapitulo tono="blue" />
      <div className="container-page">
        <SectionHeading titulo={a.titulo} tono="blue" alineacion="izquierda" />
        <div aria-hidden className="mt-10 hidden grid-cols-[1fr_48px_1fr] gap-x-4 md:mt-14 lg:grid">
          <Rotulo>{a.hoy}</Rotulo>
          <span />
          <Rotulo azul>{a.despues}</Rotulo>
        </div>
        <p aria-hidden className="mt-10 flex items-center gap-2 md:mt-14 lg:hidden">
          <Rotulo as="span">{a.hoy}</Rotulo>
          <ArrowRight size={14} className="text-blue-soft" />
          <Rotulo as="span" azul>
            {a.despues}
          </Rotulo>
        </p>
        <ul className="mt-3 border-b border-line">
          {a.filas.map((c, i) => (
            <li
              key={c.despues}
              data-revelar=""
              style={{ ["--retraso" as string]: `${Math.min(0.32, i * 0.08)}s`, ["--y" as string]: "12px" } as React.CSSProperties}
              className="grid gap-2 border-t border-line py-4 lg:grid-cols-[1fr_48px_1fr] lg:items-center lg:gap-x-4 lg:py-5"
            >
              <p className="text-[18px] leading-snug text-white/75">
                <span className="sr-only">{a.hoy}: </span>
                <span className="relative line-through decoration-white/40 lg:inline-block lg:whitespace-nowrap lg:no-underline">
                  {c.hoy}
                  <span aria-hidden className="tachado-linea absolute inset-x-0 top-1/2 hidden h-px bg-white/40 lg:block" />
                </span>
              </p>
              <ArrowRight aria-hidden size={18} className="hidden text-blue-soft lg:block" />
              <p className="flex items-start gap-3 font-display text-[22px] font-medium leading-snug text-white">
                <span aria-hidden className="mt-[14px] h-[2px] w-2.5 shrink-0 rounded-full bg-blue-soft lg:hidden" />
                <span>
                  <span className="sr-only">{a.despues}: </span>
                  {c.despues}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Rótulo de los únicos microrrótulos de la página ("Hoy" y "Después"):
// `caption` (Inter de 13 px) en mayúsculas, peso 500, 0.1em; blanco al 66 % o
// azul claro.
function Rotulo({ children, azul = false, as = "p" }: { children: React.ReactNode; azul?: boolean; as?: "p" | "span" }) {
  const Comp = as;
  return <Comp className={cn("text-[13px] font-medium uppercase leading-snug tracking-[0.1em]", azul ? "text-blue-soft" : "text-white/66")}>{children}</Comp>;
}

// ------------------------------------------------ Cómo trabajamos

// El proceso como línea de tiempo: cuatro pasos en un <ol>, cada uno con lo
// que te llevas. En escritorio, cuatro columnas unidas por una línea de 1 px
// entre nodos; en celular, lista vertical con la línea a la izquierda. Todos
// los nodos iguales. Sin figura debajo: cómo elegimos el primer proceso (lo
// que se dice en la reunión contra lo que muestran los documentos, y las
// cuatro preguntas que lo filtran) va en la pregunta "¿Cómo identifican qué
// proceso cambiar primero?"; en el cuerpo queda una cláusula del paso 02.
function Recorrido() {
  const r = consultoria.recorrido;
  const ultimo = r.pasos.length - 1;
  return (
    <section id="como-trabajamos" className="relative py-16 md:py-24">
      <LineaCapitulo tono="blue" />
      <div className="container-page">
        <SectionHeading titulo={r.titulo} tono="blue" alineacion="izquierda" />
        <ol data-escalonar="0.08" className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-4 lg:gap-8">
          {r.pasos.map((p, i) => (
            <li key={p.numero} data-revelar="" className="relative pl-10 lg:pl-0 lg:pt-8">
              {/* La línea que une los nodos: vertical en celular, horizontal
                  hasta el nodo siguiente en escritorio. */}
              {i < ultimo && (
                <span
                  aria-hidden
                  className="absolute bottom-[-44px] left-[15px] top-3 w-px bg-blue-soft/40 lg:bottom-auto lg:left-3 lg:right-[-32px] lg:top-[5.5px] lg:h-px lg:w-auto"
                />
              )}
              <span aria-hidden className="absolute left-[9.5px] top-1.5 h-3 w-3 rounded-full border border-blue-soft bg-[#08090e] lg:left-0 lg:top-0" />
              <p className="font-display text-[15px] font-medium tracking-[0.1em] text-blue-soft">{p.numero}</p>
              <h3 className="mt-2 text-[22px] leading-snug text-white">{p.titulo}</h3>
              <p className="mt-2 text-[17px] leading-relaxed text-muted">{p.texto}</p>
              {/* "Te llevas" en minúscula y 15 px: repetido cuatro veces en
                  mayúsculas espaciadas gritaba más que el entregable. */}
              <p className="mt-4 text-[15px] font-medium leading-snug text-blue-soft">{p.rotulo}</p>
              <p className="mt-1 text-[17px] leading-snug text-white">{p.llevas}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
