"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

// Escribe una frase letra por letra, la sostiene, la borra y pasa a la
// siguiente. Con "reducir movimiento" muestra la primera frase quieta.
export function TextoQueSeEscribe({ frases }: { frases: readonly string[] }) {
  const reducir = useReducedMotion();
  // Solo escribe mientras está en pantalla: fuera de ella no gasta procesador.
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref);
  const [indice, setIndice] = useState(0);
  const [texto, setTexto] = useState("");
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    if (reducir || !visible) return;
    const completa = frases[indice];
    let t: ReturnType<typeof setTimeout>;
    if (!borrando) {
      t = texto.length < completa.length
        ? setTimeout(() => setTexto(completa.slice(0, texto.length + 1)), 32)
        : setTimeout(() => setBorrando(true), 2000);
    } else if (texto.length > 0) {
      t = setTimeout(() => setTexto(completa.slice(0, texto.length - 1)), 14);
    } else {
      t = setTimeout(() => {
        setBorrando(false);
        setIndice((indice + 1) % frases.length);
      }, 250);
    }
    return () => clearTimeout(t);
  }, [texto, borrando, indice, frases, reducir, visible]);

  // Todas las frases van invisibles y apiladas en la misma celda que la que se
  // escribe: la caja toma la altura de la más larga. Sin esto, en pantallas de
  // 360 y 375 px la caja ganaba y perdía una línea en cada frase y toda la
  // página de abajo saltaba.
  return (
    <span ref={ref} className="grid">
      {frases.map((f) => (
        <span key={f} aria-hidden className="invisible [grid-area:1/1]">
          {f}
          <span className="ml-0.5 inline-block h-[1.05em] w-[2px]" />
        </span>
      ))}
      <span className="[grid-area:1/1]">
        {reducir ? frases[0] : texto}
        <span className="animate-caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-cyan" />
      </span>
    </span>
  );
}
