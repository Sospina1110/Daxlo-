import { agendar, cierre as textoCierre, contacto, dosFormas, hero, otraLinea, preguntasLinea, privacidad } from "../../src/content/copy";
import { hayAgenda } from "../../src/lib/agenda";
import { APPS_SCRIPT, esperarArriba, esperarEnAncla, expect, H1, interceptarAppsScript, irA, marcarDocumento, quieto, tocar, test, type Page, type Vigilancia } from "./apoyo";

// Los caminos que terminan en una conversación agendada: cada llamado a la
// acción lleva a /agendar (con la línea ya elegida cuando corresponde) y el
// formulario manda al Apps Script exactamente lo que espera. El Apps Script
// nunca se toca de verdad: interceptarAppsScript() lo responde en local.

const CONTRATO = ["linea", "nombre", "whatsapp", "correo", "empresa", "interes", "website", "tiempo_llenado_segundos", "origen", "autorizacion", "politica_version", "marketing"];
const campoLinea = (page: Page) => page.getByLabel(agendar.campos.linea);
const cierre = (page: Page) => page.locator('section[aria-labelledby="titulo-cierre"]');

// Llegó a /agendar, con la línea que corresponde, y la página abrió arriba
// (los llamados están a media página o al final: si /agendar abriera donde
// quedó el scroll, el titular y el formulario quedarían fuera de la vista).
async function llegarAAgendar(page: Page, lineaEsperada: string) {
  await expect(page).toHaveURL(lineaEsperada ? `/agendar?linea=${lineaEsperada}` : "/agendar");
  await expect(page.locator("h1")).toContainText(H1["/agendar"]);
  await expect(campoLinea(page)).toHaveValue(lineaEsperada);
  await esperarArriba(page);
}

