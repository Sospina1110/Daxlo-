import { manifiesto } from "@/content/copy";

// Qué es Daxlo, en una sola afirmación de dos tonos. El arranque
// (manifiesto.fuerte) es el h2 y va en blanco; lo que sigue continúa en el
// mismo párrafo, apagado, y se enciende palabra por palabra mientras cruza la
// pantalla. Es la idea «Encendido» hecha letra y va una sola vez en el sitio.
// Nada más: ni icono, ni botón, ni etiqueta. Es la pantalla casi vacía entre
// el hero y la pieza del ecosistema.
//
// Movimiento: CSS atado al scroll (globals.css, .manifiesto), sin JavaScript.
// El párrafo es la línea de tiempo y cada palabra tiene su tramo (--a a --b,
// en porcentaje del paso del párrafo por la pantalla): la primera se enciende
// cuando el párrafo va entrando y la última poco después de cruzar el centro.
// Sin soporte, con «reducir movimiento» o sin JavaScript, todas encendidas: el
// estado apagado solo existe dentro de la animación.
const DESDE = 24;
const HASTA = 52;
const TRAMO = 9;

export function Manifiesto() {
  const palabras = manifiesto.sigue.split(" ");
  const paso = (HASTA - DESDE - TRAMO) / Math.max(1, palabras.length - 1);
  return (
    <section aria-labelledby="titulo-manifiesto" className="seccion-capitulo relative">
      <div className="container-page lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div className="manifiesto font-display text-statement text-white lg:col-span-10 lg:col-start-2">
          <h2 id="titulo-manifiesto" className="inline [font-size:inherit] [font-weight:inherit] [letter-spacing:inherit] [line-height:inherit]">
            {manifiesto.fuerte}
          </h2>{" "}
          <p className="inline">
            {palabras.map((p, i) => {
              const a = DESDE + i * paso;
              return (
                <span key={i}>
                  <span className="palabra" style={{ ["--a" as string]: `${a.toFixed(2)}%`, ["--b" as string]: `${(a + TRAMO).toFixed(2)}%` } as React.CSSProperties}>
                    {p}
                  </span>
                  {i < palabras.length - 1 ? " " : ""}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
