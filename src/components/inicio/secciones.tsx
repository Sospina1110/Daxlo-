import Link from "next/link";
import { ArrowRight, Plus } from "@phosphor-icons/react/dist/ssr";
import { cierre, consultoria, contacto, dosFormas, ecosistema, faq, inicio, preguntasLinea, rutas } from "@/content/copy";
import { Boton } from "@/components/ui/boton";
import { sinCorte } from "@/lib/utils";

// Las secciones del inicio «Limpia» que no necesitan JavaScript: problema y
// solución, los tres beneficios, las dos líneas, las preguntas y el cierre.
// Fondo negro plano, una idea por pantalla, y la composición la hacen la
// letra, los numerales en Geist Mono y las líneas finas: ninguna fila de
// tarjetas iguales con icono.

// Un titular de dos frases va en dos renglones: la segunda empieza abajo.
// Con `siempre`, también en celular (frases cortas, como la del cierre).
function enDosFrases(texto: string, siempre = false) {
  const [uno, ...resto] = texto.split(/(?<=\.)\s+/);
  if (!resto.length) return texto;
  return (
    <>
      {uno} <span className={siempre ? "block" : "sm:block"}>{resto.join(" ")}</span>
    </>
  );
}

const numero = (n: number) => String(n).padStart(2, "0");

// ------------------------------------------------ Problema → solución

