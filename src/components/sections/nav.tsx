"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion, type Variants } from "motion/react";
import { nav } from "@/content/copy";
import { Boton } from "@/components/ui/boton";
import { EASE } from "@/lib/utils";

// La barra del sistema «Limpia» (skill landing-page-design, B7): compacta,
// flotante, centrada y del ancho de su contenido, sobre una superficie
// translúcida con desenfoque (limpia.css, .barra). No cambia de forma al
// bajar: es la misma píldora en todas las páginas.
//
// En celular quedan el logo y el botón del menú. El menú abre como un panel
// de alto completo (negro casi opaco sobre un desenfoque fuerte) y sus
// enlaces llegan uno tras otro, en orden de lectura: cada uno sube 24 px y
// funde, 60 ms después del anterior, y la secuencia nunca pasa de 400 ms. El
// botón del menú son dos líneas que se cruzan en una equis con la curva base.
//
// Lo que se abre o cierra con el teclado (Enter, Espacio, Escape) no se
// anima. Con «reducir movimiento», solo opacidad.
//
// Los enlaces son rutas del sitio (Link): la página siguiente se precarga y se
// abre sin recargar. La página actual queda marcada con aria-current.

const PASO = 0.06;
const TOPE = 0.4;

const panel: Variants = {
  oculto: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
  salida: (teclado: boolean) => ({ opacity: 0, transition: { duration: teclado ? 0 : 0.2, ease: EASE } }),
};

// Cada fila del menú. `i` es su posición en orden de lectura. Va como string
// de transform (WAAPI, acelerado) y no con `y`.
const fila: Variants = {
  oculto: { opacity: 0, transform: "translateY(24px)" },
  visible: (i: number) => ({
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.5, ease: EASE, delay: Math.min(i * PASO, TOPE) },
  }),
  salida: { opacity: 0, transition: { duration: 0.15, ease: EASE } },
};
const filaQuieta: Variants = {
  oculto: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: EASE } },
  salida: { opacity: 0, transition: { duration: 0.1, ease: EASE } },
};

export function Nav() {
  const [abierta, setAbierta] = useState(false);
  // Si el último abrir o cerrar fue con el teclado: entonces no se anima.
  const [teclado, setTeclado] = useState(false);
  const reducir = useReducedMotion();
  const ruta = usePathname();

  // El menú se cierra al cambiar de página, también con atrás y adelante.
  useEffect(() => {
    setAbierta(false);
  }, [ruta]);

  const actual = (href: string) => ruta === href || ruta === `${href}/`;

  // Un clic con event.detail 0 llegó del teclado (Enter o Espacio).
  const cerrar = (e?: React.MouseEvent) => {
    setTeclado(e?.detail === 0);
    setAbierta(false);
  };

  // Con el menú abierto la página de atrás no se mueve ni recibe toques: se
  // cierra con Escape, con el botón o eligiendo una opción.
  useEffect(() => {
    if (!abierta) return;
    const alEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setTeclado(true);
      setAbierta(false);
    };
    window.addEventListener("keydown", alEscape);
    const html = document.documentElement;
    const antes = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", alEscape);
      html.style.overflow = antes;
    };
  }, [abierta]);

  const variantesFila = reducir || teclado ? filaQuieta : fila;

  return (
    // El <header> ocupa todo el ancho pero no recibe toques: solo la píldora
    // y el menú. Así la franja a los lados de la barra sigue siendo página.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav aria-label="Principal" className="barra pointer-events-auto relative z-10 mx-auto w-full max-w-md justify-between lg:w-fit lg:max-w-none">
        <Link href="/" aria-label="Daxlo, ir al inicio" className="barra-logo inline-flex min-h-[44px] shrink-0 items-center px-2 lg:mr-2 lg:min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/daxlo-logo-claro.png" alt="Daxlo" width={94} height={24} className="h-6 w-auto" />
        </Link>

        <ul className="hidden items-center lg:flex">
          {nav.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={actual(l.href) ? "page" : undefined} className="barra-enlace title-4">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 lg:ml-2">
          <Boton href={nav.cta.href} variante="secundario" tamano="sm" className="hidden min-h-[40px] lg:inline-flex">
            {nav.cta.label}
          </Boton>
          <button
            type="button"
            onClick={(e) => {
              setTeclado(e.detail === 0);
              setAbierta((v) => !v);
            }}
            aria-expanded={abierta}
            aria-controls="menu-movil"
            aria-label={abierta ? "Cerrar menú" : "Abrir menú"}
            data-teclado={teclado || undefined}
            className="barra-menu lg:hidden"
          >
            <span aria-hidden />
            <span aria-hidden />
          </button>
        </div>
      </nav>

      <AnimatePresence custom={teclado}>
        {abierta && (
          // El panel: cubre la pantalla. Es decorativo; tocarlo cierra.
          <m.div
            key="fondo"
            aria-hidden
            onClick={() => cerrar()}
            custom={teclado}
            variants={panel}
            initial={teclado ? false : "oculto"}
            animate="visible"
            exit="salida"
            className="menu-panel pointer-events-auto fixed inset-0 lg:hidden"
          />
        )}
        {abierta && (
          <m.div
            key="menu"
            id="menu-movil"
            custom={teclado}
            variants={panel}
            initial={teclado ? false : "oculto"}
            animate="visible"
            exit="salida"
            className="pointer-events-auto relative mx-auto mt-8 max-h-[calc(100dvh-96px)] w-full max-w-md overflow-y-auto overscroll-contain px-2 pb-8 lg:hidden"
          >
            <ul className="flex flex-col">
              {nav.links.map((l, i) => (
                <m.li key={l.href} custom={i} variants={variantesFila} initial={teclado ? false : "oculto"} animate="visible" exit="salida">
                  <Link
                    href={l.href}
                    onClick={cerrar}
                    aria-current={actual(l.href) ? "page" : undefined}
                    className="heading-4 flex min-h-[56px] items-center justify-between py-2 text-texto active:text-texto-2"
                  >
                    {l.label}
                    {actual(l.href) && <span aria-hidden className="h-2 w-2 rounded-full bg-acento" />}
                  </Link>
                </m.li>
              ))}
            </ul>
            <m.div
              custom={nav.links.length}
              variants={variantesFila}
              initial={teclado ? false : "oculto"}
              animate="visible"
              exit="salida"
              className="mt-8"
              onClick={cerrar}
            >
              <Boton href={nav.cta.href} flecha className="w-full">
                Agendar una conversación
              </Boton>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
