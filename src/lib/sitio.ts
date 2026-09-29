import type { Metadata } from "next";
import { contacto, faq, nosotros, paginas, rutas } from "@/content/copy";

// Datos del sitio para buscadores: metadatos de cada página y datos
// estructurados (schema.org) que Google lee para entender quién es Daxlo y qué
// ofrece.

export const URL_SITIO = "https://daxlo.co";

const IMAGEN_OG = { url: "/og.png", width: 1200, height: 630, alt: "Daxlo. Implementamos la IA. Transferimos la capacidad." };

type ClavePagina = keyof typeof paginas;

// Metadatos completos de una página. Next reemplaza (no combina) openGraph y
// twitter entre el layout y la página, así que cada página los lleva enteros.
export function metadatosPagina(clave: ClavePagina): Metadata {
  const p = paginas[clave];
  const ruta = rutas[clave];
  const esInicio = clave === "inicio";
  const tituloCompleto = esInicio ? p.titulo : `${p.titulo} · Daxlo`;
  return {
    title: esInicio ? { absolute: p.titulo } : p.titulo,
    description: p.descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      type: "website",
      locale: "es_CO",
      url: ruta,
      siteName: "Daxlo",
      title: tituloCompleto,
      description: p.descripcion,
      images: [IMAGEN_OG],
    },
    twitter: { card: "summary_large_image", title: tituloCompleto, description: p.descripcion, images: [IMAGEN_OG.url] },
  };
}

const ID_ORGANIZACION = `${URL_SITIO}/#organizacion`;

export const ldOrganizacion = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ID_ORGANIZACION,
  name: "Daxlo",
  url: URL_SITIO,
  logo: `${URL_SITIO}/apple-touch-icon.png`,
  image: `${URL_SITIO}/og.png`,
  description: paginas.inicio.descripcion,
  slogan: "Implementamos la IA. Transferimos la capacidad.",
  areaServed: { "@type": "Country", name: "Colombia" },
  founder: [
    { "@type": "Person", name: "Martín Zárate" },
    { "@type": "Person", name: "Santiago Ospina" },
  ],
  sameAs: [contacto.instagram],
  contactPoint: { "@type": "ContactPoint", contactType: "customer service", url: contacto.whatsapp, availableLanguage: "es" },
};

export const ldSitioWeb = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Daxlo",
  url: URL_SITIO,
  inLanguage: "es-CO",
  publisher: { "@id": ID_ORGANIZACION },
};

export function ldServicio(clave: "coaching" | "consultoria") {
  const p = paginas[clave];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.titulo,
    serviceType: clave === "coaching" ? "Coaching en inteligencia artificial" : "Consultoría de implementación de inteligencia artificial",
    description: p.descripcion,
    url: `${URL_SITIO}${rutas[clave]}`,
    provider: { "@id": ID_ORGANIZACION },
    areaServed: { "@type": "Country", name: "Colombia" },
    availableLanguage: "es",
  };
}

// Migas de pan: Inicio > página actual.
export function ldMigas(clave: Exclude<ClavePagina, "inicio">, nombre: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${URL_SITIO}/` },
      { "@type": "ListItem", position: 2, name: nombre, item: `${URL_SITIO}${rutas[clave]}` },
    ],
  };
}

// Todas las preguntas frecuentes, tal como se leen en /preguntas.
export const ldPreguntas = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.grupos.flatMap((g) =>
    g.preguntas.map((q) => ({ "@type": "Question", name: q.p, acceptedAnswer: { "@type": "Answer", text: q.r } })),
  ),
};

export const ldSobreNosotros = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: paginas.nosotros.titulo,
  description: nosotros.parrafos[0],
  url: `${URL_SITIO}${rutas.nosotros}`,
  about: { "@id": ID_ORGANIZACION },
};
