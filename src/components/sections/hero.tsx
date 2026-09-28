"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUp, BarChart3, ChevronDown, Globe, MessageSquare, Paperclip, Workflow } from "lucide-react";
import { hero } from "@/content/copy";
import { Badge, GlowButton, WindowDots } from "@/components/ui/primitives";
import { ToolLogo } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { EASE } from "@/lib/utils";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pb-8 pt-32 md:pt-44">
      <FondoHero />
      <div className="container-page relative">
        <Reveal alCargar>
          <Badge>{hero.badge}</Badge>
        </Reveal>

        <h1 className="mt-7 text-[clamp(2.7rem,6.6vw,5rem)] leading-[1.02] tracking-[-0.03em]">
          <LineaTitular texto={hero.titulo[0]} retraso={0.15} />{" "}
          <LineaTitular texto={hero.titulo[1]} retraso={0.3} clase="text-gradient-dual pb-1" />
        </h1>

        <Reveal alCargar delay={0.55}>
          <p className="mt-7 max-w-[580px] text-[18px] leading-relaxed text-muted md:text-[19px]">{hero.sub}</p>
        </Reveal>

        <Reveal alCargar delay={0.7} className="mt-9">
          <GlowButton href="#agendar" tamano="lg">
            {hero.cta}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </GlowButton>
          <p className="mt-4 text-[15px] text-dim">{hero.meta}</p>
        </Reveal>

        <Maqueta />
      </div>
    </section>
  );
}

// Cada línea sube desde abajo de una máscara. El degradado va en el propio
// elemento animado para que el recorte de texto no se pierda.
function LineaTitular({ texto, retraso, clase }: { texto: string; retraso: number; clase?: string }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={`block ${clase ?? ""}`}
        initial={{ y: "105%", opacity: 0, filter: "blur(6px)" }}
        animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: retraso, ease: EASE }}
      >
        {texto}
      </motion.span>
    </span>
  );
}

