import { Fragment } from "react";
import { cn, type Tono } from "@/lib/utils";
import { toolLogos, type ToolId } from "@/lib/logos";
import { Reveal } from "./reveal";

// Titular + bajada: la cabecera de casi todas las secciones. Todo va a la
// izquierda: centrado no queda nada (DESIGN.md, Layout). Sin etiqueta encima
// del titular, tampoco en el h1 de las páginas de apoyo.
// Entra como un solo bloque: el escalón interno entre titular y bajada se
// repetía igual en cada sección.
//
// Tres formas (`alineacion`):
// - "izquierda": titular y bajada, una debajo de la otra.
// - "columnas": desde 1024 px, el titular en las columnas 1 a 7 y la bajada
//   en las columnas 9 a 12, alineada con la base del titular. Ocupa el ancho
//   sin centrar nada. En celular, una debajo de la otra.
//
// Escalas (DESIGN.md, Typography): el h1 de página va en `headline-page`; los
// capítulos del argumento (h2) en `headline-lg`, y las secciones de apoyo
// ("¿Esto es para…?" y las preguntas) bajan a `headline-support`. Los anchos
// máximos van en `ch` y `em`: no dependen de las métricas de una familia.
export function SectionHeading({
  titulo,
  sub,
  alineacion = "izquierda",
  nivel = 2,
  escala = "capitulo",
  className,
  id,
}: {
  titulo: React.ReactNode;
  sub?: React.ReactNode;
  // Se conserva por las páginas de línea, que todavía lo pasan: el color ya
  // no depende de la página (DESIGN.md, Colors).
  tono?: Tono;
  alineacion?: "izquierda" | "columnas";
  nivel?: 1 | 2;
  escala?: "capitulo" | "apoyo";
  className?: string;
  id?: string;
}) {
  const Titular = nivel === 1 ? "h1" : "h2";
  const apoyo = nivel === 2 && escala === "apoyo";
  const columnas = alineacion === "columnas" && Boolean(sub);
  const titular = (
    <Titular
      id={id}
      className={cn(
        "text-white",
        nivel === 1 ? "max-w-[16em] text-headline-page" : apoyo ? "max-w-[18em] text-headline-support" : "max-w-[17em] text-headline-lg",
      )}
    >
      {titulo}
    </Titular>
  );
  // Protagonista de su sección: sube 16 px, el doble que el texto de apoyo.
  return (
    <Reveal y={16} className={cn(columnas && "lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6", className)}>
      {columnas ? <div className="lg:col-span-7">{titular}</div> : titular}
      {sub && (
        <p className={cn("mt-4 max-w-[56ch] text-body-md text-muted", columnas && "lg:col-span-4 lg:col-start-9 lg:mt-0 lg:pb-[0.35em]")}>{sub}</p>
      )}
    </Reveal>
  );
}

// Un titular de dos frases se corta entre las frases, cada una en su renglón:
// "Tu gente ya usa IA. / Tu empresa trabaja igual." El navegador lo partía a
// mitad de la segunda ("Tu gente ya usa IA. Tu / empresa…"). Con `corte` se
// parte después de la primera aparición de ese texto (por ejemplo ", "). Si
// no hay dónde cortar, devuelve el texto tal cual. El texto no cambia: los
// renglones van en spans de bloque separados por un espacio, así que el
// textContent (lectores de pantalla, pruebas, buscadores) sigue igual.
export function enLineas(texto: string, corte?: string): React.ReactNode {
  let partes: string[];
  if (corte) {
    const i = texto.indexOf(corte);
    partes = i > 0 ? [texto.slice(0, i + corte.trimEnd().length), texto.slice(i + corte.length)] : [texto];
  } else {
    partes = texto.split(/(?<=[.?!])\s+(?=[¿¡A-ZÁÉÍÓÚÑ])/);
  }
  if (partes.length < 2) return texto;
  return partes.map((p, i) => (
    <Fragment key={p}>
      {i > 0 && " "}
      <span className="block">{p}</span>
    </Fragment>
  ));
}

// Línea de luz que abre un capítulo: el mismo recurso que separa las zonas de
// cada línea, a lo ancho del contenedor y más tenue. Va arriba de las
// secciones que cambian de tema (DESIGN.md, Layout: ritmo vertical); las que
// continúan la idea anterior no la llevan.
const lineaPorTono: Record<Tono, string> = {
  cyan: "via-cyan/35",
  blue: "via-blue-bright/45",
  dual: "via-white/15",
};

export function LineaCapitulo({ tono = "dual" }: { tono?: Tono }) {
  return (
    <div aria-hidden data-hilo-capitulo="" className="pointer-events-none absolute inset-x-0 top-0">
      <div className="container-page">
        <div className={cn("h-px bg-gradient-to-r from-transparent to-transparent", lineaPorTono[tono])} />
      </div>
    </div>
  );
}

// Marquesina infinita en CSS puro: dos copias idénticas que se desplazan
// medio ancho. La segunda copia no se anuncia a lectores de pantalla.
export function Marquee({
  children,
  reverso = false,
  duracion = 40,
  espacio = 56,
  className,
}: {
  children: React.ReactNode;
  reverso?: boolean;
  duracion?: number;
  espacio?: number;
  className?: string;
}) {
  const mitad = (oculta: boolean) => (
    <div aria-hidden={oculta || undefined} className="flex shrink-0 items-center" style={{ gap: espacio, paddingRight: espacio }}>
      {children}
    </div>
  );
  return (
    <div className={cn("mask-x overflow-hidden", className)}>
      <div
        className={cn("marquee-track flex w-max", reverso ? "animate-marquee-reverse" : "animate-marquee")}
        style={{ ["--marquee-duration" as string]: `${duracion}s` } as React.CSSProperties}
      >
        {mitad(false)}
        {mitad(true)}
      </div>
    </div>
  );
}

// Logo oficial de una herramienta. `mono` lo pinta con el color del texto.
export function ToolLogo({ id, tamano = 28, mono = false, className }: { id: ToolId; tamano?: number; mono?: boolean; className?: string }) {
  const logo = toolLogos[id];
  return (
    <svg
      viewBox={logo.viewBox}
      width={tamano}
      height={tamano}
      fill={mono ? "currentColor" : logo.color}
      aria-hidden
      className={cn("shrink-0", className)}
    >
      {logo.paths.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}
