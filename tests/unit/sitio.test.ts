import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { describe, expect, it, vi } from "vitest";
import { contacto, faq, paginas, rutas } from "@/content/copy";
import {
  ldMigas,
  ldOrganizacion,
  ldPreguntas,
  ldServicio,
  ldSitioWeb,
  ldSobreNosotros,
  metadatosPagina,
  URL_SITIO,
} from "@/lib/sitio";
import { PUBLIC } from "../apoyo/proyecto";

// El layout importa las fuentes de Google, que solo existen dentro del build
// de Next. Aquí basta con que devuelvan algo con la misma forma.
vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "fuente-inter", className: "" }),
  Outfit: () => ({ variable: "fuente-outfit", className: "" }),
}));

const { metadata: metadatosLayout } = await import("@/app/layout");

type Clave = keyof typeof paginas;
const CLAVES = Object.keys(paginas) as Clave[];

// Lo que Next hace con el título de la página y la plantilla del layout.
function tituloFinal(titulo: Metadata["title"]) {
  const plantilla = (metadatosLayout.title as { template: string }).template;
  if (typeof titulo === "string") return plantilla.replace("%s", titulo);
  if (titulo && typeof titulo === "object" && "absolute" in titulo) return titulo.absolute;
  throw new Error(`Título con forma inesperada: ${JSON.stringify(titulo)}`);
}

// Next resuelve las URL relativas contra metadataBase.
const absoluta = (u: string | URL) => new URL(u, metadatosLayout.metadataBase ?? undefined).href;
const esperada = (ruta: string) => new URL(ruta, "https://daxlo.co").href;

// Ancho y alto de un PNG: vienen en la cabecera IHDR, bytes 16 a 23.
function medidasPng(archivo: string) {
  const b = fs.readFileSync(archivo);
  return { ancho: b.readUInt32BE(16), alto: b.readUInt32BE(20) };
}

describe("layout: valores por defecto", () => {
  it("apunta metadataBase a https://daxlo.co y usa la plantilla ' · Daxlo'", () => {
    expect(String(metadatosLayout.metadataBase)).toBe("https://daxlo.co/");
    expect(URL_SITIO).toBe("https://daxlo.co");
    expect(metadatosLayout.title).toEqual({ default: paginas.inicio.titulo, template: "%s · Daxlo" });
    expect(metadatosLayout.description).toBe(paginas.inicio.descripcion);
  });
});

describe("metadatosPagina", () => {
  it.each(CLAVES)("%s: título final, con ' · Daxlo' solo en las páginas internas", (clave) => {
    const m = metadatosPagina(clave);
    const titulo = tituloFinal(m.title);
    if (clave === "inicio") {
      // El inicio no pasa por la plantilla: su título ya empieza con Daxlo.
      expect(m.title).toEqual({ absolute: paginas.inicio.titulo });
      expect(titulo).toBe(paginas.inicio.titulo);
    } else {
      expect(m.title).toBe(paginas[clave].titulo);
      expect(titulo).toBe(`${paginas[clave].titulo} · Daxlo`);
    }
    // Buscador, Open Graph y X muestran el mismo título.
    expect(m.openGraph?.title).toBe(titulo);
    expect(m.twitter?.title).toBe(titulo);
  });

  it.each(CLAVES)("%s: descripción igual en buscador, Open Graph y X", (clave) => {
    const m = metadatosPagina(clave);
    expect(m.description).toBe(paginas[clave].descripcion);
    expect(m.openGraph?.description).toBe(paginas[clave].descripcion);
    expect(m.twitter?.description).toBe(paginas[clave].descripcion);
  });

  it.each(CLAVES)("%s: canónica y og:url apuntan a https://daxlo.co + su ruta", (clave) => {
    const m = metadatosPagina(clave);
    const canonica = m.alternates?.canonical;
    expect(typeof canonica).toBe("string");
    expect(absoluta(canonica as string)).toBe(esperada(rutas[clave]));
    const og = m.openGraph as { url?: string };
    expect(absoluta(og.url as string)).toBe(esperada(rutas[clave]));
  });

  it.each(CLAVES)("%s: Open Graph completo, con la imagen de 1200×630", (clave) => {
    const og = metadatosPagina(clave).openGraph as Record<string, unknown>;
    expect(og).toMatchObject({ type: "website", locale: "es_CO", siteName: "Daxlo" });
    const imagenes = og.images as { url: string; width: number; height: number; alt: string }[];
    expect(imagenes).toHaveLength(1);
    expect(imagenes[0]).toMatchObject({ url: "/og.png", width: 1200, height: 630 });
    expect(imagenes[0].alt.length).toBeGreaterThan(10);
    expect(absoluta(imagenes[0].url)).toBe("https://daxlo.co/og.png");
  });

  it.each(CLAVES)("%s: tarjeta grande para X con la misma imagen", (clave) => {
    const tw = metadatosPagina(clave).twitter as Record<string, unknown>;
    expect(tw.card).toBe("summary_large_image");
    expect(tw.images).toEqual(["/og.png"]);
  });

  it("cada página tiene título, descripción y canónica propios", () => {
    const todos = CLAVES.map((c) => metadatosPagina(c));
    const titulos = todos.map((m) => tituloFinal(m.title));
    const canonicas = todos.map((m) => absoluta(m.alternates?.canonical as string));
    expect(new Set(titulos).size).toBe(CLAVES.length);
    expect(new Set(todos.map((m) => m.description)).size).toBe(CLAVES.length);
    expect(new Set(canonicas).size).toBe(CLAVES.length);
  });

  it("la imagen para redes existe y mide lo que dicen los metadatos", () => {
    const archivo = path.join(PUBLIC, "og.png");
    expect(fs.existsSync(archivo)).toBe(true);
    expect(medidasPng(archivo)).toEqual({ ancho: 1200, alto: 630 });
  });
});

