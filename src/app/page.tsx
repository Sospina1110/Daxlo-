import { Hero } from "@/components/inicio/hero";
import { Frase, Pasos } from "@/components/inicio/avance";
import { Beneficios, Cierre, Empiezas, Preguntas, Problema } from "@/components/inicio/secciones";
import { JsonLd } from "@/components/ui/json-ld";
import { ldSitioWeb, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("inicio");

// Cada página devuelve un solo elemento raíz, con los datos estructurados al
// final. Al navegar, Next lleva a la vista la raíz de la página nueva; con
// varios elementos sueltos (el primero, un script sin caja) la página nueva
// abría a mitad de camino.
//
// El inicio «Limpia» (2026-11-11) sigue la estructura de la skill
// landing-page-design (Parte A, tipo A: hero clásico más secciones): qué
// hacemos (hero), qué es Daxlo (la frase que se enciende), el problema y lo
// que cambia, los tres beneficios, cómo funciona en tres pasos, por dónde se
// empieza (las dos líneas), las preguntas y el cierre con el mismo botón del
// hero. Todo sobre negro plano. Ya no monta la cinta, el hilo de luz, el
// ecosistema fijado ni el cierre que amanece.
export default function Inicio() {
  return (
    <div className="limpia bg-fondo">
      <Hero />
      <Frase />
      <Problema />
      <Beneficios />
      <Pasos />
      <Empiezas />
      <Preguntas />
      <Cierre />
      <JsonLd datos={ldSitioWeb} />
    </div>
  );
}
