"use client";

import { useEffect, useRef } from "react";
import { alMedir, trazar, type Punto } from "./medir";
import "./fondo-hilo.css";

// El hilo de luz. De la cinta del hero sale una línea de luz de 1 px que baja
// por la página y va encendiendo lo que toca: es el cable de «Encendido»
// (DESIGN.md). Nace donde la página lo diga ([data-hilo-origen]: en el inicio,
// el borde inferior del recuadro que escribe, de donde se desprende el papel),
// cruza hasta el margen izquierdo, baja por él, alimenta la línea de cada
// capítulo ([data-hilo-capitulo]) con una rama que se apaga hacia la derecha,
// entra al campo azul del cierre y muere en el botón ([data-hilo-fin]).
// Nunca pasa detrás de un párrafo: los tramos verticales van en el margen (a
// 24 px del texto desde 1280 px; a 10 px del borde de la pantalla por debajo)
// y los horizontales, sobre el aire entre secciones.
//
// Movimiento: cada tramo es una línea que se desliza dentro de su caja
// (translate) con una animación de CSS atada al scroll de la página
// (animation-timeline: scroll(root)). Corre en el compositor: nada en el hilo
// principal por cuadro. JavaScript solo mide la página al cargar y cuando
// cambia su tamaño, y escribe el rango de scroll de cada tramo. La punta del
// tramo que se está dibujando brilla y se apaga al doblar la esquina.
//
// Sin soporte de animation-timeline (Firefox, Safari anterior a 26) o con
// «reducir movimiento», el hilo queda entero y quieto. Sin JavaScript no hay
// hilo: es adorno y no lleva contenido.
//
// Va al final de la raíz de la página (que tiene que ser `relative`): así se
// pinta sobre el campo azul del cierre. Es decorativo y no recibe eventos.
export function FondoHilo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const capa = ref.current;
    const raiz = capa?.parentElement;
    if (!capa || !raiz) return;

    const construir = () => {
      const origen = raiz.querySelector<HTMLElement>("[data-hilo-origen]");
      const fin = raiz.querySelector<HTMLElement>("[data-hilo-fin]");
      const contenedor = raiz.querySelector<HTMLElement>(".container-page");
      if (!origen || !fin || !contenedor) {
        capa.innerHTML = "";
        return;
      }
      const base = raiz.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const vh = innerHeight;
      const sy = scrollY;
      // Todo en coordenadas de la raíz; `pagina` las pasa a scroll.
      const enRaiz = (r: DOMRect) => ({ left: r.left - base.left, right: r.right - base.left, top: r.top - base.top, bottom: r.bottom - base.top });
      const pagina = (y: number) => y + base.top + sy;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      const tope = maxScroll - 4;

      const rc = contenedor.getBoundingClientRect();
      const margen = parseFloat(getComputedStyle(contenedor).paddingLeft);
      const textoIzq = rc.left + margen - base.left;
      const textoDer = rc.right - margen - base.left;
      const movil = vw < 768;
      // 24 px a la izquierda del texto desde 1280 px; por debajo, a 10 px del
      // borde de la pantalla.
      const xL = Math.round(vw >= 1280 ? textoIzq - 24 : 10);
      const r = movil ? 8 : 14;
      // Dónde va la cabeza del hilo en la pantalla mientras baja: un poco por
      // debajo de la mitad, delante de lo que se está leyendo.
      const F = 0.62;

      const o = enRaiz(origen.getBoundingClientRect());
      const seccion = origen.closest("section");
      const cierre = fin.closest("section");
      if (!seccion || !cierre) return;
      const xO = Math.round(o.left);
      const yO = Math.round(o.bottom);
      // Cruza al margen por el borde inferior de la sección de la que nace.
      const yH = Math.round(enRaiz(seccion.getBoundingClientRect()).bottom);
      const yC = Math.round(enRaiz(cierre.getBoundingClientRect()).top);
      const b = enRaiz((fin.querySelector("a") ?? fin).getBoundingClientRect());
      const yB = Math.round((b.top + b.bottom) / 2);
      const xB = Math.round(b.left - 2);
      if (yH <= yO || yC <= yH || yB <= yC) return;

      // Vértices, con el scroll en el que la cabeza llega a cada uno. Cada
      // tramo tarda por lo menos 24 px de scroll.
      const pts: Punto[] = [];
      const empuja = (x: number, y: number, s: number, clase?: string) => {
        const previo = pts.length ? pts[pts.length - 1].s : -24;
        pts.push({ x, y, s: Math.round(Math.min(tope, Math.max(s, previo + 24))), clase });
      };
      const s0 = Math.max(0, pagina(yO) - F * vh);
      empuja(xO, yO, s0);
      empuja(xO, yH, Math.max(s0 + 0.12 * vh, pagina(yH) - F * vh));
      empuja(xL, yH, pts[1].s + 0.4 * vh * (Math.abs(xO - xL) / vw));
      empuja(xL, yC, pagina(yC) - F * vh);
      empuja(xL, yB, pagina(yB) - 0.5 * vh, "hilo-campo");
      if (xB - xL > r + 2) empuja(xB, yB, pts[pts.length - 1].s + 40, "hilo-campo");

      const { tramos, esquinas } = trazar(pts, r);
      const rango = (a: number, z: number) => `--a:${a.toFixed(0)}px;--b:${Math.max(a + 1, z).toFixed(0)}px`;
      const html: string[] = [];

      // Las ramas: cuando la cabeza pasa por una línea de capítulo, la luz
      // corre por esa línea hacia la derecha y se apaga antes del borde.
      for (const linea of raiz.querySelectorAll<HTMLElement>("[data-hilo-capitulo]")) {
        const y = Math.round(enRaiz(linea.getBoundingClientRect()).top);
        if (y <= yH + 8 || y >= yC - 8) continue;
        const s = Math.min(tope, Math.max(0, pagina(y) - F * vh));
        html.push(
          `<div class="hilo-tramo hilo-h hilo-derecha hilo-rama" style="top:${y}px;left:${xL + 1}px;width:${Math.max(0, Math.round(textoDer) - xL)}px;${rango(s, s + 0.42 * vh)}"><div class="hilo-linea"><div class="hilo-punta"></div></div></div>`,
        );
      }
      tramos.forEach((t, i) => {
        const clase = ["hilo-tramo", t.vertical ? "hilo-v" : "hilo-h", t.vertical ? (t.sentido > 0 ? "hilo-baja" : "hilo-sube") : t.sentido > 0 ? "hilo-derecha" : "hilo-izquierda", i === 0 ? "hilo-inicio" : "", t.clase].filter(Boolean).join(" ");
        const caja = t.vertical ? `left:${t.x}px;top:${t.y}px;height:${t.largo}px` : `top:${t.y}px;left:${t.x}px;width:${t.largo}px`;
        html.push(`<div class="${clase}" style="${caja};${rango(t.a, t.b)}"><div class="hilo-linea"><div class="hilo-punta"></div></div></div>`);
      });
      for (const e of esquinas) {
        html.push(
          `<div class="hilo-esquina" style="left:${e.x}px;top:${e.y}px;width:${e.r + 1}px;height:${e.r + 1}px;border-${e.horizontal}-width:1px;border-${e.vertical}-width:1px;border-${e.vertical}-${e.horizontal}-radius:${e.r}px;${rango(e.a, e.b)}"></div>`,
        );
      }
      // El punto donde muere: se enciende cuando el hilo llega al botón.
      const ultimo = pts[pts.length - 1];
      html.push(`<div class="hilo-llegada" style="left:${ultimo.x}px;top:${ultimo.y}px;${rango(ultimo.s - 30, ultimo.s + 60)}"></div>`);

      capa.style.height = `${Math.ceil(base.height)}px`;
      capa.innerHTML = html.join("");
      capa.dataset.listo = "";
    };

    // El recuadro del que nace entra subiendo 20 px: se mide otra vez cuando
    // ya está quieto.
    const espera = setTimeout(construir, 1600);
    const soltar = alMedir(construir);
    return () => {
      clearTimeout(espera);
      soltar();
    };
  }, []);

  return <div ref={ref} aria-hidden className="fondo-hilo pointer-events-none absolute inset-x-0 top-0 overflow-hidden" />;
}
