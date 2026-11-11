import { Nosotros } from "@/components/sections/cierre";
import { CtaFinal, OtraLinea } from "@/components/sections/entre-paginas";
import { nosotros } from "@/content/copy";
import { JsonLd } from "@/components/ui/json-ld";
import { Migas } from "@/components/ui/migas";
import { ldMigas, ldSobreNosotros, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("nosotros");

export default function PaginaNosotros() {
  return (
    <div>
      <Nosotros migas={<Migas actual={nosotros.etiqueta} />} />
      <OtraLinea hacia="coaching" />
      <OtraLinea hacia="consultoria" />
      <CtaFinal />
      <JsonLd datos={[ldSobreNosotros, ldMigas("nosotros", nosotros.etiqueta)]} />
    </div>
  );
}
