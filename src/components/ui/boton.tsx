import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

// El botón del sistema «Limpia» (limpia.css, .boton). Principal: mandarina con
// texto negro, uno por pantalla. Secundario: superficie gris. El texto usa
// Button-md, o Button-sm en la barra. Las rutas del sitio van con Link (se
// precargan y abren sin recargar); lo demás, con <a>.
type Props = {
  href: string;
  children: React.ReactNode;
  variante?: "principal" | "secundario";
  tamano?: "md" | "sm";
  flecha?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function Boton({ href, children, variante = "principal", tamano = "md", flecha = false, className, onClick }: Props) {
  const clases = cn(
    "boton",
    variante === "principal" ? "boton-principal-limpio" : "boton-secundario",
    tamano === "md" ? "button-md" : "button-sm",
    className,
  );
  const interior = (
    <>
      {children}
      {flecha && <ArrowRight aria-hidden size={tamano === "md" ? 18 : 16} weight="bold" className="boton-flecha" />}
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
