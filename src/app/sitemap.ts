import type { MetadataRoute } from "next";
import { rutas } from "@/content/copy";
import { URL_SITIO } from "@/lib/sitio";

// Se genera como /sitemap.xml al compilar.
export const dynamic = "force-static";

const prioridad: Record<keyof typeof rutas, number> = {
  inicio: 1,
  coaching: 0.9,
  consultoria: 0.9,
  agendar: 0.8,
  privacidad: 0.3,
  herramientas: 0.7,
  preguntas: 0.7,
  nosotros: 0.6,
};

// Último cambio del contenido de cada página (AAAA-MM-DD). Se actualiza a mano
// cuando cambia el texto de esa página, y no con la fecha del build: Google
// deja de creerle a un lastmod que cambia en cada publicación. El cierre es
// compartido, así que un cambio ahí toca todas las páginas que lo muestran.
const ultimoCambio: Record<keyof typeof rutas, string> = {
  inicio: "2026-10-30",
  coaching: "2026-10-30",
  consultoria: "2026-10-30",
  herramientas: "2026-10-30",
  nosotros: "2026-10-30",
  preguntas: "2026-10-30",
  agendar: "2026-10-30",
  privacidad: "2026-10-26",
};

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(rutas) as (keyof typeof rutas)[]).map((clave) => ({
    url: `${URL_SITIO}${rutas[clave] === "/" ? "/" : rutas[clave]}`,
    lastModified: ultimoCambio[clave],
    changeFrequency: "monthly",
    priority: prioridad[clave],
  }));
}
