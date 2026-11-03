import { Fragment } from "react";
import { cn, type Tono } from "@/lib/utils";
import { toolLogos, type ToolId } from "@/lib/logos";
import { Badge } from "./primitives";
import { Reveal } from "./reveal";

// Titular + bajada: la cabecera de casi todas las secciones. La etiqueta
// (`badge`) queda solo para las páginas que la usan como h1 de página
// (/herramientas, /preguntas, /agendar, /nosotros); las secciones bajo el hero
// no llevan etiqueta encima del titular (DESIGN.md, Components).
// Entra como un solo bloque: el escalón interno entre etiqueta, titular y
// bajada se repetía igual en cada sección.
// Las cabeceras de sección (h2) centradas van centradas solo desde 640 px: en
// celular, una bajada de cuatro o cinco líneas centrada cuesta leerla porque
// cada línea empieza en un punto distinto. El h1 de página centrado
// (/herramientas, /preguntas) sigue centrado en todos los anchos: sus migas y
// su fondo van centrados, y la etiqueta y el titular a la izquierda
// descuadraban la primera pantalla.
//
// Dos escalas de h2 (`escala`, DESIGN.md, Typography): los capítulos del
// argumento (el problema, qué cambia, la sesión, cómo trabajamos, las dos
// puertas, quiénes somos) van en `headline-lg`, hasta 56 px y 880 px de ancho
// para que el titular quede en dos renglones; las secciones de apoyo ("¿Esto
// es para…?" y las preguntas) bajan a `headline-support`, 28–40 px. Antes las
// nueve cabeceras de /consultoria eran iguales y ninguna mandaba.
export function SectionHeading({
  badge,
  titulo,
  sub,
  tono = "dual",
  alineacion = "centro",
  nivel = 2,
  escala = "capitulo",
  className,
  id,
}: {
  badge?: string;
  titulo: React.ReactNode;
  sub?: React.ReactNode;
  tono?: Tono;
  alineacion?: "centro" | "izquierda";
  nivel?: 1 | 2;
  escala?: "capitulo" | "apoyo";
  className?: string;
  id?: string;
}) {
  const centro = alineacion === "centro";
  const Titular = nivel === 1 ? "h1" : "h2";
  const apoyo = nivel === 2 && escala === "apoyo";
  const anchoIzquierda = nivel === 1 ? "max-w-[680px]" : apoyo ? "max-w-[640px]" : "max-w-[880px]";
  return (
    <Reveal
      className={cn(
        centro ? (nivel === 1 ? "mx-auto max-w-[760px] text-center" : "max-w-[760px] sm:mx-auto sm:text-center") : anchoIzquierda,
        className,
      )}
    >
      {badge && (
        <Badge tono={tono} className="mb-5">
          {badge}
        </Badge>
      )}
      <Titular
        id={id}
        className={cn(
          "text-white",
          nivel === 1
            ? "text-[clamp(2.3rem,5.4vw,4rem)] leading-[1.05] tracking-[-0.025em]"
            : apoyo
              ? "text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1]"
              : "text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.05]",
        )}
      >
        {titulo}
      </Titular>
      {sub && <p className={cn("mt-4 max-w-[620px] text-[18px] leading-relaxed text-muted", centro && (nivel === 1 ? "mx-auto" : "sm:mx-auto"))}>{sub}</p>}
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
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
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
