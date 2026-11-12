"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion, type Variants } from "motion/react";
import { nav } from "@/content/copy";
import { Boton } from "@/components/ui/boton";
import { EASE } from "@/lib/utils";

// La barra del sistema «Campo» (campo.css, .barra): mínima, centrada y
// enmarcada entre dos corchetes finos. Es la misma en todas las páginas.
//
// Cambia de tema según lo que tiene detrás: cada sección dice el suyo con
// data-tema ("claro" u "oscuro") y la barra toma el de la que pasa por su
// línea media. Se mide al hacer scroll (un cuadro como mucho, oyente pasivo)
// y no con un observador, porque hay secciones que cambian de tema sin
// moverse (la escena fijada del inicio). Sin JavaScript queda en oscuro, que
// se lee sobre cualquier fondo gracias a su velo.
//
// En celular quedan el logo y el botón del menú. El menú abre como un panel
// de alto completo (medianoche casi opaca sobre un desenfoque fuerte) y sus
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
// La línea media de la barra, en px desde arriba de la pantalla.
const LINEA = 48;

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
  salida: { opacity: 0, transition: { duration: 0.2, ease: EASE } },
};
const filaQuieta: Variants = {
  oculto: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: EASE } },
  salida: { opacity: 0, transition: { duration: 0.2, ease: EASE } },
};

export function Nav() {
  const [abierta, setAbierta] = useState(false);
  // Si el último abrir o cerrar fue con el teclado: entonces no se anima.
  const [teclado, setTeclado] = useState(false);
  const reducir = useReducedMotion();
  const ruta = usePathname();
  const marco = useRef<HTMLElement>(null);

  // El menú se cierra al cambiar de página, también con atrás y adelante.
  useEffect(() => {
    setAbierta(false);
  }, [ruta]);

  // El tema de la barra: el de la sección que cruza su línea media. Si hay
  // varias (un panel oscuro dentro de una sección clara), gana la de más
  // adentro, que va después en el documento.
  useEffect(() => {
    const el = marco.current;
    if (!el) return;
    let cuadro = 0;
    const medir = () => {
      cuadro = 0;
      let tema = "oscuro";
      for (const zona of document.querySelectorAll<HTMLElement>("[data-tema]")) {
        if (zona === el) continue;
        const caja = zona.getBoundingClientRect();
        if (caja.top <= LINEA && caja.bottom > LINEA) tema = zona.dataset.tema || tema;
      }
      if (el.dataset.tema !== tema) el.dataset.tema = tema;
    };
    const pedir = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
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
    // El <header> ocupa todo el ancho pero no recibe toques: solo la barra y
    // el menú. Así la franja a los lados de la barra sigue siendo página.
    <header ref={marco} data-tema="oscuro" data-abierta={abierta || undefined} className="barra-marco pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 md:pt-6">
      <nav aria-label="Principal" className="barra pointer-events-auto relative z-10 mx-auto w-full max-w-[1024px] justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Daxlo, ir al inicio" className="barra-logo inline-flex h-11 shrink-0 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/daxlo-logo-claro.png" alt="Daxlo" width={79} height={20} className="h-5 w-auto" />
          </Link>

          <ul className="hidden items-center lg:flex">
            {nav.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={actual(l.href) ? "page" : undefined} className="barra-enlace">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center">
          <Boton href={nav.cta.href} className="hidden lg:inline-flex">
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
            className="pointer-events-auto relative mx-auto mt-8 max-h-[calc(100dvh-96px)] w-full max-w-[1024px] overflow-y-auto overscroll-contain px-1 pb-8 lg:hidden"
          >
            <ul className="flex flex-col">
              {nav.links.map((l, i) => (
                <m.li key={l.href} custom={i} variants={variantesFila} initial={teclado ? false : "oculto"} animate="visible" exit="salida">
                  <Link href={l.href} onClick={cerrar} aria-current={actual(l.href) ? "page" : undefined} className="menu-enlace cm-titular cm-titular-m">
                    {l.label}
                    {actual(l.href) && <span aria-hidden className="h-2 w-2 bg-acento" />}
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
              <Boton href={nav.cta.href} flecha className="h-12 w-full">
                Agendar una conversación
              </Boton>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
