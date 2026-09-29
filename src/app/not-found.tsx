import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { nav } from "@/content/copy";
import { GlowButton, Orb } from "@/components/ui/primitives";
import { glow } from "@/lib/utils";

export const metadata: Metadata = { title: "Página no encontrada" };

// Página 404. Next.js trae una por defecto, pero en inglés. Además del botón
// al inicio, ofrece las páginas principales para que nadie quede sin salida.
export default function NoEncontrada() {
  return (
    <section className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden px-6 pb-16 pt-28">
      <span aria-hidden className="absolute -left-[20%] bottom-[-30%] -z-10 h-[600px] w-[600px] resplandor" style={glow("41 196 245", 0.25, 1.47)} />
      <span aria-hidden className="absolute -right-[20%] top-[-30%] -z-10 h-[600px] w-[600px] resplandor" style={glow("27 53 208", 0.45, 1.47)} />
      <div className="text-center">
        <Orb tamano={72} className="animate-float" />
        <p className="mt-8 font-display text-[14px] font-medium uppercase tracking-[0.16em] text-dim">Error 404</p>
        <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.4rem)] leading-tight text-white">Esta página no existe.</h1>
        <p className="mx-auto mt-4 max-w-[440px] text-[18px] leading-relaxed text-muted">
          Puede que el enlace esté mal escrito o que la página ya no esté.
        </p>
        <GlowButton href="/" className="mt-9">
          <ArrowLeft size={17} /> Volver al inicio
        </GlowButton>
        <nav aria-label="Páginas del sitio" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[16px]">
            {nav.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block py-1.5 text-white/60 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
