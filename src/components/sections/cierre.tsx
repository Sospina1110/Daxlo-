"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Plus } from "lucide-react";
import { agendar, contacto, faq, nosotros } from "@/content/copy";
import { Badge, GlowButton, Orb } from "@/components/ui/primitives";
import { SectionHeading } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { cn, EASE, glow } from "@/lib/utils";

// ------------------------------------------------ Quiénes somos

export function Nosotros() {
  const n = nosotros;
  return (
    // overflow-hidden: el halo de la foto se sale de su caja. Sin recortarlo, en
    // un celular la página queda más ancha que la pantalla y se desliza de lado.
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[400px_1fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-[400px]">
          <span aria-hidden className="resplandor absolute -left-12 -top-12 h-72 w-72" style={glow("41 196 245", 0.32, 1.4)} />
          <span aria-hidden className="resplandor absolute -bottom-12 -right-12 h-80 w-80" style={glow("27 53 208", 0.5, 1.4)} />
          <div className="relative overflow-hidden rounded-[28px] border border-line-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/equipo.webp"
              alt="Martín Zárate y Santiago Ospina, socios de Daxlo"
              width={800}
              height={1200}
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
          <p className="mt-4 text-center text-[15px] text-white/65">
            <span className="text-white">Martín Zárate</span> y <span className="text-white">Santiago Ospina</span>
          </p>
        </Reveal>
        <div>
          <SectionHeading badge={n.badge} titulo={n.titulo} alineacion="izquierda" />
          <div className="mt-7 space-y-5">
            {n.parrafos.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="text-[18px] leading-relaxed text-muted">{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="text-gradient-dual mt-8 font-display text-[26px] font-medium leading-snug">{n.firma}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------ Preguntas frecuentes

export function Faq() {
  const f = faq;
  return (
    <section id="preguntas" className="relative py-24 md:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading badge={f.badge} titulo={f.titulo} alineacion="izquierda" />
          <Reveal delay={0.15} className="glass mt-8 rounded-[22px] p-6">
            <p className="font-display text-[20px] text-white">{f.ayuda}</p>
            <p className="mt-2 text-[17px] text-muted">{f.ayudaTexto}</p>
            <GlowButton href={contacto.whatsapp} className="mt-5" tamano="sm">
              {f.ayudaCta} <ArrowRight size={15} />
            </GlowButton>
          </Reveal>
        </div>
        <div className="space-y-10">
          {f.grupos.map((g) => (
            <div key={g.nombre}>
              <Reveal>
                <p className={cn("flex items-center gap-2.5 font-display text-[15px] font-medium uppercase tracking-[0.12em]", g.tono === "cyan" ? "text-cyan" : "text-[#8ea0ff]")}>
                  <span className={cn("h-2 w-2 rounded-full", g.tono === "cyan" ? "bg-cyan" : "bg-blue-bright")} />
                  {g.nombre}
                </p>
              </Reveal>
              <div className="mt-4 space-y-3">
                {g.preguntas.map((q, i) => (
                  <Reveal key={q.p} delay={0.04 * i}>
                    <Pregunta pregunta={q.p} respuesta={q.r} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// La respuesta queda siempre en el HTML (los buscadores la leen); cerrada se
// oculta con `inert` para que no reciba foco ni se anuncie.
function Pregunta({ pregunta, respuesta }: { pregunta: string; respuesta: string }) {
  const [abierta, setAbierta] = useState(false);
  const id = useId();
  return (
    <div className={cn("rounded-2xl border transition-colors duration-300", abierta ? "border-line-2 bg-white/[0.035]" : "border-line hover:border-line-2")}>
      <button
        type="button"
        aria-expanded={abierta}
        aria-controls={id}
        onClick={() => setAbierta((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[17px] font-medium text-white md:px-6 md:py-5 md:text-[18px]"
      >
        {pregunta}
        <motion.span animate={{ rotate: abierta ? 45 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 text-white/60">
          <Plus size={20} />
        </motion.span>
      </button>
      <motion.div
        id={id}
        role="region"
        inert={!abierta}
        initial={false}
        animate={{ height: abierta ? "auto" : 0, opacity: abierta ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-[17px] leading-relaxed text-muted md:px-6">{respuesta}</p>
      </motion.div>
    </div>
  );
}

// ------------------------------------------------ Agendar

export function Agendar() {
  const a = agendar;
  return (
    <section id="agendar" className="relative isolate overflow-hidden py-28 md:py-36">
      <span aria-hidden className="absolute -left-[20%] top-1/3 -z-10 h-[680px] w-[680px] resplandor" style={glow("41 196 245", 0.25, 1.44)} />
      <span aria-hidden className="absolute -right-[20%] top-1/4 -z-10 h-[680px] w-[680px] resplandor" style={glow("27 53 208", 0.45, 1.44)} />
      <div className="container-page">
        <div className="mx-auto max-w-[760px] text-center">
          <Reveal className="flex justify-center">
            <Orb tamano={64} className="animate-float" />
          </Reveal>
          <Reveal delay={0.05} className="mt-6">
            <Badge>{a.badge}</Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] text-white">{a.titulo}</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-[600px] text-[18px] leading-relaxed text-muted">{a.sub}</p>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="mx-auto mt-12 max-w-[720px]">
          <FormularioContacto />
        </Reveal>
      </div>
    </section>
  );
}

// Mismo contrato que el formulario anterior: el Apps Script espera estos
// nombres de campo exactos. Si se cambia uno, deja de guardarse en la hoja.
const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbz08pM19vMZGmIQMs9QlpOS704oPOKAR6RXJLoSeuS52EOt1swQxt9fJL86AAmL0g9C/exec";
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errores = Partial<Record<"linea" | "nombre" | "whatsapp" | "email", string>>;

function FormularioContacto() {
  const a = agendar;
  const formRef = useRef<HTMLFormElement>(null);
  const cargadoEn = useRef(0);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<"listo" | "enviando" | "exito" | "error">("listo");
  const [duplicado, setDuplicado] = useState(false);

  useEffect(() => {
    cargadoEn.current = Date.now();
  }, []);

  const valor = (id: string) => (formRef.current?.elements.namedItem(id) as HTMLInputElement | null)?.value.trim() ?? "";

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const linea = valor("linea");
    const nombre = valor("nombre");
    const whatsapp = valor("whatsapp");
    const correo = valor("email");

    const nuevos: Errores = {};
    if (!linea) nuevos.linea = a.errores.linea;
    if (!nombre) nuevos.nombre = a.errores.nombre;
    if (!whatsapp) nuevos.whatsapp = a.errores.whatsapp;
    if (!correo) nuevos.email = a.errores.correo;
    else if (!CORREO_VALIDO.test(correo)) nuevos.email = a.errores.correoFormato;
    setErrores(nuevos);
    const primero = (["linea", "nombre", "whatsapp", "email"] as const).find((k) => nuevos[k]);
    if (primero) {
      (formRef.current?.elements.namedItem(primero) as HTMLElement | null)?.focus();
      return;
    }

    // FormData mantiene la petición "simple" para CORS: el Apps Script no
    // responde a la verificación previa OPTIONS.
    const datos = new FormData();
    datos.append("linea", linea);
    datos.append("nombre", nombre);
    datos.append("whatsapp", whatsapp);
    datos.append("correo", correo);
    datos.append("empresa", valor("empresa"));
    datos.append("interes", valor("interes"));
    datos.append("website", (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "");
    datos.append("tiempo_llenado_segundos", String(Math.round((Date.now() - cargadoEn.current) / 1000)));
    datos.append("origen", window.location.origin);

    setEstado("enviando");
    try {
      const res = await fetch(ENDPOINT, { method: "POST", body: datos });
      let json: { status?: string; codigo?: string } | null = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }
      if (json?.status === "ok") {
        setEstado("exito");
      } else if (json?.status === "error" && json.codigo === "envio_duplicado") {
        setDuplicado(true);
        setEstado("exito");
      } else {
        setEstado("error");
      }
    } catch {
      setEstado("error");
    }
  }

  if (estado === "exito") {
    return (
      <div role="status" className="glass rounded-[26px] p-10 text-center">
        <CheckCircle2 size={56} className="mx-auto text-mint" />
        <h3 className="mt-5 text-[30px] text-white">{a.exito.titulo}</h3>
        <p className="mx-auto mt-3 max-w-[460px] text-[18px] text-muted">{duplicado ? a.exito.duplicado : a.exito.texto}</p>
        <GlowButton href={contacto.whatsapp} className="mt-7">
          {a.exito.whatsapp}
        </GlowButton>
      </div>
    );
  }

  const c = a.campos;
  return (
    <form ref={formRef} onSubmit={enviar} noValidate className="glass relative overflow-hidden rounded-[26px] p-6 md:p-10">
      <span aria-hidden className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
      <div className="grid gap-5">
        <Campo id="linea" etiqueta={c.linea} error={errores.linea} obligatorio>
          <select id="linea" name="linea" defaultValue="" className={claseCampo(errores.linea)} aria-invalid={!!errores.linea || undefined} aria-describedby={errores.linea ? "error-linea" : undefined}>
            <option value="" disabled>
              Selecciona una opción
            </option>
            {c.lineaOpciones.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.texto}
              </option>
            ))}
          </select>
        </Campo>
        <Campo id="nombre" etiqueta={c.nombre} error={errores.nombre} obligatorio>
          <input id="nombre" name="nombre" autoComplete="name" placeholder="Tu nombre" className={claseCampo(errores.nombre)} aria-invalid={!!errores.nombre || undefined} aria-describedby={errores.nombre ? "error-nombre" : undefined} />
        </Campo>
        <div className="grid gap-5 md:grid-cols-2">
          <Campo id="whatsapp" etiqueta={c.whatsapp} error={errores.whatsapp} obligatorio>
            <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" placeholder="+57 300 123 4567" className={claseCampo(errores.whatsapp)} aria-invalid={!!errores.whatsapp || undefined} aria-describedby={errores.whatsapp ? "error-whatsapp" : undefined} />
          </Campo>
          <Campo id="email" etiqueta={c.correo} error={errores.email} obligatorio>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" className={claseCampo(errores.email)} aria-invalid={!!errores.email || undefined} aria-describedby={errores.email ? "error-email" : undefined} />
          </Campo>
        </div>
        <Campo id="empresa" etiqueta={c.empresa}>
          <input id="empresa" name="empresa" autoComplete="organization" placeholder="Nombre de tu empresa" className={claseCampo()} />
        </Campo>
        <Campo id="interes" etiqueta={c.interes}>
          <textarea id="interes" name="interes" rows={4} placeholder={c.interesEjemplo} className={cn(claseCampo(), "resize-y")} />
        </Campo>

        {/* Trampa para bots: una persona no ve este campo; si llega lleno, es spam. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">No llenes este campo</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <GlowButton type="submit" tamano="lg" className="mt-2 w-full" disabled={estado === "enviando"}>
          {estado === "enviando" ? a.enviando : a.enviar}
          {estado !== "enviando" && <ArrowRight size={18} />}
        </GlowButton>
        <p role="status" aria-live="polite" className={cn("text-center text-[15px]", estado === "error" ? "font-medium text-[#ffb4be]" : "text-dim")}>
          {estado === "error" ? a.errores.general : a.meta}
        </p>
      </div>
    </form>
  );
}

function claseCampo(error?: string) {
  return cn(
    "w-full rounded-xl border bg-ink/70 px-4 py-3.5 text-[17px] text-white placeholder:text-white/40 transition-colors focus:bg-ink focus:outline-none",
    error ? "border-[#ff8a9b]/70 focus:border-[#ff8a9b]" : "border-line-2 focus:border-cyan/60",
  );
}

function Campo({ id, etiqueta, error, obligatorio, children }: { id: string; etiqueta: string; error?: string; obligatorio?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[15px] font-medium text-white/85">
        {etiqueta}
        {obligatorio ? <span className="text-cyan"> *</span> : <span className="font-normal text-white/45"> (opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`error-${id}`} className="mt-1.5 text-[14px] font-medium text-[#ff8a9b]">
          {error}
        </p>
      )}
    </div>
  );
}
