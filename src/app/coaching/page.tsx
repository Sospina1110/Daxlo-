import { ZonaCoaching } from "@/components/sections/coaching";
import { CtaFinal, PreguntasLinea } from "@/components/sections/entre-paginas";
import { JsonLd } from "@/components/ui/json-ld";
import { servicios } from "@/content/copy";
import { Migas } from "@/components/ui/migas";
import { ldMigas, ldServicio, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("coaching");

// Una sola acción al final: las preguntas y el cierre. El puente a la
// consultoría vive en "No es para ti si".
export default function PaginaCoaching() {
  return (
    <div>
      <ZonaCoaching migas={<Migas actual={servicios.coaching} />} />
      <PreguntasLinea linea="coaching" />
      <CtaFinal linea="coaching" whatsapp />
      <JsonLd datos={[ldServicio("coaching"), ldMigas("coaching", servicios.coaching)]} />
    </div>
  );
}
