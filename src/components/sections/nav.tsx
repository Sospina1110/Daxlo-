"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav } from "@/content/copy";
import { GlowButton } from "@/components/ui/primitives";
import { cn, EASE } from "@/lib/utils";

// Arriba del todo es una barra ancha y transparente. Al bajar se encoge a una
// píldora de vidrio con desenfoque, como la de la plantilla.
//
// Los enlaces son rutas del sitio (Link): la página siguiente se precarga y se
// abre sin recargar. La página actual queda marcada con aria-current.
export function Nav() {
  const [compacta, setCompacta] = useState(false);
  const [abierta, setAbierta] = useState(false);
  const ruta = usePathname();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setCompacta(y > 24));

  // El menú se cierra al cambiar de página, también con atrás y adelante.
  useEffect(() => {
    setAbierta(false);
  }, [ruta]);

  const actual = (href: string) => ruta === href || ruta === `${href}/`;

  useEffect(() => {
    if (!abierta) return;
    const alEscape = (e: KeyboardEvent) => e.key === "Escape" && setAbierta(false);
    window.addEventListener("keydown", alEscape);
    return () => window.removeEventListener("keydown", alEscape);
  }, [abierta]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav
        aria-label="Principal"
        className={cn(
          "entrada mx-auto flex items-center justify-between rounded-2xl border transition-[max-width,background-color,border-color,padding,box-shadow] duration-500",
          compacta || abierta
            ? "max-w-[1000px] border-line-2 bg-ink/92 px-4 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.45)] md:bg-ink/75 md:backdrop-blur-xl"
            : "max-w-[1200px] border-transparent px-4 py-3.5 md:px-6",
        )}
      >
        <Link href="/" className="shrink-0" aria-label="Daxlo, ir al inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/daxlo-logo-claro.png" alt="Daxlo" width={110} height={28} className="h-7 w-auto" />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {nav.links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={actual(l.href) ? "page" : undefined}
                className={cn(
                  "relative text-[15px] transition-colors hover:text-white",
                  actual(l.href) ? "text-white after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-gradient-to-r after:from-cyan after:to-blue-bright" : "text-white/70",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <GlowButton href={nav.cta.href} tamano="sm">
            {nav.cta.label}
          </GlowButton>
          <button
            type="button"
            onClick={() => setAbierta((v) => !v)}
            aria-expanded={abierta}
            aria-controls="menu-movil"
            aria-label={abierta ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line-2 text-white lg:hidden"
          >
            {abierta ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {abierta && (
          <m.div
            id="menu-movil"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mx-auto mt-2 max-h-[calc(100dvh-96px)] max-w-[1000px] overflow-y-auto rounded-2xl border border-line-2 bg-ink/95 p-3 lg:hidden"
          >
            <ul className="flex flex-col">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setAbierta(false)}
                    aria-current={actual(l.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3.5 text-[17px] hover:bg-white/5",
                      actual(l.href) ? "bg-white/[0.06] text-white" : "text-white/85",
                    )}
                  >
                    {l.label}
                    {actual(l.href) && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cyan" />}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-2 pt-3" onClick={() => setAbierta(false)}>
              <GlowButton href={nav.cta.href} className="w-full">
                Agendar una conversación
              </GlowButton>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
