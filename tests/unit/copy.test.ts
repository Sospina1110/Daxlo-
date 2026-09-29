import { describe, expect, it } from "vitest";
import * as copy from "@/content/copy";
import { agendar, agendarCon, comparacion, consultoria, coaching, contacto, dosFormas, faq, footer, hero, herramientas, nav, paginas, preguntasLinea, rutas } from "@/content/copy";
import { toolLogos } from "@/lib/logos";

// Reglas que el texto del sitio tiene que cumplir siempre. Todo el texto vive
// en src/content/copy.ts: si alguien cambia una frase o un enlace, aquí se ve
// si rompió algo.

const RUTAS = Object.values(rutas) as string[];
type Clave = keyof typeof paginas;
const CLAVES = Object.keys(rutas) as Clave[];

// Todas las cadenas exportadas por copy.ts, con la ruta para ubicarlas.
function cadenas(valor: unknown, donde: string, salida: [string, string][] = []) {
  if (typeof valor === "string") salida.push([donde, valor]);
  else if (Array.isArray(valor)) valor.forEach((v, i) => cadenas(v, `${donde}[${i}]`, salida));
  else if (valor && typeof valor === "object") Object.entries(valor).forEach(([k, v]) => cadenas(v, `${donde}.${k}`, salida));
  return salida;
}
const TODAS = Object.entries(copy).flatMap(([nombre, valor]) => cadenas(valor, nombre));

// Ruta interna válida: una de `rutas`, con un ancla opcional.
function separar(href: string) {
  const [ruta, ancla] = href.split("#");
  return { ruta, ancla };
}

describe("voz de marca", () => {
  it("hay texto que revisar", () => {
    expect(TODAS.length).toBeGreaterThan(150);
  });

  it("no hay guiones largos (—) ni medios (–) en ninguna frase", () => {
    const conGuion = TODAS.filter(([, t]) => /[—–]/.test(t)).map(([d, t]) => `${d}: ${t}`);
    expect(conGuion).toEqual([]);
  });

  it("ninguna frase empieza o termina con espacios, ni tiene espacios dobles", () => {
    const mal = TODAS.filter(([, t]) => t !== t.trim() || / {2}/.test(t)).map(([d]) => d);
    expect(mal).toEqual([]);
  });

  it("toda pregunta frecuente abre y cierra con signos de interrogación", () => {
    for (const q of faq.grupos.flatMap((g) => g.preguntas)) {
      expect(q.p, q.p).toMatch(/^¿.+\?$/);
      expect(q.r.length, q.p).toBeGreaterThan(20);
    }
  });
});

