import Link from "next/link";
import { cn } from "@/lib/utils";

// Migas de pan: dónde está el visitante y cómo volver al inicio, en mono,
// sobre el titular de la página (paginas.css, .cp-migas). Los datos
// estructurados equivalentes van aparte (ldMigas en src/lib/sitio.ts).
// El separador es decorativo: lo pinta el CSS y no cuenta para lectores.
//
// `soloInicio`: la página actual queda solo para lectores de pantalla y
// buscadores. Es para las páginas cuyo titular ya empieza con ese mismo
// nombre como rótulo (las de cada línea): a la vista se lee «Inicio /
// [nombre del servicio]» en un solo renglón, sin repetirlo.
export function Migas({ actual, soloInicio = false, className }: { actual: string; soloInicio?: boolean; className?: string }) {
  return (
    <nav aria-label="Migas de pan" className={cn("cm-mono cp-migas", soloInicio && "cp-migas-flota", className)}>
      <ol>
        <li>
          <Link href="/">Inicio</Link>
        </li>
        <li aria-hidden="true" className="cp-migas-separador" />
        <li aria-current="page" className={soloInicio ? "sr-only" : undefined}>
          {actual}
        </li>
      </ol>
    </nav>
  );
}
