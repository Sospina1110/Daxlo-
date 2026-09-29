// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { agendar, faq, nav, paginas, rutas } from "@/content/copy";
import { OUT } from "../apoyo/proyecto";

// Revisa el sitio tal como sale del build (out/): lo que publica Cloudflare y
// lo que leen los buscadores. Necesita un `npm run build` antes.

const HAY_BUILD = fs.existsSync(path.join(OUT, "index.html"));
if (!HAY_BUILD) {
  console.warn("\n[salida-build] Se omiten las pruebas del build: no existe out/index.html. Corre `npm run build` primero.\n");
}

type Clave = keyof typeof rutas;
const CLAVES = Object.keys(rutas) as Clave[];
const SITIO = "https://daxlo.co";

// Tipos de schema.org que cada página debe declarar, ni más ni menos.
const TIPOS_LD: Record<Clave, string[]> = {
  inicio: ["Organization", "WebSite"],
  coaching: ["Organization", "Service", "BreadcrumbList"],
  consultoria: ["Organization", "Service", "BreadcrumbList"],
  herramientas: ["Organization", "BreadcrumbList"],
  nosotros: ["Organization", "AboutPage", "BreadcrumbList"],
  preguntas: ["Organization", "FAQPage", "BreadcrumbList"],
  agendar: ["Organization", "BreadcrumbList"],
};

// Archivo de out/ que Cloudflare sirve para una ruta: / → index.html, /x → x.html.
function archivoDe(ruta: string) {
  const limpia = ruta.replace(/\/$/, "");
  return path.join(OUT, limpia === "" ? "index.html" : `${limpia.slice(1)}.html`);
}

const cache = new Map<string, Document>();
function documento(archivo: string) {
  if (!cache.has(archivo)) cache.set(archivo, new JSDOM(fs.readFileSync(archivo, "utf8")).window.document);
  return cache.get(archivo) as Document;
}
const pagina = (clave: Clave) => documento(archivoDe(rutas[clave]));
const ARCHIVO_404 = path.join(OUT, "404.html");

// Todos los bloques JSON-LD de un documento, con los arreglos aplanados.
function datosEstructurados(doc: Document) {
  return [...doc.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => {
    const datos = JSON.parse(s.textContent ?? "");
    return (Array.isArray(datos) ? datos : [datos]) as Record<string, unknown>[];
  });
}

const meta = (doc: Document, selector: string) => doc.querySelector(selector)?.getAttribute("content") ?? null;
const normal = (u: string) => new URL(u).href;
const tituloEsperado = (clave: Clave) => (clave === "inicio" ? paginas.inicio.titulo : `${paginas[clave].titulo} · Daxlo`);

// Texto que ve la persona: sin scripts ni estilos.
function textoVisible(doc: Document) {
  const copia = doc.body.cloneNode(true) as HTMLElement;
  copia.querySelectorAll("script, style, noscript, template").forEach((n) => n.remove());
  return copia.textContent ?? "";
}

const TODOS_LOS_HTML = HAY_BUILD ? [...CLAVES.map((c) => archivoDe(rutas[c])), ARCHIVO_404] : [];

