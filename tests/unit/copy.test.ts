import { describe, expect, it } from "vitest";
import * as copy from "@/content/copy";
import { agendar, agendarCon, cierre, consultoria, coaching, contacto, dosFormas, faq, footer, hero, herramientas, inicio, nav, nosotros, otraLinea, paginas, preguntasLinea, privacidad, rutas, servicios } from "@/content/copy";
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

  // Lista negra de la voz (voz-daxlo.md y el brief del sitio). Con \b para que
  // "reutilizar" o "potencia" dentro de otra palabra no cuenten.
  it("ninguna frase usa palabras o fórmulas vetadas", () => {
    const vetadas =
      /\b(utiliz|realiz|adquir|potenci|empoder|revolucion)\w*|implementación de soluciones|desbloquear el potencial|en la era de la ia|no se trata de|soluciones integrales|transformación digital|\batrás\b|ya es tarde|no te quedes fuera/i;
    const mal = TODAS.filter(([, t]) => vetadas.test(t)).map(([d, t]) => `${d}: ${t}`);
    expect(mal).toEqual([]);
  });

  // Frases que voz-daxlo.md da como referencia, y las que reconocen límites
  // ("te lo decimos", "no te cotizamos nada"): la regla de la voz que más
  // confianza genera. Se pueden acortar, no desaparecer: si un recorte o un
  // ajuste de SEO las toca, falla aquí.
  // Desde noviembre de 2026 (pedido de Santiago: páginas más cortas) cada
  // límite va donde se decide: en el primer paso de cada línea (la sesión de
  // coaching y el paso 01 de consultoría, la primera conversación), en la respuesta a
  // "¿quién lo va a operar?", en "No es para… si" y en el cierre. Bajo el
  // botón de la portada van datos, no el límite completo: repetido arriba y en
  // el cierre perdía fuerza. Lo largo (las 40 horas) pasó a las preguntas.
  const respuesta = (p: string) => faq.grupos.flatMap((g) => g.preguntas).find((q) => q.p === p)?.r ?? "";

  it("frases de referencia de la voz: el hero, la portada de coaching y los límites", () => {
    // Desde el 2026-11-12 (inicio «Campo») el hero dice qué pasa y a quién:
    // montar, y que la gente lo maneje.
    expect(hero.sub).toContain("Le enseñamos a tu equipo a manejarlos");
    expect(coaching.portada.sub).toContain("Traes un trabajo tuyo que hoy te toma horas y lo dejas funcionando antes de colgar");
    // Coaching: el límite en el primer paso, y quien trabaja con otros va a
    // la consultoría desde "No es para ti si".
    expect(coaching.sesion.pasos[0].texto).toMatch(/Si la IA no te sirve, te lo decimos ahí mismo/);
    expect(coaching.paraTi.noEs.items.at(-1)).toMatch(/^Lo hacen varias personas de tu equipo/);
    expect(otraLinea.consultoria.enlace).toMatch(/consultoría/);
    // Consultoría: bajo el botón, lo que cuesta empezar; el límite en el
    // primer paso, la pregunta que filtra y a quién no le servimos (con el
    // puente al coaching).
    expect(consultoria.portada.nota).toContain("Conversación y diagnóstico sin costo");
    expect(consultoria.recorrido.pasos[0].llevas).toMatch(/Un sí o un no/);
    expect(consultoria.paraQuien.respuesta).toMatch(/«ustedes lo manejan», ahí te decimos que no/);
    expect(consultoria.paraQuien.noEs.items.at(-1)).toMatch(/una sola persona/);
    expect(otraLinea.coaching.enlace).toMatch(/coaching/);
    // Las 40 horas son referencia, no filtro, y si no da no se propone nada.
    const noDa = respuesta("¿Y si mi proceso no da para un proyecto?");
    expect(noDa).toMatch(/te lo decimos en la primera conversación y no te proponemos un proyecto/i);
    expect(noDa).toMatch(/40 horas/);
    // Aliado (Santiago, 2026-11-03): el hero lo dice arriba y la portada de
    // consultoría lo cumple. Tu equipo opera cada proceso (sin dependencia) y
    // Daxlo sigue contigo con el siguiente; ya no se promete "salir".
    expect(hero.aliado).toBe("Tu aliado de IA");
    expect(consultoria.portada.sub).toMatch(/Tu equipo lo opera y seguimos contigo con el siguiente proceso\.$/);
    const todo = TODAS.map(([, t]) => t).join(" ");
    expect(todo).not.toMatch(/\bsalimos\b|salir es parte del contrato/i);
    // El diagnóstico no se cobra (Santiago, 2026-11-03), y se dice donde se
    // describe: bajo el botón, en el paso 02 y en lo que cuesta.
    expect(consultoria.recorrido.pasos[1].texto).toMatch(/^Sin costo\./);
    expect(respuesta("¿Cuánto cuesta una consultoría de IA?")).toMatch(/diagnóstico de una semana, sin costo/);
    // El cierre de todas las páginas.
    expect(cierre.sub).toMatch(/Si no te servimos, te lo decimos/);
  });

  // Las dos puertas del inicio y la pregunta de /preguntas#elegir dicen lo
  // mismo con las mismas palabras: quién hace el trabajo. Si se separan,
  // alguien que trabaja solo puede entrar por la puerta de la consultoría.
  it("las dos puertas del inicio y la pregunta para elegir usan la misma regla", () => {
    expect(dosFormas.coaching.regla).toMatch(/^Lo haces tú solo/);
    expect(dosFormas.consultoria.regla).toMatch(/^Lo hacen varias personas/);
    const elegir = respuesta("¿Te sirve el coaching o la consultoría de IA?");
    expect(elegir).toMatch(/lo haces tú solo.*es coaching/i);
    expect(elegir).toMatch(/lo hacen varias personas de tu equipo, es consultoría/i);
  });

  // Las herramientas no son la propuesta de valor (Santiago, 2026-11-03:
  // "Clases… con ChatGPT y Claude" no le agrega valor a nadie). Donde se dice
  // qué hacemos y cómo trabajamos (las puertas del inicio, los subtítulos de
  // las portadas, los titulares, las escenas y las filas de /consultoria y los
  // pasos de las dos líneas) no va ningún nombre de herramienta. Sí pueden ir
  // en /herramientas, en las preguntas, en los metadatos y en la maqueta de
  // la sesión.
  it("las herramientas no aparecen como propuesta de valor", () => {
    const escapar = (n: string) => n.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
    const nombres = [...herramientas.lista.map((h) => h.nombre), "Excel"].map(escapar);
    const marca = new RegExp(`\\b(${nombres.join("|")})\\b`, "i");
    const donde = [
      ...cadenas(dosFormas, "dosFormas"),
      ...cadenas(hero, "hero"),
      ...cadenas(inicio, "inicio"),
      ["coaching.portada.sub", coaching.portada.sub],
      ["coaching.sesion.titulo", coaching.sesion.titulo],
      ...cadenas(coaching.sesion.pasos, "coaching.sesion.pasos"),
      ["coaching.problema.titulo", coaching.problema.titulo],
      ["consultoria.portada.sub", consultoria.portada.sub],
      ...cadenas(consultoria.problema, "consultoria.problema"),
      ...cadenas(consultoria.cambios, "consultoria.cambios"),
      ...cadenas(consultoria.recorrido, "consultoria.recorrido"),
      ...cadenas(otraLinea, "otraLinea"),
    ] as [string, string][];
    // Que la lista revise lo que dice revisar: las dos puertas y los pasos.
    expect(donde.map(([d]) => d)).toEqual(expect.arrayContaining(["dosFormas.coaching.linea", "dosFormas.consultoria.linea", "consultoria.recorrido.pasos[2].texto", "coaching.sesion.pasos[1].texto"]));
    expect(marca.test("Tú le escribes a ChatGPT o a Claude")).toBe(true);
    const mal = donde.filter(([, t]) => marca.test(t)).map(([d, t]) => `${d}: ${t}`);
    expect(mal).toEqual([]);
  });

  // Sin cifras de precio ni medios de pago (se hablan en la propuesta,
  // Santiago 2026-11-03), ni el "plan B manual", que no tiene fuente.
  it("sin precios, medios de pago ni promesas sin fuente", () => {
    const todo = TODAS.map(([, t]) => t).join(" ");
    expect(todo).not.toMatch(/\$\s?\d|\bCOP\b|\bnequi\b|\bdaviplata\b|\bllave\b|\btarjeta\b|\btransferencia\b|plan b/i);
  });

  it("toda pregunta frecuente abre y cierra con signos de interrogación", () => {
    for (const q of faq.grupos.flatMap((g) => g.preguntas)) {
      expect(q.p, q.p).toMatch(/^¿.+\?$/);
      expect(q.r.length, q.p).toBeGreaterThan(20);
    }
  });
});

