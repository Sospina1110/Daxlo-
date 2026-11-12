import { CheckSquare, FileText, ListChecks } from "@phosphor-icons/react/dist/ssr";
import { Columnas, Franja, ParaQuien, PreguntasLinea } from "@/components/campo/bloques";
import { Cabecera } from "@/components/campo/cabecera";
import { Lista } from "@/components/campo/lista";
import { Sesion } from "@/components/campo/sesion";
import { Cierre, FraseFoto } from "@/components/inicio/secciones";
import { JsonLd } from "@/components/ui/json-ld";
import { agendarCon, coaching, dosFormas, hero, otraLinea, rutas, servicios } from "@/content/copy";
import { videoDe } from "@/lib/campo/video";
import { ldMigas, ldServicio, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("coaching");

// /coaching, en el sistema «Campo»: para ti y para tu gente. Una idea por
// pantalla, sobre el armazón de las páginas interiores de la referencia.
//
//   1  Cabecera sobre la toma de las manos en el teclado (escribes tú)
//   2  Tres razones por las que ese trabajo sigue tomando horas (lista fijada)
//   3  Cómo es una sesión: el panel azul con los tres pasos y la ventana de
//      ejemplo (#como-funciona)
//   4  Lo que te llevas: tres columnas con icono
//   5  El límite, sobre una toma a sangre
//   6  Para quién: es para ti si y no es para ti si
//   7  Para tu gente: la franja para empresas (#equipos)
//   8  Las preguntas de la línea, cerradas, y el cierre
const ICONOS = [CheckSquare, ListChecks, FileText];

export default function PaginaCoaching() {
  const c = coaching;
  return (
    <div className="campo">
      <Cabecera
        variante="foto"
        migas={servicios.coaching}
        rotulo={c.portada.eyebrow}
        rotuloEnTitular
        titulo={[c.portada.titulo]}
        sub={c.portada.sub}
        accion={{ texto: hero.cta, href: agendarCon("coaching") }}
        nota={c.portada.nota}
        foto={{ nombre: "giro", ancho: 1600, alto: 893, video: videoDe("daxlo-giro") }}
      />
      <Lista id="titulo-problema" rotulo={c.problema.rotulo} titulo={c.problema.titulo} items={c.problema.escenas.map((titulo) => ({ titulo }))} />
      <Sesion />
      <Columnas
        id="titulo-llevas"
        rotulo={c.llevas.rotulo}
        titulo={c.llevas.titulo}
        items={c.llevas.lista.map((item, n) => {
          const Icono = ICONOS[n];
          return { ...item, icono: <Icono size={22} weight="light" /> };
        })}
      />
      <FraseFoto texto={c.sesion.remate} foto="problema" video={videoDe("daxlo-problema")} />
      <ParaQuien
        id="titulo-quien"
        rotulo={c.paraTi.rotulo}
        titulo={c.paraTi.titulo}
        listas={[
          { ...c.paraTi.es, tipo: "si" },
          { ...c.paraTi.noEs, tipo: "no" },
        ]}
        enlace={{ t: otraLinea.consultoria.enlace, h: rutas.consultoria }}
      />
      <Franja id="equipos" rotulo={c.equipos.rotulo} titulo={c.equipos.titulo} texto={c.equipos.texto} enlace={{ t: dosFormas.consultoria.enlace, h: rutas.consultoria }} />
      <PreguntasLinea linea="coaching" />
      <Cierre video={videoDe("daxlo-luz")} linea="coaching" />
      <JsonLd datos={[ldServicio("coaching"), ldMigas("coaching", servicios.coaching)]} />
    </div>
  );
}
