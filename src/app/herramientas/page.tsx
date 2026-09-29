import { Herramientas } from "@/components/sections/herramientas";
import { CtaFinal } from "@/components/sections/entre-paginas";
import { JsonLd } from "@/components/ui/json-ld";
import { Migas } from "@/components/ui/migas";
import { ldMigas, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("herramientas");

export default function PaginaHerramientas() {
  return (
    <>
      <JsonLd datos={ldMigas("herramientas", "Herramientas")} />
      <Herramientas migas={<Migas actual="Herramientas" centro />} />
      <CtaFinal />
    </>
  );
}
