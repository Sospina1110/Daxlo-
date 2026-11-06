"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion, type Variants } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav } from "@/content/copy";
import { GlowButton } from "@/components/ui/primitives";
import { cn, EASE } from "@/lib/utils";

// Panel del menú: sale del botón que lo abre. El origen es el centro de la
// hamburguesa medido desde el borde derecho: 16 px de relleno de la barra
// compacta + 22 px de medio botón + 1 px de borde = 39 px. El panel y la barra
// comparten max-w-[1000px] mx-auto, así que ese borde es el mismo.
const ORIGEN_PANEL = "calc(100% - 39px) 0";

// Entra en 200 ms y sale en 150 ms (las salidas son más cortas que las
// entradas): baja 6 px y crece de 0.97 a 1; al salir, 4 px y 0.98. Va como
// string de transform y no con x/y: en motion 13.4.4, x/y corren en el hilo
// principal, y el cierre coincide con la navegación de Next; el string va por
// WAAPI, acelerado. Lo que se abre o cierra con el teclado (Enter, Espacio,
// Escape) no se anima: `custom` dice si fue con teclado.
const panel: Variants = {
  oculto: { opacity: 0, transform: "translateY(-6px) scale(0.97)" },
  visible: { opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 0.2, ease: EASE } },
  salida: (teclado: boolean) =>
    teclado
      ? { opacity: 0, transition: { duration: 0 } }
      : { opacity: 0, transform: "translateY(-4px) scale(0.98)", transition: { duration: 0.15, ease: EASE } },
};
// Con "reducir movimiento", solo opacidad: 150 ms al entrar y 100 ms al salir.
// MotionConfig reducedMotion="user" no alcanza: solo apaga x, y, scale…
// (motion-dom, keys-position), no un transform escrito como string.
const panelQuieto: Variants = {
  oculto: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15, ease: EASE } },
  salida: (teclado: boolean) => ({ opacity: 0, transition: { duration: teclado ? 0 : 0.1, ease: EASE } }),
};
// El fondo oscuro: el mismo ritmo, solo opacidad.
const fondo: Variants = {
  oculto: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: EASE } },
  salida: (teclado: boolean) => ({ opacity: 0, transition: { duration: teclado ? 0 : 0.15, ease: EASE } }),
};

