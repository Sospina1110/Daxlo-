import { cn, type Tono } from "@/lib/utils";
import { toolLogos, type ToolId } from "@/lib/logos";
import { Badge } from "./primitives";
import { Reveal } from "./reveal";

// Badge + titular + bajada: la cabecera de casi todas las secciones.
export function SectionHeading({
  badge,
  titulo,
  sub,
  tono = "dual",
  alineacion = "centro",
  className,
  id,
}: {
  badge?: string;
  titulo: React.ReactNode;
  sub?: React.ReactNode;
  tono?: Tono;
  alineacion?: "centro" | "izquierda";
  className?: string;
  id?: string;
}) {
  const centro = alineacion === "centro";
  return (
    <div className={cn(centro ? "mx-auto max-w-[760px] text-center" : "max-w-[680px]", className)}>
      {badge && (
        <Reveal>
          <Badge tono={tono}>{badge}</Badge>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 id={id} className="mt-5 text-[clamp(2.1rem,4.6vw,3.5rem)] leading-[1.05] text-white">
          {titulo}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p className={cn("mt-5 text-[18px] leading-relaxed text-muted", centro && "mx-auto max-w-[620px]")}>{sub}</p>
        </Reveal>
      )}
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

// Lista con viñeta de marca de agua: el "check" de las tarjetas de la plantilla.
export function Puntos({ items, tono = "dual", className }: { items: readonly string[]; tono?: Tono; className?: string }) {
  const color = tono === "cyan" ? "text-cyan" : tono === "blue" ? "text-[#8ea0ff]" : "text-mint";
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((p) => (
        <li key={p} className="flex items-start gap-3 text-[17px] text-white/85">
          <svg viewBox="0 0 24 24" className={cn("mt-[3px] h-[18px] w-[18px] shrink-0", color)} aria-hidden>
            <path fill="currentColor" d="M12 2l1.9 6.3L20 10l-6.1 1.7L12 18l-1.9-6.3L4 10l6.1-1.7z" />
          </svg>
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}
