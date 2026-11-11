import { Herramientas } from "@/components/sections/herramientas";
import { CtaFinal, OtraLinea } from "@/components/sections/entre-paginas";
import { JsonLd } from "@/components/ui/json-ld";
import { Migas } from "@/components/ui/migas";
import { ldMigas, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("herramientas");

// Después de las fichas, las dos tarjetas que llevan a cada línea (las de
// /nosotros, con su regla): quien llegó por una herramienta sabe cómo la
// aprende o cómo la usamos en su empresa antes del cierre.
export default function PaginaHerramientas() {
  return (
    <div>
      <Herramientas migas={<Migas actual="Herramientas" />} />
      <OtraLinea hacia="coaching" />
      <OtraLinea hacia="consultoria" />
      <CtaFinal />
      <JsonLd datos={ldMigas("herramientas", "Herramientas")} />
    </div>
  );
}