// Arriba del todo es una barra ancha y transparente. Al bajar se encoge a una
// píldora de vidrio con desenfoque, como la de la plantilla.
//
// Los enlaces son rutas del sitio (Link): la página siguiente se precarga y se
// abre sin recargar. La página actual queda marcada con aria-current.
export function Nav() {
  const [compacta, setCompacta] = useState(false);
  const [abierta, setAbierta] = useState(false);
  // Si el último abrir o cerrar fue con el teclado: entonces no se anima.
  const [teclado, setTeclado] = useState(false);
  const reducir = useReducedMotion();
  const ruta = usePathname();

  // Compacta pasados los primeros 24 px de la página. Un IntersectionObserver
  // sobre un centinela de 24 px pegado arriba del documento avisa solo al
  // cruzar el umbral: con useScroll de Motion había trabajo en el hilo
  // principal en cada cuadro de scroll, en todas las páginas. El centinela
  // se ve mientras scrollY ≤ 24 (tocar el borde cuenta), igual que antes.
  const centinela = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = centinela.current;
    if (!el) return;
    // Si llegan varias entradas juntas (scroll rápido), vale la última.
    const io = new IntersectionObserver((es) => setCompacta(!es[es.length - 1].isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
  // cierra con Escape, tocando fuera o eligiendo una opción.
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

  const vidrio = compacta || abierta;

  return (
    <>
      {/* Fuera de la barra fija: absoluto respecto del documento (ningún
          ancestro está posicionado), así se va con el scroll. */}
      <div ref={centinela} aria-hidden className="pointer-events-none absolute left-0 top-0 h-6 w-px" />
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
        {/* Entra solo con un fundido de 0,4 s (--desde 0): es marco, no
            contenido, y antes subía 16 px en cada carga.
            Al compactarse cambian el ancho (1200 → 1000 px) y el relleno en
            300 ms con la curva de mover: es lo único del sitio que cambia de
            forma estando en pantalla. Excepción documentada a "solo transform y
            opacity": la barra es fija, cambia una vez por dirección y tiene tres
            hijos. Si en un celular de gama media el panel Performance muestra
            más de 2 ms de layout por cuadro, se pasa a FLIP. Con "reducir
            movimiento" el ancho salta. El borde transparente es fijo: la caja no
            cambia al aparecer el vidrio.
            El fundido de entrada no se queda aplicado al terminar (relleno
            `backwards`, no el `both` de .entrada): una animación que sigue
            rellenando opacity convierte a la barra en raíz del backdrop-filter,
            y el vidrio, que es un hijo, dejaba de desenfocar lo de atrás. Termina
            en el valor natural (opacidad 1, sin transform), así que no salta. Va
            en línea porque .entrada está fuera de capa y le gana a cualquier
            utilidad; "reducir movimiento" lo sigue apagando con !important. */}
        <nav
          aria-label="Principal"
          style={{ animationFillMode: "backwards" }}
          className={cn(
            "entrada relative isolate mx-auto flex items-center justify-between rounded-2xl border border-transparent transition-[max-width,padding] duration-(--dur-mover) ease-mover [--desde:0px] [--duracion:0.4s] motion-reduce:transition-none motion-reduce:duration-0",
            vidrio ? "max-w-[1000px] px-4 py-2.5" : "max-w-[1200px] px-4 py-3.5 md:px-6",
          )}
        >
          {/* El vidrio (fondo, borde, sombra y desenfoque) va en una capa que
              solo cambia de opacidad, en 200 ms. Antes se animaban la sombra de
              40 px y el fondo, y el desenfoque entraba de golpe: se repintaban
              en cada cuadro.
              La capa tiene siempre el ancho de la barra compacta (como mucho
              1000 px) y va centrada: su esquina de arriba a la izquierda no se
              mueve mientras la barra cambia de ancho. Con -inset-px se movía
              con el borde de la barra y Chrome lo contaba como layout shift
              (CLS de ~0,018 en escritorio en cada ida y vuelta). El encogimiento
              de 1200 a 1000 px se ve con `scale` (1.2 → 1, 300 ms, curva de
              mover), que no mueve la caja; solo desde 1240 px, donde la barra
              ancha mide de verdad 1200. Con "reducir movimiento", solo funde. */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute -bottom-px -top-px left-1/2 -z-10 w-[min(1000px,calc(100%+2px))] -translate-x-1/2 rounded-[inherit] border border-line-2 bg-ink/[0.97] shadow-[0_10px_40px_rgba(0,0,0,0.45)] [transition-duration:var(--dur-ui),var(--dur-mover)] [transition-property:opacity,scale] [transition-timing-function:var(--ease-salida),var(--ease-mover)] md:bg-ink/75 md:backdrop-blur-xl motion-reduce:[transition-property:opacity]",
              vidrio ? "opacity-100" : "opacity-0 motion-safe:min-[1240px]:scale-x-[1.2]",
            )}
          />
          <Link href="/" className="inline-flex min-h-[44px] shrink-0 items-center" aria-label="Daxlo, ir al inicio">
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
            {/* Baja a 0.95 al presionar (en 44 px, 0.97 apenas se nota) y se
                aclara el fondo. Los dos íconos van en la misma celda y se
                cruzan en 150 ms: opacidad, escala 0.8 y 2 px de desenfoque, que
                funde los dos trazos en uno. Con teclado, de una vez; con
                "reducir movimiento", solo opacidad en 100 ms. */}
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
              className="group pulsable inline-grid h-11 w-11 place-items-center rounded-xl border border-line-2 text-white [--escala-presion:0.95] active:bg-white/[0.06] lg:hidden"
            >
              <Menu
                size={20}
                aria-hidden
                className="[grid-area:1/1] transition-[opacity,scale,filter] duration-(--dur-rapida) group-aria-expanded:scale-80 group-aria-expanded:opacity-0 group-aria-expanded:blur-[2px] group-data-teclado:transition-none motion-reduce:transition-opacity motion-reduce:duration-100 motion-reduce:group-aria-expanded:scale-100 motion-reduce:group-aria-expanded:blur-none"
              />
              <X
                size={20}
                aria-hidden
                className="[grid-area:1/1] scale-80 opacity-0 blur-[2px] transition-[opacity,scale,filter] duration-(--dur-rapida) group-aria-expanded:scale-100 group-aria-expanded:opacity-100 group-aria-expanded:blur-none group-data-teclado:transition-none motion-reduce:scale-100 motion-reduce:blur-none motion-reduce:transition-opacity motion-reduce:duration-100"
              />
            </button>
          </div>
        </nav>

        <AnimatePresence custom={teclado}>
          {abierta && (
            <m.div
              key="fondo"
              aria-hidden
              onClick={() => cerrar()}
              custom={teclado}
              variants={fondo}
              initial={teclado ? false : "oculto"}
              animate="visible"
              exit="salida"
              className="fixed inset-0 -z-10 bg-black/60 lg:hidden"
            />
          )}
          {abierta && (
            <m.div
              key="menu"
              id="menu-movil"
              custom={teclado}
              variants={reducir ? panelQuieto : panel}
              initial={teclado ? false : "oculto"}
              animate="visible"
              exit="salida"
              style={{ transformOrigin: ORIGEN_PANEL }}
              className="mx-auto mt-2 max-h-[calc(100dvh-96px)] max-w-[1000px] overflow-y-auto overscroll-contain rounded-2xl border border-line-2 bg-ink p-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)] lg:hidden"
            >
              {/* Sin escalón: el menú se abre varias veces por visita y es una
                  sola entrada por contenedor. Las filas van a todo lo ancho: al
                  presionar se aclara el fondo, al instante y sin escala.
                  active:opacity-100 las saca de la regla de los enlaces de texto
                  (bajan a 0.7 al tocar, globals.css): las dos señales juntas se
                  anulaban y el fondo no llegaba a aclararse. */}
              <ul className="flex flex-col">
                {nav.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={cerrar}
                      aria-current={actual(l.href) ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3.5 text-[17px] hover:bg-white/5 active:bg-white/[0.08] active:opacity-100",
                        actual(l.href) ? "bg-white/[0.06] text-white" : "text-white/85",
                      )}
                    >
                      {l.label}
                      {actual(l.href) && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cyan" />}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="p-2 pt-3" onClick={cerrar}>
                <GlowButton href={nav.cta.href} className="w-full">
                  Agendar una conversación
                </GlowButton>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
