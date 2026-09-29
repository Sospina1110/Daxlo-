import { footer, hero, nav, otraLinea, rutas } from "../../src/content/copy";
import { esperarArriba, esperarEnAncla, esperarHidratacion, expect, H1, irA, irAlFinal, marcarDocumento, posicion, quieto, RUTAS_INTERNAS, tocar, test, type Page, vigilarScroll } from "./apoyo";

// Moverse por el sitio: barra (escritorio y celular), logo, pie, migas de pan,
// los enlaces viejos del sitio de una sola página y la 404. Cada navegación
// sale desde el fondo de la página y la nueva tiene que abrir arriba (o en su
// ancla).

const barraDe = (page: Page) => page.getByRole("navigation", { name: "Principal" });
const menuDe = (page: Page) => page.locator("#menu-movil");
const botonMenu = (page: Page) => barraDe(page).getByRole("button", { name: /menú/ });
const overflowHtml = (page: Page) => page.evaluate(() => document.documentElement.style.overflow);

// Opacidad de un color CSS calculado, en cualquier sintaxis: rgba(r, g, b, a)
// o la de barra, oklab(l a b / a), color(srgb r g b / a). Sin alfa, es 1.
function alfaDe(color: string) {
  const coma = color.match(/^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/);
  if (coma) return parseFloat(coma[1]);
  const barra = color.match(/\/\s*([\d.]+)(%?)\s*\)$/);
  if (barra) return parseFloat(barra[1]) / (barra[2] ? 100 : 1);
  return color === "transparent" ? 0 : 1;
}

