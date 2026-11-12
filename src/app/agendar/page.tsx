import { FormularioContacto } from "@/components/campo/formulario";
import { PasosAgendar } from "@/components/campo/agendar";
import { JsonLd } from "@/components/ui/json-ld";
import { Migas } from "@/components/ui/migas";
import { agendar } from "@/content/copy";
import { ldMigas, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("agendar");

const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as React.CSSProperties;

// /agendar, en el sistema «Campo»: sobre el azul profundo, el titular (el h1)
// con los tres pasos de lo que pasa después a la izquierda, y el formulario a
// la derecha, a la vista. En celular va todo en una columna: titular, pasos
// y formulario. La entrada corre en CSS y no mueve la caja de nada.
export default function PaginaAgendar() {
  const a = agendar;
  return (
    <div className="campo">
      <section aria-labelledby="titulo-pagina" data-tema="oscuro" className="cp-agendar">
        <span aria-hidden="true" className="cm-grano" />
        <div className="cp-agendar-rejilla">
          <div className="cp-agendar-texto">
            <Migas actual={a.badge} className="cm-hero-entra" />
            <h1 id="titulo-pagina" className="cp-h1">
              <span className="cm-titular cm-titular-xl">
                <span className="cm-linea">
                  <span>{a.titulo}</span>
                </span>
              </span>
            </h1>
            <p style={retraso(650)} className="cm-texto-l cp-cabecera-sub cm-hero-entra">
              {a.sub}
            </p>
            <div style={retraso(780)} className="cm-hero-entra">
              <PasosAgendar />
            </div>
          </div>
          <div style={retraso(500)} className="cm-hero-entra">
            <FormularioContacto />
          </div>
        </div>
      </section>
      <JsonLd datos={ldMigas("agendar", a.badge)} />
    </div>
  );
}
