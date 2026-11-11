import { Calculator, Check, Mail, Table2 } from "lucide-react";
import { ecosistema } from "@/content/copy";
import { LineaCapitulo, SectionHeading } from "@/components/ui/blocks";
import { PiezaPasos } from "@/components/ui/pieza-pasos";
import { desfase, PASO_FINAL, REGADOS } from "@/lib/ecosistema";

// La pieza del inicio: cómo queda una empresa. Un escenario de ejemplo pasa de
// "a mano" a "encendido" en cuatro pasos mientras se baja, y los tres pilares
// (lo montamos, lo aprende tu gente, nos quedamos) viven dentro de él.
//
// Es HTML y CSS (globals.css, bloque "Ecosistema"): sin SVG, sin canvas y sin
// librerías. El marcado sale completo del servidor en su cuadro final (paso
// 3) y con los cuatro pasos encendidos; PiezaPasos solo decide qué paso está
// activo y lo escribe en data-paso. Con «reducir movimiento» o sin JavaScript
// nada se fija y nada avanza: el escenario arriba y los pasos debajo, en dos
// columnas.
//
// Vocabulario (DESIGN.md): la gente es un círculo blanco; el trabajo, una
// ficha menta; un agente, una placa azul con filo cian; una automatización,
// una línea cian. Las herramientas son tejas oscuras: ya estaban en la
// empresa. Daxlo es su equis, al lado y fuera del marco.
//
// Accesibilidad: el escenario es una imagen (role="img" con su descripción) y
// lo de adentro no se anuncia ni recibe el foco. Los pasos son h3 y párrafos
// de verdad.
const ICONOS = [Mail, Table2, Calculator] as const;

export function Ecosistema() {
  const e = ecosistema;
  return (
    <section aria-labelledby="titulo-ecosistema" className="seccion-capitulo relative">
      <LineaCapitulo />
      <div className="container-page">
        <SectionHeading id="titulo-ecosistema" titulo={e.titulo} />
        <PiezaPasos className="eco mt-8 md:mt-14">
          <div className="eco-caja">
            <Leyenda className="eco-leyenda-arriba" />
            <div data-escenario="" data-paso={PASO_FINAL} role="img" aria-label={e.descripcion} className="eco-escenario">
              <Escenario />
            </div>
            <Leyenda className="eco-leyenda-abajo" />
          </div>
          <ol className="eco-pasos">
            {e.pasos.map((p) => (
              <li key={p.rotulo} data-paso-texto="" className="eco-paso">
                <p className="rotulo eco-paso-rotulo">{p.rotulo}</p>
                <h3 className="mt-4 text-headline-support text-white">{p.titulo}</h3>
                <p className="mt-4 max-w-[46ch] text-body-md text-muted">{p.texto}</p>
              </li>
            ))}
          </ol>
        </PiezaPasos>
      </div>
    </section>
  );
}

