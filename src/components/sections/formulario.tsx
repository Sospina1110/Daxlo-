"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { agendar, contacto, privacidad, rutas } from "@/content/copy";
import { GlowButton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

// Mismo contrato que el formulario anterior: el Apps Script espera estos
// nombres de campo exactos. Si se cambia uno, deja de guardarse en la hoja.
// autorizacion y politica_version son la prueba de la autorización
// que pide la Ley 1581: el Apps Script debe guardarlos en su propia columna.
const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbz08pM19vMZGmIQMs9QlpOS704oPOKAR6RXJLoSeuS52EOt1swQxt9fJL86AAmL0g9C/exec";
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errores = Partial<Record<"linea" | "nombre" | "whatsapp" | "email" | "autoriza", string>>;

export function FormularioContacto() {
  const a = agendar;
  const formRef = useRef<HTMLFormElement>(null);
  const cargadoEn = useRef(0);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<"listo" | "enviando" | "exito" | "error">("listo");
  const [duplicado, setDuplicado] = useState(false);

  useEffect(() => {
    cargadoEn.current = Date.now();
    // Sin JavaScript valida el navegador (campos required). Con JavaScript la
    // validación es la nuestra, con los mensajes en la página.
    if (formRef.current) formRef.current.noValidate = true;
    // Si llega desde la página de una línea (/agendar?linea=coaching), la
    // opción ya viene elegida.
    const linea = new URLSearchParams(window.location.search).get("linea");
    const select = formRef.current?.elements.namedItem("linea") as HTMLSelectElement | null;
    if (linea && select && a.campos.lineaOpciones.some((o) => o.valor === linea)) select.value = linea;
  }, [a.campos.lineaOpciones]);

  const valor = (id: string) => (formRef.current?.elements.namedItem(id) as HTMLInputElement | null)?.value.trim() ?? "";

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const linea = valor("linea");
    const nombre = valor("nombre");
    const whatsapp = valor("whatsapp");
    const correo = valor("correo");
    const marcado = (id: string) => (formRef.current?.elements.namedItem(id) as HTMLInputElement | null)?.checked ?? false;
    const digitos = whatsapp.replace(/\D/g, "").length;

    const nuevos: Errores = {};
    if (!linea) nuevos.linea = a.errores.linea;
    if (!nombre) nuevos.nombre = a.errores.nombre;
    if (!whatsapp) nuevos.whatsapp = a.errores.whatsapp;
    else if (digitos < 7 || digitos > 15) nuevos.whatsapp = a.errores.whatsappFormato;
    if (!correo) nuevos.email = a.errores.correo;
    else if (!CORREO_VALIDO.test(correo)) nuevos.email = a.errores.correoFormato;
    if (!marcado("autorizacion")) nuevos.autoriza = a.errores.autorizacion;
    setErrores(nuevos);
    const primero = (["linea", "nombre", "whatsapp", "email", "autoriza"] as const).find((k) => nuevos[k]);
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
    datos.append("autorizacion", "si");
    datos.append("politica_version", privacidad.version);
    datos.append("marketing", marcado("marketing") ? "si" : "no");

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
      } else if (json?.status === "error" && json.codigo === "sin_autorizacion") {
        // El Apps Script rechazó el envío porque no traía la autorización.
        setErrores({ autoriza: a.errores.autorizacion });
        setEstado("listo");
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
    // method y action son el respaldo para cuando el JavaScript no llega a
    // cargar (red que corta, iOS anterior a 16.4): el formulario se envía
    // directo al Apps Script por POST. Sin esto se enviaba por GET a la misma
    // página, con el nombre, el WhatsApp y el correo en la URL, y el contacto
    // se perdía. Con JavaScript, enviar() lo intercepta y nada cambia.
    <form ref={formRef} onSubmit={enviar} method="post" action={ENDPOINT} className="glass relative overflow-hidden rounded-[26px] p-5 sm:p-6 md:p-10">
      <span aria-hidden className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
      <div className="grid gap-5">
        <Campo id="linea" etiqueta={c.linea} error={errores.linea} obligatorio>
          {/* Apariencia propia: el select nativo de Safari salía gris y
              distinto al resto de los campos. */}
          <div className="relative">
            <select id="linea" name="linea" required defaultValue="" className={cn(claseCampo(errores.linea), "appearance-none pr-11")} aria-invalid={!!errores.linea || undefined} aria-describedby={errores.linea ? "error-linea" : undefined}>
              <option value="" disabled>
                Selecciona una opción
              </option>
              {c.lineaOpciones.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.texto}
                </option>
              ))}
            </select>
            <ChevronDown size={18} aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/55" />
          </div>
        </Campo>
        <Campo id="nombre" etiqueta={c.nombre} error={errores.nombre} obligatorio>
          <input id="nombre" name="nombre" required maxLength={100} autoComplete="name" placeholder="Tu nombre" className={claseCampo(errores.nombre)} aria-invalid={!!errores.nombre || undefined} aria-describedby={errores.nombre ? "error-nombre" : undefined} />
        </Campo>
        <div className="grid gap-5 md:grid-cols-2">
          <Campo id="whatsapp" etiqueta={c.whatsapp} error={errores.whatsapp} obligatorio>
            <input id="whatsapp" name="whatsapp" required maxLength={25} type="tel" autoComplete="tel" placeholder="+57 300 123 4567" className={claseCampo(errores.whatsapp)} aria-invalid={!!errores.whatsapp || undefined} aria-describedby={errores.whatsapp ? "error-whatsapp" : undefined} />
          </Campo>
          <Campo id="email" etiqueta={c.correo} error={errores.email} obligatorio>
            <input id="email" name="correo" required maxLength={254} type="email" autoComplete="email" placeholder="tu@correo.com" className={claseCampo(errores.email)} aria-invalid={!!errores.email || undefined} aria-describedby={errores.email ? "error-email" : undefined} />
          </Campo>
        </div>
        <Campo id="empresa" etiqueta={c.empresa}>
          <input id="empresa" name="empresa" maxLength={120} autoComplete="organization" placeholder="Nombre de tu empresa" className={claseCampo()} />
        </Campo>
        <Campo id="interes" etiqueta={c.interes}>
          <textarea id="interes" name="interes" rows={5} maxLength={2000} placeholder={c.interesEjemplo} className={cn(claseCampo(), "resize-y")} />
        </Campo>

        {/* Autorización previa, expresa e informada (Ley 1581 de 2012): la
            casilla arranca sin marcar. La política abre en otra pestaña para no
            perder lo escrito. */}
        <div>
          <label htmlFor="autoriza" className="flex min-h-[44px] cursor-pointer items-start gap-3 text-[16px] leading-snug text-white/80">
            <input
              id="autoriza"
              name="autorizacion"
              type="checkbox"
              value="si"
              required
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#29c4f5]"
              aria-invalid={!!errores.autoriza || undefined}
              aria-describedby={errores.autoriza ? "error-autoriza" : undefined}
            />
            <span>
              {c.autorizacion}{" "}
              <Link href={rutas.privacidad} target="_blank" rel="noopener" className="text-cyan underline underline-offset-2">
                {c.autorizacionEnlace}
              </Link>
              .
            </span>
          </label>
          {errores.autoriza && (
            <p id="error-autoriza" className="mt-1.5 text-[14px] font-medium text-[#ff8a9b]">
              {errores.autoriza}
            </p>
          )}
          <input type="hidden" name="politica_version" value={privacidad.version} />
        </div>
        <label htmlFor="marketing" className="flex min-h-[44px] cursor-pointer items-start gap-3 text-[16px] leading-snug text-white/70">
          <input id="marketing" name="marketing" type="checkbox" value="si" className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#29c4f5]" />
          <span>
            {c.marketing} <span className="text-white/45">(opcional)</span>
          </span>
        </label>
        <p className="text-[14px] leading-snug text-dim">{c.aviso}</p>

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
