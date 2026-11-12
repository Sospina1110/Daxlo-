import { Boton } from "@/components/ui/boton";
import { Migas } from "@/components/ui/migas";
import { FondoVideo } from "@/components/inicio/fondo-video";
import { Foto } from "@/components/inicio/foto";
import { TramaHero } from "@/components/inicio/trama-hero";
import type { VideoFondo as Video } from "@/lib/campo/video";
import { sinCorte } from "@/lib/utils";

// La cabecera de una página interna (paginas.css, .cp-cabecera): las migas,
// un rótulo en mono, el titular en peso fino (el único h1 de la página), una
// bajada corta y, si la página vende algo, un botón pequeño con su nota.
//
// - variante "foto": a sangre sobre una toma con su video y la trama de
//   puntos viva encima, como el hero del inicio pero más baja; el texto va
//   abajo a la izquierda.
// - variante "centro": sin toma, el texto centrado. Con fondo "hondo" va
//   sobre el azul profundo con un horizonte de luz, y debajo del texto puede
//   llevar una pieza dibujada (children).
//
// `rotuloEnTitular`: el rótulo es parte del h1 (el nombre del servicio, que
// es lo que se busca). Si no, va como párrafo aparte.
//
// La entrada corre en CSS, sin esperar a React, y no mueve la caja de nada:
// la toma funde, cada renglón del titular sube desde abajo de su máscara y
// lo demás llega 16 px después.
type Props = {
  variante: "foto" | "centro";
  fondo?: "hondo";
  migas: string;
  // Sin rótulo, las migas hacen de rótulo.
  rotulo?: string;
  rotuloEnTitular?: boolean;
  // La pieza de abajo ocupa todo el ancho del contenido.
  piezaAncha?: boolean;
  // Un renglón por frase.
  titulo: readonly string[];
  sub?: string;
  accion?: { texto: string; href: string };
  nota?: readonly string[];
  foto?: { nombre: string; ancho: number; alto: number; video: Video | null };
  children?: React.ReactNode;
};

const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as React.CSSProperties;

export function Cabecera({ variante, fondo, migas, rotulo, rotuloEnTitular = false, piezaAncha = false, titulo, sub, accion, nota, foto, children }: Props) {
  const enTitular = Boolean(rotulo) && rotuloEnTitular;
  const texto = (
    <>
      <Migas actual={migas} soloInicio={enTitular} className="cm-hero-entra" />
      {rotulo && !enTitular && (
        <p style={{ marginTop: 20 }} className="cm-mono cm-corchete cp-rotulo cm-hero-entra">
          {rotulo}
        </p>
      )}
      <h1 id="titulo-pagina" className="cp-h1">
        {rotulo && enTitular && <span className="cm-mono cm-corchete cp-rotulo cm-hero-entra">{sinCorte(rotulo)} </span>}
        <span className="cm-titular cm-titular-xl">
          {titulo.map((frase, i) => (
            <span key={frase} className="cm-linea">
              <span style={{ "--i": i } as React.CSSProperties}>{frase} </span>
            </span>
          ))}
        </span>
      </h1>
      {sub && (
        <p style={retraso(650)} className="cm-texto-l cp-cabecera-sub cm-hero-entra">
          {sub}
        </p>
      )}
      {accion && (
        <div style={retraso(780)} className="cp-cabecera-accion cm-hero-entra">
          <Boton href={accion.href}>{accion.texto}</Boton>
          {nota && (
            <ul className="cm-mono cp-nota">
              {nota.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );

  return (
    <section aria-labelledby="titulo-pagina" data-tema="oscuro" data-variante={variante} data-fondo={fondo} className="cp-cabecera">
      {foto && (
        <div aria-hidden="true" data-escena={foto.nombre} className="cp-cabecera-fondo">
          <div className="cp-cabecera-medios">
            <Foto nombre={foto.nombre} ancho={foto.ancho} alto={foto.alto} prioridad />
            {foto.video && <FondoVideo video={foto.video} espera />}
          </div>
          <span className="cp-cabecera-velo" />
          <TramaHero />
          <span className="cm-grano" />
        </div>
      )}
      {fondo === "hondo" && <span aria-hidden="true" className="cp-horizonte" />}
      {variante === "foto" ? <div className="cp-cabecera-contenido">{texto}</div> : texto}
      {children && (
        <div style={retraso(900)} data-ancha={piezaAncha ? "" : undefined} className="cp-cabecera-pieza cm-hero-entra">
          {children}
        </div>
      )}
    </section>
  );
}