// Todo lo de adentro es decorativo (aria-hidden): lo cuenta la descripción.
// - data-desde="n": aparece a partir del paso n. data-hasta="0": solo en "Hoy".
// - .eco-llega (sube 6 px y crece desde 0.96), .eco-traza (se dibuja con
//   scaleX o scaleY) y .eco-funde (solo opacidad) son las tres entradas.
// - --t es el retraso de cada pieza dentro de su paso (la ola).
function Escenario() {
  const e = ecosistema;
  return (
    <div aria-hidden className="eco-lienzo">
      {/* Solo en celular: cuatro puntos y el rótulo del paso que se ve. */}
      <div className="eco-barra">
        <span className="eco-puntos">
          {e.pasos.map((p) => (
            <span key={p.rotulo} className="eco-punto" />
          ))}
        </span>
        <span className="eco-barra-rotulos rotulo">
          {e.pasos.map((p) => (
            <span key={p.rotulo}>{p.rotulo}</span>
          ))}
        </span>
      </div>
      <span className="rotulo eco-ejemplo">{e.etiqueta}</span>

      <div className="eco-marco">
        <span className="rotulo eco-marco-rotulo">{e.marco}</span>
        {e.carriles.map((c, i) => {
          const Icono = ICONOS[i];
          const t = (base: number) => ({ ["--t" as string]: `${(base * i).toFixed(2)}s` }) as React.CSSProperties;
          return (
            <div key={c.agente} className="eco-carril" data-carril={i} style={{ ["--fase" as string]: `-${desfase(i)}s` } as React.CSSProperties}>
              {/* A mano: una línea gris punteada de la herramienta a la persona. */}
              <span data-hasta="0" className="eco-via-mano eco-funde" />
              {/* Automatizaciones: se dibujan desde la herramienta. */}
              <span data-desde="1" className="eco-via eco-traza" style={t(0.08)} />

              {/* El trabajo. En "Hoy" está regado: cada papel girado y fuera
                  de lugar (--x0, --y0, --r0), y llegan uno por uno cuando el
                  escenario entra en pantalla. En "Lo montamos" enderezan y
                  viajan al arranque de su carril; de ahí en adelante circula
                  uno, de la herramienta a la persona, por detrás del agente. */}
              <span className="eco-pila">
                {REGADOS[i].map((p, k) => (
                  <span
                    key={k}
                    className="ficha-papel eco-papel"
                    style={{ ["--x0" as string]: `${p.x}cqw`, ["--y0" as string]: p.y, ["--r0" as string]: `${p.r}deg`, ["--n" as string]: i + k * 2 } as React.CSSProperties}
                  >
                    {c.papel}
                  </span>
                ))}
              </span>
              <span className="eco-viaje">
                <span className="ficha-papel">{c.papel}</span>
              </span>

              <span className="eco-nodo eco-herramienta">
                <span className="eco-forma">
                  <Icono size={16} strokeWidth={1.75} />
                </span>
                <span className="eco-nombre">{c.herramienta}</span>
              </span>

              <span className="eco-nodo eco-agente">
                <span data-hasta="0" className="eco-hueco eco-funde">
                  <span>{e.estados.aMano}</span>
                </span>
                <span data-desde="1" className="eco-forma eco-llega" style={t(0.12)}>
                  <span className="eco-brillo" />
                </span>
                <span data-desde="1" className="eco-nombre eco-funde" style={t(0.12)}>
                  {c.agente}
                </span>
              </span>

              <span className="eco-nodo eco-persona">
                <span className="eco-forma">
                  <span data-desde="2" className="eco-lleno eco-funde" style={t(0.08)} />
                </span>
                <span className="eco-nombre">{c.persona}</span>
                <span data-desde="2" className="eco-aprueba eco-funde" style={{ ["--t" as string]: `${(0.2 + 0.08 * i).toFixed(2)}s` } as React.CSSProperties}>
                  <Check size={13} strokeWidth={2.5} />
                  {e.estados.aprueba}
                </span>
              </span>

              {/* Solo en el carril de Ventas: la persona le ajusta algo al agente. */}
              {i === 1 && (
                <span data-desde="2" className="eco-ajusta eco-funde">
                  <span className="eco-ajusta-pulso" />
                  <span className="eco-ajusta-rotulo">{e.estados.ajusta}</span>
                </span>
              )}
            </div>
          );
        })}

        {/* El cuarto carril, punteado: lo que sigue. */}
        <div data-desde="3" className="eco-siguiente eco-funde">
          <span className="eco-siguiente-via" />
          <span className="eco-siguiente-teja" />
          <span className="eco-siguiente-persona" />
          <span className="eco-siguiente-nombre">{e.estados.siguiente}</span>
        </div>
      </div>

      {/* Daxlo: fuera del marco, bajo la columna de agentes. Mientras monta,
          la línea es sólida; después pasa a punteada (ya no está en el flujo). */}
      <div data-desde="1" className="eco-daxlo eco-funde">
        <span className="eco-daxlo-linea">
          <span className="eco-daxlo-solida" />
          <span data-desde="3" className="eco-daxlo-punteada eco-funde" />
          <span className="eco-daxlo-pulso" />
        </span>
        <span className="eco-daxlo-teja">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/daxlo-x.png" alt="" width={22} height={16} loading="lazy" />
        </span>
        <span className="eco-daxlo-texto">
          <span className="eco-daxlo-nombre">{e.daxlo.nombre}</span>
          <span className="eco-daxlo-acciones">
            {e.daxlo.acciones.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </span>
        </span>
      </div>
    </div>
  );
}

// La leyenda deja leer el dibujo a quien nunca vio un diagrama de estos. Va
// fuera del escenario y tampoco se anuncia: nombra lo que la descripción de
// la imagen ya dice.
function Leyenda({ className }: { className: string }) {
  const [gente, trabajo, agentes, automatizaciones] = ecosistema.leyenda;
  return (
    <ul aria-hidden className={`eco-leyenda ${className}`}>
      <li>
        <span className="eco-leyenda-persona" />
        {gente}
      </li>
      <li>
        <span className="eco-leyenda-papel" />
        {trabajo}
      </li>
      <li>
        <span className="eco-leyenda-agente" />
        {agentes}
      </li>
      <li>
        <span className="eco-leyenda-via" />
        {automatizaciones}
      </li>
    </ul>
  );
}
