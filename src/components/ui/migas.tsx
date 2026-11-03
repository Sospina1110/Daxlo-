import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Migas de pan: dónde está el visitante y cómo volver al inicio. Los datos
// estructurados equivalentes van aparte (ldMigas en src/lib/sitio.ts).
export function Migas({ actual, centro = false, className }: { actual: string; centro?: boolean; className?: string }) {
  return (
    <nav aria-label="Migas de pan" className={cn("entrada text-[14px] text-white/60", className)}>
      <ol className={cn("flex flex-wrap items-center gap-1.5", centro && "justify-center")}>
        <li>
          {/* 44 × 44 px para el pulgar, sin mover la línea: los márgenes
              negativos, vertical y horizontal, devuelven lo que agrega el
              área táctil. El lateral (6 px) es igual al espacio entre migas,
              para no montarse sobre la flecha. */}
          <Link href="/" className="-mx-1.5 -my-3 inline-flex min-h-[44px] min-w-[44px] items-center rounded px-1.5 transition-colors hover:text-white">
            Inicio
          </Link>
        </li>
        <li aria-hidden className="text-white/30">
          <ChevronRight size={14} />
        </li>
        <li aria-current="page" className="text-white/80">
          {actual}
        </li>
      </ol>
    </nav>
  );
}
