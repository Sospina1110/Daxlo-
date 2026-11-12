import Link from "next/link";
import { inicio, nosotros, rutas } from "@/content/copy";
import { MarcaX } from "@/components/inicio/dibujos";
import { FondoVideo } from "@/components/inicio/fondo-video";
import { Foto } from "@/components/inicio/foto";
import { TramaHero } from "@/components/inicio/trama-hero";
import type { VideoFondo as Video } from "@/lib/campo/video";
import { DibujoCapas, IconoRegla } from "./dibujos";

// Las secciones propias de /nosotros, «Cómo trabajamos» (paginas.css).

const numero = (n: number) => String(n).padStart(2, "0");

// ------------------------------------------------ /nosotros: la toma

// La toma de la cabecera de «Cómo trabajamos»: un panel ancho con el video
// de la sala y la trama de puntos encima.
export function Toma({ nombre, ancho, alto, video }: { nombre: string; ancho: number; alto: number; video: Video | null }) {
  return (
    <div aria-hidden="true" className="cp-toma">
      <div className="cp-toma-medios">
        <Foto nombre={nombre} ancho={ancho} alto={alto} prioridad />
        {video && <FondoVideo video={video} espera />}
      </div>
      <TramaHero />
      <span className="cm-grano" />
    </div>
  );
}

// ------------------------------------------------ /nosotros: las reglas

// Seis reglas de trabajo sobre oscuro: el titular a la izquierda, fijo en
// escritorio, y a la derecha cada regla con su icono de línea.
export function Reglas() {
  const r = nosotros.reglas;
  return (
    <section aria-labelledby="titulo-reglas" data-tema="oscuro" className="cp-oscuro">
      <div className="cp-reglas">
        <div data-revelar="" className="cp-reglas-cabeza">
          <p className="cm-mono cm-corchete">{r.rotulo}</p>
          <h2 id="titulo-reglas" className="cm-titular cm-titular-l">
            {r.titulo}
          </h2>
        </div>
        <ol className="cp-reglas-lista">
          {r.lista.map((regla, n) => (
            <li key={regla.titulo} data-revelar="marca" className="cp-regla">
              <IconoRegla n={n} />
              <div>
                <p aria-hidden="true" className="cm-mono">
                  [{numero(n + 1)}]
                </p>
                <h3 className="cm-titular cm-titular-s">{regla.titulo}</h3>
                <p className="cm-texto-m">{regla.linea}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ------------------------------------------------ /nosotros: lo que queda montado

// El panel azul profundo con las capas apiladas, dibujadas, y sus nombres al
// lado (los de las seis capas del inicio, de arriba hacia abajo, como en el
// dibujo). El enlace lleva al panel del inicio, capa por capa.
export function Montado() {
  const m = nosotros.montado;
  const capas = inicio.sistema.capas.map((c, n) => ({ ...c, n })).reverse();
  return (
    <section aria-labelledby="titulo-montado" data-tema="claro" className="cm-claro cm-sistema cp-panel-seccion">
      <div data-tema="oscuro" className="cm-panel">
        <span aria-hidden="true" className="cm-grano" />
        <div data-revelar="" className="cm-panel-cabeza">
          <MarcaX />
          <p className="cm-mono cm-panel-nombre">{m.rotulo}</p>
          <h2 id="titulo-montado" className="cm-titular cm-titular-l">
            {m.titulo}
          </h2>
        </div>
        <div data-revelar="marca" className="cp-montado">
          <DibujoCapas className="cp-montado-dibujo" />
          <div>
            <ol reversed className="cp-montado-capas">
              {capas.map((c) => (
                <li key={c.id}>
                  <span aria-hidden="true" className="cm-mono">
                    {numero(c.n + 1)}
                  </span>
                  <span className="cm-titular cm-titular-s">{c.rotulo}</span>
                </li>
              ))}
            </ol>
            <Link href={`${rutas.inicio}#capa-herramientas`} className="cm-enlace">
              {m.enlace}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------ /nosotros: quién está detrás

export function Detras() {
  return (
    <section aria-label={nosotros.detras} data-tema="claro" className="cm-claro cp-detras">
      <div data-revelar="" className="cp-marco cp-detras-caja">
        <p className="cm-mono cm-corchete">{nosotros.detras}</p>
        <p className="cm-titular cm-titular-m">{nosotros.fundador}</p>
      </div>
    </section>
  );
}
