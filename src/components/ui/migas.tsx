import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Migas de pan: dónde está el visitante y cómo volver al inicio. Los datos
// estructurados equivalentes van aparte (ldMigas en src/lib/sitio.ts).
export function Migas({ actual, centro = false, className }: { actual: string; centro?: boolean; className?: string }) {
  return (
    <nav aria-label="Migas de pan" className={cn("entrada text-[14px] text-white/55", className)}>
      <ol className={cn("flex flex-wrap items-center gap-1.5", centro && "justify-center")}>
        <li>
          <Link href="/" className="rounded transition-colors hover:text-white">
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
