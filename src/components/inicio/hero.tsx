import { herramientas, hero, inicio, rutas } from "@/content/copy";
import { Boton } from "@/components/ui/boton";
import { Pieza } from "./pieza";

// El hero del inicio «Limpia». Negro plano, la letra grande y una sola línea
// azul fina como gráfico (el primer ejemplo del video de color: negro carbón,
// azul rey y una salpicadura de mandarina).
//
// Arriba del pliegue, lo que pide la skill (A2): titular, subtítulo, un solo
// botón, una señal de respaldo y la pieza visual. La señal de respaldo son
// las herramientas con las que se trabaja, en texto: no hay clientes ni
// cifras que se puedan publicar.
//
// El titular va en el degradado blanco → gris de la skill (el único del
// sitio), con 680 px de ancho máximo y cortes donde corta la idea: en
// escritorio, «Implementamos la IA. / Transferimos / la capacidad.»; en
// celular cada frase se parte después del verbo.
//
// La entrada corre en CSS (.hero-entra): no espera a React y no mueve la
// caja de nada. La línea se dibuja una vez (limpia.css, .hero-arco).
export function Hero() {
  const [uno, dos] = hero.titulo.map((frase) => {
    const [verbo, ...resto] = frase.split(" ");
    return { verbo, resto: resto.join(" ") };
  });
  const retraso = (n: number) => ({ "--retraso": `${n * 80}ms` }) as React.CSSProperties;
  return (
    <section id="top" aria-labelledby="titulo-hero" className="hero-limpio">
      <div aria-hidden className="hero-arco hidden md:block">
        <svg viewBox="0 0 1440 800" preserveAspectRatio="none" fill="none">
          <path d="M-20 772 C 560 772, 900 744, 1120 470 S 1370 70, 1460 -40" stroke="var(--color-trazo)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div className="contenedor">
        <div className="mt-6 grid items-center gap-y-16 lg:mt-16 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7">
            <p className="hero-entra caption-4 rotulo-tecnico flex items-center gap-3 text-texto-2">
              <span aria-hidden className="h-px w-8 bg-trazo" />
              {hero.aliado}
            </p>
            <h1 id="titulo-hero" style={retraso(1)} className="hero-entra heading-1 titular-hero mt-6 max-w-[680px] pb-1">
              <span className="block">
                {uno.verbo} <br className="sm:hidden" />
                {uno.resto}
              </span>
              <span className="block">
                {dos.verbo} <br />
                {dos.resto}
              </span>
            </h1>
            <p style={retraso(2)} className="hero-entra body-7 mt-6 max-w-xl text-texto-2">
              {hero.sub}
            </p>
            <div style={retraso(3)} className="hero-entra mt-8 flex flex-col gap-x-6 gap-y-3 sm:flex-row sm:items-center">
              <Boton href={rutas.agendar} flecha>
                {hero.cta}
              </Boton>
              <p className="caption-2 text-texto-2">{hero.meta}</p>
            </div>
            <div style={retraso(4)} className="hero-entra mt-12">
              <p className="caption-4 rotulo-tecnico text-texto-2">{inicio.respaldo}</p>
              <ul className="title-4 mt-3 flex flex-wrap gap-x-6 gap-y-2 text-texto">
                {herramientas.lista.map((h) => (
                  <li key={h.id}>{h.nombre}</li>
                ))}
              </ul>
            </div>
          </div>
          <div style={retraso(4)} className="hero-entra lg:col-span-5">
            <Pieza />
          </div>
        </div>
      </div>
    </section>
  );
}
