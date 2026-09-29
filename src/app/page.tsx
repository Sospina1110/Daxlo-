import { Hero } from "@/components/sections/hero";
import { Comparacion, DosFormas, FranjaHerramientas } from "@/components/sections/intro";
import { CtaFinal, NosotrosResumen } from "@/components/sections/entre-paginas";
import { JsonLd } from "@/components/ui/json-ld";
import { ldSitioWeb, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("inicio");

// El inicio es el índice: presenta las dos líneas y manda a cada visitante a
// la página de la que le interesa. El detalle de cada una vive en su ruta.
export default function Inicio() {
  return (
    <>
      <JsonLd datos={ldSitioWeb} />
      <Hero />
      <FranjaHerramientas conEnlace />
      <DosFormas />
      <Comparacion />
      <NosotrosResumen />
      <CtaFinal />
    </>
  );
}
