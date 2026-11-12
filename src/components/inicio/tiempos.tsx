"use client";

import { useEffect, useRef } from "react";
import { inicio } from "@/content/copy";
import { crearBucle } from "@/lib/campo/bucle";
import { leerEntorno, limitar, suave } from "@/lib/campo/entorno";
import { crearParticulas, pintarParticulas, sembrar } from "@/lib/campo/particulas";
import { crearTrama, leerEncuadre, muestrear } from "@/lib/campo/trama";
import type { VideoFondo as Video } from "@/lib/campo/video";
import { MarcaX } from "./dibujos";
import { FondoVideo } from "./fondo-video";
import { Foto } from "./foto";

// La escena fijada en tres tiempos.
//
// La sección mide varias pantallas de alto y lo de adentro se queda fijo
// (position: sticky, campo.css) mientras se baja. El avance del scroll (0 a 1)
// decide qué se ve:
//
//   0,00 → 0,20  tiempo 01: el primer video y su afirmación
//   0,20 → 0,29  relevo: la trama cubre la pantalla y la toma cambia debajo
//   0,29 → 0,47  tiempo 02
//   0,47 → 0,56  relevo
//   0,56 → 0,74  tiempo 03
//   0,74 → 0,94  paso a claro: la toma funde a papel y los puntos de la trama
//                vuelan a formar la X de Daxlo, con la frase de cierre
//
// Este componente mide el scroll, dibuja el lienzo (la trama y las
// partículas) y prende y apaga los videos: solo corre el del tiempo que se
// está viendo (los dos, durante un relevo), y ninguno con la escena fuera de
// pantalla. Todo lo demás es CSS: escribe en la sección data-tiempo (qué
// afirmación toca) y unas variables con los avances (--f2 y --f3, las tomas;
// --velo y --papel; --z1 a --z3, el acercamiento; --b1 a --b3, las barras).
//
// El bucle corre solo con la escena en pantalla y la pestaña visible. En
// equipos que no lo aguantan se dibuja un cuadro por cuadro de scroll y
// quedan los pósters. Con «reducir movimiento» no hay escena fijada, lienzo
// ni video: el CSS deja los cuatro bloques uno debajo del otro, con la X
// quieta. Sin JavaScript, igual.

const ESCENAS = ["problema", "giro", "operacion"] as const;

// Los cortes del avance (ver arriba).
const A = 0.2;
const B = 0.29;
const C = 0.47;
const D = 0.56;
const E = 0.74;
const F = 0.94;
// Dónde cambia la afirmación: a mitad de cada relevo y cuando el papel ya
// cubre.
const T2 = (A + B) / 2;
const T3 = (C + D) / 2;
const T4 = E + (F - E) * 0.45;

const COLOR_TRAMA = "rgb(214 238 252)";
const COLOR_TINTA = "rgb(2 7 10)";
const COLOR_AZUL = "rgb(2 151 222)";

// Una afirmación de dos frases va en dos renglones.
function enFrases(texto: string) {
  return texto.split(/(?<=\.)\s+/).map((frase) => (
    <span key={frase} className="cm-frase-linea">
      {frase}{" "}
    </span>
  ));
}

export type VideosEscena = Partial<Record<(typeof ESCENAS)[number], Video | null>>;

