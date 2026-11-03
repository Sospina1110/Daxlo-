import { ZonaConsultoria } from "@/components/sections/consultoria";
import { CtaFinal, PreguntasLinea } from "@/components/sections/entre-paginas";
import { JsonLd } from "@/components/ui/json-ld";
import { servicios } from "@/content/copy";
import { Migas } from "@/components/ui/migas";
import { ldMigas, ldServicio, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("consultoria");

// Una sola acción al final: las preguntas y el cierre. El puente al coaching
// vive en "No es para tu empresa si".
export default function PaginaConsultoria() {
  return (
    <div>
      <ZonaConsultoria migas={<Migas actual={servicios.consultoria} />} />
      <PreguntasLinea linea="consultoria" />
      <CtaFinal linea="consultoria" whatsapp />
      <JsonLd datos={[ldServicio("consultoria"), ldMigas("consultoria", servicios.consultoria)]} />
    </div>
  );
}
