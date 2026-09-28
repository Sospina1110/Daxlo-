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

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function Reveal({ children, className, delay = 0, y }: RevealProps) {
  const estilo: Record<string, string> = {};
  if (delay) estilo["--retraso"] = `${delay}s`;
  if (y !== undefined) estilo["--y"] = `${y}px`;
  return (
    <div data-revelar="" className={className} style={Object.keys(estilo).length ? (estilo as React.CSSProperties) : undefined}>
      {children}
    </div>
  );
}

// Grupo cuyos hijos aparecen escalonados: el script le da a cada hijo un
// retraso según su posición.
export function Stagger({
  children,
  className,
  escalon = 0.09,
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
