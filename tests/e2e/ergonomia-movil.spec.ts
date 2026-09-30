import { hero, nav } from "../../src/content/copy";
import { bordeBarra, caja, esperarHidratacion, expect, irA, quieto, recorrer, RUTAS, test, type Page } from "./apoyo";

// Lo que hace que el sitio se pueda usar con el pulgar: áreas táctiles de al
// menos 44×44 px (la guía de Apple), campos de 16 px o más (con menos, Safari
// en iPhone hace zoom al tocar el campo y deja la página corrida), letra
// legible y anclas que no quedan tapadas por la barra fija.

const MIN_TACTIL = 44;

test.describe("ergonomía en celular", () => {
  test.skip(({ isMobile }) => !isMobile, "solo aplica en los proyectos de celular");

  async function medirTactil(page: Page, nombre: string, elemento: ReturnType<Page["locator"]>) {
    await elemento.scrollIntoViewIfNeeded();
    const b = await caja(elemento);
    expect.soft(b.width, `${nombre}: ancho ${b.width}`).toBeGreaterThanOrEqual(MIN_TACTIL);
    expect.soft(b.height, `${nombre}: alto ${b.height}`).toBeGreaterThanOrEqual(MIN_TACTIL);
  }

  test("botón del menú, botón principal del hero y enlaces del menú abierto: al menos 44×44", async ({ page }) => {
    await irA(page, "/");
    const barra = page.getByRole("navigation", { name: "Principal" });
    const hamburguesa = barra.getByRole("button", { name: "Abrir menú" });
    await expect(hamburguesa).toBeVisible();
    await medirTactil(page, "botón del menú", hamburguesa);
    await medirTactil(page, "botón del hero", page.locator("#top").getByRole("link", { name: hero.cta }));

    await hamburguesa.tap();
    const menu = page.locator("#menu-movil");
    await expect(menu).toBeVisible();
    for (const l of nav.links) await medirTactil(page, `menú: ${l.label}`, menu.getByRole("link", { name: l.label, exact: true }));
    await medirTactil(page, "menú: Agendar una conversación", menu.getByRole("link", { name: "Agendar una conversación" }));
  });

  // Medía 42 px de alto (GlowButton tamano="sm" sin alto mínimo) hasta el
  // commit 148d9cf, que le puso min-h-[44px].
  test("el botón Agendar de la barra mide al menos 44×44", async ({ page }) => {
    await irA(page, "/");
    const cta = page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: nav.cta.label, exact: true });
    await medirTactil(page, "botón Agendar de la barra", cta);
    // También con la barra compacta (al bajar por la página).
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
    await expect.poll(() => cta.evaluate((a) => a.getBoundingClientRect().height)).toBeGreaterThanOrEqual(MIN_TACTIL);
  });

  test("cada pregunta frecuente y el botón de WhatsApp de la ayuda se pueden tocar con el pulgar (al menos 44×44)", async ({ page }) => {
    await irA(page, "/preguntas");
    const botones = page.locator("main button[aria-controls]");
    const n = await botones.count();
    expect(n).toBeGreaterThan(5);
    for (let i = 0; i < n; i++) await medirTactil(page, `pregunta ${i + 1}`, botones.nth(i));
    await medirTactil(page, "Escribir por WhatsApp", page.locator("main").getByRole("link", { name: /Escribir por WhatsApp/ }));
  });

  test("los enlaces del pie (páginas y contacto) miden al menos 44 px de alto", async ({ page }) => {
    await irA(page, "/");
    // Los enlaces de las listas del pie: nueve páginas y tres de contacto.
    const enlaces = page.locator("footer li > a");
    const n = await enlaces.count();
    expect(n).toBe(12);
    for (let i = 0; i < n; i++) {
      const enlace = enlaces.nth(i);
      const nombre = (await enlace.getAttribute("aria-label")) ?? (await enlace.innerText()).trim();
      await enlace.scrollIntoViewIfNeeded();
      const b = await caja(enlace);
      expect.soft(b.height, `pie: ${nombre} mide ${b.height} de alto`).toBeGreaterThanOrEqual(MIN_TACTIL);
      // Y ninguno se sale de la pantalla (el correo no cabía en 320 px).
      const ancho = page.viewportSize()?.width ?? 0;
      expect.soft(b.x + b.width, `pie: ${nombre} se sale por la derecha`).toBeLessThanOrEqual(ancho + 1);
    }
  });

  test("formulario: botón de enviar de 44 px o más y campos con letra de 16 px o más (sin zoom en iPhone)", async ({ page }) => {
    await irA(page, "/agendar");
    await medirTactil(page, "enviar", page.getByRole("button", { name: /Agendar la conversación/ }));
    const campos = await page.locator("form").evaluate((form) =>
      [...form.querySelectorAll("input, select, textarea")]
        // La trampa para bots no se ve ni recibe foco.
        .filter((el) => !el.closest("[aria-hidden='true']"))
        .map((el) => ({ nombre: el.getAttribute("name"), letra: parseFloat(getComputedStyle(el).fontSize), alto: el.getBoundingClientRect().height })),
    );
    // La casilla de autorización y la versión de la política (oculta) no son
    // campos de texto: la casilla se mide aparte, con su etiqueta como área táctil.
    expect(campos.map((c) => c.nombre)).toEqual(["linea", "nombre", "whatsapp", "correo", "empresa", "interes", "autorizacion", "politica_version", "marketing"]);
    for (const id of ["autoriza", "marketing"]) {
      const alto = await page.locator(`label[for='${id}']`).evaluate((l) => l.getBoundingClientRect().height);
      expect(alto, `alto de la etiqueta de la casilla ${id}`).toBeGreaterThanOrEqual(MIN_TACTIL);
    }
    for (const c of campos.filter((x) => !["autorizacion", "politica_version", "marketing"].includes(x.nombre ?? ""))) {
      expect.soft(c.letra, `${c.nombre}: letra de ${c.letra}px`).toBeGreaterThanOrEqual(16);
      expect.soft(c.alto, `${c.nombre}: alto de ${c.alto}px`).toBeGreaterThanOrEqual(MIN_TACTIL);
    }
  });

  test("el selector '¿Qué te interesa?' se ve como los demás campos y su flecha no tapa el texto ni el toque", async ({ page }) => {
    await irA(page, "/agendar");
    const select = page.locator("select#linea");
    // A la vista y ya aparecido: mientras su bloque sigue oculto, WebKit
    // informa el fondo del select como transparente.
    await quieto(select);
    await expect
      .poll(() => select.evaluate((s) => getComputedStyle(s).backgroundColor === getComputedStyle(document.getElementById("nombre") as Element).backgroundColor))
      .toBe(true);
    const datos = await select.evaluate((s) => {
      const cs = getComputedStyle(s);
      const flecha = s.parentElement?.querySelector("svg") as SVGElement | null;
      const nombre = document.getElementById("nombre") as HTMLInputElement;
      return {
        apariencia: cs.appearance || cs.getPropertyValue("-webkit-appearance"),
        fondo: cs.backgroundColor,
        fondoNombre: getComputedStyle(nombre).backgroundColor,
        rellenoDerecho: parseFloat(cs.paddingRight),
        flecha: flecha ? { eventos: getComputedStyle(flecha).pointerEvents, oculta: flecha.getAttribute("aria-hidden"), derecha: flecha.getBoundingClientRect().right, izquierda: flecha.getBoundingClientRect().left } : null,
        caja: s.getBoundingClientRect().right,
      };
    });
    // Sin la apariencia nativa (en Safari salía gris), con el mismo fondo que los otros campos.
    expect(datos.apariencia).toBe("none");
    expect(datos.fondo).toBe(datos.fondoNombre);
    // La flecha propia es decorativa, deja pasar el toque y queda dentro del campo, sobre el relleno derecho.
    expect(datos.flecha).not.toBeNull();
    expect(datos.flecha?.eventos).toBe("none");
    expect(datos.flecha?.oculta).toBe("true");
    expect(datos.flecha!.derecha).toBeLessThanOrEqual(datos.caja);
    expect(datos.caja - datos.flecha!.izquierda).toBeLessThanOrEqual(datos.rellenoDerecho);
    // Y el select sigue funcionando con su apariencia propia.
    await select.selectOption("coaching");
    await expect(select).toHaveValue("coaching");
  });

  for (const ruta of RUTAS) {
    test(`${ruta}: ningún texto visible mide menos de 11 px`, async ({ page }) => {
      await irA(page, ruta);
      await recorrer(page);
      const chicos = await page.evaluate(() => {
        const salida: string[] = [];
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const vistos = new Set<Element>();
        while (w.nextNode()) {
          const el = w.currentNode.parentElement;
          const texto = (w.currentNode.textContent ?? "").trim();
          if (!texto || !el || vistos.has(el)) continue;
          vistos.add(el);
          if (el.closest("script, style, noscript, .sr-only, [role=region][inert]")) continue;
          if (el.getClientRects().length === 0 || getComputedStyle(el).visibility === "hidden") continue;
          const px = parseFloat(getComputedStyle(el).fontSize);
          if (px < 11) salida.push(`${texto.slice(0, 40)} (${px}px)`);
        }
        return salida;
      });
      expect(chicos).toEqual([]);
    });
  }

  // Al llegar por un enlace con ancla, la sección tiene que quedar arriba pero
  // con su titular debajo de la barra fija (scroll-padding-top en globals.css).
  const ANCLAS = [
    { ruta: "/coaching", id: "como-funciona", enlacePie: "Cómo funciona" },
    { ruta: "/consultoria", id: "que-automatizamos", enlacePie: "Qué automatizamos" },
  ];

  async function titularBajoLaBarra(page: Page, id: string) {
    const seccion = page.locator(`#${id}`);
    const titular = seccion.locator("h2").first();
    await expect(titular).toBeVisible();
    // Llegó a la sección: su borde superior queda cerca del tope de la pantalla.
    await expect.poll(() => seccion.evaluate((s) => Math.round(s.getBoundingClientRect().top)), { message: "la sección no quedó arriba" }).toBeGreaterThanOrEqual(0);
    await expect.poll(() => seccion.evaluate((s) => Math.round(s.getBoundingClientRect().top))).toBeLessThanOrEqual(160);
    const barra = await bordeBarra(page);
    const arribaTitular = await titular.evaluate((h) => h.getBoundingClientRect().top);
    expect(arribaTitular, `el titular empieza en ${arribaTitular} y la barra termina en ${barra}`).toBeGreaterThanOrEqual(barra);
    // La sección entera (con la etiqueta que va sobre el titular) arranca
    // debajo de la barra: eso es lo que hace scroll-padding-top.
    const arribaSeccion = await seccion.evaluate((s) => s.getBoundingClientRect().top);
    expect(arribaSeccion, `la sección empieza en ${arribaSeccion}, bajo la barra que termina en ${barra}`).toBeGreaterThanOrEqual(barra - 1);
  }

  for (const a of ANCLAS) {
    test(`abrir ${a.ruta}#${a.id} directo deja el titular de la sección a la vista, bajo la barra`, async ({ page }) => {
      await page.goto(`${a.ruta}#${a.id}`);
      await esperarHidratacion(page);
      await titularBajoLaBarra(page, a.id);
    });

    test(`el enlace del pie '${a.enlacePie}' lleva a la sección con el titular bajo la barra`, async ({ page }) => {
      await irA(page, "/");
      await page.locator("footer").getByRole("link", { name: a.enlacePie }).tap();
      await expect(page).toHaveURL(`${a.ruta}#${a.id}`);
      await titularBajoLaBarra(page, a.id);
    });
  }
});
