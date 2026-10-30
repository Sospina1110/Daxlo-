import { ZonaCoaching } from "@/components/sections/coaching";
import { FranjaHerramientas } from "@/components/sections/intro";
import { CtaFinal, OtraLinea, PreguntasLinea } from "@/components/sections/entre-paginas";
import { JsonLd } from "@/components/ui/json-ld";
import { servicios } from "@/content/copy";
import { Migas } from "@/components/ui/migas";
import { ldMigas, ldServicio, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("coaching");

export default function PaginaCoaching() {
  return (
    <div>
      <ZonaCoaching migas={<Migas actual={servicios.coaching} />} />
      <FranjaHerramientas conEnlace />
      <PreguntasLinea linea="coaching" />
      <OtraLinea hacia="consultoria" />
      <CtaFinal linea="coaching" />
      <JsonLd datos={[ldServicio("coaching"), ldMigas("coaching", servicios.coaching)]} />
    </div>
  );
}
