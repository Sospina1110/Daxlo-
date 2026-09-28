import { AlertTriangle, BookOpen, Check, Clock, LogOut, Mail, ScanText, ShieldCheck, Timer, Users } from "lucide-react";
import { consultoria } from "@/content/copy";
import { SectionHeading } from "@/components/ui/blocks";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn, glow } from "@/lib/utils";
import { TarjetaCalifica, TarjetasProblema, Zona } from "./zona";
import { ZonaPortada } from "./zona-portada";
import { Apilado } from "./apilado";
import { Lienzo } from "./lienzo";

const AZUL_CLARO = "#8ea0ff";

export function ZonaConsultoria() {
  const c = consultoria;
  return (
    <Zona tono="blue">
      <ZonaPortada id="consultoria" tono="blue" {...c.portada} />
      <TarjetasProblema
        tono="blue"
        titulo={c.problema.titulo}
        sub={c.problema.sub}
        tarjetas={c.problema.tarjetas}
        iconos={[<LogOut key="a" size={22} />, <BookOpen key="b" size={22} />, <Clock key="c" size={22} />]}
      />
      <Fases />
      <Automatizamos />
      <TarjetaCalifica tono="blue" {...c.califica} />
      <PorQue />
    </Zona>
  );
}

// ------------------------------------------------ Fases: tarjetas apiladas



function PanelVisual({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative rounded-2xl border border-line-2 bg-ink/95 p-5 shadow-2xl", className)}>{children}</div>;
}

function VisualDiscovery() {
  const manual = ["Toda factura trae orden de compra", "El proveedor manda un solo archivo", "El total cuadra con el pedido"];
  const real = ["Algunas llegan sin orden", "A veces manda tres archivos", "El total no siempre cuadra"];
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center p-6">
      <span className="absolute -right-16 -top-16 h-64 w-64 resplandor" style={glow("61 90 255", 0.4, 1.70)} />
      <div className="relative grid w-full max-w-[460px] gap-3 sm:grid-cols-2">
        <PanelVisual className="p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dim">Lo que dice el manual</p>
          <ul className="mt-3 space-y-2.5">
            {manual.map((m) => (
              <li key={m} className="flex gap-2 text-[12.5px] leading-snug text-white/75">
                <Check size={13} className="mt-0.5 shrink-0 text-white/40" />
                {m}
              </li>
            ))}
          </ul>
        </PanelVisual>
        <PanelVisual className="border-blue-bright/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: AZUL_CLARO }}>
            Lo que pasa de verdad
          </p>
          <ul className="mt-3 space-y-2.5">
            {real.map((m, i) => (
              <li key={m} className={cn("flex gap-2 rounded-md text-[12.5px] leading-snug", i === 0 ? "bg-cyan/10 p-1.5 text-white ring-1 ring-cyan/35" : "text-white/75")}>
                <AlertTriangle size={13} className={cn("mt-0.5 shrink-0", i === 0 ? "text-cyan" : "text-white/40")} />
                {m}
              </li>
            ))}
          </ul>
        </PanelVisual>
        <span className="mx-auto inline-flex sm:col-span-2 items-center gap-2 rounded-full border border-cyan/35 bg-cyan/10 px-3 py-1.5 text-[12px] text-cyan">
          <AlertTriangle size={13} /> Contradicción encontrada antes de construir
        </span>
      </div>
    </div>
  );
}

function VisualConstruccion() {
  const pasos = [
    { t: "Leer el correo", i: <Mail size={14} /> },
    { t: "Extraer los datos", i: <ScanText size={14} /> },
    { t: "Validar las reglas", i: <ShieldCheck size={14} /> },
  ];
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center p-6">
      <span className="absolute -bottom-16 -left-10 h-64 w-64 resplandor" style={glow("27 53 208", 0.5, 1.70)} />
      <PanelVisual className="w-full max-w-[340px]">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-dim">Construcción</p>
          <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: AZUL_CLARO }}>
            <Timer size={13} /> Precio cerrado
          </span>
        </div>
        <ol className="mt-4">
          {pasos.map((p, i) => (
            <li key={p.t} className="relative flex items-center gap-3 pb-4 last:pb-0">
              {i < pasos.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-gradient-to-b from-blue-bright/60 to-transparent" />}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-bright/40 bg-blue/25" style={{ color: AZUL_CLARO }}>
                {p.i}
              </span>
              <span className="text-[14px] text-white/85">{p.t}</span>
              <Check size={14} className="ml-auto text-mint" />
            </li>
          ))}
        </ol>
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-[12.5px] text-white/70">
          <Users size={14} style={{ color: AZUL_CLARO }} />
          Tu equipo prueba cada parte
        </div>
      </PanelVisual>
    </div>
  );
}

