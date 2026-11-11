"use client";

import { useEffect, useRef } from "react";
import { inicio, manifiesto } from "@/content/copy";

// Dos momentos del inicio que avanzan con el scroll: la frase que se enciende
// palabra por palabra y el indicador de los tres pasos.
//
// Los dos leen el mismo avance: cuánto de un bloque ya pasó por una línea de
// lectura de la pantalla. Se mide en un requestAnimationFrame por cuadro como
// mucho, y solo mientras el bloque está en pantalla (un IntersectionObserver
// pone y quita el oyente de scroll). El avance nunca retrocede: lo que se
// encendió queda encendido, como las demás apariciones de la página.
//
// Sin JavaScript, o con «reducir movimiento», todo está completo desde el
// principio (limpia.css).

type Medida = (caja: DOMRect, alto: number) => number;

function useAvance(ref: React.RefObject<HTMLElement | null>, medida: Medida, alAvanzar: (p: number) => void) {
  const guardado = useRef({ medida, alAvanzar });
  guardado.current = { medida, alAvanzar };
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    let cuadro = 0;
    let activo = false;
    let maximo = -1;
    const medir = () => {
      cuadro = 0;
      const p = Math.min(1, Math.max(0, guardado.current.medida(el.getBoundingClientRect(), window.innerHeight)));
      if (p <= maximo) return;
      maximo = p;
      guardado.current.alAvanzar(p);
    };
    const pedir = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };
    const io = new IntersectionObserver((es) => {
      const dentro = es[es.length - 1].isIntersecting;
      if (dentro && !activo) {
        activo = true;
        window.addEventListener("scroll", pedir, { passive: true });
        window.addEventListener("resize", pedir);
      } else if (!dentro && activo) {
        activo = false;
        window.removeEventListener("scroll", pedir);
        window.removeEventListener("resize", pedir);
      }
      // Al entrar y al salir se mide una vez: un salto largo de scroll puede
      // pasar el bloque de largo entre dos cuadros.
      medir();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, [ref]);
}

// ---------------------------------------------------------------- Frase

// La línea de lectura va al 72 % del alto de la pantalla: una palabra se
// enciende cuando esa línea ya recorrió la parte del bloque que le toca.
const lineaFrase: Medida = (caja, alto) => (alto * 0.72 - caja.top) / Math.max(1, caja.height);

// La frase que se enciende (skill landing-page-design, B11): qué es Daxlo, en
// letra grande y sin nada más en la pantalla. La primera oración es el h2; el
// resto sigue en el mismo párrafo. Cada palabra va en su <span> y pasa del
// 30 % al blanco cuando le llega el turno, con la curva base.
export function Frase() {
  const ref = useRef<HTMLDivElement>(null);
  const encendidas = useRef(0);
  const fuerte = manifiesto.fuerte.split(" ");
  const sigue = manifiesto.sigue.split(" ");
  const total = fuerte.length + sigue.length;

  useAvance(ref, lineaFrase, (p) => {
    const palabras = ref.current?.querySelectorAll(".frase-palabra");
    if (!palabras) return;
    const hasta = Math.round(p * total);
    for (let i = encendidas.current; i < hasta; i++) palabras[i]?.setAttribute("data-on", "");
    encendidas.current = Math.max(encendidas.current, hasta);
  });

  const palabra = (t: string, i: number) => (
    <span key={i} className="frase-palabra">
      {t}{" "}
    </span>
  );

  return (
    <section aria-labelledby="titulo-frase" className="seccion">
      <div className="contenedor">
        <div ref={ref} className="frase heading-3 mx-auto max-w-[680px] text-texto">
          <h2 id="titulo-frase" className="inline">
            {fuerte.map(palabra)}
          </h2>
          <p className="inline">{sigue.map((t, i) => palabra(t, fuerte.length + i))}</p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Pasos

// El indicador recorre los tres pasos mientras la lista cruza la pantalla:
// empieza cuando su borde de arriba llega al 80 % del alto y termina cuando
// ya pasó su propio alto (o el 40 % de la pantalla, si la lista es más baja,
// como en escritorio, donde los pasos van en fila).
const lineaPasos: Medida = (caja, alto) => (alto * 0.8 - caja.top) / Math.max(caja.height, alto * 0.4);

// Cómo funciona, en tres pasos. La línea azul crece con el scroll (solo
// transform), cada paso se enciende cuando la línea llega a su punto y el
// punto del paso al que se llegó va en mandarina.
export function Pasos() {
  const ref = useRef<HTMLDivElement>(null);
  const pasos = inicio.pasos.lista;

  useEffect(() => {
    ref.current?.setAttribute("data-lista", "");
  }, []);

  useAvance(ref, lineaPasos, (p) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--avance", p.toFixed(3));
    const items = el.querySelectorAll(".pasos-item");
    let actual = -1;
    items.forEach((item, i) => {
      if (p > i / items.length + 0.02) {
        item.setAttribute("data-on", "");
        actual = i;
      }
    });
    items.forEach((item, i) => (i === actual ? item.setAttribute("data-actual", "") : item.removeAttribute("data-actual")));
  });

  return (
    <section aria-labelledby="titulo-pasos" className="seccion">
      <div className="contenedor">
        <h2 id="titulo-pasos" data-revelar="" className="heading-2 max-w-[680px] text-texto">
          {inicio.pasos.titulo}
        </h2>
        <div ref={ref} data-revelar="" className="pasos relative mt-12 lg:mt-16">
          <span aria-hidden className="pasos-via">
            <span className="pasos-via-llena" />
          </span>
          <ol className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {pasos.map((paso, i) => (
              <li key={paso.titulo} className="pasos-item">
                <span aria-hidden className="pasos-punto" />
                <p className="caption-4 mono text-texto-2">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="heading-5 mt-4 max-w-[18ch] text-texto">{paso.titulo}</h3>
                <p className="body-3 mt-4 max-w-[36ch] text-texto-2">{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
