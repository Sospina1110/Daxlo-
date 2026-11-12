"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CaretDown, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { agendar, contacto, privacidad, rutas } from "@/content/copy";
import { Boton } from "@/components/ui/boton";
import { enlaceDeAgenda, hayAgenda, irA } from "@/lib/agenda";

// El formulario de /agendar, en el sistema «Campo» (paginas.css, .cp-form).
// Solo cambió cómo se ve: la lógica y el destino del envío son los de siempre.
//
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
  const [agenda, setAgenda] = useState<string | null>(null);
  // El HTML exportado promete lo que pasa sin JavaScript (el envío va directo
  // al Apps Script, sin agenda); la frase de la agenda sale ya montado.
  const [montado, setMontado] = useState(false);
  const exitoRef = useRef<HTMLDivElement>(null);

  // El panel de éxito reemplaza al formulario, que es más alto: quien tocó
  // enviar al final quedaría mirando el pie. El foco lo trae a la vista y le
  // dice al lector de pantalla qué pasó.
  useEffect(() => {
    if (estado !== "exito") return;
    const el = exitoRef.current;
    el?.focus({ preventScroll: true });
    el?.scrollIntoView?.({ block: "center" });
  }, [estado]);

  useEffect(() => {
    setMontado(true);
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
      // Con agenda, pasa a Cal.com apenas queda registrado, sin espera: la
      // frase bajo el botón ya le dijo a dónde va. El panel con el botón queda
      // de respaldo si la navegación falla, y es lo que ve si vuelve con Atrás.
      if (json?.status === "ok") {
        const url = enlaceDeAgenda(linea, nombre, correo);
        setAgenda(url);
        setEstado("exito");
        if (url) irA(url);
      } else if (json?.status === "error" && json.codigo === "envio_duplicado") {
        // Ya estaba en la hoja, pero quizá no alcanzó a agendar: también pasa.
        const url = enlaceDeAgenda(linea, nombre, correo);
        setAgenda(url);
        setDuplicado(true);
        setEstado("exito");
        if (url) irA(url);
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

  // El panel de éxito llega subiendo un poco, solo con CSS (@starting-style,
  // paginas.css). Los errores no se animan: aparecen junto con el foco en el
  // campo.
  if (estado === "exito" && agenda) {
    return (
      <div ref={exitoRef} tabIndex={-1} role="status" className="cp-exito">
        <CheckCircle aria-hidden size={52} weight="light" />
        <h3 className="cm-titular cm-titular-m">{a.exito.agenda.titulo}</h3>
        <p className="cm-texto-l">{a.exito.agenda.texto}</p>
        <Boton href={agenda} flecha>
          {a.exito.agenda.boton}
        </Boton>
      </div>
    );
  }

  if (estado === "exito") {
    return (
      <div ref={exitoRef} tabIndex={-1} role="status" className="cp-exito">
        <CheckCircle aria-hidden size={52} weight="light" />
        <h3 className="cm-titular cm-titular-m">{a.exito.titulo}</h3>
        <p className="cm-texto-l">{duplicado ? a.exito.duplicado : a.exito.texto}</p>
        <Boton href={contacto.whatsapp}>{a.exito.whatsapp}</Boton>
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
    <form ref={formRef} onSubmit={enviar} method="post" action={ENDPOINT} className="cp-form">
      <div className="cp-form-campos">
        <Campo id="linea" etiqueta={c.linea} error={errores.linea} obligatorio>
          {/* Apariencia propia: el select nativo de Safari salía gris y
              distinto al resto de los campos. */}
          <div className="cp-select">
            <select id="linea" name="linea" required defaultValue="" className="cp-campo" aria-invalid={!!errores.linea || undefined} aria-describedby={errores.linea ? "error-linea" : undefined}>
              <option value="" disabled>
                Selecciona una opción
              </option>
              {c.lineaOpciones.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.texto}
                </option>
              ))}
            </select>
            <CaretDown aria-hidden size={16} />
          </div>
        </Campo>
        <Campo id="nombre" etiqueta={c.nombre} error={errores.nombre} obligatorio>
          <input id="nombre" name="nombre" required maxLength={100} autoComplete="name" placeholder="Tu nombre" className="cp-campo" aria-invalid={!!errores.nombre || undefined} aria-describedby={errores.nombre ? "error-nombre" : undefined} />
        </Campo>
        <div className="cp-form-dos">
          <Campo id="whatsapp" etiqueta={c.whatsapp} error={errores.whatsapp} obligatorio>
            <input id="whatsapp" name="whatsapp" required maxLength={25} type="tel" autoComplete="tel" placeholder="+57 300 123 4567" className="cp-campo" aria-invalid={!!errores.whatsapp || undefined} aria-describedby={errores.whatsapp ? "error-whatsapp" : undefined} />
          </Campo>
          <Campo id="email" etiqueta={c.correo} error={errores.email} obligatorio>
            <input id="email" name="correo" required maxLength={254} type="email" autoComplete="email" placeholder="tu@correo.com" className="cp-campo" aria-invalid={!!errores.email || undefined} aria-describedby={errores.email ? "error-email" : undefined} />
          </Campo>
        </div>
        <Campo id="empresa" etiqueta={c.empresa}>
          <input id="empresa" name="empresa" maxLength={120} autoComplete="organization" placeholder="Nombre de tu empresa" className="cp-campo" />
        </Campo>
        <Campo id="interes" etiqueta={c.interes}>
          <textarea id="interes" name="interes" rows={4} maxLength={2000} placeholder={c.interesEjemplo} className="cp-campo" />
        </Campo>

        {/* Autorización previa, expresa e informada (Ley 1581 de 2012): la
            casilla arranca sin marcar. La política abre en otra pestaña para no
            perder lo escrito. */}
        <div>
          <label htmlFor="autoriza" className="cp-casilla">
            <input id="autoriza" name="autorizacion" type="checkbox" value="si" required aria-invalid={!!errores.autoriza || undefined} aria-describedby={errores.autoriza ? "error-autoriza" : undefined} />
            <span>
              {c.autorizacion}{" "}
              <Link href={rutas.privacidad} target="_blank" rel="noopener">
                {c.autorizacionEnlace}
              </Link>
              .
            </span>
          </label>
          {errores.autoriza && (
            <p id="error-autoriza" className="cp-error">
              {errores.autoriza}
            </p>
          )}
          <input type="hidden" name="politica_version" value={privacidad.version} />
        </div>
        <label htmlFor="marketing" className="cp-casilla">
          <input id="marketing" name="marketing" type="checkbox" value="si" />
          <span>
            {c.marketing} <small>(opcional)</small>
          </span>
        </label>
        <p className="cp-form-aviso">{c.aviso}</p>

        {/* Trampa para bots: una persona no ve este campo; si llega lleno, es spam. */}
        <div aria-hidden className="cp-trampa">
          <label htmlFor="website">No llenes este campo</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <button type="submit" disabled={estado === "enviando"} className="boton">
          {estado === "enviando" ? a.enviando : a.enviar}
          {estado !== "enviando" && <ArrowRight aria-hidden size={16} className="boton-flecha" />}
        </button>
        <p role="status" aria-live="polite" data-error={estado === "error" ? "" : undefined} className="cp-form-estado">
          {estado === "error" ? a.errores.general : montado && hayAgenda() ? a.metaAgenda : a.meta}
        </p>
      </div>
    </form>
  );
}

function Campo({ id, etiqueta, error, obligatorio, children }: { id: string; etiqueta: string; error?: string; obligatorio?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="cp-etiqueta">
        {etiqueta}
        {obligatorio ? <span data-obligatorio=""> *</span> : <span> (opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`error-${id}`} className="cp-error">
          {error}
        </p>
      )}
    </div>
  );
}
