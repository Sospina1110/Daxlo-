import type { Metadata } from "next";
import Link from "next/link";
import { MarcaX } from "@/components/inicio/dibujos";
import { Boton } from "@/components/ui/boton";
import { nav } from "@/content/copy";

export const metadata: Metadata = { title: "Página no encontrada" };

// Página 404, en el sistema «Campo»: sobria. Next.js trae una por defecto,
// pero en inglés. Además del botón al inicio, ofrece las páginas principales
// para que nadie quede sin salida.
export default function NoEncontrada() {
  return (
    <div className="campo">
      <section aria-labelledby="titulo-pagina" data-tema="oscuro" className="cp-perdida">
        <div>
          <MarcaX className="cp-perdida-x" />
          <p className="cm-mono cm-corchete">Error 404</p>
          <h1 id="titulo-pagina" className="cm-titular cm-titular-l">
            Esta página no existe.
          </h1>
          <p className="cm-texto-l">Puede que el enlace esté mal escrito o que la página ya no esté.</p>
          <Boton href="/">Volver al inicio</Boton>
          <nav aria-label="Páginas del sitio">
            <ul>
              {nav.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </div>
  );
}
