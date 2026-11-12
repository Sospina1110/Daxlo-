"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { inicio } from "@/content/copy";
import { MiniArea } from "./dibujos";
import { Foto } from "./foto";

// El carrusel de tarjetas en perspectiva: dónde entra la IA en una empresa,
// un ejemplo por área. Son ejemplos de lo que se monta, no casos: van bajo el
// rótulo fijo «Ejemplos». Cada tarjeta lleva su rótulo (área y qué se monta),
// su toma o su mini diagrama de línea, y una línea de texto.
//
// El riel es un contenedor con scroll nativo y scroll-snap: en pantallas
// táctiles el arrastre y la inercia son los del sistema. Con mouse se
// arrastra (el riel sigue al puntero y, al soltar, sigue con la velocidad que
// traía hasta la tarjeta que le toca). Además: flechas, puntos y teclado
// (flechas izquierda y derecha, Inicio y Fin, con el riel enfocado).
//
// El giro en 3D de cada tarjeta lo hace el CSS atado al scroll del riel
// (animation-timeline: view(inline), campo.css). Donde no hay soporte, este
// componente escribe en cada tarjeta --d (su distancia al centro, en
// tarjetas) y --a (la misma, sin signo) al hacer scroll. No hay ningún bucle:
// solo se mide cuando el riel se mueve.

// El fondo de cada tarjeta, en la paleta de la página.
// Cada tarjeta lleva su toma o, si no tiene, su mini diagrama de línea.
const TONOS = [
  { tono: "foto", foto: "t-sala" },
  { tono: "hondo", dibujo: "comercial" },
  { tono: "electrico", dibujo: "operacion" },
  { tono: "foto", foto: "t-manos" },
  { tono: "papel", dibujo: "atencion" },
  { tono: "noche", dibujo: "mercadeo" },
  { tono: "foto", foto: "t-mesa" },
] as const;

const numero = (n: number) => String(n).padStart(2, "0");

