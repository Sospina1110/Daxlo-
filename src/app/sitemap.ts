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
// deja de creerle a un lastmod que cambia en cada publicación.
// El 12 de noviembre de 2026 cambió el contenido de todas las páginas (el
// sitio rehecho en el sistema «Campo»), salvo el texto de la política de
// datos, que es del 11. Si esta pasada se publica otro día, se pone aquí la
// fecha de publicación.
const ultimoCambio: Record<keyof typeof rutas, string> = {
  inicio: "2026-11-12",
  coaching: "2026-11-12",
  consultoria: "2026-11-12",
  herramientas: "2026-11-12",
  nosotros: "2026-11-12",
  preguntas: "2026-11-12",
  agendar: "2026-11-12",
  privacidad: "2026-11-11",
};

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(rutas) as (keyof typeof rutas)[]).map((clave) => ({
    url: `${URL_SITIO}${rutas[clave] === "/" ? "/" : rutas[clave]}`,
    lastModified: ultimoCambio[clave],
    changeFrequency: "monthly",
    priority: prioridad[clave],
  }));
}
