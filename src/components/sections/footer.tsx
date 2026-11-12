import Link from "next/link";
import { InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { CorreoContacto } from "@/components/ui/correo-contacto";
import { MarcaX } from "@/components/inicio/dibujos";
import { contacto, footer, herramientas, rutas } from "@/content/copy";

// El pie del sistema «Campo»: medianoche, a todo el ancho. Arriba, cuatro
// columnas de enlaces con el título en mono; debajo, una franja entre
// corchetes con los derechos, la X y el contacto; y como última línea del
// sitio, el eslogan en letra gigante, una frase por renglón. Al final, la
// letra chica: la política de datos y el aviso de marcas.
// En celular las columnas van de a dos.
export function Footer() {
  const f = footer;
  const frases = f.lema.split(/(?<=\.)\s+/);
  return (
    <footer data-tema="oscuro" className="cm-pie">
      <div className="cm-pie-columnas">
        {f.columnas.map((col) => (
          <nav key={col.titulo} aria-label={col.titulo}>
            <p className="cm-mono cm-pie-titulo">{col.titulo}</p>
            <ul className="mt-5">
              {col.enlaces.map((e) => (
                <li key={e.h}>
                  <Link href={e.h} className="cm-pie-enlace">
                    {e.t}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="cm-pie-franja">
        <p className="cm-mono">{f.derechos}</p>
        <Link href="/" aria-label="Daxlo, ir al inicio" className="cm-pie-enlace max-md:hidden">
          <MarcaX className="h-5 w-auto" />
        </Link>
        <ul aria-label={f.contacto} className="flex flex-wrap items-center gap-x-6">
          <li>
            <a href={contacto.whatsapp} target="_blank" rel="noopener" className="cm-pie-enlace cm-mono">
              <WhatsappLogo aria-hidden size={16} /> WhatsApp
            </a>
          </li>
          <li>
            <CorreoContacto className="cm-pie-enlace cm-mono" />
          </li>
          <li>
            <a href={contacto.instagram} target="_blank" rel="noopener" className="cm-pie-enlace cm-mono">
              <InstagramLogo aria-hidden size={16} /> Instagram
            </a>
          </li>
        </ul>
      </div>

      <p className="cm-titular cm-pie-lema">
        {frases.map((frase) => (
          <span key={frase}>{frase} </span>
        ))}
      </p>

      <div className="cm-pie-aviso">
        <Link href={rutas.privacidad} className="cm-pie-enlace cm-pie-politica">
          {f.privacidad}
        </Link>
        <p className="mt-1 max-w-[110ch]">{herramientas.aviso}</p>
      </div>
    </footer>
  );
}