test.describe("barra en celular", () => {
  test.skip(({ isMobile }) => !isMobile, "el menú hamburguesa es solo para pantallas angostas");

  test("se ve el botón del menú y no la lista de escritorio", async ({ page }) => {
    await irA(page, "/");
    await expect(barraDe(page).getByRole("button", { name: "Abrir menú" })).toBeVisible();
    await expect(barraDe(page).locator("ul")).toBeHidden();
  });

  test("el menú abre opaco, marca la página actual, cabe en la pantalla, bloquea el scroll y cierra con el botón y con Escape", async ({ page }) => {
    await irA(page, "/consultoria");
    const boton = botonMenu(page);
    const menu = menuDe(page);
    await expect(boton).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveCount(0);

    await boton.tap();
    await expect(boton).toHaveAttribute("aria-expanded", "true");
    await expect(boton).toHaveAccessibleName("Cerrar menú");
    await expect(menu).toBeVisible();
    for (const l of nav.links) {
      const enlace = menu.getByRole("link", { name: l.label, exact: true });
      await expect(enlace).toBeVisible();
      await expect(enlace).toHaveAttribute("href", l.href);
    }
    await expect(menu.getByRole("link", { name: "Agendar una conversación" })).toBeVisible();
    await expect(menu.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(menu.getByRole("link", { name: "Consultoría", exact: true })).toHaveAttribute("aria-current", "page");

    // El panel es opaco: lo de atrás no se transparenta bajo los enlaces.
    const fondoPanel = await menu.evaluate((m) => getComputedStyle(m).backgroundColor);
    expect(alfaDe(fondoPanel), `fondo del panel: ${fondoPanel}`).toBe(1);
    // El último elemento del menú queda dentro de la pantalla.
    const alto = page.viewportSize()?.height ?? 0;
    expect(await menu.evaluate((m) => m.getBoundingClientRect().bottom)).toBeLessThanOrEqual(alto);
    // La página de atrás no se desplaza mientras el menú está abierto.
    expect(await overflowHtml(page)).toBe("hidden");

    await boton.tap();
    await expect(boton).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveCount(0);
    expect(await overflowHtml(page)).toBe("");

    await boton.tap();
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(boton).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveCount(0);
    expect(await overflowHtml(page)).toBe("");
  });

  test("tocar fuera del panel cierra el menú y no activa lo que hay debajo", async ({ page }) => {
    await irA(page, "/coaching");
    // El puente a la consultoría es una tarjeta-enlace grande: se deja en la
    // franja de abajo de la pantalla, la que el panel del menú no tapa.
    const puente = page.getByRole("link", { name: new RegExp(otraLinea.consultoria.enlace) });
    await quieto(puente);
    await puente.evaluate((a) => {
      const r = a.getBoundingClientRect();
      window.scrollTo({ top: scrollY + r.top - innerHeight + 40, behavior: "instant" });
    });
    const antes = await posicion(page);

    await botonMenu(page).tap();
    await expect(menuDe(page)).toBeVisible();
    const punto = await page.evaluate(() => ({ x: Math.round(innerWidth / 2), y: innerHeight - 15 }));
    // Debajo del punto, tapado por el fondo del menú, está el enlace a /consultoria.
    const debajo = await page.evaluate(({ x, y }) => {
      const pila = document.elementsFromPoint(x, y);
      const panel = document.getElementById("menu-movil") as HTMLElement;
      return { enPanel: pila.some((e) => panel.contains(e)), enlace: pila.map((e) => e.closest("a")?.getAttribute("href")).find(Boolean) ?? null, primero: pila[0]?.getAttribute("aria-hidden") };
    }, punto);
    expect(debajo.enPanel, "el punto elegido cae dentro del panel").toBe(false);
    expect(debajo.enlace).toBe("/consultoria");
    expect(debajo.primero, "lo primero bajo el dedo es el fondo decorativo del menú").toBe("true");

    await page.touchscreen.tap(punto.x, punto.y);
    await expect(botonMenu(page)).toHaveAttribute("aria-expanded", "false");
    await expect(menuDe(page)).toHaveCount(0);
    // Se quedó en la misma página y en el mismo lugar.
    await expect(page).toHaveURL("/coaching");
    await expect(page.locator("h1")).toContainText(H1["/coaching"]);
    expect(await posicion(page)).toBe(antes);
    expect(await overflowHtml(page)).toBe("");
  });

  test("cada enlace del menú, tocado desde el fondo de la página, navega sin recargar, abre arriba y cierra el menú", async ({ page }) => {
    await irA(page, "/");
    const mismoDocumento = await marcarDocumento(page);
    const marca = await mismoDocumento();
    const boton = botonMenu(page);
    const menu = menuDe(page);

    for (const l of nav.links) {
      await irAlFinal(page);
      expect(await posicion(page)).toBeGreaterThan(500);
      await boton.tap();
      await expect(menu).toBeVisible();
      await vigilarScroll(page);
      await menu.getByRole("link", { name: l.label, exact: true }).tap();
      await expect(page).toHaveURL(l.href);
      await expect(page.locator("h1")).toContainText(H1[l.href]);
      await expect(menu, `el menú quedó abierto después de ir a ${l.href}`).toHaveCount(0);
      await expect(boton).toHaveAttribute("aria-expanded", "false");
      await esperarArriba(page);
      expect(await overflowHtml(page)).toBe("");
      // La página actual queda marcada (se ve al volver a abrir).
      await boton.tap();
      await expect(menu.getByRole("link", { name: l.label, exact: true })).toHaveAttribute("aria-current", "page");
      await boton.tap();
      await expect(menu).toHaveCount(0);
    }
    expect(await mismoDocumento(), "la navegación recargó la página").toBe(marca);
  });

  test("el llamado 'Agendar una conversación' del menú lleva a /agendar, arriba, y cierra el menú", async ({ page }) => {
    await irA(page, "/coaching");
    await irAlFinal(page);
    await botonMenu(page).tap();
    await vigilarScroll(page);
    await menuDe(page).getByRole("link", { name: "Agendar una conversación" }).tap();
    await expect(page).toHaveURL(rutas.agendar);
    await expect(page.locator("h1")).toContainText(H1["/agendar"]);
    await expect(menuDe(page)).toHaveCount(0);
    await esperarArriba(page);
  });
});

test.describe("barra en escritorio", () => {
  test.skip(({ isMobile }) => isMobile, "la lista de enlaces es solo para pantallas anchas");

  test("se ven los cinco enlaces y no el botón del menú", async ({ page }) => {
    await irA(page, "/");
    await expect(botonMenu(page)).toBeHidden();
    const lista = barraDe(page).locator("ul");
    await expect(lista).toBeVisible();
    await expect(lista.getByRole("link")).toHaveText(nav.links.map((l) => l.label));
  });

  test("cada enlace, usado desde el fondo de la página, navega sin recargar, abre arriba y queda marcado", async ({ page }) => {
    await irA(page, "/");
    const mismoDocumento = await marcarDocumento(page);
    const marca = await mismoDocumento();
    const lista = barraDe(page).locator("ul");
    for (const l of nav.links) {
      await irAlFinal(page);
      await vigilarScroll(page);
      await lista.getByRole("link", { name: l.label, exact: true }).click();
      await expect(page).toHaveURL(l.href);
      await expect(page.locator("h1")).toContainText(H1[l.href]);
      await expect(lista.locator('[aria-current="page"]')).toHaveText(l.label);
      await esperarArriba(page);
    }
    await irAlFinal(page);
    await vigilarScroll(page);
    await barraDe(page).getByRole("link", { name: nav.cta.label, exact: true }).click();
    await expect(page).toHaveURL(rutas.agendar);
    await expect(lista.locator('[aria-current="page"]')).toHaveCount(0);
    await esperarArriba(page);
    expect(await mismoDocumento(), "la navegación recargó la página").toBe(marca);
  });

  test("el enlace 'Saltar al contenido' aparece con el teclado y lleva al contenido", async ({ page }) => {
    await irA(page, "/coaching");
    await page.keyboard.press("Tab");
    const salto = page.getByRole("link", { name: "Saltar al contenido" });
    await expect(salto).toBeFocused();
    await expect(salto).toBeInViewport();
    const b = await salto.boundingBox();
    expect(b && b.width > 20 && b.height > 20, "el enlace sigue oculto con foco").toBeTruthy();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#contenido$/);
  });
});

test("el logo de la barra, desde el fondo de otra página, vuelve al inicio arriba", async ({ page, isMobile }) => {
  await irA(page, "/nosotros");
  const mismoDocumento = await marcarDocumento(page);
  const marca = await mismoDocumento();
  await irAlFinal(page);
  await tocar(barraDe(page).getByRole("link", { name: "Daxlo, ir al inicio" }), isMobile);
  await expect(page).toHaveURL("/");
  await expect(page.locator("h1")).toContainText(hero.titulo[0]);
  await esperarArriba(page);
  expect(await mismoDocumento()).toBe(marca);
});

test("cada enlace del pie lleva a su página, que abre arriba, o a su sección si lleva ancla", async ({ page, isMobile }) => {
  test.slow();
  await irA(page, "/");
  const pie = page.locator("footer");
  for (const e of footer.columnas.flatMap((c) => c.enlaces)) {
    const [ruta, ancla] = e.h.split("#");
    const enlace = pie.getByRole("link", { name: e.t, exact: true });
    await tocar(enlace, isMobile);
    await expect(page).toHaveURL(e.h);
    await expect(page.locator("h1")).toContainText(H1[ruta]);
    if (ancla) await esperarEnAncla(page, ancla);
    else await esperarArriba(page);
  }
});

test("el logo del pie vuelve al inicio, arriba", async ({ page, isMobile }) => {
  await irA(page, "/preguntas");
  await tocar(page.locator("footer").getByRole("link", { name: "Daxlo, ir al inicio" }), isMobile);
  await expect(page).toHaveURL("/");
  await expect(page.locator("h1")).toContainText(hero.titulo[0]);
  await esperarArriba(page);
});

for (const ruta of RUTAS_INTERNAS) {
  test(`las migas de ${ruta} llevan al inicio con 'Inicio'`, async ({ page, isMobile }) => {
    await irA(page, ruta);
    const migas = page.getByRole("navigation", { name: "Migas de pan" });
    await expect(migas).toBeVisible();
    await expect(migas.locator('[aria-current="page"]')).toBeVisible();
    await tocar(migas.getByRole("link", { name: "Inicio" }), isMobile);
    await expect(page).toHaveURL("/");
    await expect(page.locator("h1")).toContainText(hero.titulo[0]);
    await esperarArriba(page);
  });
}

test.describe("enlaces viejos del sitio de una sola página", () => {
  const VIEJAS: [string, string][] = [
    ["#coaching", "/coaching"],
    ["#coaching-pasos", "/coaching#como-funciona"],
    ["#consultoria", "/consultoria"],
    ["#consultoria-fases", "/consultoria#como-trabajamos"],
    ["#automatizamos", "/consultoria#que-automatizamos"],
    ["#herramientas", "/herramientas"],
    ["#preguntas", "/preguntas"],
    ["#agendar", "/agendar"],
  ];

  for (const [vieja, nueva] of VIEJAS) {
    test(`/${vieja} redirige a ${nueva}`, async ({ page }) => {
      await irA(page, "/nosotros");
      await page.goto(`/${vieja}`, { waitUntil: "commit" });
      await expect(page).toHaveURL(nueva);
      await esperarHidratacion(page);
      const [ruta, ancla] = nueva.split("#");
      await expect(page.locator("h1")).toContainText(H1[ruta]);
      if (ancla) await esperarEnAncla(page, ancla);
      // La redirección reemplaza la entrada del historial (location.replace):
      // "atrás" vuelve a donde estaba la persona y no a la dirección vieja,
      // que la mandaría otra vez hacia adelante.
      await page.goBack();
      await expect(page).toHaveURL("/nosotros");
    });
  }

  test("un ancla que no es vieja (#top) se queda en el inicio", async ({ page }) => {
    await page.goto("/#top");
    await esperarHidratacion(page);
    await expect(page).toHaveURL("/#top");
    await expect(page.locator("h1")).toContainText(hero.titulo[0]);
  });

  test("solo redirige desde la raíz: /preguntas#coaching se queda en /preguntas", async ({ page }) => {
    await page.goto("/preguntas#coaching");
    await esperarHidratacion(page);
    await expect(page).toHaveURL("/preguntas#coaching");
    await esperarEnAncla(page, "coaching");
  });
});

test.describe("página 404", () => {
  test("una ruta que no existe responde 404 con la página propia y salidas al sitio", async ({ page, vigilancia, isMobile }) => {
    // El 404 del documento es lo esperado aquí (y el navegador lo anota en consola).
    vigilancia.tolerar(/HTTP 404: .*\/esta-pagina-no-existe$/);
    vigilancia.tolerar(/console\.error: Failed to load resource: .*404/);
    const res = await page.goto("/esta-pagina-no-existe");
    expect(res?.status()).toBe(404);
    await esperarHidratacion(page);
    await expect(page).toHaveTitle("Página no encontrada · Daxlo");
    await expect(page.locator("h1")).toHaveText("Esta página no existe.");
    const salidas = page.getByRole("navigation", { name: "Páginas del sitio" });
    await expect(salidas.getByRole("link")).toHaveText(nav.links.map((l) => l.label));
    await tocar(page.getByRole("link", { name: "Volver al inicio" }), isMobile);
    await expect(page).toHaveURL("/");
    await expect(page.locator("h1")).toContainText(hero.titulo[0]);
  });

  test("desde la 404 se llega a cada página de la lista", async ({ page, vigilancia, isMobile }) => {
    test.slow();
    vigilancia.tolerar(/HTTP 404: .*\/no-existe-tampoco$/);
    vigilancia.tolerar(/console\.error: Failed to load resource: .*404/);
    for (const l of nav.links) {
      await page.goto("/no-existe-tampoco");
      await esperarHidratacion(page);
      await tocar(page.getByRole("navigation", { name: "Páginas del sitio" }).getByRole("link", { name: l.label, exact: true }), isMobile);
      await expect(page).toHaveURL(l.href);
      await expect(page.locator("h1")).toContainText(H1[l.href]);
    }
  });
});