export function Areas() {
  const a = inicio.areas;
  const total = a.tarjetas.length;
  const riel = useRef<HTMLUListElement>(null);
  const [activa, setActiva] = useState(0);
  const arrastre = useRef<{ id: number; x: number; inicio: number; ultimaX: number; ultimoT: number; v: number; movido: boolean } | null>(null);

  // Dónde hay que dejar el scroll para que la tarjeta i quede al centro.
  const destino = useCallback((i: number) => {
    const el = riel.current;
    const tarjeta = el?.children[i] as HTMLElement | undefined;
    if (!el || !tarjeta) return 0;
    return tarjeta.offsetLeft - (el.clientWidth - tarjeta.offsetWidth) / 2;
  }, []);

  const ir = useCallback(
    (i: number) => {
      const el = riel.current;
      if (!el) return;
      const n = Math.min(total - 1, Math.max(0, i));
      const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: destino(n), behavior: quieto ? "auto" : "smooth" });
    },
    [destino, total],
  );

  // Al moverse el riel: cuál tarjeta está al centro y, sin animation-timeline,
  // el giro de cada una.
  useEffect(() => {
    const el = riel.current;
    if (!el) return;
    const conLinea = typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
    let cuadro = 0;
    const medir = () => {
      cuadro = 0;
      const centro = el.scrollLeft + el.clientWidth / 2;
      let mejor = 0;
      let menor = Infinity;
      for (let i = 0; i < el.children.length; i++) {
        const t = el.children[i] as HTMLElement;
        const d = (t.offsetLeft + t.offsetWidth / 2 - centro) / (t.offsetWidth + 24);
        if (Math.abs(d) < menor) {
          menor = Math.abs(d);
          mejor = i;
        }
        // La del centro va encima de sus vecinas, y cada vecina encima de la
        // que le sigue hacia afuera.
        const capa = String(10 - Math.min(9, Math.round(Math.abs(d))));
        if (t.style.zIndex !== capa) t.style.zIndex = capa;
        if (!conLinea) {
          const corto = Math.max(-1.6, Math.min(1.6, d));
          t.style.setProperty("--d", corto.toFixed(3));
          t.style.setProperty("--a", Math.abs(corto).toFixed(3));
        }
      }
      setActiva(mejor);
    };
    const pedir = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };
    // Arranca en la tarjeta del medio, con tarjetas a los dos lados. (Sin
    // JavaScript arranca en la primera.)
    el.scrollLeft = destino(Math.floor(el.children.length / 2));
    medir();
    el.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      el.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, [destino]);

  // Arrastre con mouse. En pantallas táctiles no hace falta: es el scroll.
  const alBajar = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    arrastre.current = { id: e.pointerId, x: e.clientX, inicio: el.scrollLeft, ultimaX: e.clientX, ultimoT: e.timeStamp, v: 0, movido: false };
  };
  const alMover = (e: React.PointerEvent<HTMLUListElement>) => {
    const g = arrastre.current;
    if (!g || g.id !== e.pointerId) return;
    const el = e.currentTarget;
    const dx = e.clientX - g.x;
    if (!g.movido && Math.abs(dx) > 4) {
      g.movido = true;
      el.setPointerCapture(e.pointerId);
      el.setAttribute("data-arrastra", "");
    }
    if (!g.movido) return;
    el.scrollLeft = g.inicio - dx;
    const dt = Math.max(1, e.timeStamp - g.ultimoT);
    // Velocidad en px por ms, suavizada.
    g.v = g.v * 0.6 + ((e.clientX - g.ultimaX) / dt) * 0.4;
    g.ultimaX = e.clientX;
    g.ultimoT = e.timeStamp;
  };
  const alSoltar = (e: React.PointerEvent<HTMLUListElement>) => {
    const g = arrastre.current;
    if (!g || g.id !== e.pointerId) return;
    arrastre.current = null;
    if (!g.movido) return;
    const el = e.currentTarget;
    // Hasta dónde llegaría con la velocidad que traía, y la tarjeta más
    // cercana a ese punto.
    const proyectado = el.scrollLeft - g.v * 260;
    let mejor = 0;
    let menor = Infinity;
    for (let i = 0; i < total; i++) {
      const d = Math.abs(destino(i) - proyectado);
      if (d < menor) {
        menor = d;
        mejor = i;
      }
    }
    ir(mejor);
    el.removeAttribute("data-arrastra");
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  const alTeclear = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const pasos: Record<string, number> = { ArrowRight: activa + 1, ArrowLeft: activa - 1, Home: 0, End: total - 1 };
    if (!(e.key in pasos)) return;
    e.preventDefault();
    ir(pasos[e.key]);
  };

  return (
    <section aria-labelledby="titulo-areas" data-tema="oscuro" className="cm-areas">
      <div data-revelar="" className="cm-areas-cabeza">
        <h2 id="titulo-areas" className="cm-titular cm-titular-m">
          {a.titulo}
        </h2>
        <p className="cm-mono cm-corchete cm-areas-etiqueta">{a.etiqueta}</p>
      </div>

      <div data-revelar="" role="group" aria-roledescription="carrusel" aria-label={a.controles.region} className="cm-carrusel">
        <div className="cm-carrusel-sube">
          {/* mask-x: las tarjetas de los lados salen de la pantalla a propósito. */}
          <ul
            ref={riel}
            tabIndex={0}
            aria-label={a.controles.region}
            onPointerDown={alBajar}
            onPointerMove={alMover}
            onPointerUp={alSoltar}
            onPointerCancel={alSoltar}
            onKeyDown={alTeclear}
            className="cm-riel mask-x"
          >
            {a.tarjetas.map((t, i) => {
              const fondo = TONOS[i % TONOS.length];
              return (
                <li key={t.area} className="cm-tarjeta-sitio">
                  <div data-tono={fondo.tono} data-activa={i === activa || undefined} className="cm-tarjeta">
                    {"foto" in fondo && (
                      <span aria-hidden="true" className="cm-tarjeta-foto">
                        <Foto nombre={fondo.foto} ancho={560} alto={700} temprana />
                      </span>
                    )}
                    <p className="cm-mono cm-tarjeta-cabeza">
                      <span>
                        <span aria-hidden="true">[{numero(i + 1)}] </span>
                        {t.area}
                      </span>
                      <span className="cm-tarjeta-monta">{t.monta}</span>
                    </p>
                    {"dibujo" in fondo && <MiniArea area={fondo.dibujo} />}
                    <p className="cm-tarjeta-linea">{t.linea}</p>
                    <span aria-hidden="true" className="cm-esquinas" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="cm-carrusel-controles">
          <button type="button" onClick={() => ir(activa - 1)} disabled={activa === 0} aria-label={a.controles.anterior} className="cm-carrusel-flecha">
            <ArrowLeft aria-hidden size={18} />
          </button>
          <div className="cm-carrusel-puntos">
            {a.tarjetas.map((t, i) => (
              <button
                key={t.area}
                type="button"
                onClick={() => ir(i)}
                aria-label={`${a.controles.ir} ${i + 1}: ${t.area}`}
                aria-current={i === activa ? "true" : undefined}
                className="cm-carrusel-punto"
              />
            ))}
          </div>
          <button type="button" onClick={() => ir(activa + 1)} disabled={activa === total - 1} aria-label={a.controles.siguiente} className="cm-carrusel-flecha">
            <ArrowRight aria-hidden size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
