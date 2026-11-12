import { Cabecera } from "@/components/campo/cabecera";
import { Elegir, Grupos } from "@/components/campo/preguntas";
import { Cierre } from "@/components/inicio/secciones";
import { JsonLd } from "@/components/ui/json-ld";
import { faq } from "@/content/copy";
import { videoDe } from "@/lib/campo/video";
import { ldMigas, ldPreguntas, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("preguntas");

// /preguntas, en el sistema «Campo»: abre con cómo elegir (las dos reglas,
// cada una con su puerta) y sigue con las preguntas en filas limpias, por
// grupos, con el índice fijo a la izquierda. Las respuestas van en el HTML
// del servidor, cerradas, y en los datos estructurados (FAQPage).
export default function PaginaPreguntas() {
  const f = faq;
  return (
    <div className="campo">
      <Cabecera variante="centro" migas={f.titulo} titulo={[f.titulo]} sub={f.sub} piezaAncha>
        <Elegir />
      </Cabecera>
      <Grupos />
      <Cierre video={videoDe("daxlo-luz")} />
      <JsonLd datos={[ldPreguntas, ldMigas("preguntas", f.titulo)]} />
    </div>
  );
}
