import Link from "next/link";
import { InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { CorreoContacto } from "@/components/ui/correo-contacto";
import { contacto, footer, herramientas, rutas } from "@/content/copy";

// El pie del sistema «Limpia»: plano, sobre el negro de la página. Arriba, el
// logo y las columnas de enlaces; abajo, una línea fina y la letra chica: los
// derechos, la política de datos y el aviso de marcas. Sin eslogan gigante ni
// efectos: el pie cierra, no compite con el cierre.
// En celular las columnas de enlaces van de a dos.
export function Footer() {
  const f = footer;
  return (
    <footer className="bg-fondo pb-8 pt-16 md:pt-24">
      <div className="contenedor">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" aria-label="Daxlo, ir al inicio" className="pie-enlace">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/daxlo-logo-claro.png" alt="Daxlo" width={110} height={28} className="h-7 w-auto" loading="lazy" />
            </Link>
            <p className="body-6 mt-4 max-w-[28ch] text-texto-2">{f.lema}</p>
          </div>
          {f.columnas.map((col) => (
            <nav key={col.titulo} aria-label={col.titulo} className="lg:col-span-2">
              <p className="caption-4 rotulo-tecnico text-texto-2">{col.titulo}</p>
              <ul className="mt-4">
                {col.enlaces.map((e) => (
                  <li key={e.h}>
                    <Link href={e.h} className="pie-enlace body-6">
                      {e.t}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <p className="caption-4 rotulo-tecnico text-texto-2">Contacto</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 sm:block">
              <li>
                <a href={contacto.whatsapp} target="_blank" rel="noopener" className="pie-enlace body-6">
                  <WhatsappLogo aria-hidden size={16} /> WhatsApp
                </a>
              </li>
              <li>
                <CorreoContacto className="pie-enlace body-6" />
              </li>
              <li>
                <a href={contacto.instagram} target="_blank" rel="noopener" className="pie-enlace body-6">
                  <InstagramLogo aria-hidden size={16} /> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <span aria-hidden className="regla mt-16" />
        <div className="mt-6 flex flex-col gap-3 text-texto-2">
          <div className="caption-5 flex flex-wrap items-center gap-x-6">
            <p>{f.derechos}</p>
            <Link href={rutas.privacidad} className="pie-enlace caption-5 underline decoration-capa-4 underline-offset-4">
              {f.privacidad}
            </Link>
          </div>
          <p className="caption-5 max-w-[96ch]">{herramientas.aviso}</p>
        </div>
      </div>
    </footer>
  );
}