// Haces de luz diagonales, resplandores de esquina y rejilla tenue. Todo en
// código: la plantilla usa un render 3D que no se puede reutilizar.
function FondoHero() {
  const haces = [
    { y: 300, h: 16, o: 0.95 },
    { y: 352, h: 7, o: 0.7 },
    { y: 392, h: 24, o: 0.85 },
    { y: 452, h: 5, o: 0.55 },
    { y: 488, h: 12, o: 0.75 },
    { y: 560, h: 30, o: 0.5 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_20%,#000_20%,transparent_75%)]" />
      <motion.div
        className="absolute -right-[14%] -top-[6%] h-[980px] w-[78%] [mask-image:linear-gradient(to_left,#000_45%,transparent)] max-md:-right-[40%] max-md:w-[140%] max-md:opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.2 }}
      >
        <svg viewBox="0 0 900 900" preserveAspectRatio="xMaxYMin slice" className="animate-breathe h-full w-full will-change-[opacity]">
          <defs>
            <linearGradient id="haz" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#29c4f5" stopOpacity="0" />
              <stop offset="0.45" stopColor="#3d5aff" stopOpacity="0.95" />
              <stop offset="0.8" stopColor="#29c4f5" stopOpacity="0.9" />
              <stop offset="1" stopColor="#29c4f5" stopOpacity="0" />
            </linearGradient>
            <filter id="difuso" x="-20%" y="-200%" width="140%" height="500%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <filter id="difuso-fuerte" x="-20%" y="-400%" width="140%" height="900%">
              <feGaussianBlur stdDeviation="30" />
            </filter>
          </defs>
          <g transform="rotate(-38 450 450)">
            {haces.map((h) => (
              <g key={h.y} opacity={h.o}>
                <rect x="-150" y={h.y - h.h * 1.5} width="1250" height={h.h * 4} fill="url(#haz)" filter="url(#difuso-fuerte)" opacity="0.55" />
                <rect x="-150" y={h.y} width="1250" height={h.h} rx={h.h / 2} fill="url(#haz)" filter="url(#difuso)" />
                <rect x="-150" y={h.y + h.h / 2 - 0.75} width="1250" height="1.5" fill="#d8f6ff" opacity="0.7" />
              </g>
            ))}
          </g>
        </svg>
      </motion.div>
      <div className="absolute -bottom-[30%] -left-[18%] h-[640px] w-[640px] rounded-full bg-cyan/35 blur-[140px]" />
      <div className="absolute -bottom-[34%] right-[-10%] h-[620px] w-[620px] rounded-full bg-blue/50 blur-[150px]" />
    </div>
  );
}

// Recuadro de chat que se escribe solo, delante de una ventana con historial.
// Es decorativo: las tareas son ejemplos del tipo de trabajo, no datos de nadie.
function Maqueta() {
  return (
    <Reveal alCargar delay={0.9} y={48} className="relative mt-16 md:mt-24">
      <div aria-hidden className="relative mx-auto max-w-[1020px]">
        <div className="glass absolute -left-2 top-12 hidden h-[330px] w-[58%] overflow-hidden rounded-2xl bg-ink-2/70 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] md:block">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <WindowDots />
          </div>
          <ul className="space-y-1 p-4">
            {hero.historial.map((h, i) => (
              <li key={h} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px]" style={{ opacity: 1 - i * 0.16 }}>
                <MessageSquare size={15} className="text-white/45" />
                <span className="text-white/60">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative ml-auto w-full overflow-hidden rounded-2xl border border-line-2 bg-ink-2/95 shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:w-[74%]">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan to-blue-bright" />
          <div className="flex items-center gap-2 p-4 pb-0">
            <span className="inline-flex items-center gap-2 rounded-lg border border-line-2 px-3 py-1.5 text-[14px] text-white/85">
              <ToolLogo id="claude" tamano={15} />
              Claude
              <ChevronDown size={14} className="text-white/50" />
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line-2 text-white/60">
              <Globe size={15} />
            </span>
          </div>
          <div className="min-h-[104px] px-5 py-6 text-[18px] leading-snug text-white md:min-h-[96px] md:text-[21px]">
            <TextoQueSeEscribe frases={hero.tareas} />
          </div>
          <div className="flex items-center justify-between gap-3 p-4 pt-0">
            <div className="flex flex-wrap gap-2">
              <Ficha icono={<Paperclip size={14} />}>Adjuntar</Ficha>
              <Ficha icono={<Workflow size={14} />}>Automatizar</Ficha>
              <Ficha icono={<BarChart3 size={14} />} clase="hidden sm:inline-flex">
                Analizar
              </Ficha>
            </div>
            <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-blue text-white shadow-[0_0_24px_rgba(41,196,245,0.45)]">
              <ArrowUp size={18} />
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Ficha({ children, icono, clase = "" }: { children: React.ReactNode; icono: React.ReactNode; clase?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border border-line-2 px-3 py-1.5 text-[13px] text-white/70 ${clase}`}>
      {icono}
      {children}
    </span>
  );
}

// Escribe una frase letra por letra, la sostiene, la borra y pasa a la
// siguiente. Con "reducir movimiento" muestra la primera frase quieta.
export function TextoQueSeEscribe({ frases }: { frases: readonly string[] }) {
  const reducir = useReducedMotion();
  const [indice, setIndice] = useState(0);
  const [texto, setTexto] = useState("");
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    if (reducir) return;
    const completa = frases[indice];
    let t: ReturnType<typeof setTimeout>;
    if (!borrando) {
      t = texto.length < completa.length
        ? setTimeout(() => setTexto(completa.slice(0, texto.length + 1)), 32)
        : setTimeout(() => setBorrando(true), 2000);
    } else if (texto.length > 0) {
      t = setTimeout(() => setTexto(completa.slice(0, texto.length - 1)), 14);
    } else {
      t = setTimeout(() => {
        setBorrando(false);
        setIndice((indice + 1) % frases.length);
      }, 250);
    }
    return () => clearTimeout(t);
  }, [texto, borrando, indice, frases, reducir]);

  return (
    <span>
      {reducir ? frases[0] : texto}
      <span className="animate-caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-cyan" />
    </span>
  );
}
