import { ArrowRight } from "lucide-react";
import { consultoria, otraLinea, rutas } from "@/content/copy";
import { LineaCapitulo, SectionHeading } from "@/components/ui/blocks";
import { cn } from "@/lib/utils";
import { ParaQuien, TarjetasProblema, Zona } from "./zona";
import { ZonaPortada } from "./zona-portada";
import { Recorrido as RecorridoAnimado } from "./recorrido";
import { EscenaCosto, EscenaEmpezar, EscenaOrdenar, EscenaSiguiente } from "./recorrido-escenas";

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
              {/* La flecha llega con el tachado (.flecha-cambio): se corre 8 px
                  hacia "Después" mientras la raya termina. */}
              <ArrowRight aria-hidden size={18} className="flecha-cambio hidden text-blue-soft lg:block" />
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

// El método como un video corto (2026-11-06, pedido de Santiago): una escena
// animada por paso que avanza sola, con la barra de capítulos debajo y el
// texto del paso al lado (debajo en celular). Los cuatro pasos siguen
// completos en un <ol>; sin JavaScript se ven como la línea de tiempo de
// antes. El reproductor vive en recorrido.tsx y las escenas en
// recorrido-escenas.tsx (se pintan en el servidor y viajan como props). Cómo
// elegimos el primer proceso (lo que se dice en la reunión contra lo que
// muestran los documentos, y las cuatro preguntas que lo filtran) va en la
// pregunta "¿Cómo identifican qué proceso cambiar primero?"; en el cuerpo
// queda una cláusula del paso 02.
function Recorrido() {
  const r = consultoria.recorrido;
  const { escenas, ...textos } = r.animacion;
  return (
    <section id="como-trabajamos" className="relative py-16 md:py-24">
      <LineaCapitulo tono="blue" />
      <div className="container-page">
        <SectionHeading titulo={r.titulo} tono="blue" alineacion="izquierda" />
        <RecorridoAnimado
          pasos={r.pasos}
          textos={textos}
          escenas={[<EscenaCosto key="costo" />, <EscenaEmpezar key="empezar" />, <EscenaOrdenar key="ordenar" />, <EscenaSiguiente key="siguiente" />]}
        />
      </div>
    </section>
  );
}
