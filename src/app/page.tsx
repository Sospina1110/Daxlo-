import { Areas } from "@/components/inicio/areas";
import { Hero } from "@/components/inicio/hero";
import { Cierre, Equipo, FraseFoto, Montado, Principios, Puertas, Sistema } from "@/components/inicio/secciones";
import { Tiempos } from "@/components/inicio/tiempos";
import { JsonLd } from "@/components/ui/json-ld";
import { videoDe } from "@/lib/campo/video";
import { ldSitioWeb, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("inicio");

// Cada página devuelve un solo elemento raíz, con los datos estructurados al
// final. Al navegar, Next lleva a la vista la raíz de la página nueva; con
// varios elementos sueltos (el primero, un script sin caja) la página nueva
// abría a mitad de camino.
//
// El inicio «Campo» (2026-11-12) sigue, sección por sección, el armazón del
// sitio de referencia que eligió Santiago: poco texto y se ve lo que se hace.
//
//   1  Hero a pantalla completa sobre video, con la trama de puntos
//   2  Carrusel de tarjetas en perspectiva: dónde entra la IA en la empresa
//   3  Escena fijada en tres tiempos, que termina en claro con la X de Daxlo
//   4  Una frase sobre una toma a sangre
//   5  Tres principios con iconos de línea, sobre un resplandor eléctrico
//   6  Toma y lista de tres, sobre claro
//   7  Una afirmación que se enciende palabra por palabra
//   8  El panel azul profundo: las seis capas del sistema
//   9  La segunda afirmación y las tres puertas
//   10 El cierre
//
// La página alterna oscuro con fotografía, claro y azul profundo. Cada
// sección dice su tema con data-tema, y la barra lo sigue (nav.tsx).
//
// Los videos de fondo se buscan aquí, en el build: si alguno no está en
// public/video/, la página no lo nombra y queda su póster
// (src/lib/campo/video.ts).
export default function Inicio() {
  return (
    <div className="campo">
      <Hero video={videoDe("daxlo-hero")} vertical={videoDe("daxlo-hero-vertical")} />
      <Areas />
      <Tiempos videos={{ problema: videoDe("daxlo-problema"), giro: videoDe("daxlo-giro"), operacion: videoDe("daxlo-operacion") }} />
      <FraseFoto video={videoDe("daxlo-bodega")} />
      <Principios />
      <Equipo video={videoDe("daxlo-mesa")} />
      <Montado />
      <Sistema />
      <Puertas />
      <Cierre video={videoDe("daxlo-luz")} />
      <JsonLd datos={ldSitioWeb} />
    </div>
  );
}
