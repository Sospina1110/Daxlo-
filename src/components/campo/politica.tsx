import { privacidad } from "@/content/copy";
import { CorreoContacto } from "@/components/ui/correo-contacto";
import { Indice } from "./indice";

const numero = (n: number) => String(n).padStart(2, "0");

// ------------------------------------------------ /privacidad

// La política de tratamiento de datos: texto largo de lectura, sobre papel,
// en una columna angosta, sin apariciones (se lee de corrido) y con el índice
// fijo a la izquierda. Cada sección es enlazable por su ancla, y el texto
// legal sí se puede seleccionar y copiar (data-copiable).
export function Politica() {
  const p = privacidad;
  const r = p.responsable;
  const responsable = "Quién es responsable de tus datos";
  return (
    <section aria-label="Texto de la política" data-tema="claro" className="cm-claro">
      <div data-indice="" className="cp-politica">
        <Indice
          items={["Responsable", ...p.secciones.map((s) => s.titulo)]}
          objetivo=".cp-politica-seccion"
          enlaces={["#responsable", ...p.secciones.map((_, n) => `#seccion-${n + 1}`)]}
          nombre="Secciones de la política"
        />
        <article data-copiable="">
          <p>{p.intro}</p>
          <section id="responsable" className="cp-politica-seccion">
            <h2 className="cm-titular cm-titular-s">{responsable}</h2>
            <dl className="cp-politica-datos">
              <dt>Responsable</dt>
              <dd>{r.nombre}</dd>
              <dt>Domicilio</dt>
              <dd>{r.domicilio}</dd>
              <dt>Correo</dt>
              <dd>
                <CorreoContacto />
              </dd>
              <dt>WhatsApp</dt>
              <dd>{r.whatsapp}</dd>
            </dl>
            <p>{r.atiende}</p>
          </section>
          {p.secciones.map((s, n) => (
            <section key={s.titulo} id={`seccion-${n + 1}`} className="cp-politica-seccion">
              <p aria-hidden="true" className="cm-mono">
                [{numero(n + 1)}]
              </p>
              <h2 className="cm-titular cm-titular-s">{s.titulo}</h2>
              {"lista" in s && s.lista && (
                <ul>
                  {s.lista.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {s.parrafos.map((texto) => (
                <p key={texto}>{texto}</p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
