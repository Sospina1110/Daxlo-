import { ZonaConsultoria } from "@/components/sections/consultoria";
import { CtaFinal, OtraLinea, PreguntasLinea } from "@/components/sections/entre-paginas";
import { JsonLd } from "@/components/ui/json-ld";
import { Migas } from "@/components/ui/migas";
import { ldMigas, ldServicio, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("consultoria");

export default function PaginaConsultoria() {
  return (
    <>
      <JsonLd datos={[ldServicio("consultoria"), ldMigas("consultoria", "Consultoría de implementación")]} />
      <ZonaConsultoria migas={<Migas actual="Consultoría de implementación" />} />
      <PreguntasLinea linea="consultoria" />
      <OtraLinea hacia="coaching" />
      <CtaFinal linea="consultoria" />
    </>
  );
}