function VisualTraspaso() {
  const items = ["Entrenamiento con el equipo", "Operación acompañada", "Tu equipo hace los ajustes"];
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center p-6">
      <span className="absolute -right-10 -top-10 h-64 w-64 resplandor" style={glow("61 90 255", 0.4, 1.70)} />
      <PanelVisual className="w-full max-w-[340px]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-dim">Traspaso</p>
        <ul className="mt-4 space-y-3">
          {items.map((t, i) => (
            <li key={t} className="flex items-center gap-3 text-[14px] text-white/85">
              <span
                data-revelar=""
                style={{ ["--retraso" as string]: `${0.4 + i * 0.35}s`, ["--y" as string]: "6px" } as React.CSSProperties}
                className="flex h-6 w-6 items-center justify-center rounded-md bg-mint/15 text-mint"
              >
                <Check size={14} />
              </span>
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            data-revelar=""
            style={{ ["--retraso" as string]: "0.4s" } as React.CSSProperties}
            className="crecer h-full rounded-full bg-gradient-to-r from-blue-bright to-cyan"
          />
        </div>
        <p className="mt-4 text-center text-[13px] text-white/70">Lo opera tu equipo</p>
      </PanelVisual>
    </div>
  );
}

// ------------------------------------------------ Qué automatizamos: el lienzo




function Fases() {
  const f = consultoria.fases;
  return (
    <section id="consultoria-fases" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading badge={f.badge} titulo={f.titulo} sub={f.sub} tono="blue" />
        <Apilado items={f.items} visuales={[<VisualDiscovery key="a" />, <VisualConstruccion key="b" />, <VisualTraspaso key="c" />]} />
      </div>
    </section>
  );
}

function Automatizamos() {
  const a = consultoria.automatizamos;
  return (
    <section id="automatizamos" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading badge={a.badge} titulo={a.titulo} sub={a.sub} tono="blue" />
        <Reveal className="mt-12" y={40}>
          <Lienzo />
        </Reveal>
        <Reveal className="mx-auto mt-8 max-w-[680px] text-center">
          <p className="text-[17px] leading-relaxed text-white/75">{a.nota}</p>
        </Reveal>
        <Stagger as="ul" className="mt-10 flex flex-wrap justify-center gap-2.5" escalon={0.04}>
          {a.procesos.map((p) => (
            <StaggerItem as="li" key={p}>
              <span className="inline-flex rounded-2xl border border-line-2 bg-white/[0.03] px-4 py-2 text-[15px] text-white/80 sm:rounded-full">{p}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}



// ------------------------------------------------ Por qué nosotros

function PorQue() {
  const p = consultoria.porQue;
  return (
    <section className="relative py-20 md:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading titulo={p.titulo} tono="blue" alineacion="izquierda" />
          <Reveal delay={0.15}>
            <p className="mt-8 border-l-2 border-blue-bright pl-5 font-display text-[22px] leading-snug text-white">{p.admision}</p>
          </Reveal>
        </div>
        <Stagger className="grid gap-4 sm:grid-cols-2" escalon={0.1}>
          {p.items.map((it, i) => (
            <StaggerItem key={it.titulo} className="h-full">
              <article className="glass h-full rounded-[22px] p-7">
                <span className="text-gradient-blue font-display text-[34px] font-medium leading-none">0{i + 1}</span>
                <h3 className="mt-4 text-[21px] leading-snug text-white">{it.titulo}</h3>
                <p className="mt-2.5 text-[17px] leading-relaxed text-muted">{it.texto}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
