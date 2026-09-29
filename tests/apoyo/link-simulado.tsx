import type { AnchorHTMLAttributes, ReactNode } from "react";

// Reemplazo de next/link para jsdom: un <a> normal con el mismo href. Evita la
// navegación de verdad (jsdom no navega) pero deja correr el onClick del
// componente, que es lo que se prueba (por ejemplo, cerrar el menú).
type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string };
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  children?: ReactNode;
};

export default function LinkSimulado({ href, prefetch, replace, scroll, children, onClick, ...resto }: Props) {
  void prefetch;
  void replace;
  void scroll;
  const destino = typeof href === "string" ? href : (href.pathname ?? "");
  return (
    <a
      href={destino}
      {...resto}
      onClick={(e) => {
        onClick?.(e);
        e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}
