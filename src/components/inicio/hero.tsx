import { hero, rutas } from "@/content/copy";
import { Boton } from "@/components/ui/boton";
import type { VideoFondo as Video } from "@/lib/campo/video";
import { FondoVideo } from "./fondo-video";
import { Foto } from "./foto";
import { TramaHero } from "./trama-hero";

// El hero del inicio «Campo»: a pantalla completa sobre el video de la sala
// (su póster mientras carga), con la trama de puntos viva encima (un lienzo)
// y tres rótulos en mono. El texto va abajo a la izquierda, sobre la mitad
// oscura de la toma: un rótulo, el titular en peso fino (una frase por
// renglón en escritorio), la bajada corta y un botón pequeño. En pantallas
// más altas que anchas se usa la toma vertical y el texto va arriba.
//
// La entrada corre en CSS, sin esperar a React, y no mueve la caja de nada:
// el póster funde, cada frase del titular sube desde abajo de su máscara y lo
// demás llega 16 px después. El póster es la imagen más grande de la primera
// pantalla: se pide de primera (fetchpriority) y llena su caja, así que no
// hay salto al cargar. El video se pide después, con la página ya cargada.

// Dónde apunta cada rótulo, en fracciones del ancho y del alto de la toma, y
// hacia dónde sale su guía (en px; --dy positivo sube).
const ANCLAS = [
  { fx: 0.775, fy: 0.665, dx: 54, dy: -84, fin: false },
  { fx: 0.685, fy: 0.44, dx: -64, dy: 62, fin: true },
  { fx: 0.845, fy: 0.6, dx: 40, dy: 148, fin: true },
];

const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as React.CSSProperties;

export function Hero({ video, vertical }: { video: Video | null; vertical: Video | null }) {
  return (
    <section id="top" aria-labelledby="titulo-hero" data-tema="oscuro" className="cm-hero">
      <div aria-hidden="true" className="cm-hero-fondo">
        <div className="cm-hero-medios">
          <Foto nombre="hero" ancho={1600} alto={893} vertical prioridad />
          {video && <FondoVideo video={video} vertical={vertical} espera />}
        </div>
        <span className="cm-hero-velo" />
        <TramaHero />
        <span className="cm-grano" />
        <div className="cm-notas">
          {hero.rotulos.notas.map((n, i) => {
            const a = ANCLAS[i];
            return (
              <p key={n.clave} data-fin={a.fin || undefined} className="cm-nota" style={{ "--fx": a.fx, "--fy": a.fy, "--dx": `${a.dx}px`, "--dy": `${a.dy}px` } as React.CSSProperties}>
                <svg width="1" height="1" fill="none" stroke="currentColor">
                  <circle r="3.5" />
                  <line x1="0" y1="0" x2={a.dx} y2={-a.dy} strokeDasharray="2 4" opacity="0.8" />
                </svg>
                <span className="cm-mono cm-nota-texto">
                  <b>{n.clave}</b>
                  {n.valor}
                </span>
              </p>
            );
          })}
          <p className="cm-mono cm-corchete cm-notas-etiqueta">{hero.rotulos.etiqueta}</p>
        </div>
      </div>

      <div className="cm-hero-contenido">
        <p className="cm-mono cm-corchete cm-hero-rotulo cm-hero-entra">{hero.aliado}</p>
        <h1 id="titulo-hero" className="cm-titular cm-titular-xl">
          {hero.titulo.map((frase, i) => (
            <span key={frase} className="cm-linea">
              <span style={{ "--i": i } as React.CSSProperties}>{frase} </span>
            </span>
          ))}
        </h1>
        <p style={retraso(650)} className="cm-texto-l cm-hero-sub cm-hero-entra">
          {hero.sub}
        </p>
        <div style={retraso(780)} className="cm-hero-accion cm-hero-entra">
          <Boton href={rutas.agendar}>{hero.cta}</Boton>
          <p className="cm-mono cm-hero-meta">{hero.meta}</p>
        </div>
      </div>
    </section>
  );
}
