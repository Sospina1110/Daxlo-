import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

// El botón del sistema «Campo» (campo.css, .boton): pequeño, de esquinas casi
// rectas. Claro sobre fondos oscuros y oscuro sobre fondos claros; dentro de
// la barra el color lo decide el tema de la barra. Las rutas del sitio van
// con Link (se precargan y abren sin recargar); lo demás, con <a>.
type Props = {
  href: string;
  children: React.ReactNode;
  variante?: "claro" | "oscuro";
  flecha?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function Boton({ href, children, variante = "claro", flecha = false, className, onClick }: Props) {
  const clases = cn("boton", variante === "oscuro" && "boton-oscuro", className);
  const interior = (
    <>
      {children}
      {flecha && <ArrowRight aria-hidden size={16} className="boton-flecha" />}
    </>
  );
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={clases} onClick={onClick}>
        {interior}
      </Link>
    );
  }
  return (
    <a href={href} className={clases} onClick={onClick} target="_blank" rel="noopener noreferrer">
      {interior}
    </a>
  );
}
