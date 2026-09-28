import { CalendarClock, Check, CircleX, Clapperboard, Circle, MonitorUp, Video } from "lucide-react";
import { coaching } from "@/content/copy";
import { MarcaX, WindowDots } from "@/components/ui/primitives";
import { SectionHeading } from "@/components/ui/blocks";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { TextoQueSeEscribe } from "@/components/ui/escritura";
import { TarjetaCalifica, TarjetasProblema, Zona } from "./zona";
import { ZonaPortada } from "./zona-portada";
import { cn, glow } from "@/lib/utils";

export function ZonaCoaching() {
  const c = coaching;
  return (
    <Zona tono="cyan">
      <ZonaPortada id="coaching" tono="cyan" {...c.portada} />
      <TarjetasProblema
        tono="cyan"
        titulo={c.problema.titulo}
        sub={c.problema.sub}
        tarjetas={c.problema.tarjetas}
        iconos={[<Clapperboard key="a" size={22} />, <CircleX key="b" size={22} />, <CalendarClock key="c" size={22} />]}
      />
      <Sesion />
      <Pasos />
      <TarjetaCalifica tono="cyan" {...c.paraTi} />
    </Zona>
  );
}

// ------------------------------------------------ La sesión

function Sesion() {
  const s = coaching.sesion;
  return (
    <section className="relative py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
          <SectionHeading titulo={s.titulo} sub={s.texto} tono="cyan" alineacion="izquierda" />
          <Reveal delay={0.2}>
            <p className="border-l-2 border-cyan pl-5 font-display text-[22px] leading-snug text-white">{s.remate}</p>
          </Reveal>
        </div>
        <Reveal className="mt-12" y={40}>
          <VentanaSesion />
        </Reveal>
      </div>
    </section>
  );
}

