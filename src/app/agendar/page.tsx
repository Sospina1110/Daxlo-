import { Agendar } from "@/components/sections/cierre";
import { JsonLd } from "@/components/ui/json-ld";
import { Migas } from "@/components/ui/migas";
import { ldMigas, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("agendar");

export default function PaginaAgendar() {
  return (
    <div>
      <Agendar migas={<Migas actual="Agendar" centro />} />
      <JsonLd datos={ldMigas("agendar", "Agendar")} />
    </div>
  );
}
