import { Nosotros } from "@/components/sections/cierre";
import { CtaFinal, OtraLinea } from "@/components/sections/entre-paginas";
import { JsonLd } from "@/components/ui/json-ld";
import { Migas } from "@/components/ui/migas";
import { ldMigas, ldSobreNosotros, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("nosotros");

export default function PaginaNosotros() {
  return (
    <>
      <JsonLd datos={[ldSobreNosotros, ldMigas("nosotros", "Quiénes somos")]} />
      <Nosotros migas={<Migas actual="Quiénes somos" />} />
      <OtraLinea hacia="coaching" />
      <OtraLinea hacia="consultoria" />
      <CtaFinal />
    </>
  );
}
