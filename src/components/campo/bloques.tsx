import Link from "next/link";
import { ArrowRight, Check, X } from "@phosphor-icons/react/dist/ssr";
import { dosFormas, faq, preguntasLinea, rutas } from "@/content/copy";
import { Enciende } from "@/components/inicio/enciende";
import { Foto } from "@/components/inicio/foto";
import { cn, sinCorte } from "@/lib/utils";
import { Indice } from "./indice";
import { Pregunta } from "./pregunta";

// Las piezas de las páginas internas que no necesitan JavaScript propio
// (paginas.css). Poco texto y mucho aire: una idea por pantalla. Cada sección
// dice su tema con data-tema y la barra lo sigue.

type Linea = "coaching" | "consultoria";

// ------------------------------------------------ Afirmación que se enciende

// Un rótulo, una frase que se enciende palabra por palabra con el scroll y
// el resto de la pantalla, vacío. Sobre claro o sobre oscuro.
export function Afirmacion({ id, rotulo, texto, tema = "claro" }: { id: string; rotulo: string; texto: string; tema?: "claro" | "oscuro" }) {
  return (
    <section aria-labelledby={id} data-tema={tema} className={cn(tema === "claro" ? "cm-claro" : "cp-oscuro", "cm-afirmacion")}>
      <h2 id={id} className="cm-mono cm-afirmacion-rotulo">
        {rotulo}
      </h2>
      <Enciende texto={texto} className="cm-titular cm-titular-m" />
    </section>
  );
}

// ------------------------------------------------ Pasos

// Paneles apilados sobre oscuro: cada paso con su dibujo sobre azul, su
// título, una línea y lo que te llevas. A la izquierda, en escritorio, el
// índice fijo que marca el paso que se está viendo. El HTML trae todos los
// pasos completos, en orden, dentro de un <ol>.
type Paso = { numero: string; etapa: string; titulo: string; texto: string; rotulo: string; llevas: string };

