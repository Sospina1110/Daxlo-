import { Afirmacion, DosPuertas } from "@/components/campo/bloques";
import { Cabecera } from "@/components/campo/cabecera";
import { Cadena, ListaHerramientas } from "@/components/campo/herramientas";
import { Cierre } from "@/components/inicio/secciones";
import { JsonLd } from "@/components/ui/json-ld";
import { faq, herramientas } from "@/content/copy";
import { videoDe } from "@/lib/campo/video";
import { ldMigas, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("herramientas");

// /herramientas, en el sistema «Campo»: con qué trabajamos, para qué sirve
// cada una y por qué no son de Daxlo. Sin toma: la cabecera va sobre el azul
// profundo, con las siete herramientas en fila.
//
//   1  Cabecera sobre azul profundo, con la cadena de herramientas
//   2  Para qué sirve cada una: una fila por herramienta
//   3  Por qué no son nuestras: la afirmación que se enciende
//   4  Las dos puertas (dónde se usan) y el cierre
export default function PaginaHerramientas() {
  const h = herramientas;
  return (
    <div className="campo">
      <Cabecera variante="centro" fondo="hondo" migas={h.badge} titulo={[h.titulo]} sub={h.sub}>
        <Cadena />
      </Cabecera>
      <ListaHerramientas />
      <Afirmacion id="titulo-porque" rotulo={h.porque.rotulo} texto={h.porque.texto} />
      <DosPuertas id="titulo-puertas" rotulo={h.puertas} titulo={faq.elegir.titulo} />
      <Cierre video={videoDe("daxlo-luz")} />
      <JsonLd datos={ldMigas("herramientas", h.badge)} />
    </div>
  );
}
