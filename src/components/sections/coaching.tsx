import { coaching, otraLinea, rutas } from "@/content/copy";
import { MarcaX } from "@/components/ui/primitives";
import { LineaCapitulo, SectionHeading } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { TextoQueSeEscribe } from "@/components/ui/escritura";
import { ParaQuien, TarjetasProblema, Zona } from "./zona";
import { ZonaPortada } from "./zona-portada";
import { cn, glow, sinCorte } from "@/lib/utils";

// La página contesta en orden: ¿qué es? (portada), ¿me pasa a mí? (escenas),
// ¿cómo es una clase y qué me llevo? (la sesión) y ¿es para mí y con quién?
// (dos columnas y los socios). Las preguntas y el cierre los pone la página.
export function ZonaCoaching({ migas }: { migas?: React.ReactNode }) {
  const c = coaching;
  return (
    <Zona tono="cyan" arriba>
      <ZonaPortada tono="cyan" {...c.portada} migas={migas} />
      <TarjetasProblema tono="cyan" titulo={c.problema.titulo} escenas={c.problema.escenas} />
      <Sesion />
      <ParaQuien
        id="para-ti"
        tono="cyan"
        titulo={c.paraTi.titulo}
        es={c.paraTi.es}
        noEs={c.paraTi.noEs}
        enlace={{ texto: otraLinea.consultoria.enlace, href: rutas.consultoria }}
        socios={c.paraTi.socios}
      />
    </Zona>
  );
}

// ------------------------------------------------ La sesión

// Capítulo y momento de autor de la página: la sesión se muestra en vez de
// describirse. A la izquierda la ventana (ilustrativa, rotulada "Ejemplo"); a
// la derecha los tres pasos, que contestan las tres escenas del problema, y el
// remate como cita. Una sola secuencia numerada a la vista: los pasos 1-2-3
// (la ventana ya no lleva el plan de temas al lado, que el ojo emparejaba con
// los números). En celular: titular, ventana, pasos y remate. Lleva el id
// como-funciona: la redirección #coaching-pasos, el pie y las pruebas.
function Sesion() {
  const s = coaching.sesion;
  return (
    <section id="como-funciona" className="relative py-16 md:py-24">
      <LineaCapitulo tono="cyan" />
      <div className="container-page">
        <SectionHeading titulo={sinCorte(s.titulo)} tono="cyan" alineacion="izquierda" />
        <div className="mt-10 grid items-start gap-10 md:mt-14 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <Reveal y={32}>
            <VentanaSesion />
          </Reveal>
          <div>
            <ol data-escalonar="0.08">
              {s.pasos.map((p) => (
                <li key={p.numero} data-revelar="" className="flex gap-4 border-t border-line py-5">
                  <span className="w-4 shrink-0 font-display text-[15px] font-medium leading-[1.6] tracking-[0.1em] text-cyan">{p.numero}</span>
                  <p className="text-[18px] leading-relaxed text-white/85">{p.texto}</p>
                </li>
              ))}
            </ol>
            <Reveal delay={0.16}>
              <p className="mt-4 border-t border-line-2 pt-6 font-display text-[22px] font-medium leading-snug text-white">{s.remate}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// Maqueta del método: tú escribes, nosotros corregimos. Ilustrativa, no es la
// conversación de ningún cliente: lleva el rótulo "Ejemplo" a la vista. Sin
// puntos de ventana, sin "En vivo" ni pulso animado, para que no se lea como
// una sesión real. Solo el chat, sin barra lateral. Es decorativa para
// lectores de pantalla: lo que cuenta ya está en los pasos.
function VentanaSesion() {
  const v = coaching.sesion.ventana;
  return (
    <div aria-hidden className="relative overflow-hidden rounded-[28px] border border-line-2 bg-ink-2/90 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
      <span className="absolute -bottom-40 -left-24 h-96 w-96 resplandor" style={glow("41 196 245", 0.22, 1.57)} />
      <div className="relative">
        <div className="flex min-h-[380px] flex-col p-5 md:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
            <span className="font-display text-[17px] text-white">{v.titulo}</span>
            <span className="rounded-full bg-cyan/10 px-2.5 py-0.5 text-[13px] text-cyan">{v.etiqueta}</span>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-4 py-6">
            {v.mensajes.map((m, i) => (
              <div
                key={m.texto}
                data-revelar=""
                style={{ ["--retraso" as string]: `${0.3 + i * 0.75}s`, ["--y" as string]: "14px" } as React.CSSProperties}
                className={cn("flex items-end gap-3", m.de === "tu" ? "justify-end" : "justify-start")}
              >
                {m.de === "daxlo" && <MarcaX tamano={32} />}
                <p
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-snug md:text-[16px]",
                    m.de === "tu" ? "rounded-br-md bg-white/[0.08] text-white/90" : "rounded-bl-md border border-cyan/25 bg-cyan/[0.08] text-white",
                  )}
                >
                  {m.texto}
                </p>
                {m.de === "tu" && (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-2 bg-ink text-[13px] font-medium text-white/80">
                    {v.avatar}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-line-2 bg-ink/70 px-4 py-3.5 text-[15px] text-white/60">
            <TextoQueSeEscribe frases={[v.placeholder]} />
          </div>
        </div>
      </div>
    </div>
  );
}
