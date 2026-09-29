import Link from "next/link";
import { cn, type Tono } from "@/lib/utils";

const bordePorTono: Record<Tono, React.CSSProperties> = {
  dual: {},
  cyan: { ["--from" as string]: "#29c4f5", ["--to" as string]: "#0b7ea6" },
  blue: { ["--from" as string]: "#6f86ff", ["--to" as string]: "#1b35d0" },
};

// Píldora con borde degradado: la etiqueta sobre cada titular de sección.
export function Badge({ children, tono = "dual", className }: { children: React.ReactNode; tono?: Tono; className?: string }) {
  return (
    <span
      style={bordePorTono[tono]}
      className={cn(
        "border-gradient inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.12em] text-white/90",
        className,
      )}
    >
      {children}
    </span>
  );
}

// Foco de luz del borde superior del botón. Degradado radial en vez de
// filter: blur, que en un celular se paga en cada botón de la página.
const brilloPorTono: Record<Tono, string> = {
  dual: "radial-gradient(closest-side at 35% 50%, rgba(41,196,245,0.75), transparent), radial-gradient(closest-side at 65% 50%, rgba(61,90,255,0.75), transparent)",
  cyan: "radial-gradient(closest-side, rgba(41,196,245,0.85), rgba(11,126,166,0.3) 60%, transparent)",
  blue: "radial-gradient(closest-side, rgba(61,90,255,0.9), rgba(27,53,208,0.3) 60%, transparent)",
};

type GlowButtonProps = {
  children: React.ReactNode;
  href?: string;
  tono?: Tono;
  tamano?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

// Botón oscuro con borde degradado y un foco de luz en el borde superior,
// como el "Get Started" de la plantilla.
export function GlowButton({ children, href, tono = "dual", tamano = "md", className, type = "button", disabled, onClick }: GlowButtonProps) {
  const clases = cn(
    "group border-gradient relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium text-white transition duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60",
    tamano === "sm" && "min-h-[44px] px-4 py-2 text-[15px]",
    tamano === "md" && "px-4 py-3 text-[16px] min-[360px]:px-5",
    // En pantallas de 320 px el padding completo partía "Agendar una
    // conversación" en dos líneas.
    tamano === "lg" && "px-4 py-4 text-[16px] min-[360px]:px-7 min-[360px]:text-[17px]",
    className,
  );
  const estilo = { ...bordePorTono[tono], ["--fill" as string]: "#10121a", ["--angle" as string]: "120deg" } as React.CSSProperties;
  const interior = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute -top-5 left-1/2 h-10 w-[90%] -translate-x-1/2 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: brilloPorTono[tono] }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );
  // Las rutas del propio sitio van con Link: la página siguiente se precarga y
  // se abre sin recargar. Los enlaces externos (WhatsApp) quedan como <a>.
  if (href?.startsWith("/")) {
    return (
      <Link href={href} className={clases} style={estilo}>
        {interior}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={clases} style={estilo}>
        {interior}
      </a>
    );
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={clases} style={estilo}>
      {interior}
    </button>
  );
}

// Esfera de vidrio con luz de borde en dos tonos, la pieza visual de la plantilla.
export function Orb({ tamano = 240, tono = "dual", className }: { tamano?: number | string; tono?: Tono; className?: string }) {
  const a = tono === "blue" ? "61, 90, 255" : "41, 196, 245";
  const b = tono === "cyan" ? "11, 126, 166" : "27, 53, 208";
  return (
    <span
      aria-hidden
      className={cn("relative inline-block shrink-0 rounded-full", className)}
      style={{
        width: tamano,
        height: tamano,
        background: [
          "radial-gradient(circle at 32% 26%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 16%, transparent 34%)",
          `radial-gradient(circle at 74% 82%, rgba(${a},0.75), transparent 46%)`,
          `radial-gradient(circle at 18% 86%, rgba(${b},0.8), transparent 48%)`,
          "radial-gradient(circle at 50% 50%, #0a0b11 0%, #05060a 70%)",
        ].join(","),
        boxShadow: [
          "inset 0 0 0 1px rgba(255,255,255,0.08)",
          `inset -14px -18px 36px rgba(${a},0.5)`,
          `inset 16px 12px 34px rgba(${b},0.45)`,
          `0 0 60px 6px rgba(${b},0.28)`,
          `0 0 110px 20px rgba(${a},0.14)`,
        ].join(","),
      }}
    />
  );
}

// Los tres puntos de ventana de macOS que usan todas las maquetas.
export function WindowDots({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("flex items-center gap-1.5", className)}>
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
    </span>
  );
}

const tejaPorTono: Record<Tono, string> = {
  cyan: "border-cyan/25 bg-cyan/10 text-cyan",
  blue: "border-blue-bright/30 bg-blue-bright/12 text-[#8ea0ff]",
  dual: "border-line-2 bg-white/5 text-white",
};

// Teja de icono: el recuadro redondeado que va sobre los titulares de tarjeta.
export function IconTile({ children, tono = "dual", className }: { children: React.ReactNode; tono?: Tono; className?: string }) {
  return (
    <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl border", tejaPorTono[tono], className)}>
      {children}
    </span>
  );
}

// La X de Daxlo (blanca, cuña cian) en un círculo casi negro: el avatar de
// Daxlo en las maquetas de chat.
export function MarcaX({ tamano = 32, className }: { tamano?: number; className?: string }) {
  const ancho = Math.round(tamano * 0.56);
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full border border-line-2 bg-ink", className)}
      style={{ width: tamano, height: tamano }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/daxlo-x.png" alt="" width={ancho} height={Math.round((ancho * 162) / 219)} />
    </span>
  );
}

