import { Faq } from "@/components/sections/cierre";
import { CtaFinal } from "@/components/sections/entre-paginas";
import { JsonLd } from "@/components/ui/json-ld";
import { Migas } from "@/components/ui/migas";
import { ldMigas, ldPreguntas, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("preguntas");

export default function PaginaPreguntas() {
  return (
    <div>
      <Faq migas={<Migas actual="Preguntas frecuentes" />} />
      <CtaFinal />
      <JsonLd datos={[ldPreguntas, ldMigas("preguntas", "Preguntas frecuentes")]} />
    </div>
  );
}