describe("rutas y enlaces", () => {
  it("hay siete rutas, sin repetidas, todas absolutas", () => {
    expect(RUTAS).toHaveLength(7);
    expect(new Set(RUTAS).size).toBe(7);
    for (const r of RUTAS) expect(r).toMatch(/^\/[a-z]*$/);
    expect(rutas.inicio).toBe("/");
  });

  it("la barra tiene cinco enlaces a rutas del sitio y el botón va a /agendar", () => {
    expect(nav.links).toHaveLength(5);
    for (const l of nav.links) expect(RUTAS, l.href).toContain(l.href);
    expect(new Set(nav.links.map((l) => l.href)).size).toBe(5);
    expect(new Set(nav.links.map((l) => l.label)).size).toBe(5);
    expect(nav.cta.href).toBe(rutas.agendar);
  });

  it("desde la barra se llega a todas las rutas (enlaces + logo al inicio + botón Agendar)", () => {
    const alcanzables = new Set([...nav.links.map((l) => l.href), rutas.inicio, nav.cta.href]);
    expect([...alcanzables].sort()).toEqual([...RUTAS].sort());
  });

  it("cada enlace del pie apunta a una ruta del sitio, con un ancla válida si la lleva", () => {
    const enlaces = footer.columnas.flatMap((c) => c.enlaces);
    expect(enlaces.length).toBeGreaterThan(0);
    for (const e of enlaces) {
      const { ruta, ancla } = separar(e.h);
      expect(RUTAS, e.h).toContain(ruta);
      if (ancla !== undefined) expect(ancla, e.h).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it("el pie enlaza todas las páginas internas y las tres anclas de cada línea", () => {
    const hrefs = footer.columnas.flatMap((c) => c.enlaces.map((e) => e.h));
    for (const r of RUTAS.filter((r) => r !== "/")) expect(hrefs, r).toContain(r);
    expect(hrefs).toEqual(expect.arrayContaining(["/coaching#como-funciona", "/consultoria#como-trabajamos", "/consultoria#que-automatizamos"]));
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("agendarCon arma /agendar?linea=... con una opción que el formulario conoce", () => {
    const valores = agendar.campos.lineaOpciones.map((o) => o.valor);
    for (const linea of ["coaching", "consultoria"] as const) {
      expect(agendarCon(linea)).toBe(`/agendar?linea=${linea}`);
      expect(valores).toContain(linea);
    }
  });

  it("WhatsApp e Instagram son enlaces https válidos", () => {
    expect(contacto.whatsapp).toMatch(/^https:\/\/wa\.me\/57\d{10}$/);
    expect(contacto.instagram).toMatch(/^https:\/\/www\.instagram\.com\/[\w.]+\/$/);
    expect(contacto.correo).toMatch(/^[^\s@]+@daxlo\.co$/);
  });
});

describe("títulos y descripciones para buscadores", () => {
  it("paginas tiene exactamente una entrada por ruta", () => {
    expect(Object.keys(paginas).sort()).toEqual([...CLAVES].sort());
  });

  it.each(CLAVES)("%s: el título, con ' · Daxlo', cabe en 65 caracteres", (clave) => {
    const p = paginas[clave];
    const completo = clave === "inicio" ? p.titulo : `${p.titulo} · Daxlo`;
    expect(p.titulo.trim().length).toBeGreaterThan(0);
    expect(completo.length, completo).toBeLessThanOrEqual(65);
  });

  it("el título del inicio ya lleva la marca y los internos no la repiten", () => {
    expect(paginas.inicio.titulo.startsWith("Daxlo")).toBe(true);
    for (const c of CLAVES.filter((c) => c !== "inicio")) expect(paginas[c].titulo, c).not.toMatch(/Daxlo/);
  });

  it.each(CLAVES)("%s: la descripción tiene al menos 70 caracteres", (clave) => {
    const d = paginas[clave].descripcion;
    expect(d.length, d).toBeGreaterThanOrEqual(70);
  });

  // Por encima de ~170 caracteres Google corta la descripción con "...".
  for (const clave of CLAVES) {
    it(`${clave}: la descripción no pasa de 170 caracteres`, () => {
      const d = paginas[clave].descripcion;
      expect(d.length, d).toBeLessThanOrEqual(170);
    });
  }

  it("no hay dos páginas con el mismo título ni la misma descripción", () => {
    const p = Object.values(paginas);
    expect(new Set(p.map((x) => x.titulo)).size).toBe(p.length);
    expect(new Set(p.map((x) => x.descripcion)).size).toBe(p.length);
  });
});

describe("listas que el sitio pinta con key de React", () => {
  // Una frase repetida en estas listas produce keys duplicadas: React pierde o
  // duplica elementos al actualizar.
  const unicas = (nombre: string, lista: readonly string[]) =>
    it(`${nombre}: sin repetidos`, () => {
      expect(lista.length).toBeGreaterThan(0);
      expect(new Set(lista).size, lista.join(" | ")).toBe(lista.length);
    });

  unicas("hero.tareas (texto que se escribe)", hero.tareas);
  unicas("hero.historial", hero.historial);
  unicas("dosFormas.coaching.puntos", dosFormas.coaching.puntos);
  unicas("dosFormas.consultoria.puntos", dosFormas.consultoria.puntos);
  unicas("comparacion.filas (criterio)", comparacion.filas.map((f) => f.criterio));
  unicas("coaching.pasos", coaching.pasos.items.map((i) => i.titulo));
  unicas("coaching.problema", coaching.problema.tarjetas.map((t) => t.titulo));
  unicas("consultoria.problema", consultoria.problema.tarjetas.map((t) => t.titulo));
  unicas("consultoria.fases (número)", consultoria.fases.items.map((i) => i.numero));
  unicas("consultoria.automatizamos.procesos", consultoria.automatizamos.procesos);
  unicas("consultoria.automatizamos.nodos (id)", consultoria.automatizamos.nodos.map((n) => n.id));
  unicas("consultoria.porQue", consultoria.porQue.items.map((i) => i.titulo));
  unicas("faq (todas las preguntas)", faq.grupos.flatMap((g) => g.preguntas.map((q) => q.p)));
  unicas("herramientas.lista (id)", herramientas.lista.map((h) => h.id));
  unicas("agendar.campos.lineaOpciones (valor)", agendar.campos.lineaOpciones.map((o) => o.valor));
  unicas("footer (títulos de columna)", footer.columnas.map((c) => c.titulo));
});

describe("coherencia entre bloques", () => {
  it("cada herramienta de la lista tiene su logo", () => {
    for (const h of herramientas.lista) expect(Object.keys(toolLogos), h.id).toContain(h.id);
  });

  it("las preguntas de cada línea apuntan a su grupo de faq", () => {
    expect(faq.grupos[preguntasLinea.coaching.grupo].nombre).toMatch(/coaching/i);
    expect(faq.grupos[preguntasLinea.consultoria.grupo].nombre).toMatch(/consultor/i);
  });

  it("el formulario ofrece coaching, consultoría y 'todavía no sé'", () => {
    expect(agendar.campos.lineaOpciones.map((o) => o.valor)).toEqual(["coaching", "consultoria", "no_se"]);
  });

  it("todos los mensajes de error del formulario tienen texto", () => {
    for (const k of ["linea", "nombre", "whatsapp", "correo", "correoFormato", "general"] as const) {
      expect(agendar.errores[k].length, k).toBeGreaterThan(10);
    }
  });
});
