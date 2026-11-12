import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { agendarCon, cierre, contacto, dosFormas, hero, inicio, rutas } from "@/content/copy";
import { Boton } from "@/components/ui/boton";
import type { VideoFondo as Video } from "@/lib/campo/video";
import { sinCorte } from "@/lib/utils";
import { DiagramaCapa, IconoPrincipio, MarcaX } from "./dibujos";
import { Enciende } from "./enciende";
import { FondoVideo } from "./fondo-video";
import { Foto } from "./foto";

// Las secciones del inicio «Campo» que no necesitan JavaScript propio: la
// frase sobre foto, los tres principios, la foto con lista, las dos
// afirmaciones que se encienden (el encendido es un componente aparte), el
// panel del sistema, las puertas y el cierre. Poco texto y mucho aire: una
// idea por pantalla.

const numero = (n: number) => String(n).padStart(2, "0");

// ------------------------------------------------ Frase sobre foto

// Una sola frase sobre una toma a sangre. En el inicio es la bodega, con una
// persona que se aleja por el pasillo; las páginas internas la usan con su
// propia frase y su propia toma (el encuadre de cada una va en campo.css,
// .cm-frase-fondo[data-escena]). La frase se parte después de la coma.
export function FraseFoto({ texto = inicio.frase, foto = "bodega", video }: { texto?: string; foto?: string; video: Video | null }) {
  const [uno, dos] = texto.split(/(?<=,)\s+/);
  return (
    <section aria-labelledby="titulo-frase" data-tema="oscuro" className="cm-frase">
      <div aria-hidden="true" data-escena={foto} className="cm-frase-fondo">
        <Foto nombre={foto} ancho={1600} alto={893} />
        {video && <FondoVideo video={video} />}
        <span className="cm-frase-velo" />
        <span className="cm-grano" />
      </div>
      <h2 id="titulo-frase" data-revelar="" className="cm-titular cm-titular-l">
        {uno} {dos && <span className="sm:block">{dos}</span>}
      </h2>
    </section>
  );
}

// ------------------------------------------------ Tres principios