describe("datos estructurados (JSON-LD)", () => {
  const ID_ORG = "https://daxlo.co/#organizacion";

  it("Organization: identidad, fundadores, contacto y archivos que existen", () => {
    expect(ldOrganizacion).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": ID_ORG,
      name: "Daxlo",
      url: "https://daxlo.co",
      description: paginas.inicio.descripcion,
      areaServed: { "@type": "Country", name: "Colombia" },
    });
    expect(ldOrganizacion.founder.map((f) => f.name)).toEqual(["Martín Zárate", "Santiago Ospina"]);
    expect(ldOrganizacion.founder.every((f) => f["@type"] === "Person")).toBe(true);
    expect(ldOrganizacion.sameAs).toContain(contacto.instagram);
    expect(ldOrganizacion.contactPoint.url).toBe(contacto.whatsapp);
    // El logo y la imagen apuntan a archivos reales de public/.
    for (const url of [ldOrganizacion.logo, ldOrganizacion.image]) {
      expect(url.startsWith("https://daxlo.co/")).toBe(true);
      expect(fs.existsSync(path.join(PUBLIC, new URL(url).pathname))).toBe(true);
    }
  });

  it("WebSite: en español de Colombia y publicado por la organización", () => {
    expect(ldSitioWeb).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: "https://daxlo.co",
      inLanguage: "es-CO",
      publisher: { "@id": ldOrganizacion["@id"] },
    });
  });

  it.each(["coaching", "consultoria"] as const)("Service de %s: nombre, descripción y URL de su página", (clave) => {
    const s = ldServicio(clave);
    expect(s).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Service",
      name: paginas[clave].titulo,
      description: paginas[clave].descripcion,
      url: `https://daxlo.co${rutas[clave]}`,
      provider: { "@id": ID_ORG },
      areaServed: { "@type": "Country", name: "Colombia" },
    });
    expect(s.serviceType.length).toBeGreaterThan(10);
  });

  it("los dos servicios no se describen igual", () => {
    expect(ldServicio("coaching").serviceType).not.toBe(ldServicio("consultoria").serviceType);
  });

  const internas = CLAVES.filter((c): c is Exclude<Clave, "inicio"> => c !== "inicio");
  it.each(internas)("BreadcrumbList de %s: Inicio > página, con URL absolutas", (clave) => {
    const migas = ldMigas(clave, "Nombre visible");
    expect(migas["@type"]).toBe("BreadcrumbList");
    expect(migas.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://daxlo.co/" },
      { "@type": "ListItem", position: 2, name: "Nombre visible", item: `https://daxlo.co${rutas[clave]}` },
    ]);
  });

  it("FAQPage: una pregunta por cada pregunta de faq, con su respuesta exacta", () => {
    const todas = faq.grupos.flatMap((g) => g.preguntas);
    expect(ldPreguntas["@type"]).toBe("FAQPage");
    expect(ldPreguntas.mainEntity).toHaveLength(todas.length);
    expect(todas.length).toBeGreaterThan(0);
    ldPreguntas.mainEntity.forEach((q, i) => {
      expect(q).toEqual({ "@type": "Question", name: todas[i].p, acceptedAnswer: { "@type": "Answer", text: todas[i].r } });
    });
    expect(new Set(ldPreguntas.mainEntity.map((q) => q.name)).size).toBe(todas.length);
  });

  it("AboutPage de /nosotros apunta a su URL y a la organización", () => {
    expect(ldSobreNosotros).toMatchObject({
      "@type": "AboutPage",
      name: paginas.nosotros.titulo,
      url: "https://daxlo.co/nosotros",
      about: { "@id": ID_ORG },
    });
  });

  it("ninguna URL de los datos estructurados es relativa", () => {
    const bloques = [ldOrganizacion, ldSitioWeb, ldServicio("coaching"), ldServicio("consultoria"), ldPreguntas, ldSobreNosotros, ...internas.map((c) => ldMigas(c, c))];
    const urls: string[] = [];
    const recorrer = (v: unknown, clave = "") => {
      if (typeof v === "string" && ["url", "item", "logo", "image", "@id", "sameAs"].includes(clave)) urls.push(v);
      else if (Array.isArray(v)) v.forEach((x) => recorrer(x, clave));
      else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => recorrer(x, k));
    };
    bloques.forEach((b) => recorrer(b));
    expect(urls.length).toBeGreaterThan(10);
    for (const u of urls) expect(u, u).toMatch(/^https:\/\//);
  });
});