// El problema, con las palabras de quien lo vive, y al lado lo que cambia:
// tres filas hoy → después (las de /consultoria). Lo de hoy va en gris; lo
// de después, en blanco, detrás de una flecha azul.
export function Problema() {
  const hoy = ecosistema.pasos[0];
  const c = consultoria.cambios;
  return (
    <section aria-labelledby="titulo-problema" className="seccion">
      <div className="contenedor grid gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        <div data-revelar="" className="lg:col-span-6">
          <h2 id="titulo-problema" className="heading-2 max-w-[680px] text-texto">
            {enDosFrases(hoy.titulo)}
          </h2>
          <p className="body-7 mt-6 max-w-[44ch] text-texto-2">{hoy.texto}</p>
        </div>
        <div data-revelar="" className="lg:col-span-5 lg:col-start-8 lg:pt-3">
          <div aria-hidden className="caption-4 rotulo-tecnico flex items-center gap-3 pb-4 text-texto-2 sm:grid sm:grid-cols-2 sm:gap-x-8">
            <p>{c.hoy}</p>
            <ArrowRight size={12} weight="bold" className="text-trazo sm:hidden" />
            <p className="text-texto">{c.despues}</p>
          </div>
          <ul>
            {c.filas.map((f) => (
              <li key={f.hoy}>
                <span aria-hidden className="regla" />
                <div className="grid gap-x-8 gap-y-2 py-6 sm:grid-cols-2">
                  <p className="body-3 text-texto-2">
                    <span className="sr-only">{c.hoy}: </span>
                    {f.hoy}
                  </p>
                  <p className="body-2 flex gap-3 text-texto">
                    <span className="sr-only">{c.despues}: </span>
                    <ArrowRight aria-hidden size={16} weight="bold" className="mt-1 shrink-0 text-trazo" />
                    <span>{f.despues}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <span aria-hidden className="regla" />
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------ Tres beneficios

// Los tres pilares, en filas: el numeral y el rótulo en Geist Mono, el
// beneficio en titular y el detalle al lado. Separadas por líneas finas.
export function Beneficios() {
  const pilares = ecosistema.pasos.slice(1);
  return (
    <section aria-labelledby="titulo-beneficios" className="seccion">
      <div className="contenedor">
        <div data-revelar="">
          <p className="caption-4 rotulo-tecnico flex items-center gap-3 text-texto-2">
            <span aria-hidden className="h-px w-8 bg-trazo" />
            {inicio.beneficios.rotulo}
          </p>
          <h2 id="titulo-beneficios" className="heading-2 mt-6 max-w-[680px] text-texto">
            {enDosFrases(ecosistema.titulo)}
          </h2>
        </div>
        <ol data-escalonar="0.08" className="mt-12 lg:mt-16">
          {pilares.map((p, i) => (
            <li key={p.rotulo} data-revelar="" className="pilar">
              <span aria-hidden className="regla" />
              <div className="grid gap-y-4 py-8 lg:grid-cols-12 lg:gap-x-8 lg:py-10">
                <p className="caption-4 rotulo-tecnico flex gap-4 text-texto-2 lg:col-span-3 lg:pt-2">
                  <span className="pilar-numero mono text-texto">{numero(i + 1)}</span>
                  {p.rotulo}
                </p>
                <h3 className="pilar-titulo heading-4 text-texto lg:col-span-4">{p.titulo}</h3>
                <p className="body-3 max-w-[52ch] text-texto-2 lg:col-span-5 lg:pt-1">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
        <span aria-hidden className="regla" />
      </div>
    </section>
  );
}

// ------------------------------------------------ Por dónde empiezas

// Las dos líneas, en un solo marco partido en dos. Cada mitad es un enlace
// entero a su página; la regla que decide (quién hace el trabajo) va arriba,
// en Geist Mono.
export function Empiezas() {
  const d = dosFormas;
  const puertas = [
    { ...d.coaching, href: rutas.coaching, extra: d.coaching.equipos },
    { ...d.consultoria, href: rutas.consultoria, extra: undefined },
  ];
  return (
    <section aria-labelledby="titulo-empiezas" className="seccion">
      <div className="contenedor">
        <div data-revelar="" className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="titulo-empiezas" className="heading-2 text-texto">
            {d.titulo}
          </h2>
          <p className="body-7 max-w-[40ch] text-texto-2">{d.sub}</p>
        </div>
        <div data-revelar="" className="puertas mt-12 grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          {puertas.map((p, i) => (
            <div key={p.href} className="contents">
              {i > 0 && <span aria-hidden className="h-px bg-capa-3 md:h-auto md:w-px" />}
              <Link href={p.href} className="puerta-limpia">
                <span className="caption-4 rotulo-tecnico flex items-center gap-3 text-texto-2">
                  <span aria-hidden className="h-2 w-2 rounded-full bg-trazo" />
                  {p.regla}
                </span>
                <span className="heading-4 mt-8 block text-texto">{sinCorte(p.titulo)}</span>
                <span className="body-3 mt-4 block max-w-[48ch] text-texto-2">{sinCorte(p.linea)}</span>
                {p.extra && <span className="body-3 mt-4 block max-w-[48ch] text-texto-2">{p.extra}</span>}
                <span className="body-2 mt-auto inline-flex items-center gap-2 pt-8 text-texto">
                  {p.enlace}
                  <ArrowRight aria-hidden size={16} weight="bold" className="boton-flecha text-trazo" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------ Preguntas

// Siete preguntas de las que ya contesta /preguntas, en un acordeón de
// <details>: abre sin JavaScript y la respuesta está siempre en el HTML. Los
// datos estructurados (FAQPage) siguen solo en /preguntas, donde están todas.
export function Preguntas() {
  const todas = faq.grupos.flatMap((g) => g.preguntas);
  const lista = inicio.preguntas.lista.map((p) => todas.find((q) => q.p === p)).filter((q) => q !== undefined);
  return (
    <section aria-labelledby="titulo-dudas" className="seccion">
      <div className="contenedor grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
        <div data-revelar="" className="lg:col-span-5">
          <h2 id="titulo-dudas" className="heading-2 max-w-[14ch] text-texto">
            {inicio.preguntas.titulo}
          </h2>
          <Link href={rutas.preguntas} className="enlace body-2 mt-6">
            {preguntasLinea.todas}
            <ArrowRight aria-hidden size={16} weight="bold" className="boton-flecha" />
          </Link>
        </div>
        <div data-revelar="" className="lg:col-span-7">
          {lista.map((q) => (
            <div key={q.p}>
              <span aria-hidden className="regla" />
              <details className="duda">
                <summary>
                  <h3 className="title-2 text-texto">{sinCorte(q.p)}</h3>
                  <Plus aria-hidden size={20} className="duda-mas" />
                </summary>
                <div className="duda-respuesta pb-6">
                  <p className="body-3 max-w-[64ch] text-texto-2">{sinCorte(q.r)}</p>
                  {q.enlace && (
                    <Link href={q.enlace.h} className="enlace body-2 mt-2">
                      {q.enlace.t}
                      <ArrowRight aria-hidden size={16} weight="bold" className="boton-flecha" />
                    </Link>
                  )}
                </div>
              </details>
            </div>
          ))}
          <span aria-hidden className="regla" />
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------ Cierre

// El cierre: el mismo botón del hero y la reducción de riesgo. Una
// superficie gris plana, sin borde ni efecto, y todo al centro: es la única
// pantalla centrada de la página.
export function Cierre() {
  return (
    <section aria-labelledby="titulo-cierre" className="seccion">
      <div className="contenedor">
        <div data-revelar="" className="rounded-3xl bg-capa-1 px-6 py-16 text-center md:px-12 md:py-24">
          <h2 id="titulo-cierre" className="heading-2 mx-auto max-w-[680px] text-texto">
            {cierre.titulo}
          </h2>
          <p className="body-7 mx-auto mt-6 max-w-[680px] text-texto-2">{enDosFrases(cierre.sub, true)}</p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <Boton href={rutas.agendar} flecha>
              {cierre.cta}
            </Boton>
            <a href={contacto.whatsapp} target="_blank" rel="noopener noreferrer" className="enlace caption-1">
              {cierre.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