test.describe("llamados a la acción", () => {
  test("el botón del hero lleva a /agendar sin recargar", async ({ page, isMobile }) => {
    await irA(page, "/");
    const mismoDocumento = await marcarDocumento(page);
    const marca = await mismoDocumento();
    await tocar(page.locator("#top").getByRole("link", { name: hero.cta }), isMobile);
    await llegarAAgendar(page, "");
    expect(await mismoDocumento()).toBe(marca);
  });

  // Desde noviembre de 2026 cada página de línea tiene un solo llamado a
  // agendar en el cuerpo (la portada) y uno al final (el cierre): el bloque
  // "¿Esto es para…?" ya no lleva botón propio.
  for (const linea of ["coaching", "consultoria"] as const) {
    test(`en /${linea}, el cuerpo de la página no repite botones de agendar: solo la portada y el cierre`, async ({ page }) => {
      await irA(page, `/${linea}`);
      const agendar = page.locator(`main a[href="/agendar?linea=${linea}"]`);
      await expect(agendar).toHaveCount(2);
      await expect(cierre(page).locator(`a[href="/agendar?linea=${linea}"]`)).toHaveCount(1);
    });
  }

  // La portada de cada línea lleva la acción en la primera pantalla: antes, el
  // primer botón del contenido aparecía a varias pantallas de distancia.
  for (const linea of ["coaching", "consultoria"] as const) {
    test(`en /${linea}, el botón de la portada llega a /agendar con ${linea} elegido`, async ({ page, isMobile }) => {
      await irA(page, `/${linea}`);
      await tocar(page.locator("main").getByRole("link", { name: hero.cta }).first(), isMobile);
      await llegarAAgendar(page, linea);
    });

    test(`en /${linea}, el botón de la portada se ve sin bajar`, async ({ page }) => {
      test.skip((page.viewportSize()?.height ?? 0) < 800, "en pantallas bajas el titular gigante ocupa la primera pantalla");
      await irA(page, `/${linea}`);
      const boton = page.locator("main").getByRole("link", { name: hero.cta }).first();
      await expect(boton).toBeVisible();
      await expect
        .poll(() => boton.evaluate((b) => Math.round(b.getBoundingClientRect().bottom - innerHeight)), {
          message: "píxeles que el botón queda por debajo del borde de la pantalla (debe ser 0 o menos)",
        })
        .toBeLessThanOrEqual(0);
    });
  }

  for (const linea of ["coaching", "consultoria"] as const) {
    test(`el cierre de /${linea} también llega con ${linea} elegido`, async ({ page, isMobile }) => {
      await irA(page, `/${linea}`);
      await tocar(cierre(page).getByRole("link", { name: /Agendar una conversación/ }), isMobile);
      await llegarAAgendar(page, linea);
    });
  }

  test("el cierre de una página general llega a /agendar sin línea elegida", async ({ page, isMobile }) => {
    await irA(page, "/nosotros");
    await tocar(cierre(page).getByRole("link", { name: /Agendar una conversación/ }), isMobile);
    await llegarAAgendar(page, "");
  });

  test("las tarjetas del inicio llevan a /coaching y a /consultoria", async ({ page, isMobile }) => {
    await irA(page, "/");
    // El nombre accesible lleva la línea en texto solo para lectores (sr-only);
    // Chromium mete un espacio antes de los dos puntos.
    const tarjeta = (d: { enlace: string; titulo: string }) => page.getByRole("link", { name: new RegExp(`^${d.enlace}\\s*:\\s*${d.titulo}$`) });
    await tocar(tarjeta(dosFormas.coaching), isMobile);
    await expect(page).toHaveURL("/coaching");
    await expect(page.locator("h1")).toContainText(H1["/coaching"]);
    await esperarArriba(page);

    await irA(page, "/");
    await tocar(tarjeta(dosFormas.consultoria), isMobile);
    await expect(page).toHaveURL("/consultoria");
    await expect(page.locator("h1")).toContainText(H1["/consultoria"]);
    await esperarArriba(page);
  });

  // Cada puerta del inicio se puede tocar entera (el enlace se estira sobre la
  // tarjeta) y dice su regla: quién hace el trabajo.
  test("cada puerta del inicio se toca entera y muestra su regla", async ({ page, isMobile }) => {
    await irA(page, "/");
    for (const [d, destino] of [[dosFormas.coaching, "/coaching"], [dosFormas.consultoria, "/consultoria"]] as const) {
      const tarjeta = page.locator("article").filter({ hasText: d.regla });
      await expect(tarjeta).toHaveCount(1);
      const regla = tarjeta.getByText(d.regla, { exact: true });
      await expect(regla).toBeVisible();
      await quieto(regla);
      // Lo que queda bajo el dedo en la regla (texto, no el enlace) es el
      // enlace estirado de la tarjeta, y un toque ahí abre la línea.
      const punto = await regla.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const x = Math.round(r.left + Math.min(r.width / 2, 60));
        const y = Math.round(r.top + r.height / 2);
        return { x, y, href: document.elementFromPoint(x, y)?.closest("a")?.getAttribute("href") ?? null };
      });
      expect(punto.href).toBe(destino);
      if (isMobile) await page.touchscreen.tap(punto.x, punto.y);
      else await page.mouse.click(punto.x, punto.y);
      await expect(page).toHaveURL(destino);
      await esperarArriba(page);
      await irA(page, "/");
    }
  });

  test("el puente de cada línea, en 'No es para… si', lleva a la otra y la abre arriba", async ({ page, isMobile }) => {
    await irA(page, "/coaching");
    await tocar(page.getByRole("link", { name: new RegExp(otraLinea.consultoria.enlace) }), isMobile);
    await expect(page).toHaveURL("/consultoria");
    await expect(page.locator("h1")).toContainText(H1["/consultoria"]);
    await esperarArriba(page);
    await tocar(page.getByRole("link", { name: new RegExp(otraLinea.coaching.enlace) }), isMobile);
    await expect(page).toHaveURL("/coaching");
    await expect(page.locator("h1")).toContainText(H1["/coaching"]);
    await esperarArriba(page);
  });

  test("'Ver todas las preguntas' en /coaching lleva al grupo de coaching en /preguntas", async ({ page, isMobile }) => {
    await irA(page, "/coaching");
    await tocar(page.getByRole("link", { name: preguntasLinea.todas }), isMobile);
    await expect(page).toHaveURL("/preguntas#coaching");
    await esperarEnAncla(page, "coaching");
  });

  // Bajo el botón del cierre del inicio y de cada línea, un enlace de texto a
  // WhatsApp (nunca flotante), que abre en otra pestaña. No se toca: es un
  // destino externo.
  for (const ruta of ["/", "/coaching", "/consultoria"]) {
    test(`${ruta}: el cierre ofrece escribir por WhatsApp, en otra pestaña y sin pasar la página de origen`, async ({ page }) => {
      await irA(page, ruta);
      const enlace = cierre(page).getByRole("link", { name: textoCierre.whatsapp });
      await expect(enlace).toHaveCount(1);
      await expect(enlace).toHaveAttribute("href", contacto.whatsapp);
      await expect(enlace).toHaveAttribute("target", "_blank");
      await expect(enlace).toHaveAttribute("rel", /noopener/);
      await expect(enlace).toHaveAttribute("rel", /noreferrer/);
      // Y no hay ningún botón flotante de WhatsApp en la página.
      const flotantes = await page.evaluate(() =>
        [...document.querySelectorAll('a[href*="wa.me"]')].filter((a) => getComputedStyle(a).position === "fixed" || getComputedStyle(a.parentElement as Element).position === "fixed").length,
      );
      expect(flotantes).toBe(0);
    });
  }

  // Las páginas generales conservan su cierre como estaba: /preguntas ya
  // ofrece WhatsApp en su recuadro de ayuda, y /herramientas y /nosotros no
  // cambiaron en esta pasada.
  for (const ruta of ["/herramientas", "/nosotros", "/preguntas"]) {
    test(`${ruta}: el cierre no repite el enlace de WhatsApp`, async ({ page }) => {
      await irA(page, ruta);
      await expect(cierre(page).getByRole("link", { name: /Agendar una conversación/ })).toHaveCount(1);
      await expect(cierre(page).getByRole("link", { name: textoCierre.whatsapp })).toHaveCount(0);
    });
  }
});

