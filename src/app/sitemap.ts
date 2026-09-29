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
  herramientas: 0.7,
  preguntas: 0.7,
  nosotros: 0.6,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const hoy = new Date();
  return (Object.keys(rutas) as (keyof typeof rutas)[]).map((clave) => ({
    url: `${URL_SITIO}${rutas[clave] === "/" ? "/" : rutas[clave]}`,
    lastModified: hoy,
    changeFrequency: "monthly",
    priority: prioridad[clave],
  }));
}