describe.skipIf(!HAY_BUILD)(HAY_BUILD ? "salida del build (out/)" : "salida del build: OMITIDA, falta out/ (corre npm run build)", () => {
  describe.each(CLAVES)("página %s", (clave) => {
    it("existe y está en español de Colombia, con viewport para celular que permite zoom", () => {
      const doc = pagina(clave);
      expect(doc.documentElement.getAttribute("lang")).toBe("es-CO");
      const vp = meta(doc, 'meta[name="viewport"]') ?? "";
      expect(vp).toContain("width=device-width");
      expect(vp).toContain("initial-scale=1");
      // Bloquear el zoom es una barrera de accesibilidad.
      expect(vp).not.toMatch(/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/);
      expect(doc.querySelector('meta[charset], meta[charSet]')).not.toBeNull();
    });

    it("tiene exactamente un h1, con texto", () => {
      const h1s = pagina(clave).querySelectorAll("h1");
      expect(h1s).toHaveLength(1);
      expect(h1s[0].textContent?.trim().length).toBeGreaterThan(5);
    });

    it("título, descripción, canónica y og:url correctos", () => {
      const doc = pagina(clave);
      expect(doc.title).toBe(tituloEsperado(clave));
      if (clave !== "inicio") expect(doc.title.endsWith(" · Daxlo")).toBe(true);
      expect(meta(doc, 'meta[name="description"]')).toBe(paginas[clave].descripcion);
      const canonica = doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
      expect(normal(canonica)).toBe(normal(`${SITIO}${rutas[clave]}`));
      expect(normal(meta(doc, 'meta[property="og:url"]') ?? "")).toBe(normal(canonica));
      expect(meta(doc, 'meta[property="og:title"]')).toBe(doc.title);
      expect(meta(doc, 'meta[property="og:description"]')).toBe(paginas[clave].descripcion);
      expect(meta(doc, 'meta[property="og:image"]')).toBe(`${SITIO}/og.png`);
      expect(meta(doc, 'meta[property="og:locale"]')).toBe("es_CO");
      expect(meta(doc, 'meta[name="twitter:card"]')).toBe("summary_large_image");
      expect(meta(doc, 'meta[name="twitter:title"]')).toBe(doc.title);
      // Una página real nunca pide no ser indexada.
      expect(doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "").not.toMatch(/noindex/);
    });

    it("cada bloque JSON-LD se lee y la página declara justo los tipos que le tocan", () => {
      const datos = datosEstructurados(pagina(clave));
      for (const d of datos) expect(d["@context"]).toBe("https://schema.org");
      expect(datos.map((d) => d["@type"]).sort()).toEqual([...TIPOS_LD[clave]].sort());
    });

    if (clave !== "inicio") {
      it("las migas visibles y el BreadcrumbList dicen lo mismo, y el último paso es la canónica", () => {
        const doc = pagina(clave);
        const migas = doc.querySelector('nav[aria-label="Migas de pan"]');
        expect(migas).not.toBeNull();
        expect(migas?.querySelector('a[href="/"]')?.textContent?.trim()).toBe("Inicio");
        const actual = migas?.querySelector('[aria-current="page"]')?.textContent?.trim();
        const lista = datosEstructurados(doc).find((d) => d["@type"] === "BreadcrumbList") as { itemListElement: { name: string; item: string }[] };
        expect(lista.itemListElement.map((i) => i.name)).toEqual(["Inicio", actual]);
        expect(normal(lista.itemListElement[1].item)).toBe(normal(doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? ""));
      });
    }
  });

  it("los títulos, descripciones y canónicas no se repiten entre páginas", () => {
    const docs = CLAVES.map(pagina);
    const titulos = docs.map((d) => d.title);
    expect(titulos.every((t) => t.trim().length > 0)).toBe(true);
    expect(new Set(titulos).size).toBe(CLAVES.length);
    expect(new Set(docs.map((d) => meta(d, 'meta[name="description"]'))).size).toBe(CLAVES.length);
    expect(new Set(docs.map((d) => d.querySelector('link[rel="canonical"]')?.getAttribute("href"))).size).toBe(CLAVES.length);
  });

  it("FAQPage de /preguntas: tantas preguntas como en faq y como botones en la página, con el mismo texto", () => {
    const doc = pagina("preguntas");
    const ld = datosEstructurados(doc).find((d) => d["@type"] === "FAQPage") as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    const todas = faq.grupos.flatMap((g) => g.preguntas);
    expect(ld.mainEntity).toHaveLength(todas.length);
    const botones = [...doc.querySelectorAll("main button[aria-controls]")].map((b) => b.textContent?.trim());
    expect(botones).toEqual(todas.map((q) => q.p));
    expect(ld.mainEntity.map((q) => q.name)).toEqual(botones);
    // Cada respuesta del JSON-LD está en el HTML (dentro de su panel).
    const texto = textoVisible(doc);
    for (const q of ld.mainEntity) expect(texto).toContain(q.acceptedAnswer.text);
  });

  it("Service de /coaching y /consultoria nombra el servicio con el título de la página", () => {
    for (const clave of ["coaching", "consultoria"] as const) {
      const s = datosEstructurados(pagina(clave)).find((d) => d["@type"] === "Service") as { name: string; url: string };
      expect(s.name).toBe(paginas[clave].titulo);
      expect(s.url).toBe(`${SITIO}${rutas[clave]}`);
    }
  });

  it("la 404 existe, no se indexa y ofrece salida al inicio y a las cinco páginas de la barra", () => {
    expect(fs.existsSync(ARCHIVO_404)).toBe(true);
    const doc = documento(ARCHIVO_404);
    expect(doc.title).toBe("Página no encontrada · Daxlo");
    expect(meta(doc, 'meta[name="robots"]')).toMatch(/noindex/);
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
    expect(doc.querySelector("h1")?.textContent).toBe("Esta página no existe.");
    expect([...doc.querySelectorAll("main a")].some((a) => a.getAttribute("href") === "/" && /Volver al inicio/.test(a.textContent ?? ""))).toBe(true);
    const sitio = doc.querySelector('nav[aria-label="Páginas del sitio"]');
    expect([...(sitio?.querySelectorAll("a") ?? [])].map((a) => a.getAttribute("href"))).toEqual(nav.links.map((l) => l.href));
  });

  describe("enlaces", () => {
    it.each(TODOS_LOS_HTML.map((a) => [path.basename(a), a]))("%s: cada enlace interno lleva a una página que existe, y cada ancla a un id que existe", (_n, archivo) => {
      const doc = documento(archivo);
      const rotos: string[] = [];
      const enlaces = [...doc.querySelectorAll("a[href]")].map((a) => a.getAttribute("href") as string);
      expect(enlaces.length).toBeGreaterThan(5);
      for (const href of enlaces) {
        if (/undefined|null|localhost|127\.0\.0\.1/.test(href)) rotos.push(`${href} (valor sospechoso)`);
        if (href.startsWith("#")) {
          if (!doc.getElementById(href.slice(1))) rotos.push(`${href} (no hay id en la misma página)`);
          continue;
        }
        if (!href.startsWith("/") || href.startsWith("//")) continue;
        const url = new URL(href, SITIO);
        const destino = archivoDe(url.pathname);
        if (!fs.existsSync(destino)) {
          rotos.push(`${href} (no existe ${path.relative(OUT, destino)})`);
          continue;
        }
        if (url.hash && !documento(destino).getElementById(decodeURIComponent(url.hash.slice(1)))) rotos.push(`${href} (no hay #${url.hash.slice(1)} en el destino)`);
        // El único parámetro que usa el sitio es ?linea= en /agendar, con un valor que el formulario conoce.
        if (url.search) {
          const valores = agendar.campos.lineaOpciones.map((o) => o.valor);
          const linea = url.searchParams.get("linea");
          if (url.pathname !== rutas.agendar || !linea || !valores.includes(linea) || [...url.searchParams.keys()].length !== 1) rotos.push(`${href} (parámetro inesperado)`);
        }
      }
      expect(rotos).toEqual([]);
    });

    it.each(TODOS_LOS_HTML.map((a) => [path.basename(a), a]))("%s: los enlaces externos son https y los que abren pestaña llevan noopener", (_n, archivo) => {
      const doc = documento(archivo);
      for (const a of doc.querySelectorAll("a[href]")) {
        const href = a.getAttribute("href") as string;
        if (href.startsWith("/") || href.startsWith("#")) continue;
        expect(href, href).toMatch(/^(https:\/\/|mailto:)/);
        if (a.getAttribute("target") === "_blank") expect(a.getAttribute("rel") ?? "", href).toMatch(/noopener/);
      }
    });

    it.each(TODOS_LOS_HTML.map((a) => [path.basename(a), a]))("%s: el enlace 'Saltar al contenido' es el primero y apunta a <main id=contenido>", (_n, archivo) => {
      const doc = documento(archivo);
      const primero = doc.body.querySelector("a");
      expect(primero?.textContent?.trim()).toBe("Saltar al contenido");
      expect(primero?.getAttribute("href")).toBe("#contenido");
      expect(doc.getElementById("contenido")?.tagName).toBe("MAIN");
    });

    it("los enlaces del pie están en todas las páginas", () => {
      const esperados = ["/coaching", "/coaching#como-funciona", "/herramientas", "/consultoria", "/consultoria#como-trabajamos", "/consultoria#que-automatizamos", "/nosotros", "/preguntas", "/agendar"];
      for (const archivo of TODOS_LOS_HTML) {
        const pie = documento(archivo).querySelector("footer");
        const hrefs = [...(pie?.querySelectorAll("a") ?? [])].map((a) => a.getAttribute("href"));
        expect(hrefs, path.basename(archivo)).toEqual(expect.arrayContaining(esperados));
      }
    });
  });

  describe("imágenes", () => {
    it.each(TODOS_LOS_HTML.map((a) => [path.basename(a), a]))("%s: toda <img> tiene alt, vacío solo si es decorativa, y su archivo existe", (_n, archivo) => {
      const doc = documento(archivo);
      const imgs = [...doc.querySelectorAll("img")];
      expect(imgs.length).toBeGreaterThan(0);
      for (const img of imgs) {
        const src = img.getAttribute("src") ?? "";
        expect(img.hasAttribute("alt"), src).toBe(true);
        const decorativa = img.closest('[aria-hidden="true"]') !== null || ["presentation", "none"].includes(img.getAttribute("role") ?? "");
        if ((img.getAttribute("alt") ?? "").trim() === "") expect(decorativa, `${src} con alt vacío fuera de un bloque decorativo`).toBe(true);
        if (src.startsWith("/")) expect(fs.existsSync(path.join(OUT, decodeURIComponent(new URL(src, SITIO).pathname))), src).toBe(true);
      }
    });
  });

  it.each(TODOS_LOS_HTML.map((a) => [path.basename(a), a]))("%s: el texto visible no tiene guiones largos ni medios", (_n, archivo) => {
    const texto = textoVisible(documento(archivo));
    expect(texto.match(/.{0,30}[—–].{0,30}/g) ?? []).toEqual([]);
  });

  describe("scripts en línea del layout", () => {
    const VIEJAS: Record<string, string> = {
      "#coaching": "/coaching",
      "#coaching-pasos": "/coaching#como-funciona",
      "#consultoria": "/consultoria",
      "#consultoria-fases": "/consultoria#como-trabajamos",
      "#automatizamos": "/consultoria#que-automatizamos",
      "#herramientas": "/herramientas",
      "#preguntas": "/preguntas",
      "#agendar": "/agendar",
    };

    it("el script de la cabecera lleva la tabla completa de anclas viejas y corre antes de pintar", () => {
      const doc = pagina("inicio");
      const script = [...doc.head.querySelectorAll("script:not([src])")].find((s) => s.textContent?.includes("location.replace"));
      expect(script, "no hay script de redirección en <head>").toBeDefined();
      const tabla = JSON.parse(script?.textContent?.match(/\{[^{}]*"#[^{}]*\}/)?.[0] ?? "{}");
      expect(tabla).toEqual(VIEJAS);
      // Solo redirige desde la raíz.
      expect(script?.textContent).toContain("location.pathname==='/'");
    });

    it("cada destino de la tabla de anclas viejas existe (página e id)", () => {
      for (const destino of Object.values(VIEJAS)) {
        const url = new URL(destino, SITIO);
        const archivo = archivoDe(url.pathname);
        expect(fs.existsSync(archivo), destino).toBe(true);
        if (url.hash) expect(documento(archivo).getElementById(url.hash.slice(1)), destino).not.toBeNull();
      }
    });

    it("todas las clases animate-* que usa el HTML están en la lista que el script pausa fuera de pantalla", () => {
      const script = [...pagina("inicio").body.querySelectorAll("script:not([src])")].find((s) => s.textContent?.includes("data-pausa"));
      expect(script, "no hay script de apariciones al final de <body>").toBeDefined();
      const pausables = new Set(script?.textContent?.match(/\.animate-[a-z-]+/g)?.map((s) => s.slice(1)));
      const usadas = new Set<string>();
      for (const archivo of TODOS_LOS_HTML) {
        for (const el of documento(archivo).querySelectorAll("[class*='animate-']")) {
          for (const c of el.classList) if (c.startsWith("animate-")) usadas.add(c);
        }
      }
      expect(usadas.size).toBeGreaterThan(3);
      expect([...usadas].filter((c) => !pausables.has(c))).toEqual([]);
    });
  });

  describe("CSS compilado", () => {
    const css = HAY_BUILD
      ? fs
          .readdirSync(path.join(OUT, "_next/static"), { recursive: true, encoding: "utf8" })
          .filter((f) => f.endsWith(".css"))
          .map((f) => fs.readFileSync(path.join(OUT, "_next/static", f), "utf8"))
          .join("\n")
      : "";

    it("pausa de verdad lo marcado con [data-pausa]", () => {
      expect(css.replace(/\s/g, "")).toContain("[data-pausa]{animation-play-state:paused!important}");
    });

    it("con 'reducir movimiento' apaga todas las animaciones infinitas y las entradas", () => {
      const bloques = [...css.matchAll(/@media \(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?\})\s*\}/g)].map((m) => m[1]).join("\n");
      const regla = bloques.match(/([^{}]*)\{animation:none!important\}/)?.[1] ?? "";
      for (const clase of ["animate-marquee", "animate-marquee-reverse", "animate-float", "animate-flow", "animate-breathe", "animate-paseo", "animate-ping", "animate-caret", "entrada", "subir", "fundir"]) {
        expect(regla.split(",").map((s) => s.trim()), clase).toContain(`.${clase}`);
      }
    });

    it("en celular (< 768 px) no corren las líneas punteadas ni el respirar de los haces", () => {
      const bloque = css.match(/@media \(max-width:\s*767px\)\s*\{([^@]*?)\}\s*\}/)?.[1] ?? "";
      expect(bloque).toMatch(/\.animate-flow,\s*\.animate-breathe\s*\{animation:none/);
    });
  });

  describe("sitemap.xml y robots.txt", () => {
    it("el sitemap lista exactamente las siete rutas, con https://daxlo.co", () => {
      const xml = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      expect(locs.sort()).toEqual(CLAVES.map((c) => `${SITIO}${rutas[c]}`).sort());
      for (const m of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) expect(Number.isNaN(Date.parse(m[1]))).toBe(false);
    });

    it("robots.txt deja pasar a todos y apunta al sitemap", () => {
      const txt = fs.readFileSync(path.join(OUT, "robots.txt"), "utf8");
      const lineas = txt.split(/\r?\n/).map((l) => l.trim());
      expect(lineas).toContain("User-Agent: *");
      expect(lineas).toContain("Allow: /");
      expect(lineas).toContain(`Sitemap: ${SITIO}/sitemap.xml`);
      expect(lineas.filter((l) => /^Disallow:\s*\/\s*$/i.test(l))).toEqual([]);
    });
  });

  describe("precarga de páginas (scripts/precarga-segmentos.mjs)", () => {
    it.each(CLAVES.filter((c) => c !== "inicio"))("%s: existe la copia aplanada que pide el navegador, idéntica a la original", (clave) => {
      const nombre = rutas[clave].slice(1);
      const original = path.join(OUT, nombre, `__next.${nombre}`, "__PAGE__.txt");
      const aplanada = path.join(OUT, nombre, `__next.${nombre}.__PAGE__.txt`);
      expect(fs.existsSync(original), original).toBe(true);
      expect(fs.existsSync(aplanada), aplanada).toBe(true);
      expect(fs.readFileSync(aplanada, "utf8")).toBe(fs.readFileSync(original, "utf8"));
    });

    it("inicio: el segmento de la raíz existe", () => {
      expect(fs.existsSync(path.join(OUT, "__next.__PAGE__.txt"))).toBe(true);
    });
  });
});