test.describe("formulario de /agendar", () => {
  const c = agendar.campos;

  async function llenar(page: Page) {
    await campoLinea(page).selectOption("consultoria");
    await page.getByLabel(c.nombre).fill("Martina Gómez Peña");
    await page.getByLabel(new RegExp(`^${c.whatsapp}`)).fill("+57 300 123 4567");
    await page.getByLabel(new RegExp(`^${c.correo}`)).fill("martina@ferreteria.co");
    await page.getByLabel(c.empresa).fill("Ferretería El Tornillo & Cía");
    await page.getByLabel(c.interes).fill("Cada viernes concilio facturas de tres proveedores.\nMe toma la mañana.");
    await page.getByRole("checkbox", { name: new RegExp(c.autorizacion.slice(0, 20)) }).check();
  }

  const enviar = (page: Page) => page.getByRole("button", { name: new RegExp(agendar.enviar) });

  // Con la agenda de Cal.com configurada (copy.ts, calcom.enlaces), el éxito
  // del envío lleva sola a la persona a Cal.com; agenda.spec.ts prueba ese
  // paso a fondo. Aquí Cal.com se responde en local y el éxito es haber
  // llegado allá. Sin agenda, el éxito es el panel de siempre.
  const CAL = /^https:\/\/(app\.)?cal\.com\//;
  async function prepararAgenda(page: Page, vigilancia: Vigilancia) {
    if (!hayAgenda()) return;
    vigilancia.tolerar(/^petición externa inesperada: https:\/\/(app\.)?cal\.com\//);
    await page.route(CAL, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Agenda</title>" }));
  }
  async function esperarExito(page: Page) {
    if (hayAgenda()) await page.waitForURL(CAL, { timeout: 10_000 });
    else await expect(page.getByText(agendar.exito.titulo)).toBeVisible();
  }

  test("vacío: muestra los errores, pone el foco en '¿Qué te interesa?' y no envía nada", async ({ page, isMobile }) => {
    await irA(page, "/agendar");
    const envios = await interceptarAppsScript(page);
    await tocar(enviar(page), isMobile);
    for (const t of [agendar.errores.linea, agendar.errores.nombre, agendar.errores.whatsapp, agendar.errores.correo]) {
      await expect(page.getByText(t)).toBeVisible();
    }
    await expect(campoLinea(page)).toBeFocused();
    await expect(campoLinea(page)).toHaveAttribute("aria-invalid", "true");
    expect(envios).toHaveLength(0);
  });

  test("correo mal escrito: pide revisarlo y el foco va al correo", async ({ page, isMobile }) => {
    await irA(page, "/agendar");
    const envios = await interceptarAppsScript(page);
    await llenar(page);
    await page.getByLabel(new RegExp(`^${c.correo}`)).fill("martina@ferreteria");
    await tocar(enviar(page), isMobile);
    await expect(page.getByText(agendar.errores.correoFormato)).toBeVisible();
    await expect(page.getByLabel(new RegExp(`^${c.correo}`))).toBeFocused();
    expect(envios).toHaveLength(0);
  });

  test("envío completo: panel de éxito y el Apps Script recibe exactamente los campos del contrato", async ({ page, isMobile, vigilancia }) => {
    await irA(page, "/agendar");
    await prepararAgenda(page, vigilancia);
    const envios = await interceptarAppsScript(page);
    const accion = await page.locator("form").getAttribute("action");
    expect(accion).toMatch(APPS_SCRIPT);
    const sitio = new URL(page.url()).origin;
    await llenar(page);
    await tocar(enviar(page), isMobile);

    if (hayAgenda()) {
      await esperarExito(page);
    } else {
      const panel = page.getByRole("status").filter({ hasText: agendar.exito.titulo });
      // En pantalla, no solo en la página: el formulario era más alto y quien
      // tocó enviar quedaba mirando el pie.
      await expect(panel).toBeInViewport();
      await expect(panel).toBeFocused();
      await expect(panel).toContainText(agendar.exito.texto);
      await expect(page.locator("form")).toHaveCount(0);
    }

    expect(envios).toHaveLength(1);
    const [envio] = envios;
    expect(envio.metodo).toBe("POST");
    expect(envio.url).toBe(accion);
    expect(envio.campos.map(([k]) => k)).toEqual(CONTRATO);
    const datos = Object.fromEntries(envio.campos);
    expect(datos).toMatchObject({
      linea: "consultoria",
      nombre: "Martina Gómez Peña",
      whatsapp: "+57 300 123 4567",
      correo: "martina@ferreteria.co",
      empresa: "Ferretería El Tornillo & Cía",
      website: "",
      origen: sitio,
      autorizacion: "si",
      politica_version: privacidad.version,
      marketing: "no",
    });
    // En multipart/form-data el navegador manda los saltos de línea como CRLF.
    expect(datos.interes.replace(/\r\n/g, "\n")).toBe("Cada viernes concilio facturas de tres proveedores.\nMe toma la mañana.");
    expect(datos.tiempo_llenado_segundos).toMatch(/^\d+$/);
  });

  test("con ?linea=no_se la opción llega elegida y es la que se envía", async ({ page, isMobile, vigilancia }) => {
    await irA(page, "/agendar?linea=no_se");
    await expect(campoLinea(page)).toHaveValue("no_se");
    await prepararAgenda(page, vigilancia);
    const envios = await interceptarAppsScript(page);
    await page.getByLabel(c.nombre).fill("Ana");
    await page.getByLabel(new RegExp(`^${c.whatsapp}`)).fill("3001234567");
    await page.getByLabel(new RegExp(`^${c.correo}`)).fill("ana@correo.com");
    await page.getByRole("checkbox", { name: new RegExp(c.autorizacion.slice(0, 20)) }).check();
    await tocar(enviar(page), isMobile);
    await esperarExito(page);
    expect(Object.fromEntries(envios[0].campos).linea).toBe("no_se");
  });

  test("con ?linea= de un valor que no existe, el campo queda en 'Selecciona una opción'", async ({ page }) => {
    await irA(page, "/agendar?linea=gerencia");
    await expect(campoLinea(page)).toHaveValue("");
    expect(await campoLinea(page).evaluate((s: HTMLSelectElement) => [s.selectedIndex, s.selectedOptions[0]?.textContent])).toEqual([0, "Selecciona una opción"]);
  });

  test("envío duplicado: también muestra éxito, con el texto de 'ya recibimos tus datos'", async ({ page, isMobile, vigilancia }) => {
    await irA(page, "/agendar");
    await prepararAgenda(page, vigilancia);
    await interceptarAppsScript(page, () => ({ cuerpo: { status: "error", codigo: "envio_duplicado" } }));
    await llenar(page);
    await tocar(enviar(page), isMobile);
    // Con agenda, quien ya estaba en la hoja también pasa a elegir la hora.
    if (hayAgenda()) return esperarExito(page);
    const panel = page.getByRole("status").filter({ hasText: agendar.exito.titulo });
    await expect(panel).toContainText(agendar.exito.duplicado);
    await expect(panel).not.toContainText(agendar.exito.texto);
  });

  test("error del Apps Script: avisa, deja lo escrito y se puede reintentar", async ({ page, isMobile, vigilancia }) => {
    await irA(page, "/agendar");
    await prepararAgenda(page, vigilancia);
    const envios = await interceptarAppsScript(page, (n) => (n === 1 ? { cuerpo: { status: "error", codigo: "otro" } } : { cuerpo: { status: "ok" } }));
    await llenar(page);
    await tocar(enviar(page), isMobile);
    await expect(page.getByText(agendar.errores.general)).toBeVisible();
    await expect(page.getByLabel(c.nombre)).toHaveValue("Martina Gómez Peña");
    await expect(enviar(page)).toBeEnabled();
    await tocar(enviar(page), isMobile);
    await esperarExito(page);
    expect(envios).toHaveLength(2);
  });

  test("sin red: avisa con el error general", async ({ page, isMobile, vigilancia }) => {
    // El navegador anota en consola la petición cortada: es justo lo que se prueba.
    vigilancia.tolerar(/Failed to load resource|script\.google\.com/);
    await irA(page, "/agendar");
    await interceptarAppsScript(page, () => ({ abortar: true }));
    await llenar(page);
    await tocar(enviar(page), isMobile);
    await expect(page.getByText(agendar.errores.general)).toBeVisible();
    await expect(page.getByText(agendar.exito.titulo)).toHaveCount(0);
  });

  test("guardia de las pruebas: sin interceptar, un envío al Apps Script se bloquea en la página y nada sale", async ({ page, isMobile, vigilancia }) => {
    // Prueba de la propia red de seguridad (apoyo.ts): si una prueba olvidara
    // interceptar, el lead de mentira no puede llegar a la hoja real.
    vigilancia.tolerar(/\[pruebas\] envío bloqueado/);
    const salientes: string[] = [];
    page.on("request", (r) => {
      if (APPS_SCRIPT.test(r.url())) salientes.push(r.url());
    });
    await irA(page, "/agendar");
    await llenar(page);
    await tocar(enviar(page), isMobile);
    // El fetch bloqueado se ve en la página como una falla de red.
    await expect(page.getByText(agendar.errores.general)).toBeVisible();
    expect(salientes).toEqual([]);
    expect(vigilancia.errores.some((e) => /\[pruebas\] envío bloqueado: fetch/.test(e))).toBe(true);
  });

  test("respuesta que no es JSON (una página de error de Google): avisa con el error general", async ({ page, isMobile, vigilancia }) => {
    // El navegador anota en consola el 500 del Apps Script simulado.
    vigilancia.tolerar(/Failed to load resource: .*500/);
    await irA(page, "/agendar");
    await interceptarAppsScript(page, () => ({ status: 500, cuerpo: "<html><body>Error</body></html>" }));
    await llenar(page);
    await tocar(enviar(page), isMobile);
    await expect(page.getByText(agendar.errores.general)).toBeVisible();
  });
});
