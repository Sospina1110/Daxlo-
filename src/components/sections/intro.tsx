"use client";

import { motion } from "motion/react";
import { ArrowRight, Bell, FileText, Mail, Sheet } from "lucide-react";
import { comparacion, dosFormas, franjaHerramientas, herramientas } from "@/content/copy";
import { Badge, GlowButton, MarcaX, WindowDots } from "@/components/ui/primitives";
import { Marquee, Puntos, SectionHeading, ToolLogo } from "@/components/ui/blocks";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn, EASE, type Tono } from "@/lib/utils";

// ------------------------------------------------ Franja bajo el hero

// El lugar del "Trusted by" de la plantilla. Daxlo no tiene logos de clientes
// autorizados, así que muestra lo que sí es verificable: con qué trabaja.
export function FranjaHerramientas() {
  return (
    <section aria-label="Herramientas con las que trabajamos" className="relative py-14 md:py-16">
      <Reveal>
        <p className="text-center text-[15px] text-dim">{franjaHerramientas}</p>
      </Reveal>
      <Marquee duracion={38} espacio={64} className="mt-8">
        {herramientas.lista.map((h) => (
          <span key={h.id} className="flex items-center gap-3 text-white/60">
            <ToolLogo id={h.id} tamano={26} mono />
            <span className="whitespace-nowrap font-display text-[23px] font-medium tracking-tight">{h.nombre}</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}

// ------------------------------------------------ Dos formas de trabajar

export function DosFormas() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-page">
        <SectionHeading badge={dosFormas.badge} titulo={dosFormas.titulo} sub={dosFormas.sub} />
        <Stagger className="mt-14 grid gap-5 md:grid-cols-2" escalon={0.14}>
          <StaggerItem>
            <TarjetaLinea tono="cyan" datos={dosFormas.coaching} href="#coaching" visual={<VisualCoaching />} />
          </StaggerItem>
          <StaggerItem>
            <TarjetaLinea tono="blue" datos={dosFormas.consultoria} href="#consultoria" visual={<VisualConsultoria />} />
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

type DatosLinea = { etiqueta: string; titulo: string; linea: string; puntos: readonly string[]; enlace: string };

function TarjetaLinea({ tono, datos, href, visual }: { tono: Tono; datos: DatosLinea; href: string; visual: React.ReactNode }) {
  const acento = tono === "cyan" ? "text-cyan" : "text-[#8ea0ff]";
  return (
    <article
      className={cn(
        "glass group flex h-full flex-col overflow-hidden rounded-[24px] transition-colors duration-500",
        tono === "cyan" ? "hover:border-cyan/35" : "hover:border-blue-bright/40",
      )}
    >
      <div className="relative h-[270px] overflow-hidden border-b border-line bg-ink-2/60">{visual}</div>
      <div className="flex flex-1 flex-col p-7 md:p-8">
        <Badge tono={tono} className="self-start">
          {datos.etiqueta}
        </Badge>
        <h3 className="mt-5 text-[28px] leading-tight text-white md:text-[32px]">{datos.titulo}</h3>
        <p className="mt-3 text-[18px] leading-relaxed text-muted">{datos.linea}</p>
        <Puntos items={datos.puntos} tono={tono} className="mt-6" />
        <a href={href} className={cn("mt-8 inline-flex items-center gap-2 self-start text-[16px] font-medium", acento)}>
          {datos.enlace}
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  );
}

// Pantalla compartida: tú escribes, nosotros comentamos. El método en una imagen.
function VisualCoaching() {
  const filas = [0.9, 0.7, 0.85, 0.6, 0.75];
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute -left-16 -top-20 h-72 w-72 rounded-full bg-cyan/30 blur-[90px]" />
      <div className="absolute inset-x-7 bottom-0 top-9 rounded-t-xl border border-b-0 border-line-2 bg-ink/95">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <WindowDots />
          <span className="flex items-center gap-2 text-[12px] text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            Pantalla compartida
          </span>
        </div>
        <div className="space-y-2.5 p-4">
          {filas.map((ancho, i) => (
            <div key={i} className={cn("flex items-center gap-3 rounded-md px-2 py-1.5", i === 2 && "bg-cyan/10 ring-1 ring-cyan/30")}>
              <span className="h-2 w-10 rounded-full bg-white/15" />
              <span className="h-2 rounded-full bg-white/10" style={{ width: `${ancho * 45}%` }} />
              <span className="ml-auto h-2 w-8 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
        <motion.div
          className="absolute left-[46%] top-[118px] flex items-start gap-1"
          animate={{ x: [0, 14, 4, 0], y: [0, -6, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="16" height="18" viewBox="0 0 16 18">
            <path d="M1 1l13 7-6 1.6L5 16z" fill="#29c4f5" stroke="#0d0e14" strokeWidth="1.2" />
          </svg>
          <span className="mt-3 rounded-md bg-cyan px-1.5 py-0.5 text-[11px] font-semibold text-ink">Tú</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="absolute bottom-4 right-4 flex max-w-[230px] items-start gap-2 rounded-xl border border-line-2 bg-ink-2/95 p-3 shadow-xl"
        >
          <MarcaX tamano={24} className="mt-0.5" />
          <span className="text-[12.5px] leading-snug text-white/85">Ahí se traba. Dile qué hacer con las filas vacías.</span>
        </motion.div>
      </div>
    </div>
  );
}

// Correo que entra, el sistema en el medio, tres salidas. La consultoría en una imagen.
function VisualConsultoria() {
  const salidas = [
    { y: 22, t: "Hoja de cálculo", i: <Sheet size={14} /> },
    { y: 50, t: "Borrador para revisar", i: <FileText size={14} /> },
    { y: 78, t: "Aviso al equipo", i: <Bell size={14} /> },
  ];
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-blue/50 blur-[90px]" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M18 50 L48 50" stroke="rgba(142,160,255,0.55)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" fill="none" />
        {salidas.map((s) => (
          <g key={s.y}>
            <path d={`M52 50 C 62 50, 62 ${s.y}, 70 ${s.y}`} stroke="rgba(142,160,255,0.3)" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" />
            <path
              d={`M52 50 C 62 50, 62 ${s.y}, 70 ${s.y}`}
              stroke="#8ea0ff"
              strokeWidth="1.6"
              strokeDasharray="4 6"
              vectorEffect="non-scaling-stroke"
              fill="none"
              className="animate-flow"
            />
          </g>
        ))}
      </svg>
      <Nodo x={17} y={50} icono={<Mail size={14} />}>Correo nuevo</Nodo>
      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-blue-bright/40 bg-ink shadow-[0_0_40px_rgba(61,90,255,0.55)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/daxlo-x.png" alt="" width={30} height={22} />
      </span>
      {salidas.map((s) => (
        <Nodo key={s.y} x={82} y={s.y} icono={s.i}>
          {s.t}
        </Nodo>
      ))}
    </div>
  );
}

function Nodo({ x, y, icono, children }: { x: number; y: number; icono: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line-2 bg-ink/95 px-2.5 py-1.5 text-[12px] text-white/85"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="text-[#8ea0ff]">{icono}</span>
      {children}
    </span>
  );
}

// ------------------------------------------------ Comparación

export function Comparacion() {
  return (
    <section className="relative py-24 md:py-28">
      <div className="container-page">
        <SectionHeading badge={comparacion.badge} titulo={comparacion.titulo} sub={comparacion.sub} />
        <Reveal className="glass mt-12 overflow-hidden rounded-[24px]">
          <div className="hidden grid-cols-[1fr_1.4fr_1.4fr] border-b border-line md:grid">
            <span />
            <CabeceraColumna tono="cyan">Coaching 1 a 1</CabeceraColumna>
            <CabeceraColumna tono="blue">Consultoría de implementación</CabeceraColumna>
          </div>
          <dl>
            {comparacion.filas.map((f, i) => (
              <div
                key={f.criterio}
                className={cn("grid gap-3 p-5 md:grid-cols-[1fr_1.4fr_1.4fr] md:gap-0 md:p-0", i > 0 && "border-t border-line")}
              >
                <dt className="text-[13px] font-semibold uppercase tracking-[0.1em] text-dim md:px-6 md:py-5 md:text-[15px] md:normal-case md:tracking-normal md:text-white">
                  {f.criterio}
                </dt>
                <dd className="text-[17px] text-white/80 md:border-l md:border-line md:bg-cyan/[0.035] md:px-6 md:py-5">
                  <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.1em] text-cyan md:hidden">Coaching</span>
                  {f.coaching}
                </dd>
                <dd className="text-[17px] text-white/80 md:border-l md:border-line md:bg-blue-bright/[0.05] md:px-6 md:py-5">
                  <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8ea0ff] md:hidden">Consultoría</span>
                  {f.consultoria}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal className="mt-9 flex flex-wrap justify-center gap-3">
          <GlowButton href="#coaching" tono="cyan">
            Lo mío es aprender <ArrowRight size={16} />
          </GlowButton>
          <GlowButton href="#consultoria" tono="blue">
            Lo mío es un proceso <ArrowRight size={16} />
          </GlowButton>
        </Reveal>
      </div>
    </section>
  );
}

function CabeceraColumna({ tono, children }: { tono: Tono; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2.5 border-l border-line px-6 py-5 font-display text-[18px] text-white">
      <span className={cn("h-2.5 w-2.5 rounded-full", tono === "cyan" ? "bg-cyan shadow-[0_0_12px_#29c4f5]" : "bg-blue-bright shadow-[0_0_12px_#3d5aff]")} />
      {children}
    </span>
  );
}
