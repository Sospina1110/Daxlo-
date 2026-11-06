// Apariciones en CSS, como las de Framer: no esperan a que cargue React.
//
// El HTML trae el contenido marcado con data-revelar. Un script en línea del
// layout (ver src/app/layout.tsx) lo oculta apenas arranca la página y le pone
// data-visible cuando entra en pantalla; la transición la hace el CSS
// (globals.css). Sin JavaScript no se oculta nada y todo queda visible.
//
// Antes estas apariciones eran de Motion: el contenido salía del HTML con
// opacity:0 y esperaba a que React hidratara. En un celular de gama media eso
// dejaba la pantalla vacía más de 5 segundos.
//
// Ritmo único en todo el sitio (DESIGN.md, Motion):
// - En un grupo (Stagger, data-escalonar) el escalón va en ola: el primer
//   intervalo es ESCALON (0,08 s) y cada uno es 15 % más corto que el anterior
//   (0 / 0,08 / 0,148 / 0,206 / 0,255 s…). Lo calcula el script del layout.
// - Retrasos a mano por rol: protagonista 0; apoyo +0,08 s; la acción y su
//   nota juntas +0,14 s; adorno 0.
// - Ningún bloque espera más de RETRASO_MAXIMO (0,32 s): con 0,6 s de
//   entrada, nada tarda más de ~0,9 s en quedar quieto.
// - Distancia por rol con `y`: protagonista (titular de sección) 16 px; apoyo
//   8 px, el valor por defecto del CSS; adorno 0, solo funde.

export const ESCALON = 0.08;
export const RETRASO_MAXIMO = 0.32;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  // Cuánto sube al aparecer, en px. Sin valor, 8 px (apoyo).
  y?: number;
};

export function Reveal({ children, className, delay = 0, y }: RevealProps) {
  const estilo: Record<string, string> = {};
  const retraso = Math.min(delay, RETRASO_MAXIMO);
  if (retraso) estilo["--retraso"] = `${+retraso.toFixed(3)}s`;
  if (y !== undefined) estilo["--y"] = `${y}px`;
  return (
    <div data-revelar="" className={className} style={Object.keys(estilo).length ? (estilo as React.CSSProperties) : undefined}>
      {children}
    </div>
  );
}

// Grupo cuyos hijos aparecen escalonados: el script le da a cada hijo un
// retraso según su posición (con el mismo tope).
export function Stagger({
  children,
  className,
  escalon = ESCALON,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  escalon?: number;
  as?: "div" | "ul";
}) {
  const Comp = as;
  return (
    <Comp data-escalonar={escalon} className={className}>
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" }) {
  const Comp = as;
  return (
    <Comp data-revelar="" className={className}>
      {children}
    </Comp>
  );
}