export function Tiempos({ videos = {} }: { videos?: VideosEscena }) {
  const e = inicio.escena;
  const seccion = useRef<HTMLElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sec = seccion.current;
    const lz = lienzo.current;
    const pegada = sec?.querySelector<HTMLElement>(".cm-tiempos-pegada");
    if (!sec || !lz || !pegada) return;
    const entorno = leerEntorno();
    if (entorno.reducido) return;

    const cajas = [...sec.querySelectorAll<HTMLElement>(".cm-tiempo-foto")];
    const trama = crearTrama(lz, { celda: entorno.movil ? 10 : 12, color: COLOR_TRAMA, semilla: 9 });
    const particulas = crearParticulas(entorno.movil ? 750 : 1500);
    let luces: (Float32Array | null)[] = [null, null, null];
    let sembrado = false;
    let ancho = 0;
    let alto = 0;
    let avance = 0;
    let enPantalla = false;
    let ultimaMuestra = 0;
    const puesto: Record<string, string> = {};
    const poner = (nombre: string, valor: number) => {
      const v = valor.toFixed(3);
      if (puesto[nombre] === v) return;
      puesto[nombre] = v;
      sec.style.setProperty(nombre, v);
    };

    // La luz de la toma i: del video si ya corre, o de su póster.
    const tomar = (i: number, destino?: Float32Array | null) => {
      const caja = cajas[i];
      const foto = caja?.querySelector("img");
      const video = caja?.querySelector("video");
      const fuente = video && video.readyState >= 2 ? video : foto?.complete ? foto : null;
      if (!foto || !fuente) return destino ?? null;
      return muestrear(fuente, trama.rejilla(), leerEncuadre(foto), destino ?? undefined) ?? destino ?? null;
    };

    // Cada video corre solo mientras su toma se ve.
    const mandarVideos = () => {
      const p = avance;
      const visibles = [p < B, p > A && p < D, p > C && p < E + (F - E) * 0.6];
      cajas.forEach((caja, i) => {
        const v = caja.querySelector("video");
        if (!v) return;
        const debe = enPantalla && !document.hidden && visibles[i];
        if (debe && v.paused) v.play().catch(() => {});
        else if (!debe && !v.paused) v.pause();
      });
    };

    const cuadro = (t: number) => {
      if (!ancho) return;
      const caja = sec.getBoundingClientRect();
      const recorrido = Math.max(1, caja.height - alto);
      const p = limitar(-caja.top / recorrido);
      avance = p;

      // Las tomas se vuelven a leer cuatro veces por segundo: los videos se
      // mueven, y la trama los sigue.
      const releer = t - ultimaMuestra > 0.25;
      for (let i = 0; i < 3; i++) if (!luces[i] || (releer && cajas[i].querySelector("video")?.paused === false)) luces[i] = tomar(i, luces[i]);
      if (releer) {
        ultimaMuestra = t;
        mandarVideos();
      }
      if (!sembrado && luces[2]) {
        const r = trama.rejilla();
        sembrar(particulas, luces[2], r.cols, r.filas);
        sembrado = true;
      }

      const m12 = limitar((p - A) / (B - A));
      const m23 = limitar((p - C) / (D - C));
      const luz = limitar((p - E) / (F - E));
      const tiempo = p < T2 ? 1 : p < T3 ? 2 : p < T4 ? 3 : 4;
      if (sec.dataset.tiempo !== String(tiempo)) sec.dataset.tiempo = String(tiempo);

      const relevo = Math.max(Math.sin(Math.PI * m12), Math.sin(Math.PI * m23));
      poner("--f2", suave(0.2, 0.8, m12));
      poner("--f3", suave(0.2, 0.8, m23));
      poner("--velo", 0.62 * relevo);
      poner("--papel", suave(0.02, 0.5, luz));
      poner("--z1", limitar(p / B));
      poner("--z2", limitar((p - A) / (D - A)));
      poner("--z3", limitar((p - C) / (F - C)));
      poner("--b1", limitar(p / T2));
      poner("--b2", limitar((p - T2) / (T3 - T2)));
      poner("--b3", limitar((p - T3) / (T4 - T3)));

      // Qué toma lee la trama: la del tiempo, o las dos a medias en el relevo.
      let a = luces[0];
      let b: Float32Array | null = null;
      let mezcla = 0;
      if (p >= D) a = luces[2];
      else if (p >= C) {
        a = luces[1];
        b = luces[2];
        mezcla = suave(0.3, 0.7, m23);
      } else if (p >= B) a = luces[1];
      else if (p >= A) {
        b = luces[1];
        mezcla = suave(0.3, 0.7, m12);
      }

      trama.limpiar();
      trama.pintar({
        t,
        a,
        b,
        mezcla,
        fuerza: 1,
        cubrir: Math.max(relevo, suave(0, 0.3, luz)),
        alfa: 1 - suave(0.12, 0.5, luz),
      });

      const ctx = trama.contexto();
      if (ctx && luz > 0.04) {
        const anchoX = entorno.movil ? ancho * 0.82 : Math.min(ancho * 0.5, alto * 0.92);
        pintarParticulas(ctx, particulas, {
          q: suave(0.06, 1, luz),
          t,
          alfa: suave(0.08, 0.42, luz),
          ancho,
          alto,
          esc: trama.escala(),
          cx: ancho / 2,
          cy: alto * 0.47,
          anchoX,
          color: COLOR_TINTA,
          colorAzul: COLOR_AZUL,
          atlas: trama.atlas(COLOR_TINTA),
          atlasAzul: trama.atlas(COLOR_AZUL),
          ladoSigno: trama.ladoSigno(),
        });
      }
    };

    const bucle = crearBucle(sec, cuadro, { continuo: entorno.animar, fps: 60 });

    const medir = () => {
      const r = pegada.getBoundingClientRect();
      if (!r.width || !r.height) return;
      ancho = r.width;
      alto = r.height;
      trama.ajustar(ancho, alto);
      luces = [null, null, null];
      sembrado = false;
      bucle.pedir();
    };
    const ro = new ResizeObserver(medir);
    ro.observe(pegada);
    document.fonts?.ready.then(medir).catch(() => {});
    const fotos = cajas.map((c) => c.querySelector("img"));
    fotos.forEach((f) => f?.addEventListener("load", bucle.pedir));
    // Fuera de pantalla, o con la pestaña oculta, ningún video corre.
    const io = new IntersectionObserver((es) => {
      enPantalla = es[es.length - 1].isIntersecting;
      mandarVideos();
    });
    io.observe(sec);
    document.addEventListener("visibilitychange", mandarVideos);

    return () => {
      bucle.destruir();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", mandarVideos);
      fotos.forEach((f) => f?.removeEventListener("load", bucle.pedir));
    };
  }, []);

  return (
    <section ref={seccion} aria-labelledby="titulo-tiempos" data-tema="claro" data-tiempo="1" className="cm-tiempos">
      <div className="cm-tiempos-pegada">
        <ol className="cm-tiempos-lista">
          {e.tiempos.map((frase, i) => {
            const video = videos[ESCENAS[i]];
            return (
              <li key={frase} data-n={i + 1} className="cm-tiempo">
                <div aria-hidden="true" data-escena={ESCENAS[i]} className="cm-tiempo-foto">
                  <Foto nombre={ESCENAS[i]} ancho={1600} alto={893} />
                  {video && <FondoVideo video={video} modo="mandado" />}
                </div>
                <div className="cm-tiempo-texto">
                  {i === 0 && (
                    <h2 id="titulo-tiempos" className="cm-mono cm-corchete">
                      {e.rotulo}
                    </h2>
                  )}
                  <p className="cm-titular cm-titular-l">
                    <span className="cm-barrido">{enFrases(frase)}</span>
                  </p>
                </div>
              </li>
            );
          })}
          <li data-n={4} className="cm-tiempo cm-tiempo-cierre">
            <MarcaX className="cm-x-quieta" />
            <div className="cm-tiempo-texto">
              <p className="cm-titular cm-titular-l">
                <span className="cm-barrido">{enFrases(e.cierre)}</span>
              </p>
            </div>
          </li>
        </ol>
        <span aria-hidden="true" className="cm-tiempos-velo" />
        <span aria-hidden="true" className="cm-tiempos-papel" />
        <canvas ref={lienzo} aria-hidden="true" className="cm-trama cm-tiempos-lienzo" />
        <span aria-hidden="true" className="cm-grano cm-tiempos-grano" />
        <div aria-hidden="true" className="cm-tiempos-barras">
          {[1, 2, 3].map((n) => (
            <span key={n} data-n={n} className="cm-barra-tiempo">
              <span className="cm-mono">[0{n}]</span>
              <span className="cm-barra-via">
                <span className="cm-barra-llena" />
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
