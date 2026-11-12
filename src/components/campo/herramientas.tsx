import { Plus } from "@phosphor-icons/react/dist/ssr";
import { herramientas } from "@/content/copy";
import { toolLogos, type ToolId } from "@/lib/logos";

// Las secciones propias de /herramientas (paginas.css).

const numero = (n: number) => String(n).padStart(2, "0");

// ------------------------------------------------ /herramientas

// El logo de una herramienta, en el color del texto: en la paleta de la
// página, no en el de su marca.
function Logo({ id, tamano = 22 }: { id: ToolId; tamano?: number }) {
  const logo = toolLogos[id];
  return (
    <svg viewBox={logo.viewBox} width={tamano} height={tamano} fill="currentColor" aria-hidden="true">
      {logo.paths.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}

// La pieza de la cabecera: las siete herramientas en fila, unidas por una
// línea punteada. Decorativa: los nombres están en la lista de abajo.
export function Cadena() {
  return (
    <ul aria-hidden="true" className="cp-cadena">
      {herramientas.lista.map((h) => (
        <li key={h.id} className="cp-teja">
          <Logo id={h.id} tamano={26} />
          <span className="cm-mono">{h.nombre}</span>
        </li>
      ))}
    </ul>
  );
}

// Para qué sirve cada una: una fila por herramienta, sobre oscuro, con su
// número, su logo, su nombre, una línea y su clase.
export function ListaHerramientas() {
  const h = herramientas;
  return (
    <section aria-labelledby="titulo-lista" data-tema="oscuro" className="cp-oscuro">
      <div className="cp-herramientas">
        <div data-revelar="" className="cp-cabeza">
          <p className="cm-mono cm-corchete">{h.badge}</p>
          <h2 id="titulo-lista" className="cm-titular cm-titular-l">
            {h.subtituloLista}
          </h2>
        </div>
        <ul data-escalonar="0.06" className="cp-herramientas-lista">
          {h.lista.map((t, n) => (
            <li key={t.id} data-revelar="" className="cp-herramienta">
              <p aria-hidden="true" className="cm-mono cp-herramienta-numero">
                [{numero(n + 1)}]
              </p>
              <span aria-hidden="true" className="cp-icono">
                <Logo id={t.id} />
              </span>
              <h3 className="cm-titular cm-titular-s">{t.nombre}</h3>
              <p className="cm-texto-m cp-herramienta-uso">{t.uso}</p>
              <p className="cm-mono cp-herramienta-clase">{t.clase}</p>
            </li>
          ))}
          <li data-revelar="" data-otra="" className="cp-herramienta">
            <p aria-hidden="true" className="cm-mono cp-herramienta-numero">
              [{numero(h.lista.length + 1)}]
            </p>
            <span aria-hidden="true" className="cp-icono">
              <Plus size={20} weight="light" />
            </span>
            <h3 className="cm-titular cm-titular-s">{h.otra.titulo}</h3>
            <p className="cm-texto-m cp-herramienta-uso">{h.otra.texto}</p>
            <p className="cm-mono cp-herramienta-clase">{h.otra.clase}</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