// Bloque oscuro con resplandor eléctrico: un hilo que baja, el titular y los
// tres principios, cada uno con su icono de línea, que se dibuja al entrar.
export function Principios() {
  const p = inicio.principios;
  return (
    <section aria-labelledby="titulo-principios" data-tema="oscuro" className="cm-principios">
      <span aria-hidden="true" className="cm-resplandor" />
      <span aria-hidden="true" className="cm-grano" />
      <span aria-hidden="true" className="cm-hilo" />
      <h2 id="titulo-principios" data-revelar="" className="cm-titular cm-titular-l">
        {p.titulo}
      </h2>
      <ol data-escalonar="0.14" className="cm-principios-lista">
        {p.lista.map((texto, i) => (
          <li key={texto} data-revelar="" className="cm-principio">
            <p aria-hidden="true" className="cm-mono">
              [{numero(i + 1)}]
            </p>
            <IconoPrincipio n={i} />
            <p className="cm-titular cm-titular-s cm-principio-texto">{texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ------------------------------------------------ En tu empresa, con tu equipo

// Toma y lista de tres, sobre claro: las tres formas de estar adentro, y el
// botón a «Cómo trabajamos». La toma es la mesa vista desde arriba, con el
// equipo ordenando las hojas de un proceso.
export function Equipo({ video }: { video: Video | null }) {
  const e = inicio.equipo;
  return (
    <section aria-labelledby="titulo-equipo" data-tema="claro" className="cm-claro cm-equipo">
      <div aria-hidden="true" data-revelar="" className="cm-equipo-foto">
        <div className="cm-equipo-medios">
          <Foto nombre="mesa" ancho={1280} alto={714} />
          {video && <FondoVideo video={video} />}
        </div>
      </div>
      <div className="cm-equipo-contenido">
        <h2 id="titulo-equipo" data-revelar="" className="cm-titular cm-titular-m">
          {e.titulo}
        </h2>
        <ul data-escalonar="0.1" className="cm-equipo-lista">
          {e.filas.map((fila) => (
            <li key={fila.titulo} data-revelar="" className="cm-fila">
              <h3>{fila.titulo}</h3>
              <p className="cm-texto-m">{fila.linea}</p>
            </li>
          ))}
        </ul>
        <Boton href={rutas.nosotros} variante="oscuro">
          {e.boton}
        </Boton>
      </div>
    </section>
  );
}

// ------------------------------------------------ Lo que queda montado

// La afirmación que se enciende palabra por palabra: un rótulo, la frase y
// el resto de la pantalla, vacío.
export function Montado() {
  const m = inicio.montado;
  return (
    <section aria-labelledby="titulo-montado" data-tema="claro" className="cm-claro cm-afirmacion">
      <h2 id="titulo-montado" className="cm-mono cm-afirmacion-rotulo">
        {m.rotulo}
      </h2>
      <Enciende texto={m.texto} className="cm-titular cm-titular-m" />
    </section>
  );
}

// ------------------------------------------------ El sistema

// El panel azul profundo: las seis capas de lo que queda funcionando, cada
// una con su número, su diagrama de línea, su título y una línea. Los id
// (capa-…) son las anclas del pie.
export function Sistema() {
  const s = inicio.sistema;
  return (
    <section aria-labelledby="titulo-sistema" data-tema="claro" className="cm-claro cm-sistema">
      <div data-tema="oscuro" className="cm-panel">
        <span aria-hidden="true" className="cm-grano" />
        <div data-revelar="" className="cm-panel-cabeza">
          <MarcaX />
          <p className="cm-mono cm-panel-nombre">{s.nombre}</p>
          <h2 id="titulo-sistema" className="cm-titular cm-titular-l">
            {s.titulo}
          </h2>
        </div>
        <ol className="cm-capas">
          {s.capas.map((capa, i) => (
            <li key={capa.id} id={`capa-${capa.id}`} data-revelar="marca" className="cm-capa">
              <p className="cm-mono cm-capa-rotulo">
                {numero(i + 1)}
                <span aria-hidden="true">·</span>
                {capa.rotulo}
              </p>
              <DiagramaCapa id={capa.id} />
              <h3>{capa.titulo}</h3>
              <p className="cm-texto-s">{capa.linea}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ------------------------------------------------ Las puertas

// La segunda afirmación que se enciende y las tres puertas: por dónde se
// entra, según quién hace el trabajo. Cada tarjeta es un enlace entero a su
// página, con su fotografía.
const FOTOS_PUERTA = ["t-persiana", "t-manos", "t-oficina"] as const;

export function Puertas() {
  const d = dosFormas;
  const puertas = [
    { ...d.coaching, href: rutas.coaching },
    // El coaching para equipos tiene su franja en /coaching.
    { ...d.equipo, href: `${rutas.coaching}#equipos` },
    { ...d.consultoria, href: rutas.consultoria },
  ];
  return (
    <section aria-labelledby="titulo-puertas" data-tema="claro" className="cm-claro">
      <div className="cm-afirmacion">
        <h2 id="titulo-puertas" className="cm-mono cm-afirmacion-rotulo">
          {d.sub}
        </h2>
        <Enciende texto={d.texto} className="cm-titular cm-titular-m" />
      </div>
      <ul data-escalonar="0.1" className="cm-puertas-lista">
        {puertas.map((p, i) => (
          <li key={p.etiqueta} data-revelar="">
            <Link href={p.href} className="cm-puerta">
              <span aria-hidden="true" className="cm-puerta-foto">
                <Foto nombre={FOTOS_PUERTA[i]} ancho={560} alto={700} />
              </span>
              <span className="cm-mono cm-puerta-regla">{p.regla}</span>
              <span className="cm-titular cm-titular-m cm-puerta-titulo">
                {p.etiqueta}
                <ArrowRight aria-hidden size={28} weight="light" />
              </span>
              <span className="cm-texto-m cm-puerta-linea">{p.linea}</span>
              <span className="cm-mono cm-puerta-servicio">{sinCorte(p.titulo)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ------------------------------------------------ Cierre

// El cierre: un panel con resplandor eléctrico y una red de puntos de luz
// que se conectan (un video, sobre su póster), el llamado, el mismo botón del
// hero y la reducción de riesgo. Es el cierre de todas las páginas; en las de
// cada línea el botón lleva al formulario con esa línea ya elegida.
export function Cierre({ video, linea }: { video: Video | null; linea?: "coaching" | "consultoria" }) {
  return (
    <section aria-labelledby="titulo-cierre" data-tema="oscuro" className="cm-cierre">
      <div data-revelar="" className="cm-cierre-panel">
        <div aria-hidden="true" className="cm-cierre-fondo">
          <Foto nombre="luz" ancho={1280} alto={714} />
          {video && <FondoVideo video={video} />}
        </div>
        <span aria-hidden="true" className="cm-grano" />
        <h2 id="titulo-cierre" className="cm-titular cm-titular-l">
          {cierre.titulo}
        </h2>
        <div className="cm-cierre-accion">
          <Boton href={linea ? agendarCon(linea) : rutas.agendar}>{hero.cta}</Boton>
          <a href={contacto.whatsapp} target="_blank" rel="noopener noreferrer" className="cm-enlace cm-texto-s">
            {cierre.whatsapp}
          </a>
        </div>
        <p className="cm-texto-s cm-cierre-nota">{cierre.sub}</p>
      </div>
    </section>
  );
}
