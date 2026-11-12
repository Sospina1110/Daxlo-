import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { contacto, dosFormas, faq, rutas } from "@/content/copy";
import { Boton } from "@/components/ui/boton";
import { sinCorte } from "@/lib/utils";
import { Indice } from "./indice";
import { Pregunta } from "./pregunta";

// Las secciones propias de /preguntas (paginas.css).

// ------------------------------------------------ /preguntas

// Cómo elegir, antes de las preguntas: las dos reglas, una al lado de la
// otra. Cada una es un enlace entero a la página de su línea.
export function Elegir() {
  const opciones = [
    { ...dosFormas.coaching, href: rutas.coaching },
    { ...dosFormas.consultoria, href: rutas.consultoria },
  ];
  return (
    <ul aria-label={faq.elegir.rotulo} className="cp-elegir-lista">
      {opciones.map((o) => (
        <li key={o.etiqueta}>
          <Link href={o.href} className="cp-opcion">
            <span className="cm-mono">{o.etiqueta}</span>
            <span className="cm-titular cm-titular-m cp-opcion-regla">{o.regla}</span>
            <span className="cp-opcion-destino">
              {sinCorte(o.titulo)}
              <ArrowRight aria-hidden size={20} weight="light" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Los grupos de preguntas sobre claro, con el índice fijo a la izquierda.
// Cada grupo lleva su ancla (faq.grupos[].ancla: #elegir, #coaching,
// #consultoria) para que las páginas enlacen directo a sus preguntas, y los
// de cada línea llevan el enlace a su página. Al final, la ayuda por
// WhatsApp.
export function Grupos() {
  const f = faq;
  return (
    <section aria-label={f.titulo} data-tema="claro" className="cm-claro">
      <div data-indice="" className="cp-grupos">
        <Indice items={f.grupos.map((g) => g.nombre)} objetivo=".cp-grupo" enlaces={f.grupos.map((g) => `#${g.ancla}`)} nombre="Grupos de preguntas" />
        <div className="cp-grupos-lista">
          {f.grupos.map((g) => (
            <div key={g.nombre} id={g.ancla} className="cp-grupo">
              <div data-revelar="" className="cp-grupo-cabeza">
                <h2 className="cm-titular cm-titular-m">{sinCorte(g.nombre)}</h2>
                {g.enlace && (
                  <Link href={g.enlace.h} className="cm-enlace">
                    {g.enlace.t}
                  </Link>
                )}
              </div>
              <div>
                {g.preguntas.map((q) => (
                  <Pregunta key={q.p} pregunta={q.p} respuesta={q.r} enlace={q.enlace} />
                ))}
              </div>
            </div>
          ))}
          <div data-revelar="" className="cp-marco cp-ayuda">
            <div>
              <p className="cm-titular cm-titular-s">{f.ayuda}</p>
              <p className="cm-texto-m">{f.ayudaTexto}</p>
            </div>
            <Boton href={contacto.whatsapp} variante="oscuro">
              {f.ayudaCta}
            </Boton>
          </div>
        </div>
      </div>
    </section>
  );
}
