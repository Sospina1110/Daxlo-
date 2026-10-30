import { ZonaConsultoria } from "@/components/sections/consultoria";
import { CtaFinal, OtraLinea, PreguntasLinea } from "@/components/sections/entre-paginas";
import { JsonLd } from "@/components/ui/json-ld";
import { servicios } from "@/content/copy";
import { Migas } from "@/components/ui/migas";
import { ldMigas, ldServicio, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("consultoria");

export default function PaginaConsultoria() {
  return (
    <div>
      <ZonaConsultoria migas={<Migas actual={servicios.consultoria} />} />
      <PreguntasLinea linea="consultoria" />
      <OtraLinea hacia="coaching" />
      <CtaFinal linea="consultoria" />
      <JsonLd datos={[ldServicio("consultoria"), ldMigas("consultoria", servicios.consultoria)]} />
    </div>
  );
}
