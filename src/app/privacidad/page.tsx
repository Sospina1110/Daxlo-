import { Cabecera } from "@/components/campo/cabecera";
import { Politica } from "@/components/campo/politica";
import { JsonLd } from "@/components/ui/json-ld";
import { paginas, privacidad } from "@/content/copy";
import { ldMigas, metadatosPagina } from "@/lib/sitio";

export const metadata = metadatosPagina("privacidad");

// /privacidad, en el sistema «Campo»: sobria. Una cabecera centrada con la
// fecha de vigencia y, sobre papel, el texto de la política en una columna
// de lectura con su índice.
export default function PaginaPrivacidad() {
  return (
    <div className="campo">
      <Cabecera variante="centro" migas="Política de datos" titulo={[paginas.privacidad.titulo]} sub={`Vigente desde el ${privacidad.vigencia}.`} />
      <Politica />
      <JsonLd datos={ldMigas("privacidad", "Política de datos")} />
    </div>
  );
}
