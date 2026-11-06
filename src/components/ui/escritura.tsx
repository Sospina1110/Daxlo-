"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Ritmo de una persona escribiendo, determinista (sin Math.random) para que se
// pueda probar. Con 32 ms fijos por letra se leía como una máquina.
// - Letra i: 26 ms + JITTER[i % 8] (unos 42 ms de media).
// - 120 ms más después de una coma o un punto: la mano se detiene donde se
//   detiene la frase.
// - 60 ms más después de cada tercer espacio: un respiro cada pocas palabras.
export const BASE_LETRA = 26;
export const JITTER = [0, 18, 6, 30, 12, 24, 4, 34] as const;
export const PAUSA_PUNTUACION = 120;
export const PAUSA_ESPACIO = 60;
// La frase completa queda quieta 1,8 s.
export const SOSTENER = 1800;
// Se borra como lo hace una persona: seleccionar todo (el texto toma el color
// de ::selection 260 ms) y borrar de una vez. Antes retrocedía letra por letra
// a 14 ms, y eso no lo hace nadie.
export const SELECCION = 260;
// Vacío antes de la frase siguiente. Los primeros 150 ms de la pausa la frase
// borrada sale en un solo bloque (.salida-escritura, globals.css): el ritmo
// del bucle no cambia.
export const PAUSA = 300;

// Lo que se espera antes de escribir la letra `i` (con `i` letras ya escritas).
export function pausaAntesDe(frase: string, i: number) {
  let ms = BASE_LETRA + JITTER[i % JITTER.length];
  const anterior = frase[i - 1];
  if (anterior === "," || anterior === ".") ms += PAUSA_PUNTUACION;
  // Espacios escritos hasta aquí: el respiro va después del 3.º, 6.º, 9.º…
  const espacios = frase.slice(0, i).split(" ").length - 1;
  if (anterior === " " && espacios % 3 === 0) ms += PAUSA_ESPACIO;
  return ms;
}

type Fase = "escribir" | "sostener" | "seleccionar" | "pausa";

// Pone el texto en el span visible y lo repite en la capa del cursor, que lo
// pinta transparente (globals.css, .cursor-escritura) solo para que su borde
// final quede donde termina el texto.
function poner(texto: HTMLElement, cursor: HTMLElement | null, s: string) {
  texto.textContent = s;
  if (cursor) cursor.dataset.texto = s;
}

// Escribe una frase con ritmo de persona, la sostiene, la selecciona, la borra
// de una vez y pasa a la siguiente. Con "reducir movimiento" muestra la
// primera frase quieta.
//
// Sin un render de React por letra: el texto va en un span sin hijos de React
// y se escribe con textContent. El estado de React cambia solo por fase
// (escribir, sostener, seleccionar, pausa). El cursor conserva siempre la
// clase animate-caret (el script de pausa del layout la observa al cargar);
// mientras escribe o selecciona, data-escribiendo lo deja fijo (globals.css)
// y solo parpadea en las pausas, como un cursor real.
//
// El cursor no es un elemento que se corre detrás de cada letra: Chrome lo
// contaba como un layout shift por letra (unas 60 entradas al cargar el
// inicio). Es una capa del tamaño de la caja, quieta, que repite el texto en
// transparente y lleva el borde final; el texto visible reserva el mismo
// borde, transparente, así los dos parten las líneas igual. pre-wrap: un
// espacio recién escrito no se descarta al final de la línea y el cursor
// avanza con él. Parpadea con opacidad, que va por el compositor.
export function TextoQueSeEscribe({ frases }: { frases: readonly string[] }) {
  // La preferencia de movimiento solo se conoce en el navegador. Hasta montar,
  // el texto es el mismo que salió del servidor (vacío); si no, React ve un
  // HTML distinto al esperado (error #418) y vuelve a pintar la página.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const reducir = Boolean(useReducedMotion()) && montado;
  // Solo escribe mientras está en pantalla: fuera de ella no gasta procesador.
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref);
  const texto = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const escritas = useRef(0);
  const [indice, setIndice] = useState(0);
  const [fase, setFase] = useState<Fase>("escribir");

  // Con "reducir movimiento", la primera frase completa y quieta, puesta
  // después de montar.
  useEffect(() => {
    if (!reducir || !texto.current) return;
    poner(texto.current, cursor.current, frases[0]);
    escritas.current = frases[0].length;
  }, [reducir, frases]);

  useEffect(() => {
    const el = texto.current;
    const c = cursor.current;
    if (reducir || !visible || !el) return;
    const frase = frases[indice];
    let t: ReturnType<typeof setTimeout> | undefined;
    if (fase === "escribir") {
      const paso = () => {
        if (escritas.current >= frase.length) {
          setFase("sostener");
          return;
        }
        t = setTimeout(() => {
          escritas.current += 1;
          poner(el, c, frase.slice(0, escritas.current));
          paso();
        }, pausaAntesDe(frase, escritas.current));
      };
      paso();
    } else if (fase === "sostener") {
      t = setTimeout(() => setFase("seleccionar"), SOSTENER);
    } else if (fase === "seleccionar") {
      t = setTimeout(() => {
        // flushSync monta la copia que sale (fase "pausa") antes de vaciar el
        // texto: borrar y empezar a salir caen en el mismo cuadro, sin un
        // cuadro vacío entre los dos.
        flushSync(() => setFase("pausa"));
        escritas.current = 0;
        poner(el, c, "");
      }, SELECCION);
    } else {
      t = setTimeout(() => {
        setIndice((indice + 1) % frases.length);
        setFase("escribir");
      }, PAUSA);
    }
    return () => clearTimeout(t);
  }, [fase, indice, frases, reducir, visible]);

  const escribiendo = !reducir && (fase === "escribir" || fase === "seleccionar");

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
      {/* La frase recién borrada sale en un solo bloque, todavía seleccionada:
          sube 6 px y se apaga en 150 ms (.salida-escritura). Es una copia en
          la misma celda, montada solo durante la pausa: el texto de verdad ya
          está vacío y el cursor ya volvió al inicio, así que nada cambia de
          alto ni de lugar. Va antes del texto visible (que sigue siendo el
          último hijo) y no se anuncia. Con "reducir movimiento" no hay pausa
          y no aparece. */}
      {fase === "pausa" && !reducir && (
        <span aria-hidden className="salida-escritura pointer-events-none whitespace-pre-wrap [grid-area:1/1]">
          <span className="border-e-2 border-transparent bg-cyan/35 bg-clip-content pe-0.5">{frases[indice]}</span>
        </span>
      )}
      <span className="relative whitespace-pre-wrap [grid-area:1/1]" data-escribiendo={escribiendo || undefined}>
        {/* Seleccionada, con el mismo cian que ::selection y solo detrás de
            las letras (bg-clip-content); nada se desplaza. El borde
            transparente y su relleno reservan el lugar del cursor. */}
        <span ref={texto} className={cn("border-e-2 border-transparent bg-clip-content pe-0.5", fase === "seleccionar" && !reducir && "bg-cyan/35")} />
        <span ref={cursor} aria-hidden className="cursor-escritura animate-caret pointer-events-none absolute inset-0" />
      </span>
    </span>
  );
}