// Maqueta del método: tú escribes, nosotros corregimos. Ilustrativa, no es la
// conversación de ningún cliente.
function VentanaSesion() {
  const s = coaching.sesion;

  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-[26px] border border-line-2 bg-ink-2/90 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
    >
      <span className="absolute -bottom-40 -left-24 h-96 w-96 resplandor" style={glow("41 196 245", 0.25, 1.57)} />
      <div className="relative grid md:grid-cols-[250px_1fr]">
        <aside className="hidden flex-col border-r border-line p-5 md:flex">
          <WindowDots />
          <p className="mt-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-dim">Tu plan</p>
          <ul className="mt-3 space-y-1.5">
            {s.plan.map((p) => (
              <li
                key={p.sesion}
                className={cn(
                  "flex items-start gap-3 rounded-xl px-3 py-2.5",
                  p.estado === "ahora" && "border border-cyan/30 bg-cyan/10",
                )}
              >
                <span className="mt-0.5">
                  {p.estado === "hecha" && <Check size={16} className="text-cyan" />}
                  {p.estado === "ahora" && (
                    <span className="relative mt-1 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan" />
                    </span>
                  )}
                  {p.estado === "sigue" && <Circle size={15} className="text-white/35" />}
                </span>
                <span className="text-[14px] leading-tight">
                  <span className="block text-white/50">{p.sesion}</span>
                  <span className={p.estado === "sigue" ? "text-white/55" : "text-white/90"}>{p.tema}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-[13px] text-white/65">
            <MonitorUp size={15} className="text-cyan" />
            Pantalla compartida
          </div>
        </aside>

        <div className="flex min-h-[460px] flex-col p-5 md:p-7">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="font-display text-[17px] text-white">{s.ventana}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-[12px] text-cyan">
              <Video size={13} /> En vivo
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-4 py-6">
            {s.mensajes.map((m, i) => (
              <div
                key={i}
                data-revelar=""
                style={{ ["--retraso" as string]: `${0.3 + i * 0.75}s`, ["--y" as string]: "14px" } as React.CSSProperties}
                className={cn("flex items-end gap-3", m.de === "tu" ? "justify-end" : "justify-start")}
              >
                {m.de === "daxlo" && (
                  <MarcaX tamano={32} />
                )}
                <p
                  className={cn(
                    "max-w-[78%] rounded-2xl px-4 py-3 text-[15px] leading-snug md:max-w-[62%] md:text-[16px]",
                    m.de === "tu" ? "rounded-br-md bg-white/[0.08] text-white/90" : "rounded-bl-md border border-cyan/25 bg-cyan/[0.08] text-white",
                  )}
                >
                  {m.texto}
                </p>
                {m.de === "tu" && (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-2 bg-ink text-[12px] font-semibold text-white/80">
                    Tú
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-line-2 bg-ink/70 px-4 py-3.5 text-[15px] text-white/50">
            <TextoQueSeEscribe frases={[s.placeholder]} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------ Los tres pasos

function Pasos() {
  const p = coaching.pasos;
  const visuales = [<VisualLlamada key="a" />, <VisualPlan key="b" />, <VisualConstruye key="c" />];
  return (
    <section id="coaching-pasos" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading badge={p.badge} titulo={p.titulo} sub={p.sub} tono="cyan" />
        <Stagger className="mt-14 grid gap-5 md:grid-cols-3" escalon={0.14}>
          {p.items.map((it, i) => (
            <StaggerItem key={it.titulo} className="h-full">
              <article className="glass flex h-full flex-col overflow-hidden rounded-[22px]">
                <div className="relative h-[210px] overflow-hidden border-b border-line bg-ink-2/50">{visuales[i]}</div>
                <div className="p-7">
                  <h3 className="text-[22px] text-white">
                    <span className="text-cyan">{i + 1}.</span> {it.titulo}
                  </h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-muted">{it.texto}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function VisualLlamada() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      <span className="absolute -left-10 -top-10 h-48 w-48 resplandor" style={glow("41 196 245", 0.25, 1.73)} />
      <div className="relative flex items-center gap-4 rounded-2xl border border-line-2 bg-ink/85 px-5 py-4 shadow-xl">
        <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/15 text-cyan">
          <span className="absolute inset-0 animate-ping rounded-xl bg-cyan/20" />
          <Video size={20} className="relative" />
        </span>
        <span>
          <span className="block text-[15px] text-white">Primera conversación</span>
          <span className="block text-[13px] text-white/55">15 minutos · Sin costo</span>
        </span>
      </div>
    </div>
  );
}

function VisualPlan() {
  // Mismo orden que el plan de la maqueta de sesión.
  const items = coaching.sesion.plan.map((p) => p.tema);
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      <span className="absolute -right-10 -top-12 h-48 w-48 resplandor" style={glow("41 196 245", 0.2, 1.73)} />
      <div className="relative w-[70%] rounded-2xl border border-line-2 bg-ink/85 p-4 shadow-xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-dim">Tu plan</p>
        <ul className="mt-3 space-y-2">
          {items.map((t, i) => (
            <li key={t} className="flex items-center gap-2.5 text-[14px] text-white/85">
              <span
                data-revelar=""
                style={{ ["--retraso" as string]: `${0.3 + i * 0.3}s`, ["--y" as string]: "6px" } as React.CSSProperties}
                className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan/15 text-cyan"
              >
                <Check size={13} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function VisualConstruye() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      <span className="absolute -bottom-12 left-1/3 h-48 w-48 resplandor" style={glow("41 196 245", 0.25, 1.73)} />
      <div className="relative w-[74%] overflow-hidden rounded-xl border border-line-2 bg-ink/85 shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <WindowDots />
          <span className="text-[11px] text-white/50">tu-archivo.xlsx</span>
        </div>
        <div className="space-y-2 p-3">
          {[0.8, 0.55, 0.7].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-2 w-8 rounded-full bg-white/15" />
              <span className="h-2 rounded-full bg-white/10" style={{ width: `${w * 60}%` }} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end border-t border-line px-3 py-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-2.5 py-1 text-[12px] font-medium text-mint">
            <Check size={12} /> Funcionando
          </span>
        </div>
      </div>
    </div>
  );
}
