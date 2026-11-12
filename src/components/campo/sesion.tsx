import { Check } from "@phosphor-icons/react/dist/ssr";
import { coaching } from "@/content/copy";
import { sinCorte } from "@/lib/utils";

// La sección propia de /coaching (paginas.css, .cp-sesion).

// ------------------------------------------------ /coaching: la sesión

// El panel azul profundo: a la izquierda, los tres pasos de una sesión; a la
// derecha, la ventana de ejemplo, donde los mensajes llegan uno tras otro.
// La ventana es una maqueta del método, rotulada «Ejemplo»: no es la
// conversación de un cliente.
export function Sesion() {
  const s = coaching.sesion;
  const v = s.ventana;
  return (
    <section id="como-funciona" aria-labelledby="titulo-sesion" data-tema="claro" className="cm-claro cm-sistema cp-panel-seccion">
      <div data-tema="oscuro" className="cm-panel">
        <span aria-hidden="true" className="cm-grano" />
        <div className="cp-sesion">
          <div>
            <p className="cm-mono cm-corchete">{s.rotulo}</p>
            <h2 id="titulo-sesion" className="cm-titular cm-titular-l">
              {sinCorte(s.titulo)}
            </h2>
            <ol data-escalonar="0.1" className="cp-sesion-pasos">
              {s.pasos.map((p) => (
                <li key={p.numero} data-revelar="" className="cp-sesion-paso">
                  <p aria-hidden="true" className="cm-mono">
                    {p.numero}
                  </p>
                  <h3>{p.titulo}</h3>
                  <p className="cm-texto-m">{p.texto}</p>
                </li>
              ))}
            </ol>
          </div>
          <figure data-revelar="" className="cp-ventana">
            <figcaption className="cm-mono cp-ventana-barra">
              <span className="cm-corchete">{v.etiqueta}</span>
              <span>{v.titulo}</span>
            </figcaption>
            <ol className="cp-ventana-mensajes">
              {v.mensajes.map((m, i) => (
                <li key={m.texto} data-de={m.de} style={{ "--i": i } as React.CSSProperties} className="cp-mensaje">
                  <b>{m.de === "tu" ? v.avatar : "Daxlo"}</b>
                  {m.texto}
                </li>
              ))}
            </ol>
            <p aria-hidden="true" style={{ "--i": 3 } as React.CSSProperties} className="cp-ventana-campo">
              {v.placeholder}
            </p>
            <p style={{ "--i": 4 } as React.CSSProperties} className="cm-mono cp-ventana-ficha">
              <Check aria-hidden size={14} />
              {v.ficha}
            </p>
          </figure>
        </div>
      </div>
    </section>
  );
}
