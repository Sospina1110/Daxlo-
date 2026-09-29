import { ZonaCoaching } from "@/components/sections/coaching";
import { FranjaHerramientas } from "@/components/sections/intro";
import { CtaFinal, OtraLinea, PreguntasLinea } from "@/components/sections/entre-paginas";
import { JsonLd } from "@/components/ui/json-ld";
import { Migas } from "@/components/ui/migas";
import { ldMigas, ldServicio, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("coaching");

export default function PaginaCoaching() {
  return (
    <>
      <JsonLd datos={[ldServicio("coaching"), ldMigas("coaching", "Coaching 1 a 1")]} />
      <ZonaCoaching migas={<Migas actual="Coaching 1 a 1" />} />
      <FranjaHerramientas conEnlace />
      <PreguntasLinea linea="coaching" />
      <OtraLinea hacia="consultoria" />
      <CtaFinal linea="coaching" />
    </>
  );
}
