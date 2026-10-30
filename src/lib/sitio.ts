import type { Metadata } from "next";
import { contacto, faq, nosotros, paginas, privacidad, rutas, servicios } from "@/content/copy";

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
const ID_SITIO = `${URL_SITIO}/#sitio`;

type Linea = "coaching" | "consultoria";

// Cada servicio tiene un @id fijo: la organización los enlaza desde todas las
// páginas y el bloque completo vive en la página de cada línea.
export const idServicio = (clave: Linea) => `${URL_SITIO}${rutas[clave]}#servicio`;

// Lo que el sitio dice de los dos socios: egresados de Administración del CESA.
const CESA = { "@type": "CollegeOrUniversity", name: "Colegio de Estudios Superiores de Administración", alternateName: "CESA" };

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
  knowsLanguage: "es",
  knowsAbout: ["Inteligencia artificial", "Automatización de procesos con inteligencia artificial", "Extracción de datos de PDF", "Claude", "ChatGPT", "n8n"],
  // Los dos socios van juntos, siempre en este orden.
  founder: [
    { "@type": "Person", name: "Martín Zárate", jobTitle: "Socio fundador", alumniOf: CESA },
    { "@type": "Person", name: "Santiago Ospina", jobTitle: "Socio fundador", alumniOf: CESA },
  ],
  // [DATO FALTANTE: la página de empresa en LinkedIn (hoy con la URL
  // /company/https-daxlo.co-) y la confirmación de que la cuenta de TikTok
  // @daxlo.co es de Daxlo. Se suman aquí cuando Santiago lo confirme.]
  sameAs: [contacto.instagram],
  // El mismo WhatsApp que publica la política de datos.
  telephone: privacidad.responsable.whatsapp,
  contactPoint: { "@type": "ContactPoint", contactType: "customer service", url: contacto.whatsapp, availableLanguage: "es" },
  // Sin precio: no hay uno publicado.
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de Daxlo",
    itemListElement: (["coaching", "consultoria"] as const).map((clave) => ({ "@type": "Offer", itemOffered: { "@id": idServicio(clave) } })),
  },
};

export const ldSitioWeb = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": ID_SITIO,
  name: "Daxlo",
  alternateName: "daxlo.co",
  url: URL_SITIO,
  inLanguage: "es-CO",
  publisher: { "@id": ID_ORGANIZACION },
};

// A quién le sirve cada línea, con las palabras del propio sitio.
const AUDIENCIA = {
  coaching: { "@type": "Audience", audienceType: "Personas que quieren resolver su propio trabajo con inteligencia artificial" },
  consultoria: { "@type": "BusinessAudience", audienceType: "Empresas con un proceso que repiten varias personas" },
};

// El nombre es el del servicio (`servicios` en copy.ts), no el título de la
// página: el título se ajusta para buscadores y el servicio sigue siendo el
// mismo. Es el mismo texto de la portada y de las migas.
export function ldServicio(clave: Linea) {
  const p = paginas[clave];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": idServicio(clave),
    name: servicios[clave],
    serviceType: clave === "coaching" ? "Coaching en inteligencia artificial" : "Consultoría de implementación de inteligencia artificial",
    category: "Inteligencia artificial",
    description: p.descripcion,
    url: `${URL_SITIO}${rutas[clave]}`,
    provider: { "@id": ID_ORGANIZACION },
    areaServed: { "@type": "Country", name: "Colombia" },
    audience: AUDIENCIA[clave],
    availableChannel: { "@type": "ServiceChannel", serviceUrl: `${URL_SITIO}${rutas.agendar}`, availableLanguage: "es" },
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
  mainEntity: { "@id": ID_ORGANIZACION },
};
