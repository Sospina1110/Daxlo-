"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { DURACION_PASO, VISIBLE_PARA_ARRANCAR } from "@/lib/recorrido";
import { cn } from "@/lib/utils";

type Paso = { numero: string; titulo: string; texto: string; rotulo: string; llevas: string };
type Textos = { etiqueta: string; grupo: string; pausar: string; seguir: string; volver: string; verPaso: string };

// El recorrido de /consultoria como un video corto: una escena animada por
// paso, que avanza sola, con una barra de progreso partida en cuatro
// capítulos (los nodos de la línea de tiempo de antes). DESIGN.md, Components
// y Motion.
//
// - Sin JavaScript se ve la línea de tiempo de siempre, con los cuatro pasos
//   a la vista: el escenario y los controles solo se pintan bajo .js
//   (globals.css). La clase la pone el layout antes de pintar, así que el
//   reproductor ya sale armado del HTML y no salta al hidratar (CLS 0).
// - Los cuatro pasos siempre están completos en el <ol>, también para
//   buscadores y lectores de pantalla. El reproductor los apila en la misma
//   celda (que toma el alto del más largo) y deja a la vista el que toca; los
//   demás quedan en opacidad 0, sin nada que se pueda enfocar adentro. No se
//   anuncia el cambio de paso (nada de aria-live en algo que avanza solo).
// - Arranca cuando se ve la mitad del escenario y se pausa si deja de verse
//   o si la pestaña se oculta. El botón pausa y sigue (WCAG 2.2.2: se mueve
//   más de 5 s); al terminar se queda en el paso 04 y el botón pasa a
//   "Volver a ver". Cada nodo salta a su paso: si está corriendo, sigue desde
//   ahí; si está en pausa, muestra ese paso con su escena completa.
// - Con "reducir movimiento" nada avanza solo: los nodos cambian de paso y
//   cada escena queda en su cuadro final, quieta. Sin botón de pausa: no hay
//   nada que pausar.
// - Todo lo que se mueve es CSS (transform y opacity, en el compositor). React
//   solo cambia atributos cuando cambia de paso o de estado, nunca por
//   cuadro. La barra de cada capítulo es una animación de CSS de la duración
//   del paso (DURACION_PASO); cuando termina, pasa al siguiente. Pausar es
//   animation-play-state: la escena y la barra se congelan juntas, en el
//   mismo cuadro.
export function Recorrido({ pasos, escenas, textos }: { pasos: readonly Paso[]; escenas: readonly React.ReactNode[]; textos: Textos }) {
  // La preferencia de movimiento solo se conoce en el navegador: hasta montar
  // se dibuja lo mismo que salió del servidor (si no, React ve otro HTML y
  // vuelve a pintar la página, error #418). Lo visual de "reducir
  // movimiento" ya lo resuelve el CSS desde el primer cuadro.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const reducir = Boolean(useReducedMotion()) && montado;

  const escenario = useRef<HTMLDivElement>(null);
  const enVista = useInView(escenario, { amount: VISIBLE_PARA_ARRANCAR });
  const [pestanaVisible, setPestanaVisible] = useState(true);

  const [paso, setPaso] = useState(0);
  // Cambia con cada arranque de un paso: vuelve a montar su escena y su barra,
  // así sus animaciones empiezan desde cero.
  const [ciclo, setCiclo] = useState(0);
  const [iniciado, setIniciado] = useState(false);
  const [pausaUsuario, setPausaUsuario] = useState(false);
  const [terminado, setTerminado] = useState(false);
  // Paso elegido con la animación en pausa: su escena completa y quieta.
  const [cuadroFinal, setCuadroFinal] = useState(false);

  useEffect(() => {
    const alCambiar = () => setPestanaVisible(!document.hidden);
    alCambiar();
    document.addEventListener("visibilitychange", alCambiar);
    return () => document.removeEventListener("visibilitychange", alCambiar);
  }, []);

  // Arranca la primera vez que se ve.
  useEffect(() => {
    if (enVista && pestanaVisible && !reducir && !iniciado) setIniciado(true);
  }, [enVista, pestanaVisible, reducir, iniciado]);

  const ultimo = pasos.length - 1;
  const corriendo = iniciado && !reducir && !pausaUsuario && !terminado && !cuadroFinal && enVista && pestanaVisible;
  const estado = reducir ? "quieto" : terminado ? "fin" : corriendo ? "reproduciendo" : iniciado ? "pausa" : "espera";
  const final = reducir || terminado || cuadroFinal;

  // La barra del paso que corre se llenó: al siguiente, o fin.
  const alLlenarse = (i: number, e: React.AnimationEvent) => {
    if (e.animationName !== "recorrido-progreso" || i !== paso) return;
    if (paso < ultimo) {
      setPaso(paso + 1);
      setCiclo((c) => c + 1);
    } else {
      setTerminado(true);
    }
  };

  const alBoton = () => {
    if (terminado) {
      setPaso(0);
      setCiclo((c) => c + 1);
      setTerminado(false);
      setCuadroFinal(false);
      setPausaUsuario(false);
      setIniciado(true);
    } else if (pausaUsuario) {
      setPausaUsuario(false);
      setIniciado(true);
      // Venía de mostrar un paso completo y quieto: ese paso corre desde el
      // principio.
      if (cuadroFinal) {
        setCuadroFinal(false);
        setCiclo((c) => c + 1);
      }
    } else {
      setPausaUsuario(true);
    }
  };

  const irA = (i: number) => {
    setPaso(i);
    setCiclo((c) => c + 1);
    setTerminado(false);
    setCuadroFinal(pausaUsuario);
    if (!pausaUsuario) setIniciado(true);
  };

  const Icono = terminado ? RotateCcw : pausaUsuario ? Play : Pause;
  const nombreBoton = terminado ? textos.volver : pausaUsuario ? textos.seguir : textos.pausar;

  return (
    <div data-revelar="" className="recorrido mt-10 md:mt-14" data-estado={estado} data-cuadro={final ? "final" : "animado"} data-paso={paso + 1}>
      <div ref={escenario} aria-hidden className="recorrido-escenario relative overflow-hidden rounded-2xl border border-line-2 bg-ink/95">
        {/* La rejilla del hero, tenue y apagada hacia los bordes: el
            escenario se lee como un plano, no como una caja vacía. */}
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_60%_65%_at_50%_58%,#000_15%,transparent_80%)]" />
        <span className="absolute right-3 top-3 rounded-full bg-blue-soft/10 px-2.5 py-0.5 text-[13px] leading-snug text-blue-soft">{textos.etiqueta}</span>
        {/* La escena del paso. Cada arranque la monta de nuevo (key): sus
            animaciones de CSS empiezan desde cero. Después del primer paso
            entra fundiéndose (.escena-corte), como un corte de video. */}
        <div key={`${paso}-${ciclo}`} data-escena={paso + 1} className={cn("escena", ciclo > 0 && "escena-corte")}>
          {escenas[paso]}
        </div>
      </div>

      <div role="group" aria-label={textos.grupo} className="recorrido-controles items-start gap-3">
        <button
          type="button"
          onClick={alBoton}
          aria-label={nombreBoton}
          className="recorrido-boton pulsable flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-2 text-white/80 hover:border-blue-soft/60 hover:text-white"
        >
          <Icono size={16} strokeWidth={1.75} aria-hidden />
        </button>
        <div className="flex min-w-0 flex-1">
          {pasos.map((p, i) => {
            const fase = i < paso ? "hecho" : i === paso ? "activo" : "pendiente";
            return (
              <button
                key={p.numero}
                type="button"
                onClick={() => irA(i)}
                aria-label={`${textos.verPaso} ${p.numero}: ${p.titulo}`}
                aria-current={i === paso ? "step" : undefined}
                data-fase={fase}
                className="recorrido-capitulo group relative h-16 min-w-0 flex-1 text-left"
                style={{ ["--dur-paso" as string]: `${DURACION_PASO[i]}s` } as React.CSSProperties}
              >
                {/* Pista del capítulo (1 px) y lo que lleva corrido (2 px).
                    La barra del paso que corre se vuelve a montar con cada
                    arranque. */}
                <span aria-hidden className="absolute inset-x-0 top-[21.5px] h-px bg-blue-soft/30" />
                <span
                  aria-hidden
                  key={i === paso ? `activo-${ciclo}` : fase}
                  onAnimationEnd={(e) => alLlenarse(i, e)}
                  className="recorrido-relleno absolute inset-x-0 top-[21px] h-[2px] rounded-full bg-blue-soft"
                />
                {/* Nodo: hueco si falta, lleno si ya pasó o es el de ahora; el
                    de ahora lleva además un halo. Solo cambia la opacidad de
                    sus capas. */}
                <span aria-hidden className="recorrido-halo absolute left-[-6px] top-[10px] h-6 w-6 rounded-full bg-blue-soft/20" />
                <span aria-hidden className="recorrido-nodo absolute left-0 top-4 h-3 w-3 rounded-full border border-blue-soft bg-[#08090e]">
                  <span className="recorrido-nodo-lleno absolute inset-[-1px] rounded-full bg-blue-soft" />
                </span>
                {/* El nombre del botón ("Ver el paso 01: …") lleva el número
                    que se ve y el título del paso. */}
                <span className={cn("recorrido-numero absolute left-0 top-[34px] font-display text-[15px] font-medium leading-6 tracking-[0.1em] group-hover:text-white", i === paso ? "text-white" : "text-blue-soft")}>
                  {p.numero}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ol className="recorrido-pasos grid gap-8 lg:grid-cols-4 lg:gap-8">
        {pasos.map((p, i) => (
          <li key={p.numero} data-activo={i === paso ? "" : undefined} className="recorrido-paso relative pl-10 lg:pl-0 lg:pt-8">
            {/* Sin JavaScript, la línea de tiempo de siempre: la línea que une
                los nodos (vertical en celular, horizontal hasta el nodo
                siguiente en escritorio) y el nodo. Con el reproductor no se
                pintan: los reemplaza la barra de capítulos. */}
            {i < ultimo && (
              <span
                aria-hidden
                className="recorrido-estatico absolute bottom-[-44px] left-[15px] top-3 w-px bg-blue-soft/40 lg:bottom-auto lg:left-3 lg:right-[-32px] lg:top-[5.5px] lg:h-px lg:w-auto"
              />
            )}
            <span aria-hidden className="recorrido-estatico absolute left-[9.5px] top-1.5 h-3 w-3 rounded-full border border-blue-soft bg-[#08090e] lg:left-0 lg:top-0" />
            <p className="font-display text-[15px] font-medium tracking-[0.1em] text-blue-soft">{p.numero}</p>
            <h3 className="mt-2 text-[22px] leading-snug text-white">{p.titulo}</h3>
            <p className="mt-2 text-[17px] leading-relaxed text-muted">{p.texto}</p>
            {/* "Te llevas" en minúscula y 15 px: repetido cuatro veces en
                mayúsculas espaciadas gritaba más que el entregable. */}
            <p className="mt-4 text-[15px] font-medium leading-snug text-blue-soft">{p.rotulo}</p>
            <p className="mt-1 text-[17px] leading-snug text-white">{p.llevas}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
