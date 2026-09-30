import { Privacidad } from "@/components/sections/privacidad";
import { JsonLd } from "@/components/ui/json-ld";
import { Migas } from "@/components/ui/migas";
import { ldMigas, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("privacidad");

export default function PaginaPrivacidad() {
  return (
    <div>
      <Privacidad migas={<Migas actual="Política de datos" />} />
      <JsonLd datos={ldMigas("privacidad", "Política de datos")} />
    </div>
  );
}
