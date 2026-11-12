import { Afirmacion, DosPuertas } from "@/components/campo/bloques";
import { Cabecera } from "@/components/campo/cabecera";
import { Detras, Montado, Reglas, Toma } from "@/components/campo/trabajamos";
import { Cierre, FraseFoto } from "@/components/inicio/secciones";
import { JsonLd } from "@/components/ui/json-ld";
import { faq, nosotros } from "@/content/copy";
import { videoDe } from "@/lib/campo/video";
import { ldMigas, ldSobreNosotros, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("nosotros");

// /nosotros, que es «Cómo trabajamos», en el sistema «Campo»: las reglas de
// trabajo de Daxlo, lo que queda montado y quién está detrás.
//
//   1  Cabecera centrada, con la toma de la sala en un panel ancho
//   2  Por qué así: la afirmación que se enciende
//   3  Seis reglas de trabajo, cada una con su icono de línea
//   4  El límite, sobre una toma a sangre
//   5  Lo que queda montado: las capas apiladas, en el panel azul
//   6  Quién está detrás: una línea
//   7  Las dos puertas y el cierre
export default function PaginaNosotros() {
  const n = nosotros;
  return (
    <div className="campo">
      <Cabecera variante="centro" migas={n.etiqueta} titulo={[n.titulo]} sub={n.sub} piezaAncha>
        <Toma nombre="hero-b" ancho={1280} alto={720} video={videoDe("daxlo-hero-b")} />
      </Cabecera>
      <Afirmacion id="titulo-contraste" rotulo={n.contraste.rotulo} texto={n.contraste.texto} />
      <Reglas />
      <FraseFoto texto={n.frase} foto="operacion" video={videoDe("daxlo-operacion")} />
      <Montado />
      <Detras />
      <DosPuertas id="titulo-puertas" rotulo={faq.elegir.rotulo} titulo={faq.elegir.titulo} />
      <Cierre video={videoDe("daxlo-luz")} />
      <JsonLd datos={[ldSobreNosotros, ldMigas("nosotros", n.etiqueta)]} />
    </div>
  );
}
