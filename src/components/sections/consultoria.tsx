"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import {
  AlertTriangle,
  BookOpen,
  Check,
  Clock,
  FilePen,
  FileSearch,
  FolderOpen,
  LogOut,
  Mail,
  ScanText,
  Sheet,
  ShieldCheck,
  Timer,
  Users,
} from "lucide-react";
import { consultoria } from "@/content/copy";
import { WindowDots } from "@/components/ui/primitives";
import { Puntos, SectionHeading } from "@/components/ui/blocks";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn, EASE, glow } from "@/lib/utils";
import { TarjetaCalifica, TarjetasProblema, Zona, ZonaPortada } from "./zona";

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

function Fases() {
  const f = consultoria.fases;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const escritorio = useMediaQuery("(min-width: 1024px)");
  const visuales = [<VisualDiscovery key="a" />, <VisualConstruccion key="b" />, <VisualTraspaso key="c" />];

  return (
    <section id="consultoria-fases" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading badge={f.badge} titulo={f.titulo} sub={f.sub} tono="blue" />
        <div ref={ref} className="relative mt-14 lg:mt-20">
          {f.items.map((it, i) => (
            <TarjetaApilada
              key={it.numero}
              indice={i}
              total={f.items.length}
              progreso={scrollYProgress}
              escritorio={escritorio}
              item={it}
              visual={visuales[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Cada tarjeta queda fija arriba y la siguiente sube por encima, mientras las
// anteriores se encogen un poco hacia atrás. En móvil se muestran en columna:
// una tarjeta más alta que la pantalla no puede quedar fija sin cortarse.
function TarjetaApilada({
  indice,
  total,
  progreso,
  escritorio,
  item,
  visual,
}: {
  indice: number;
  total: number;
  progreso: MotionValue<number>;
  escritorio: boolean;
  item: (typeof consultoria.fases.items)[number];
  visual: React.ReactNode;
}) {
  const escalaFinal = 1 - (total - 1 - indice) * 0.05;
  const escala = useTransform(progreso, [indice / total, 1], [1, escalaFinal]);
  const alterna = indice % 2 === 1;

  return (
    <div className="lg:sticky lg:h-[88vh]" style={escritorio ? { top: 104 + indice * 28 } : undefined}>
      <motion.article
        style={escritorio ? { scale: escala } : undefined}
        className="relative mb-5 w-full origin-top overflow-hidden rounded-[28px] border border-line-2 bg-[#0e1019] shadow-[0_-24px_70px_rgba(0,0,0,0.55)] lg:mb-0 lg:grid lg:min-h-[500px] lg:grid-cols-2"
      >
        <div className={cn("flex flex-col justify-center p-8 md:p-12", alterna && "lg:order-2")}>
          <span className="font-display text-[15px] font-medium tracking-[0.1em]" style={{ color: AZUL_CLARO }}>
            FASE {item.numero}
          </span>
          <h3 className="mt-4 text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight text-white">{item.titulo}</h3>
          <p className="mt-4 text-[18px] leading-relaxed text-muted">{item.texto}</p>
          <Puntos items={item.puntos} tono="blue" className="mt-7" />
        </div>
        <div
          className={cn(
            "relative min-h-[480px] overflow-hidden border-t border-line bg-gradient-to-br from-blue/25 via-ink-2 to-ink-2 sm:min-h-[340px]",
            "lg:min-h-0 lg:border-t-0",
            alterna ? "lg:order-1 lg:border-r" : "lg:border-l",
          )}
        >
          {visual}
        </div>
      </motion.article>
    </div>
  );
}

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
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const items = ["Entrenamiento con el equipo", "Operación acompañada", "Tu equipo hace los ajustes"];
  return (
    <div ref={ref} aria-hidden className="absolute inset-0 flex items-center justify-center p-6">
      <span className="absolute -right-10 -top-10 h-64 w-64 resplandor" style={glow("61 90 255", 0.4, 1.70)} />
      <PanelVisual className="w-full max-w-[340px]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-dim">Traspaso</p>
        <ul className="mt-4 space-y-3">
          {items.map((t, i) => (
            <li key={t} className="flex items-center gap-3 text-[14px] text-white/85">
              <motion.span
                initial={{ scale: 0.3, opacity: 0 }}
                animate={visible ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.4 + i * 0.35 }}
                className="flex h-6 w-6 items-center justify-center rounded-md bg-mint/15 text-mint"
              >
                <Check size={14} />
              </motion.span>
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-bright to-cyan"
            initial={{ width: "0%" }}
            animate={visible ? { width: "100%" } : {}}
            transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
          />
        </div>
        <p className="mt-4 text-center text-[13px] text-white/70">Lo opera tu equipo</p>
      </PanelVisual>
    </div>
  );
}

// ------------------------------------------------ Qué automatizamos: el lienzo

const iconosNodo: Record<string, React.ReactNode> = {
  correo: <Mail size={15} />,
  leer: <FileSearch size={15} />,
  extraer: <ScanText size={15} />,
  validar: <ShieldCheck size={15} />,
  hoja: <Sheet size={15} />,
  borrador: <FilePen size={15} />,
};

// Posición del centro de cada nodo, en % del lienzo.
const posiciones: Record<string, { x: number; y: number }> = {
  correo: { x: 13, y: 20 },
  leer: { x: 38, y: 20 },
  extraer: { x: 63, y: 20 },
  validar: { x: 63, y: 55 },
  borrador: { x: 38, y: 84 },
  hoja: { x: 86, y: 84 },
};

const conexiones = [
  "M13 20 L38 20",
  "M38 20 L63 20",
  "M63 20 L63 55",
  "M63 55 C 63 72, 38 66, 38 84",
  "M63 55 C 63 72, 86 66, 86 84",
];

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

function Lienzo() {
  const a = consultoria.automatizamos;
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -120px 0px" });

  const barra = [
    { g: "Disparadores", i: [["Correo nuevo", <Mail key="1" size={14} />], ["Archivo en carpeta", <FolderOpen key="2" size={14} />], ["Horario fijo", <Clock key="3" size={14} />]] },
    { g: "Acciones", i: [["Leer documento", <FileSearch key="4" size={14} />], ["Extraer datos", <ScanText key="5" size={14} />], ["Validar reglas", <ShieldCheck key="6" size={14} />], ["Escribir en hoja", <Sheet key="7" size={14} />], ["Crear borrador", <FilePen key="8" size={14} />]] },
  ] as const;

  return (
    <div ref={ref} aria-hidden className="relative overflow-hidden rounded-[26px] border border-line-2 bg-ink-2/90 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
      <span className="absolute -bottom-40 -right-24 h-96 w-96 resplandor" style={glow("27 53 208", 0.45, 1.57)} />
      <div className="relative grid lg:grid-cols-[230px_1fr]">
        <aside className="hidden border-r border-line p-5 lg:block">
          <WindowDots />
          {barra.map((b) => (
            <div key={b.g} className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dim">{b.g}</p>
              <ul className="mt-2 space-y-0.5">
                {b.i.map(([t, icono]) => (
                  <li key={t} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] text-white/70">
                    <span style={{ color: AZUL_CLARO }}>{icono}</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <div className="p-5 md:p-7">
          <p className="font-display text-[17px] text-white">{a.lienzo}</p>
          <p className="text-[13px] text-dim">Así se ve un proceso documental automatizado</p>

          {/* Escritorio: lienzo con nodos y conexiones que se dibujan. */}
          <div className="bg-grid relative mt-5 hidden aspect-[1000/470] rounded-2xl border border-line md:block">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              {conexiones.map((d, i) => (
                <g key={d}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="rgba(142,160,255,0.35)"
                    strokeWidth="1.2"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={visible ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.35 + i * 0.3, ease: "easeInOut" }}
                  />
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="#8ea0ff"
                    strokeWidth="1.8"
                    strokeDasharray="4 6"
                    vectorEffect="non-scaling-stroke"
                    className="animate-flow"
                    initial={{ opacity: 0 }}
                    animate={visible ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 2 }}
                  />
                </g>
              ))}
            </svg>
            {a.nodos.map((n, i) => (
              <motion.div
                key={n.id}
                className="absolute w-[22%] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${posiciones[n.id].x}%`, top: `${posiciones[n.id].y}%` }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={visible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.28, ease: EASE }}
              >
                <NodoFlujo id={n.id} titulo={n.titulo} detalle={n.detalle} />
              </motion.div>
            ))}
          </div>

          {/* Móvil: el mismo flujo en columna. */}
          <ol className="mt-5 space-y-2.5 md:hidden">
            {a.nodos.slice(0, 4).map((n) => (
              <li key={n.id}>
                <NodoFlujo id={n.id} titulo={n.titulo} detalle={n.detalle} />
              </li>
            ))}
            <li className="grid grid-cols-2 gap-2.5">
              {a.nodos.slice(4).map((n) => (
                <NodoFlujo key={n.id} id={n.id} titulo={n.titulo} detalle={n.detalle} />
              ))}
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function NodoFlujo({ id, titulo, detalle }: { id: string; titulo: string; detalle: string }) {
  const esHoja = id === "hoja";
  const esBorrador = id === "borrador";
  return (
    <div
      className={cn(
        "rounded-xl border bg-ink/95 px-3.5 py-3 shadow-lg",
        esHoja ? "border-mint/30" : esBorrador ? "border-cyan/35" : "border-line-2",
      )}
    >
      <div className="flex items-center gap-2 text-[14px] text-white">
        <span style={{ color: esHoja ? "#e2f3ee" : esBorrador ? "#29c4f5" : AZUL_CLARO }}>{iconosNodo[id]}</span>
        <span className="leading-tight">{titulo}</span>
      </div>
      <p className="mt-1 text-[12px] leading-snug text-white/55">{detalle}</p>
      {(esHoja || esBorrador) && (
        <span
          className={cn(
            "mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
            esHoja ? "bg-mint/15 text-mint" : "bg-cyan/15 text-cyan",
          )}
        >
          {esHoja ? "Listo" : "Revisa una persona"}
        </span>
      )}
    </div>
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
