import { Afirmacion, Cambios, PanelTres, ParaQuien, Pasos, PreguntasLinea } from "@/components/campo/bloques";
import { Cabecera } from "@/components/campo/cabecera";
import { DibujoDespues, DibujoPaso } from "@/components/campo/dibujos";
import { Lista } from "@/components/campo/lista";
import { Cierre } from "@/components/inicio/secciones";
import { JsonLd } from "@/components/ui/json-ld";
import { agendarCon, consultoria, hero, otraLinea, rutas, servicios } from "@/content/copy";
import { videoDe } from "@/lib/campo/video";
import { ldMigas, ldServicio, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("consultoria");

// /consultoria, en el sistema «Campo»: cómo lo montamos. Una idea por
// pantalla, sobre el armazón de las páginas interiores de la referencia.
//
//   1  Cabecera sobre la toma de la mesa (el equipo ordenando un proceso)
//   2  Tres escenas de lo que pasa hoy, una a la vez (lista fijada)
//   3  Los cuatro pasos del método: paneles apilados con su dibujo y el
//      índice fijo (#como-trabajamos)
//   4  Por qué con tu gente: la afirmación que se enciende
//   5  Qué cambia: hoy y después (#que-automatizamos)
//   6  Después de la entrega: el panel azul con tres tarjetas
//   7  Para quién: la pregunta que filtra y a quién no le servimos
//   8  Las preguntas de la línea, cerradas, y el cierre
export default function PaginaConsultoria() {
  const c = consultoria;
  return (
    <div className="campo">
      <Cabecera
        variante="foto"
        migas={servicios.consultoria}
        rotulo={c.portada.eyebrow}
        rotuloEnTitular
        titulo={[c.portada.titulo]}
        sub={c.portada.sub}
        accion={{ texto: hero.cta, href: agendarCon("consultoria") }}
        nota={c.portada.nota}
        foto={{ nombre: "mesa", ancho: 1280, alto: 714, video: videoDe("daxlo-mesa") }}
      />
      <Lista id="titulo-problema" rotulo={c.problema.rotulo} titulo={c.problema.titulo} items={c.problema.escenas} />
      <Pasos id="como-trabajamos" rotulo={c.recorrido.rotulo} titulo={c.recorrido.titulo} pasos={c.recorrido.pasos} etiqueta={c.recorrido.dibujo.etiqueta} dibujo={(n) => <DibujoPaso n={n} />} />
      <Afirmacion id="titulo-afirmacion" rotulo={c.afirmacion.rotulo} texto={c.afirmacion.texto} />
      <Cambios id="que-automatizamos" rotulo={c.cambios.rotulo} titulo={c.cambios.titulo} hoy={c.cambios.hoy} despues={c.cambios.despues} filas={c.cambios.filas} />
      <PanelTres id="titulo-despues" rotulo={c.despues.rotulo} titulo={c.despues.titulo} tarjetas={c.despues.lista} nota={c.despues.nota} dibujo={(n) => <DibujoDespues n={n} />} />
      <ParaQuien
        id="titulo-quien"
        rotulo={c.paraQuien.rotulo}
        titulo={c.paraQuien.titulo}
        cita={c.paraQuien.cita}
        respuesta={c.paraQuien.respuesta}
        listas={[{ ...c.paraQuien.noEs, tipo: "no" }]}
        enlace={{ t: otraLinea.coaching.enlace, h: rutas.coaching }}
      />
      <PreguntasLinea linea="consultoria" />
      <Cierre video={videoDe("daxlo-luz")} linea="consultoria" />
      <JsonLd datos={[ldServicio("consultoria"), ldMigas("consultoria", servicios.consultoria)]} />
    </div>
  );
}
