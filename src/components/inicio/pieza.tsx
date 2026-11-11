"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check, Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { ecosistema, hero, inicio } from "@/content/copy";

// La pieza del hero: una sola idea. Una tarea repetida pasa a un agente, que
// la deja lista, y una persona del equipo la aprueba. Es un ejemplo y va
// rotulado; no es la pantalla de ningún cliente.
//
// Cuenta su historia en un bucle lento: se escribe la tarea, el agente
// trabaja, queda lista y la persona aprueba; después sigue con la siguiente
// tarea. La línea azul del carril baja con cada paso y el punto del paso
// activo va en mandarina. Solo se mueven transform y opacity, y nada cambia
// de tamaño: las tres tareas reservan su alto, invisibles, en la misma celda.
//
// El HTML del servidor trae el primer ejemplo completo (así se ve sin
// JavaScript y con «reducir movimiento»). El bucle arranca después de
// hidratar, se detiene fuera de pantalla y se puede pausar con el botón.

const HISTORIAS = ecosistema.carriles.map((c, i) => ({ tarea: hero.tareas[i], agente: c.agente, persona: c.persona }));

// Fases de una historia: 0 se escribe la tarea, 1 el agente trabaja, 2 queda
// lista y espera a la persona, 3 aprobada.
type Fase = 0 | 1 | 2 | 3;
const ESPERA: Record<Fase, number> = { 0: 600, 1: 1700, 2: 1500, 3: 2800 };
const POR_LETRA = 30;

export function Pieza() {
  const p = inicio.pieza;
  const reducir = useReducedMotion();
  const raiz = useRef<HTMLDivElement>(null);
  const [indice, setIndice] = useState(0);
  const [fase, setFase] = useState<Fase>(3);
  const [letras, setLetras] = useState(HISTORIAS[0].tarea.length);
  const [pausado, setPausado] = useState(false);
  const [enPantalla, setEnPantalla] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    const el = raiz.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => setEnPantalla(es[es.length - 1].isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const historia = HISTORIAS[indice];
  const corre = montado && enPantalla && !pausado && !reducir;
  const escrita = letras >= historia.tarea.length;

  useEffect(() => {
    if (!corre) return;
    // Mientras se escribe, una letra cada 30 ms.
    if (fase === 0 && !escrita) {
      const t = setTimeout(() => setLetras((n) => n + 1), POR_LETRA);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (fase === 3) {
        setIndice((i) => (i + 1) % HISTORIAS.length);
        setLetras(0);
        setFase(0);
      } else {
        setFase((f) => (f + 1) as Fase);
      }
    }, ESPERA[fase]);
    return () => clearTimeout(t);
  }, [corre, fase, escrita]);

  const estado = (paso: 0 | 1 | 2) => {
    if (paso === 0) return fase === 0 ? "activo" : "hecho";
    if (paso === 1) return fase === 0 ? "espera" : fase === 1 ? "activo" : "hecho";
    return fase < 2 ? "espera" : fase === 2 ? "activo" : "hecho";
  };
  const numero = (n: number) => String(n).padStart(2, "0");

  return (
    <div ref={raiz} className="pieza">
      <div className="flex items-center justify-between gap-4 py-2 pl-6 pr-2">
        <p className="caption-4 rotulo-tecnico text-texto-2">{ecosistema.etiqueta}</p>
        <div className="flex min-h-[32px] items-center gap-2">
          <p aria-hidden className="caption-4 mono text-texto-2">
            {numero(indice + 1)} / {numero(HISTORIAS.length)}
          </p>
          {montado && !reducir && (
            <button type="button" onClick={() => setPausado((v) => !v)} aria-pressed={pausado} aria-label={pausado ? p.seguir : p.pausar} className="pieza-control">
              {pausado ? <Play aria-hidden size={14} weight="fill" /> : <Pause aria-hidden size={14} weight="fill" />}
            </button>
          )}
        </div>
      </div>
      <span aria-hidden className="regla" />

      <div role="img" aria-label={p.descripcion} className="p-6">
        <div aria-hidden className="flex flex-col gap-8">
          {/* 01 · La tarea repetida, que se escribe sola. */}
          <div className="pieza-paso" data-estado={estado(0)}>
            <span className="pieza-punto" />
            <span className="pieza-tramo">
              <span className="pieza-tramo-lleno" />
            </span>
            <p className="caption-4 rotulo-tecnico text-texto-2">
              <span className="mono">01</span> {p.rotulos[0]}
            </p>
            <div className="title-2 mt-2 grid text-texto">
              {HISTORIAS.map((h) => (
                <span key={h.tarea} className="invisible [grid-area:1/1]">
                  {h.tarea}
                </span>
              ))}
              <span className="[grid-area:1/1]">
                {historia.tarea.slice(0, letras)}
                {fase === 0 && <span className="pieza-cursor" />}
              </span>
            </div>
          </div>

          {/* 02 · El agente. */}
          <div className="pieza-paso" data-estado={estado(1)}>
            <span className="pieza-punto" />
            <span className="pieza-tramo">
              <span className="pieza-tramo-lleno" />
            </span>
            <p className="caption-4 rotulo-tecnico text-texto-2">
              <span className="mono">02</span> {p.rotulos[1]}
            </p>
            <div className="mt-2 flex min-h-[24px] items-center justify-between gap-4">
              <p key={historia.agente} className="title-3 pieza-cambia text-texto">
                {historia.agente}
              </p>
              {fase >= 1 && (
                <p key={fase >= 2 ? "listo" : "trabajando"} className="caption-2 pieza-cambia text-texto-2">
                  {fase >= 2 ? p.listo : p.trabajando}
                </p>
              )}
            </div>
          </div>

          {/* 03 · La persona que aprueba. */}
          <div className="pieza-paso" data-estado={estado(2)}>
            <span className="pieza-punto" />
            <p className="caption-4 rotulo-tecnico text-texto-2">
              <span className="mono">03</span> {p.rotulos[2]}
            </p>
            <div className="mt-2 flex min-h-[24px] items-center justify-between gap-4">
              <p key={historia.persona} className="title-3 pieza-cambia text-texto">
                {historia.persona}
              </p>
              {fase === 2 && (
                <p key="aprueba" className="caption-2 pieza-cambia text-texto-2">
                  {ecosistema.estados.aprueba}
                </p>
              )}
              {fase === 3 && (
                <p key="aprobado" className="caption-1 pieza-cambia inline-flex items-center gap-2 text-texto">
                  <Check size={14} weight="bold" className="text-trazo" />
                  {p.aprobado}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