describe("rutas y enlaces", () => {
  it("hay ocho rutas, sin repetidas, todas absolutas", () => {
    expect(RUTAS).toHaveLength(8);
    expect(new Set(RUTAS).size).toBe(8);
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

  it("desde la barra se llega a todas las rutas salvo la política de datos, que va en el pie", () => {
    const alcanzables = new Set([...nav.links.map((l) => l.href), rutas.inicio, nav.cta.href]);
    expect([...alcanzables].sort()).toEqual(RUTAS.filter((r) => r !== rutas.privacidad).sort());
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
    for (const r of RUTAS.filter((r) => r !== "/" && r !== rutas.privacidad)) expect(hrefs, r).toContain(r);
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

  // Por encima de ~60 caracteres Google corta el título en el resultado.
  it.each(CLAVES)("%s: el título, con ' · Daxlo', cabe en 60 caracteres", (clave) => {
    const p = paginas[clave];
    const completo = clave === "inicio" ? p.titulo : `${p.titulo} · Daxlo`;
    expect(p.titulo.trim().length).toBeGreaterThan(0);
    expect(completo.length, completo).toBeLessThanOrEqual(60);
  });

  // El inicio empieza por lo que se busca y termina con la marca, igual que las
  // internas (que la reciben de la plantilla del layout).
  it("el título del inicio termina con ' · Daxlo' y los internos no repiten la marca", () => {
    expect(paginas.inicio.titulo.endsWith(" · Daxlo")).toBe(true);
    expect(paginas.inicio.titulo.match(/Daxlo/g)).toHaveLength(1);
    for (const c of CLAVES.filter((c) => c !== "inicio")) expect(paginas[c].titulo, c).not.toMatch(/Daxlo/);
  });

  it.each(CLAVES)("%s: la descripción tiene al menos 70 caracteres", (clave) => {
    const d = paginas[clave].descripcion;
    expect(d.length, d).toBeGreaterThanOrEqual(70);
  });

  // Por encima de ~155 caracteres Google corta la descripción con "...".
  for (const clave of CLAVES) {
    it(`${clave}: la descripción no pasa de 155 caracteres`, () => {
      const d = paginas[clave].descripcion;
      expect(d.length, d).toBeLessThanOrEqual(155);
    });
  }

  // El eyebrow de cada portada nombra el servicio con "IA" (servicios.*).
  // Desde octubre de 2026 (pedido de SEO de Santiago), "inteligencia artificial"
  // también va escrita completa donde se lee: en los subtítulos de las
  // portadas de /coaching y /consultoria y en dosFormas.sub. Siempre en una
  // frase natural, una vez por bloque y sin repetirla. Además sigue en los
  // metadatos y en los datos estructurados (src/lib/sitio.ts). Las frases de
  // referencia de la voz están arriba.
  it("las portadas nombran el servicio con 'IA' y dicen 'inteligencia artificial' una vez", () => {
    expect(coaching.portada.eyebrow).toBe(servicios.coaching);
    expect(consultoria.portada.eyebrow).toBe(servicios.consultoria);
    for (const s of Object.values(servicios)) expect(s).toMatch(/\bIA\b/);
    for (const sub of [coaching.portada.sub, consultoria.portada.sub, dosFormas.sub]) {
      expect(sub.match(/inteligencia artificial/gi), sub).toHaveLength(1);
    }
  });

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

  unicas("hero.titulo", hero.titulo);
  unicas("hero.rotulos.notas (clave)", hero.rotulos.notas.map((n) => n.clave));
  unicas("inicio.areas.tarjetas (área)", inicio.areas.tarjetas.map((t) => t.area));
  unicas("inicio.escena.tiempos", inicio.escena.tiempos);
  unicas("inicio.principios.lista", inicio.principios.lista);
  unicas("inicio.equipo.filas (título)", inicio.equipo.filas.map((f) => f.titulo));
  unicas("inicio.sistema.capas (id)", inicio.sistema.capas.map((c) => c.id));
  unicas("las tres puertas (etiqueta)", [dosFormas.coaching.etiqueta, dosFormas.equipo.etiqueta, dosFormas.consultoria.etiqueta]);
  unicas("nosotros.reglas (título)", nosotros.reglas.lista.map((r) => r.titulo));
  unicas("coaching.llevas (título)", coaching.llevas.lista.map((l) => l.titulo));
  unicas("consultoria.despues (título)", consultoria.despues.lista.map((l) => l.titulo));
  unicas("consultoria.recorrido.pasos (etapa)", consultoria.recorrido.pasos.map((p) => p.etapa));
  unicas("coaching.portada.nota", coaching.portada.nota);
  unicas("coaching.problema.escenas", coaching.problema.escenas);
  unicas("coaching.sesion.pasos (número)", coaching.sesion.pasos.map((p) => p.numero));
  unicas("coaching.sesion.ventana.mensajes", coaching.sesion.ventana.mensajes.map((m) => m.texto));
  unicas("coaching.paraTi.es", coaching.paraTi.es.items);
  unicas("coaching.paraTi.noEs", coaching.paraTi.noEs.items);
  unicas("consultoria.problema.escenas", consultoria.problema.escenas.map((e) => e.titulo));
  unicas("consultoria.cambios.filas (después)", consultoria.cambios.filas.map((c) => c.despues));
  unicas("consultoria.portada.nota", consultoria.portada.nota);
  unicas("consultoria.recorrido.pasos (número)", consultoria.recorrido.pasos.map((p) => p.numero));
  unicas("consultoria.paraQuien.noEs", consultoria.paraQuien.noEs.items);
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
    expect(faq.grupos[preguntasLinea.coaching.grupo].nombre).toBe(servicios.coaching);
    expect(faq.grupos[preguntasLinea.consultoria.grupo].nombre).toBe(servicios.consultoria);
  });

  it("los enlaces dentro de las respuestas van a rutas del sitio", () => {
    const enlaces = faq.grupos.flatMap((g) => g.preguntas).flatMap((q) => (q.enlace ? [q.enlace] : []));
    expect(enlaces.length).toBeGreaterThan(0);
    for (const e of enlaces) {
      expect(RUTAS, e.h).toContain(separar(e.h).ruta);
      expect(e.t.length).toBeGreaterThan(5);
    }
  });

  // Desde el 2026-11-11 (Santiago) salió la parte de los socios. Con nombre
  // aparece una sola persona, el fundador: en la última línea de "Cómo
  // trabajamos" y donde la ley pide decir quién responde por los datos. El
  // país sigue a la vista en el cuerpo ("en Colombia").
  it("con nombre aparece solo el fundador, y solo donde toca", () => {
    const FUNDADOR = "Santiago Ospina";
    expect(nosotros.fundador).toContain(FUNDADOR);
    expect(nosotros.fundador).toMatch(/Colombia/);
    const conNombre = TODAS.filter(([, t]) => t.includes(FUNDADOR)).map(([d]) => d);
    expect(conNombre.sort()).toEqual(["agendar.campos.aviso", "nosotros.fundador", "privacidad.responsable.nombre"]);
    expect(privacidad.responsable.nombre).toContain(FUNDADOR);
    // Nadie más: ni "socios" ni "los dos" en lo que se lee.
    const todo = TODAS.map(([, t]) => t).join(" ");
    expect(todo).not.toMatch(/\bsocios?\b|estamos los dos/i);
    expect(nosotros.sub).toMatch(/Colombia/);
  });

  // Pedido de Santiago (2026-11-12), ahora en todo el sitio: ninguna página
  // habla de cotizaciones, de facturas ni del informe del viernes, ni como
  // ejemplo ni de pasada. Se revisa todo el texto de copy.ts; lo que sale en
  // el HTML de cada página lo revisa tests/integracion/salida-build.test.ts.
  it("ningún texto del sitio habla de cotizaciones, facturas ni del informe del viernes", () => {
    const mal = TODAS.filter(([, t]) => /cotiz|factur|viernes/i.test(t)).map(([d, t]) => `${d}: ${t}`);
    expect(mal).toEqual([]);
    // Que la vigilancia vigile: las formas que se colaron antes.
    for (const frase of ["las cotizaciones", "no te cotizamos nada", "facturas de proveedores", "El informe del viernes", "Facturación"]) {
      expect(/cotiz|factur|viernes/i.test(frase), frase).toBe(true);
    }
  });

  // Lo que falta que confirme Santiago no se publica: ni un dato marcado
  // como faltante ni la frecuencia de trabajo con el equipo. «Cada semana»
  // solo puede decir cómo es el proceso del cliente ("se repite igual cada
  // semana"), nunca cada cuánto nos reunimos.
  it("nada marcado como dato faltante, y sin frecuencia de trabajo sin confirmar", () => {
    const todo = TODAS.map(([, t]) => t).join(" ");
    expect(todo).not.toMatch(/DATO FALTANTE/i);
    const semanas = todo.match(/.{0,22}cada semana/gi) ?? [];
    expect(semanas.filter((s) => !/se repite igual cada semana$/i.test(s))).toEqual([]);
  });

  // El inicio «Campo» (2026-11-12): poco texto, sobre el armazón que eligió
  // Santiago. Lo que agrega `inicio`, pieza por pieza.
  it("el inicio: siete áreas, tres tiempos, tres principios, tres filas y seis capas", () => {
    // El carrusel: una tarjeta por área, bajo el rótulo fijo "Ejemplos".
    expect(inicio.areas.tarjetas).toHaveLength(7);
    expect(inicio.areas.etiqueta).toBe("Ejemplos");
    for (const t of inicio.areas.tarjetas) expect(t.linea.split(" ").length, t.area).toBeLessThanOrEqual(14);
    // La escena: el primer tiempo es el titular de /consultoria, literal, y
    // un agente se explica una vez, en el segundo.
    expect(inicio.escena.tiempos).toHaveLength(3);
    expect(inicio.escena.tiempos[0]).toBe(consultoria.problema.titulo);
    expect(inicio.escena.tiempos[1]).toMatch(/^Un agente hace la tarea completa/);
    expect(inicio.escena.cierre).toMatch(/seguimos ahí/);
    // La frase de la casa.
    expect(inicio.frase).toBe("Si no puedes operarlo sin nosotros, no terminamos.");
    expect(inicio.principios.lista).toHaveLength(3);
    expect(inicio.equipo.filas).toHaveLength(3);
    // Las seis capas, y las anclas del pie que llevan a ellas.
    expect(inicio.sistema.capas).toHaveLength(6);
    const anclas = footer.columnas[0].enlaces.map((e) => separar(e.h));
    for (const a of anclas) {
      expect(a.ruta).toBe(rutas.inicio);
      expect(inicio.sistema.capas.map((c) => `capa-${c.id}`), a.ancla).toContain(a.ancla);
    }
    // "Nativa" y "ecosistema" van una sola vez en todo el sitio (el
    // ecosistema, como nombre del panel); "sistemas agénticos" no se dice.
    const todo = TODAS.map(([, t]) => t).join(" ");
    expect(todo.match(/\bnativ[ao]s?\b/gi)).toHaveLength(1);
    expect(todo.match(/ecosistema/gi)).toHaveLength(1);
    expect(inicio.sistema.nombre).toMatch(/ecosistema/i);
    expect(todo).not.toMatch(/agéntic/i);
  });

  // El eslogan salió del hero (2026-11-12): es la última línea del pie, y
  // sigue en el título de la pestaña y en los datos para buscadores
  // (src/lib/sitio.ts).
  it("el hero dice qué pasa y a quién, y el eslogan cierra el pie", () => {
    expect(hero.titulo).toEqual(["Montamos la IA dentro de tu empresa.", "Tu gente la maneja."]);
    expect(hero.titulo.join(" ")).not.toMatch(/Implementamos|Transferimos/);
    expect(footer.lema).toBe("Implementamos la IA. Transferimos la capacidad.");
    // Los rótulos sobre la fotografía son ejemplos, sin cifras.
    expect(hero.rotulos.etiqueta).toBe("Ejemplo");
    expect(cadenas(hero.rotulos, "rotulos").filter(([, t]) => /\d/.test(t))).toEqual([]);
  });

  // Pedido de Santiago (2026-11-12): en el inicio, la barra y el pie nadie
  // habla de cotizaciones, de facturas ni del informe del viernes. Tampoco
  // hay cifras: no hay ninguna medida que se pueda publicar.
  it("lo que pinta el inicio no habla de cotizaciones, facturas ni del informe del viernes, y no trae cifras", () => {
    const pintado = [
      ...cadenas(inicio, "inicio"),
      ...cadenas(hero, "hero"),
      ...cadenas(dosFormas, "dosFormas"),
      ...cadenas(cierre, "cierre"),
      ...cadenas(footer, "footer"),
      ...cadenas(nav, "nav"),
    ];
    expect(pintado.filter(([, t]) => /cotiza|factura|viernes/i.test(t)).map(([d, t]) => `${d}: ${t}`)).toEqual([]);
    const conCifra = pintado.filter(([d, t]) => /\d/.test(t) && !/\.(href|h)$/.test(d) && !/1 a 1|© 2026/.test(t));
    expect(conCifra.map(([d, t]) => `${d}: ${t}`)).toEqual([]);
  });

  // Las tres puertas del inicio. «Seguimos contigo» no es puerta: la
  // operación después de la entrega nunca es un llamado a la acción.
  it("las puertas del inicio son tres: para ti, para tu gente y para tu empresa", () => {
    expect(Object.keys(dosFormas).filter((k) => typeof (dosFormas as Record<string, unknown>)[k] === "object")).toEqual(["coaching", "equipo", "consultoria"]);
    expect([dosFormas.coaching.etiqueta, dosFormas.equipo.etiqueta, dosFormas.consultoria.etiqueta]).toEqual(["Para ti", "Para tu gente", "Para tu empresa"]);
    expect(dosFormas.coaching.titulo).toBe(servicios.coaching);
    expect(dosFormas.consultoria.titulo).toBe(servicios.consultoria);
    expect(cadenas(dosFormas, "dosFormas").filter(([, t]) => /seguimos contigo/i.test(t))).toEqual([]);
  });

  // La skill landing-page-design pide texto sin guiones (B1). Se revisa lo que
  // el inicio pinta: su copy propio y los bloques que toma prestados.
  it("lo que pinta el inicio no lleva guiones", () => {
    const pintado = [
      ...cadenas(inicio, "inicio"),
      ...cadenas(hero, "hero"),
      ...cadenas(dosFormas, "dosFormas"),
      ...cadenas(cierre, "cierre"),
      ...cadenas(footer.columnas, "footer.columnas"),
      ...cadenas(nav, "nav"),
    ].filter(([d]) => !/\.(href|h|id)$/.test(d));
    expect(pintado.filter(([, t]) => /-/.test(t)).map(([d, t]) => `${d}: ${t}`)).toEqual([]);
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
