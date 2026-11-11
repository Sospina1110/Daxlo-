import { Hero } from "@/components/sections/hero";
import { Manifiesto } from "@/components/sections/manifiesto";
import { Ecosistema } from "@/components/sections/ecosistema";
import { DosPuertas } from "@/components/sections/intro";
import { CtaFinal } from "@/components/sections/entre-paginas";
import { FondoHilo } from "@/components/fondos/fondo-hilo";
import { JsonLd } from "@/components/ui/json-ld";
import { ldSitioWeb, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("inicio");

// Cada página devuelve un solo elemento raíz, con los datos estructurados al
// final. Al navegar, Next lleva a la vista la raíz de la página nueva; con
// varios elementos sueltos (el primero, un script sin caja) la página nueva
// abría a mitad de camino.
//
// El inicio cuenta, en este orden: qué hacemos (hero), qué es Daxlo (la frase
// que se enciende), cómo queda una empresa (el ecosistema, con los tres
// pilares adentro), por dónde se entra (las dos puertas) y qué hacer ahora (el
// cierre). El hilo de luz une las cinco secciones: va al final de la raíz, que
// es `relative`, para pintarse sobre el campo azul del cierre.
export default function Inicio() {
  return (
    <div className="relative">
      <Hero />
      <Manifiesto />
      <Ecosistema />
      <DosPuertas />
      <CtaFinal whatsapp />
      <FondoHilo />
      <JsonLd datos={ldSitioWeb} />
    </div>
  );
}