export function Pasos({ id, rotulo, titulo, pasos, etiqueta, dibujo }: { id: string; rotulo: string; titulo: string; pasos: readonly Paso[]; etiqueta: string; dibujo: (n: number) => React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`titulo-${id}`} data-tema="oscuro" className="cp-oscuro cp-pasos">
      <div data-revelar="" className="cp-cabeza">
        <p className="cm-mono cm-corchete">{rotulo}</p>
        <h2 id={`titulo-${id}`} className="cm-titular cm-titular-l">
          {titulo}
        </h2>
      </div>
      <div data-indice="" className="cp-pasos-cuerpo">
        <Indice items={pasos.map((p) => p.etapa)} objetivo=".cp-paso" />
        <ol className="cp-pasos-lista">
          {pasos.map((p, n) => (
            <li key={p.numero} data-revelar="marca" className="cp-paso">
              <div aria-hidden="true" className="cp-dibujo">
                {dibujo(n)}
                <span className="cm-mono cm-corchete">{etiqueta}</span>
              </div>
              <div className="cp-paso-texto">
                <p className="cm-mono">
                  {p.numero}
                  <span aria-hidden="true">·</span>
                  {p.etapa}
                </p>
                <h3 className="cm-titular cm-titular-m">{p.titulo}</h3>
                <p className="cm-texto-m cp-paso-linea">{p.texto}</p>
                <p className="cp-paso-llevas">
                  <span className="cm-mono">{p.rotulo}</span>
                  <span className="cm-texto-m">{p.llevas}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ------------------------------------------------ Columnas

// Tres o cuatro columnas entre líneas punteadas: arriba el icono entre
// esquinas, abajo el título y una línea.
type Columna = { titulo: string; linea: string; icono: React.ReactNode };

export function Columnas({ id, rotulo, titulo, items, tema = "claro" }: { id: string; rotulo: string; titulo: string; items: readonly Columna[]; tema?: "claro" | "oscuro" }) {
  return (
    <section aria-labelledby={id} data-tema={tema} className={cn(tema === "claro" ? "cm-claro" : "cp-oscuro", "cp-columnas-seccion")}>
      <div data-revelar="" data-centro="" className="cp-cabeza">
        <p className="cm-mono cm-corchete">{rotulo}</p>
        <h2 id={id} className="cm-titular cm-titular-l">
          {titulo}
        </h2>
      </div>
      <ul data-escalonar="0.1" className="cp-columnas" style={{ "--cols": items.length } as React.CSSProperties}>
        {items.map((item) => (
          <li key={item.titulo} data-revelar="" className="cp-columna">
            <span aria-hidden="true" className="cp-icono">
              {item.icono}
            </span>
            <h3>{item.titulo}</h3>
            <p className="cm-texto-m">{item.linea}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ------------------------------------------------ Hoy y después

// Filas sobre claro: lo de hoy, apagado y con su tachado, una flecha y lo de
// después, en tinta.
type Cambio = { hoy: string; despues: string };

export function Cambios({ id, rotulo, titulo, hoy, despues, filas }: { id: string; rotulo: string; titulo: string; hoy: string; despues: string; filas: readonly Cambio[] }) {
  return (
    <section id={id} aria-labelledby={`titulo-${id}`} data-tema="claro" className="cm-claro cp-cambios">
      <div data-revelar="" className="cp-cabeza">
        <p className="cm-mono cm-corchete">{rotulo}</p>
        <h2 id={`titulo-${id}`} className="cm-titular cm-titular-l">
          {titulo}
        </h2>
      </div>
      <ol className="cp-cambios-filas">
        {filas.map((f, n) => (
          <li key={f.despues} data-revelar="" className="cp-cambio">
            <p aria-hidden="true" className="cm-mono">
              [0{n + 1}]
            </p>
            <div className="cp-cambio-hoy">
              <p className="cm-mono">{hoy}</p>
              <p className="cm-texto-l">{f.hoy}</p>
            </div>
            <ArrowRight aria-hidden size={28} weight="light" className="cp-cambio-flecha" />
            <div className="cp-cambio-despues">
              <p className="cm-mono">{despues}</p>
              <p className="cm-titular cm-titular-s">{f.despues}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ------------------------------------------------ Para quién

// A la izquierda, la pregunta (con `cita`, la que filtra, en grande); a la
// derecha, las listas de «es para ti si» y «no es para ti si», y el puente a
// la otra línea.
type ListaQuien = { titulo: string; items: readonly string[]; tipo: "si" | "no" };

export function ParaQuien({ id, rotulo, titulo, cita, respuesta, listas, enlace }: { id: string; rotulo: string; titulo: string; cita?: string; respuesta?: string; listas: readonly ListaQuien[]; enlace: { t: string; h: string } }) {
  return (
    <section aria-labelledby={id} data-tema="claro" className="cm-claro">
      <div className="cp-quien">
        <div data-revelar="">
          <p className="cm-mono cm-corchete">{rotulo}</p>
          <h2 id={id} className={cn("cm-titular", cita ? "cm-titular-s" : "cm-titular-l")}>
            {titulo}
          </h2>
          {cita && <p className="cm-titular cm-titular-m cp-quien-cita">{cita}</p>}
          {respuesta && <p className="cm-texto-l cp-quien-respuesta">{respuesta}</p>}
        </div>
        <div className="cp-quien-listas">
          {listas.map((l) => (
            <div key={l.titulo} data-revelar="">
              <h3 className="cm-mono">{l.titulo}</h3>
              <ul data-si={l.tipo === "si" ? "" : undefined} data-no={l.tipo === "no" ? "" : undefined} className="cp-quien-lista">
                {l.items.map((item) => (
                  <li key={item}>
                    {l.tipo === "si" ? <Check aria-hidden size={18} weight="light" /> : <X aria-hidden size={18} weight="light" />}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Link href={enlace.h} className="cm-enlace">
            {sinCorte(enlace.t)}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------ Franja

// Una pregunta y su salida, entre dos líneas punteadas.
export function Franja({ id, rotulo, titulo, texto, enlace }: { id: string; rotulo: string; titulo: string; texto: string; enlace: { t: string; h: string } }) {
  return (
    <section aria-labelledby={`titulo-${id}`} data-tema="claro" className="cm-claro cp-franja-seccion">
      <div id={id} data-revelar="" className="cp-marco cp-franja">
        <div>
          <p className="cm-mono cm-corchete">{rotulo}</p>
          <h2 id={`titulo-${id}`} className="cm-titular cm-titular-m">
            {titulo}
          </h2>
        </div>
        <div>
          <p className="cm-texto-l">{texto}</p>
          <Link href={enlace.h} className="cm-enlace">
            {sinCorte(enlace.t)}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------ Las dos puertas

// Las dos líneas, con la regla de las puertas del inicio: dos tarjetas con
// fotografía, cada una un enlace entero a su página.
export function DosPuertas({ id, rotulo, titulo }: { id: string; rotulo: string; titulo: string }) {
  const puertas = [
    { ...dosFormas.coaching, href: rutas.coaching, foto: "t-persiana" },
    { ...dosFormas.consultoria, href: rutas.consultoria, foto: "t-oficina" },
  ];
  return (
    <section aria-labelledby={id} data-tema="claro" className="cm-claro cp-dos-puertas">
      <div data-revelar="" className="cp-cabeza">
        <p className="cm-mono cm-corchete">{rotulo}</p>
        <h2 id={id} className="cm-titular cm-titular-l">
          {titulo}
        </h2>
      </div>
      <ul data-escalonar="0.1" className="cm-puertas-lista">
        {puertas.map((p) => (
          <li key={p.etiqueta} data-revelar="">
            <Link href={p.href} className="cm-puerta">
              <span aria-hidden="true" className="cm-puerta-foto">
                <Foto nombre={p.foto} ancho={560} alto={700} />
              </span>
              <span className="cm-mono cm-puerta-regla">{p.regla}</span>
              <span className="cm-titular cm-titular-m cm-puerta-titulo">
                {p.etiqueta}
                <ArrowRight aria-hidden size={28} weight="light" />
              </span>
              <span className="cm-texto-m cm-puerta-linea">{p.linea}</span>
              <span className="cm-mono cm-puerta-servicio">{sinCorte(p.titulo)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ------------------------------------------------ Panel de tres tarjetas

// El panel azul profundo del inicio, con tres tarjetas numeradas: cada una
// con su dibujo de línea, su título y una línea.
type Tarjeta = { titulo: string; linea: string };

export function PanelTres({ id, rotulo, titulo, tarjetas, nota, dibujo }: { id: string; rotulo: string; titulo: string; tarjetas: readonly Tarjeta[]; nota?: string; dibujo: (n: number) => React.ReactNode }) {
  return (
    <section aria-labelledby={id} data-tema="claro" className="cm-claro cm-sistema">
      <div data-tema="oscuro" className="cm-panel">
        <span aria-hidden="true" className="cm-grano" />
        <div data-revelar="" className="cm-panel-cabeza">
          <p className="cm-mono cm-panel-nombre">{rotulo}</p>
          <h2 id={id} className="cm-titular cm-titular-l">
            {titulo}
          </h2>
        </div>
        <ol data-tres="" className="cm-capas">
          {tarjetas.map((t, n) => (
            <li key={t.titulo} data-revelar="marca" className="cm-capa">
              <p aria-hidden="true" className="cm-mono cm-capa-rotulo">
                0{n + 1}
              </p>
              {dibujo(n)}
              <h3>{t.titulo}</h3>
              <p className="cm-texto-s">{t.linea}</p>
            </li>
          ))}
        </ol>
        {nota && (
          <p data-revelar="" className="cm-texto-m cp-panel-nota">
            {nota}
          </p>
        )}
      </div>
    </section>
  );
}

// ------------------------------------------------ Preguntas de una línea

// Las dudas de cada línea, sobre claro: la cabeza a la izquierda (fija en
// escritorio, con el enlace a todas las preguntas) y las filas a la derecha.
// Las respuestas están en el HTML del servidor pero cerradas: guardan el
// texto para buscadores sin alargar la lectura.
export function PreguntasLinea({ linea }: { linea: Linea }) {
  const cfg = preguntasLinea[linea];
  const grupo = faq.grupos[cfg.grupo];
  return (
    <section aria-labelledby={`preguntas-${linea}`} data-tema="claro" className="cm-claro">
      <div className="cp-preguntas">
        <div data-revelar="" className="cp-preguntas-cabeza">
          <p className="cm-mono cm-corchete">{faq.badge}</p>
          <h2 id={`preguntas-${linea}`} className="cm-titular cm-titular-m">
            {cfg.titulo}
          </h2>
          <Link href={`${rutas.preguntas}#${linea}`} className="cm-enlace">
            {preguntasLinea.todas}
          </Link>
        </div>
        <div>
          {grupo.preguntas.map((q) => (
            <Pregunta key={q.p} pregunta={q.p} respuesta={q.r} enlace={q.enlace} />
          ))}
        </div>
      </div>
    </section>
  );
}
